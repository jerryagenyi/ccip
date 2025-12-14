<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class PasswordResetController extends Controller
{
    public function sendResetLink(ForgotPasswordRequest $request)
    {

        // Always attempt to send reset link, but don't reveal if email exists
        // This prevents email enumeration attacks
        Password::sendResetLink(
            $request->only('email')
        );

        // Always return success message regardless of whether email exists
        // This is a security best practice to prevent email enumeration
        return $this->success(null, 'If that email address exists, a password reset link has been sent.');
    }

    public function reset(ResetPasswordRequest $request)
    {

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return $this->success(null, 'Password reset successfully');
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }
}

