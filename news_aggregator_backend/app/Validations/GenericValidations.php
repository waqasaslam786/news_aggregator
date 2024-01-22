<?php

namespace App\Validations;

use Illuminate\Support\Facades\Validator;

class GenericValidations
{

    function handleError($validator)
    {
        if (!empty($validator)) {
            $errorsArr = $validator->errors()->toArray();
            $errorResponse = validationResponce($errorsArr);
            abort(sendError($errorResponse));
        }
    }

    // ************************AUTH CONTROLLER ***************

    public static function login($request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'email' => 'required|email',
                'password' => 'min:8|required',
            ],
            [
                'email.required' => 'Email is required!',
                'email.email' => 'Email is not Valid!',
                'password.required' => 'Password is required!'
            ]
        );
        if ($validator->fails()) {
            return $validator;
        }
    }
    public static function signUp($request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'firstName' => 'required',
                'lastName' => 'required',
                'email' => 'required|email',
                'password' => 'min:8|required_with:confirmPassword|same:confirmPassword',
                'confirmPassword' => 'required|min:8',
            ],
            [
                'name.required' => 'Name is required!',
                'email.required' => 'Email is required!',
                'email.email' => 'Email is not Valid!',
                'password.required' => 'Password is required!'
            ]
        );
        if ($validator->fails()) {
            return $validator;
        }
    }

    public static function savePreference($request)
    {
        $validator = Validator::make(
            $request,
            [
                'preferenceable_type' => 'required|in:Source,Category,Author', // Add valid types
                'preferenceable_id' => 'required|array'
            ]
        );
        if ($validator->fails()) {
            return $validator;
        }
    }
}