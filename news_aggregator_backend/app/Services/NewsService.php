<?php
namespace App\Services;

use App\Models\{Category, Source, Author, Article};

use jcobhams\NewsApi\NewsApi;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;

class NewsService
{
    public function fetchNews()
    {
        // Get record against categories that i already saved through seeder.Because some apis don't provide categories in listing, so i searched categories through keywords
        $categories = Category::all();

        // This function get the record from the newsapi.org and save record in database
        $this->NewsAPI($categories);

        // This function get the record from the newsapi.ai and save record in database
        $this->NewsAPIAi($categories);

        // This function get the record from the NEW York times api and save record in database
        $this->NewYorkTimeAPI($categories);

        return true;
    }

    // Fetch Data from NewsApi.org
    public function NewsAPI($categories)
    {
        foreach ($categories as $category) {
            $q = $category->name;
            $sources = null;
            $domains = null;
            $exclude_domains = null;
            $from = null;
            $to = now()->format('Y-m-d');
            $language = "en";
            $sort_by = "publishedAt";
            $page_size = 10;
            $page = 1;

            $newsapi = new NewsApi(env('NEW_API_SECRET_KEY'));
            // 
            $result = $newsapi->getEverything($q, $sources, $domains, $exclude_domains, $from, $to, $language, $sort_by, $page_size, $page);

            if ($result && $result->status == "ok") {
                if (count($result->articles) > 0) {
                    $this->handleNewsAPIRecord($result->articles, $category->id);
                }
            }
        }
    }

    // Handle NewsApis Records for articles table
    public function handleNewsAPIRecord($newsData, $categoryId)
    {
        foreach ($newsData as $data) {

            if (isset($data->source->name) && isset($data->author)) {

                // Sometime source and author name are getting in paragraph form so i apply length and ignore long author or source data 

                if (strlen($data->source->name) > 50 || strlen($data->author) > 50)
                    continue;
                $sourceId = $this->handleSource($data->source->name, $data->url);
                $authorId = $this->handleAuthor($data->author);

                // prepare articles data
                $articleData = [
                    'title' => $data->title,
                    'content' => $data->content,
                    'published_at' => Carbon::parse($data->publishedAt)->format('Y-m-d H:i:s'),
                    'source_id' => $sourceId,
                    'category_id' => $categoryId,
                    'author_id' => $authorId
                ];

                // Save Articles in database
                Article::create($articleData);
            }
        }
    }

    // Fetch Data from NewsApi.Ai
    public function NewsAPIAi($categories)
    {
        foreach ($categories as $category) {
            $response = Http::post('http://eventregistry.org/api/v1/article/getArticles', [
                'action' => 'getArticles',
                'keyword' => $category->name,
                'articlesPage' => 1,
                'articlesCount' => 10,
                'articlesSortBy' => 'date',
                'articlesSortByAsc' => false,
                'articlesArticleBodyLen' => -1,
                'resultType' => 'articles',
                'dataType' => ['news'],
                'apiKey' => 'c4fe97d6-8efe-40a2-9607-f31406afdb08',
                'forceMaxDataTimeWindow' => 31,
            ]);

            $data = $response->json();

            if (isset($data) && isset($data['articles']) && isset($data['articles']['results'])) {
                if (count($data['articles']['results']) > 0) {
                    $this->handleNewsAPIAiRecord($data['articles']['results'], $category->id);
                }
            }
        }
    }

    // Handle NewsApis AI Records for articles table
    public function handleNewsAPIAiRecord($newsData, $categoryId)
    {
        foreach ($newsData as $data) {
            if (isset($data['source']['title']) && isset($data['authors']) && count($data['authors']) > 0) {

                // Sometime source are getting in paragraph form, so i apply string length and ignore long source data
                if (strlen($data['source']['title']) > 50)
                    continue;

                $sourceId = $this->handleSource($data['source']['title'], $data['source']['uri']);
                // Need one author only
                $authorName = $data['authors'][0]['name'];
                $authorId = $this->handleAuthor($authorName);

                // prepare articles data
                $articleData = [
                    'title' => $data['title'],
                    'content' => $data['body'],
                    'published_at' => Carbon::parse($data['dateTime'])->format('Y-m-d H:i:s'),
                    'source_id' => $sourceId,
                    'category_id' => $categoryId,
                    'author_id' => $authorId
                ];

                // Save Article in database
                Article::create($articleData);
            }
        }
    }

    // Fetch Data from Nework time api

    public function NewYorkTimeAPI($categories)
    {
        foreach ($categories as $category) {
            $response = $this->getNewYorkData($category->name);

            $result = json_decode($response);

            if (isset($result) && isset($result->status) && $result->status == "OK" && isset($result->response) && isset($result->response->docs)) {

                if (count($result->response->docs) > 0) {
                    $this->handleNewYorkRecord($result->response->docs, $category->id);
                }
            }
        }
    }

    // Handle NewsYork Time Records for articles table
    public function handleNewYorkRecord($newsData, $categoryId)
    {
        foreach ($newsData as $data) {

            if (isset($data->source) && isset($data->byline->original)) {

                // Sometime source and author name are getting in paragraph form so i apply length and ignore long author or source data 

                if (strlen($data->source) > 50 || strlen($data->byline->original) > 50)
                    continue;
                $sourceId = $this->handleSource($data->source, $data->web_url);
                $authorId = $this->handleAuthor($data->byline->original);

                // prepare articles data
                $articleData = [
                    'title' => $data->headline->main,
                    'content' => $data->lead_paragraph,
                    'published_at' => Carbon::parse($data->pub_date)->format('Y-m-d H:i:s'),
                    'source_id' => $sourceId,
                    'category_id' => $categoryId,
                    'author_id' => $authorId
                ];

                // Save Articles in database
                Article::create($articleData);
            }
        }
    }

    // Get newyork time data
    public function getNewYorkData($categoryName)
    {
        // API endpoint
        $apiEndpoint = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';

        // Request parameters
        $params = [
            'q' => $categoryName,
            'page' => 1,
            'sort' => 'newest',
            'api-key' => env('NEW_YORK_API_SECRET_KEY'),
            'end_date' => now()->format('Y-m-d')
        ];

        // Initialize cURL session
        $ch = curl_init($apiEndpoint . '?' . http_build_query($params));

        // Set cURL options
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // Execute cURL session and get the response
        $response = curl_exec($ch);

        // Check for errors
        if (curl_errno($ch)) {
            // Handle the error
            echo 'cURL error: ' . curl_error($ch);
        }

        // Close cURL session
        curl_close($ch);

        return $response;
    }

    // Create a new source or get already source from database
    public function handleSource($name, $url)
    {
        $source = Source::where('name', $name)->first();
        if ($source) {
            return $source->id;
        } else {
            $source = Source::create([
                "name" => $name,
                "url" => $url
            ]);
            return $source->id;
        }
    }

    // Create a new author or get already author from database
    public function handleAuthor($name)
    {
        $author = Author::where('name', $name)->first();
        if ($author) {
            return $author->id;
        } else {
            $author = Author::create([
                "name" => $name
            ]);
            return $author->id;
        }
    }
}
