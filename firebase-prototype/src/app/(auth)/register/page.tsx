

'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { StepIndicator } from './components/step-indicator';
import Step1PersonalInfo from './components/step1-personal-info';
import Step2Organisation from './components/step2-organisation';
import Step3AccountSetup from './components/step3-account-setup';
import Step4Verification from './components/step4-verification';
import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const personalInfoSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  jobTitle: z.string().min(2, 'Job title is required.'),
});

const organisationSchema = z.object({
  organisationId: z.string().nonempty('You must select an organisation.'),
});

const accountSetupSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const verificationSchema = z.object({
  idUpload: z.any().refine(val => val && val.length > 0, 'ID upload is required.'),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions.'),
});

const allSchemas = [personalInfoSchema, organisationSchema, accountSetupSchema, verificationSchema];


export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const methods = useForm({
    resolver: zodResolver(allSchemas[currentStep]),
    mode: 'onChange',
  });

  const { trigger, handleSubmit, formState } = methods;

  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      if (currentStep < 3) {
        setCurrentStep(step => step + 1);
      } else {
        // This is the final step, trigger form submission
        handleSubmit(onSubmit)();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };

  const onSubmit = (data: any) => {
    console.log("Registration Data:", data);
    // Simulate API call for submission
    setTimeout(() => {
        setIsSubmitted(true);
    }, 1000);
  };
  
  const steps = [
    { name: 'Personal Info', component: <Step1PersonalInfo /> },
    { name: 'Organisation', component: <Step2Organisation /> },
    { name: 'Account Setup', component: <Step3AccountSetup /> },
    { name: 'Verification', component: <Step4Verification /> },
  ];

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent>
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
            <h2 className="text-3xl font-bold">Registration Submitted!</h2>
            <p className="text-muted-foreground mt-3 max-w-md">
              Thank you. Your registration has been submitted for verification. You will receive an email once your account has been approved by an administrator.
            </p>
            <div className="mt-10 flex gap-4">
              <Button variant="gradient" onClick={() => router.push('/login')}>Return to Login</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
        <FormProvider {...methods}>
            <form onSubmit={e => e.preventDefault()}>
                <StepIndicator currentStep={currentStep} />
                <CardContent className="p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {steps[currentStep].component}
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-8 flex justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className={currentStep === 0 ? 'invisible' : 'visible'}
                    >
                        <ArrowLeft className="mr-2" /> Back
                    </Button>
                    <Button type="button" variant="gradient" onClick={nextStep}>
                        {currentStep === 3 ? 'Finish Registration' : 'Next Step'}
                    </Button>
                    </div>
                </CardContent>
            </form>
        </FormProvider>
    </Card>
  );
}
