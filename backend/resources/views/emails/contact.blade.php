<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #7b2cbf 0%, #9d4edd 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
        <p style="margin-top: 0;">You have received a new contact form submission from the CCIP website:</p>
        
        <div style="background: white; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> {{ $name }}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:{{ $email }}">{{ $email }}</a></p>
            <p style="margin: 10px 0;"><strong>Subject:</strong> {{ $subject }}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <strong>Message:</strong>
            <p style="white-space: pre-wrap; margin-top: 10px;">{{ $message }}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="margin: 0; font-size: 14px; color: #666;">
                You can reply directly to this email to respond to {{ $name }}.
            </p>
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        <p>This email was sent from the CCIP contact form.</p>
    </div>
</body>
</html>

