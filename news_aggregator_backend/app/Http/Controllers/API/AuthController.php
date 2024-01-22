<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Validations\GenericValidations;
use App\Http\Resources\User as UserResource;
use App\Models\{User};
use App\Services\UserPreferenceService;


class AuthController extends Controller
{
    // Login User
    public function login(Request $request)
    {
        try {
            // Validate login request
            $validator = GenericValidations::login($request);
            if (!empty($validator)) {
                $errorsArr = $validator->errors()->toArray();
                $errorResponse = validationResponce($errorsArr);
                return $this->sendError($errorResponse);
            }

            if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
                $authUser = Auth::user();
                $token = $authUser->createToken('API Token Of' . $authUser->name)->plainTextToken;
                $authUser = new UserResource($authUser);
                $authUser['token'] = $token;

                // Get User prefereces Data
                $userPreferenceService = new UserPreferenceService;
                $authUser['preferences'] = $userPreferenceService->getUserPrefrences($authUser->id);
                return $this->sendResponse($authUser, config('constants.auth.login'));
            } else {
                return $this->sendError(config('constants.auth.login_failed'));
            }
        } catch (\Exception $th) {
            return $this->sendError($th->getMessage());
        }
    }

    // SignUp User
    public function signUp(Request $request)
    {
        try {
            // Validate signUp request
            $validator = GenericValidations::signUp($request);
            if (!empty($validator)) {
                $errorsArr = $validator->errors()->toArray();
                $errorResponse = validationResponce($errorsArr);
                return $this->sendError($errorResponse);
            }

            $input = $request->only('firstName', 'lastName', 'email', 'password');
            $input['password'] = bcrypt($input['password']);

            // check email exist already and account is deleted
            $user = User::withTrashed()->where('email', $request->input('email'))->first();

            if ($user) {
                if ($user->trashed()) { // Use trashed() method to check if soft-deleted
                    $user->restore();
                    $user->update($input);
                } else {
                    return $this->sendError(config('constants.auth.already_email'));
                }
            } else {
                $user = User::create($input);
            }

            $token = $user->createToken('API Token Of' . $user->name)->plainTextToken;
            $authUser = new UserResource($user);
            $authUser['token'] = $token;

            // Get User prefereces Data
            $userPreferenceService = new UserPreferenceService;
            $authUser['preferences'] = $userPreferenceService->getUserPrefrences($authUser->id);

            return $this->sendResponse($authUser, config('constants.auth.signUp_success'));
        } catch (\Exception $th) {
            return $this->sendError($th->getMessage());
        }
    }
}