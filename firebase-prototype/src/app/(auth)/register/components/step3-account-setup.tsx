
'use client';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

export default function Step3AccountSetup() {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-6">
       <div className="text-center">
            <h2>Set Up Your Password</h2>
            <p className="text-muted-foreground">Choose a strong password to secure your account.</p>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" {...field} />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 h-full w-12"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
                <div className="relative">
                    <FormControl>
                    <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" {...field} />
                    </FormControl>
                    <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-full w-12"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
