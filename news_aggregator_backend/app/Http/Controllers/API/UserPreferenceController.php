<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{UserPreference, Author, Category, Source};
use App\Services\UserPreferenceService;

class UserPreferenceController extends Controller
{

    // Get prefrences Data
    public function getPreferencesData(Request $request)
    {
        try {
            $authors = Author::orderBy("id", "desc")->get();
            $categories = Category::orderBy("id", "desc")->get();
            $sources = Source::orderBy("id", "desc")->get();

            $data = [
                "authors" => $authors,
                "categories" => $categories,
                "sources" => $sources,
            ];

            return $this->sendResponse($data, config('constants.listing'));
        } catch (\Exception $th) {
            return $this->sendError($th->getMessage());
        }
    }

    // Save/update User Prefrence
    public function store(Request $request)
    {
        try {
            $userId = auth()->id();
            // For Source
            if (isset($request->sources) && count($request->sources) > 0) {
                $this->handleAddUpdatePreferences($request->sources, "Source", $userId);
            }

            // For Categories
            if (isset($request->categories) && count($request->categories) > 0) {
                $this->handleAddUpdatePreferences($request->categories, "Category", $userId);
            }

            // For Author
            if (isset($request->authors) && count($request->authors) > 0) {
                $this->handleAddUpdatePreferences($request->authors, "Author", $userId);
            }

            return $this->sendResponse([], config('constants.created'));
        } catch (\Exception $th) {
            return $this->sendError($th->getMessage());
        }
    }

    // Get Logged User specific preferences
    public function getUserPreferences(Request $request)
    {
        try {
            $userPreferenceService = new UserPreferenceService;
            $userPreferences = $userPreferenceService->getUserPrefrences(auth()->id());

            return $this->sendResponse($userPreferences, config('constants.listing'));
        } catch (\Exception $th) {
            return $this->sendError($th->getMessage());
        }
    }

    public function handleAddUpdatePreferences($ids, $type, $userId)
    {
        foreach ($ids as $id) {
            $preferenceData[] = [
                'user_id' => $userId,
                'preferenceable_id' => $id,
                // makeModelPath exist in controller function
                'preferenceable_type' => makeModelPath($type),
            ];
        }

        // First Delete same type info against user 
        UserPreference::where(['user_id' => $userId, 'preferenceable_type' => makeModelPath($type)])->delete();

        //Insert Latest records against type 
        UserPreference::insert($preferenceData);
    }
}