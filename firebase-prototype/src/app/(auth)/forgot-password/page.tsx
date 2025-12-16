'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ArrowLeft, MailCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    setSubmittedEmail(data.email);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                    <MailCheck className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
            </CardHeader>
            <CardContent className="text-center">
                <h1 className="text-2xl font-bold">Check your email</h1>
                <p className="text-muted-foreground mt-2">
                    We've sent a password reset link to <br />
                    <span className="font-bold text-foreground">{submittedEmail}</span>
                </p>
                <Button variant="link" className="mt-4 h-auto p-0" asChild>
                    <Link href="/login">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Sign In
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <h1 className="text-2xl font-bold">Forgot Password?</h1>
        <CardDescription>
          No worries, we'll send you reset instructions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="gradient"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send Reset Link
            </Button>
            <Button variant="link" className="w-full h-auto" asChild>
                <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sign In
                </Link>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
