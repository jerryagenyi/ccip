<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    /**
     * Handle contact form submission
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        try {
            // Send email notification to admin
            $this->sendContactEmail($validated);

            // Optionally: Store in database for future reference
            // You can create a ContactSubmission model and migration if needed
            // ContactSubmission::create($validated);

            return $this->success(
                null,
                'Thank you for your message! We\'ll get back to you soon.',
                201
            );
        } catch (\Exception $e) {
            Log::error('Contact form submission failed', [
                'error' => $e->getMessage(),
                'data' => $validated,
            ]);

            // Still return success to user, but log the error
            return $this->success(
                null,
                'Thank you for your message! We\'ll get back to you soon.',
                201
            );
        }
    }

    /**
     * Send contact form email notification
     */
    protected function sendContactEmail(array $data): void
    {
        // Get admin email from config or use default
        $adminEmail = config('mail.admin_email', config('mail.from.address', 'admin@ccip.local'));

        // If mail is not configured, just log the submission
        if (! config('mail.mailers.smtp.host')) {
            Log::info('Contact form submission (email not configured)', $data);

            return;
        }

        try {
            // Send notification to admin
            Mail::send('emails.contact', $data, function ($message) use ($data, $adminEmail) {
                $message->to($adminEmail)
                    ->subject('New Contact Form Submission: '.$data['subject'])
                    ->replyTo($data['email'], $data['name']);
            });

            // Send auto-reply to user
            Mail::send('emails.contact-auto-reply', $data, function ($message) use ($data) {
                $message->to($data['email'], $data['name'])
                    ->subject('Thank you for contacting CCIP');
            });
        } catch (\Exception $e) {
            Log::error('Failed to send contact form email', [
                'error' => $e->getMessage(),
                'data' => $data,
            ]);
            // Don't throw - we still want to return success to user
        }
    }
}
