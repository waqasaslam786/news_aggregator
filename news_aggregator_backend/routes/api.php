<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\{AuthController, CategoryController, SourceController, AuthorController, UserPreferenceController, ArticleController};

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Auth Routes
Route::group(['prefix' => 'auth'], function () {
    Route::controller(AuthController::class)->group(
        function () {
            Route::post('signUp', 'signUp');
            Route::post('login', 'login');
        }
    );
});

// General Routes
Route::middleware('auth:sanctum')->group(function () {
    // Save user Preferences data
    Route::post('userPreference', [UserPreferenceController::class, 'store']);
    // Get Specific User Preferences
    Route::get('getUserPreferences', [UserPreferenceController::class, 'getUserPreferences']);

    Route::get('getPreferencesData', [UserPreferenceController::class, 'getPreferencesData']);

    // Articles Feed
    Route::get('article', [ArticleController::class, 'index']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
