<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class PasswordResetController extends Controller
{
    public function sendResetLink(ForgotPasswordRequest $request)
    {
        try {
            // Always attempt to send reset link, but don't reveal if email exists
            // This prevents email enumeration attacks
            Password::sendResetLink(
                $request->only('email')
            );
        } catch (\Exception $e) {
            // If email is not configured (e.g., in testing), log the error but still return success
            // This maintains security by not revealing if email exists
            Log::warning('Password reset email failed to send: ' . $e->getMessage());
        }

        // Always return success message regardless of whether email exists or was sent
        // This is a security best practice to prevent email enumeration
        return $this->success(null, 'If that email address exists, a password reset link has been sent.');
    }

    public function reset(ResetPasswordRequest $request)
    {
        try {
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
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            // Log unexpected errors but return validation error to user
            Log::error('Password reset failed: ' . $e->getMessage());
            throw ValidationException::withMessages([
                'email' => ['Unable to reset password. Please try again or request a new reset link.'],
            ]);
        }
    }
}
