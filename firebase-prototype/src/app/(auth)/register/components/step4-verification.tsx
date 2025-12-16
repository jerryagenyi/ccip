
'use client';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { UploadCloud } from 'lucide-react';
import Link from 'next/link';

export default function Step4Verification() {
  const { control, register } = useFormContext();

  return (
    <div className="space-y-6">
        <div className="text-center">
            <h2>Verification</h2>
            <p className="text-muted-foreground">Just a few final steps to verify your identity.</p>
        </div>

        <FormField
            control={control}
            name="idUpload"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Upload Official ID</FormLabel>
                    <FormDescription>
                        Please upload a government-issued ID for verification (e.g., National ID Card, Driver's License).
                    </FormDescription>
                    <FormControl>
                        <div className="flex items-center justify-center w-full mt-2">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, or PDF (MAX. 2MB)</p>
                                </div>
                                <Input id="dropzone-file" type="file" className="hidden" {...register('idUpload')} />
                            </label>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        
        <FormField
            control={control}
            name="terms"
            render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>
                        Agree to terms and conditions
                        </FormLabel>
                        <FormDescription>
                            By creating an account, you agree to our{' '}
                            <Link href="#" className="text-primary hover:underline">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="#" className="text-primary hover:underline">
                                Privacy Policy
                            </Link>
                            .
                        </FormDescription>
                         <FormMessage />
                    </div>
                </FormItem>
            )}
        />
    </div>
  );
}
