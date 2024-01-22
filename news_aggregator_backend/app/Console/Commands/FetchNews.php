<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Services\NewsService;

class FetchNews extends Command
{
    // protected $signature = 'app:fetch-news';
    protected $signature = 'fetch:news';
    protected $description = 'Fetch news from News API and save to the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Start Fetching and saving record in Database');

        // Handle News Data
        $newsService = new NewsService;
        $newsService->fetchNews();

        $this->info('News job run successfully');
    }
}
