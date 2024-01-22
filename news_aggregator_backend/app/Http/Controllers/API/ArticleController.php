<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Article, UserPreference};

class ArticleController extends Controller
{
    // article listing
    public function index(Request $request)
    {
        try {

            // Filters request
            $perPage = $request->perPage ? $request->input('perPage') : 10;

            $keyword = $request->input('keyword') ? $request->input('keyword') : null;
            $categoryId = $request->input('category_id') ? $request->input('category_id') : null;
            $sourceId = $request->input('source_id') ? $request->input('source_id') : null;
            $publishDate = $request->input('published_at') ? $request->input('published_at') : null;

            // Current user id
            $userId = auth()->id();

            // Get User Prefernce data
            $userPreferences = UserPreference::with('preferenceable')
                ->where('user_id', $userId)
                ->get();

            // Separate source ids
            $sourceIds = $userPreferences
                ->where('preferenceable_type', makeModelPath('Source'))
                ->pluck('preferenceable_id')
                ->toArray();

            // Separate categories ids
            $categoryIds = $userPreferences
                ->where('preferenceable_type', makeModelPath('Category'))
                ->pluck('preferenceable_id')
                ->toArray();

            // Separate authors ids
            $authorIds = $userPreferences
                ->where('preferenceable_type', makeModelPath('Author'))
                ->pluck('preferenceable_id')
                ->toArray();

            // After all query articles table
            $articles = Article::with(['source', 'category', 'author'])
                ->where(function ($query) use ($sourceIds, $categoryIds, $authorIds) {

                    // Check if any of the conditions match
                    $query->orWhereIn('source_id', $sourceIds)
                        ->orWhereIn('category_id', $categoryIds)
                        ->orWhereIn('author_id', $authorIds);
                })

                // if keyword request create
                ->when($keyword, function ($query) use ($keyword) {
                    $query->where(function ($subQuery) use ($keyword) {
                        $subQuery->where('title', 'like', "%$keyword%")
                            ->orWhere('content', 'like', "%$keyword%");
                    });
                })

                // if category request create
                ->when($categoryId, function ($query) use ($categoryId) {
                    $query->where(function ($subQuery) use ($categoryId) {
                        $subQuery->where('category_id', $categoryId);
                    });
                })

                // if source request create
                ->when($sourceId, function ($query) use ($sourceId) {
                    $query->where(function ($subQuery) use ($sourceId) {
                        $subQuery->where('source_id', $sourceId);
                    });
                })

                // if published request create
                ->when($publishDate, function ($query) use ($publishDate) {
                    $query->where(function ($subQuery) use ($publishDate) {
                        $subQuery->whereRaw('DATE(published_at) = ?', [$publishDate]);
                    });
                })

                // Can also handle with like query as well
                // ->when($publishDate, function ($query) use ($publishDate) {
                //     $query->where(function ($subQuery) use ($publishDate) {
                //         $subQuery->where('published_at', 'like', "%$publishDate%");
                //     });
                // })

                ->orderBy('published_at', 'desc')
                ->paginate($perPage);

            return $this->sendResponse($articles, config('constants.listing'));

        } catch (\Exception $th) {
            return $this->sendError($th->getMessage());
        }
    }

}