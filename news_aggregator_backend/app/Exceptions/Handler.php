<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\AuthenticationException;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            $response = [
                'success' => false,
                'message' => $e->getMessage(),
                "data" => []
            ];
            abort(response()->json($response, 422));
        });

        $this->renderable(function (NotFoundHttpException $e, $request) {
            $response = [
                'success' => false,
                'message' => $e->getMessage(),
                "data" => []
            ];
            abort(response()->json($response, 404));
        });

        $this->renderable(function (AuthenticationException $e, $request) {
            $response = [
                'success' => false,
                'message' => $e->getMessage(),
                "data" => []
            ];
            abort(response()->json($response, 422));
        });

        $this->renderable(function (UnauthorizedException $e, $request) {
            $response = [
                'success' => false,
                'message' => $e->getMessage(),
                "data" => []
            ];
            abort(response()->json($response, 422));
        });
    }
}
