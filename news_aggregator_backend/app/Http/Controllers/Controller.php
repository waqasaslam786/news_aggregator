<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    // successs response
    public function sendResponse($result = [], $message)
    {
        $response = [
            'status' => true,
            'data' => $result,
            'message' => $message,
        ];
        return response()->json($response, 200);
    }

    // Error response
    public function sendError($error, $dataError = [], $code = 422)
    {
        $response = [
            'status' => false,
            'message' => $error,
            "data" => $dataError
        ];
        return response()->json($response, $code);
    }
}