<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    public function verify(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $this->success(null, 'Email already verified');
        }

        if ($request->user()->markEmailAsVerified()) {
            return $this->success(null, 'Email verified successfully');
        }

        return $this->error('Unable to verify email', 400);
    }

    public function resend(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $this->success(null, 'Email already verified');
        }

        $request->user()->sendEmailVerificationNotification();

        return $this->success(null, 'Verification email sent');
    }
}

