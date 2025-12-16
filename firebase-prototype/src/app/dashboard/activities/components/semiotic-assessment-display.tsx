
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ShieldAlert, CheckCircle, BrainCircuit } from 'lucide-react';
import type { SemioticAssessment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Props = {
    result: SemioticAssessment | null;
    isLoading: boolean;
};

const AssessmentSkeleton = () => (
    <div className="flex flex-col md:flex-row gap-6 p-6 border rounded-lg">
        <div className="flex flex-col items-center justify-center gap-2 md:w-1/4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-4 w-24" />
        </div>
        <div className="md:w-3/4 space-y-4">
            <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
             <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
        </div>
    </div>
);


const SemioticAssessmentDisplay = ({ result, isLoading }: Props) => {

    if (isLoading) {
        return <AssessmentSkeleton />;
    }

    if (!result) {
        return (
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <BrainCircuit className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Ready for Analysis</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Enter your message and context above, then click "Assess Semiotic Risk" to see the analysis.
                </p>
            </div>
        );
    }
    
    const getRiskColor = (score: number) => {
        if (score > 70) return 'text-red-500';
        if (score > 40) return 'text-orange-500';
        return 'text-green-500';
    };

    const getRiskLabel = (score: number) => {
        if (score > 70) return 'High Risk';
        if (score > 40) return 'Moderate Risk';
        return 'Low Risk';
    };

    const riskColor = getRiskColor(result.riskScore);
    const riskLabel = getRiskLabel(result.riskScore);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow"
            >
                <div className="p-6 flex flex-col md:flex-row items-start gap-6">
                    <div className="flex-shrink-0 flex flex-col items-center justify-center gap-2 text-center md:w-1/4">
                        <div className={cn("text-5xl font-bold tracking-tighter", riskColor)}>{result.riskScore}</div>
                        <div className={cn("font-semibold text-sm", riskColor)}>{riskLabel}</div>
                         <p className="text-xs text-muted-foreground mt-1">Assessed on {new Date(result.assessedAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex-1 space-y-6">
                        {result.predictedFailures.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-lg flex items-center gap-2 mb-2">
                                    <ShieldAlert className="h-5 w-5 text-orange-500" />
                                    Potential Issues Detected
                                </h4>
                                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                                    {result.predictedFailures.map((failure, index) => (
                                        <li key={index}>
                                            The phrase <span className="font-semibold text-foreground">"{failure.failedElement}"</span> may pose a risk.
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div>
                            <h4 className="font-semibold text-lg flex items-center gap-2 mb-2">
                                <Lightbulb className="h-5 w-5 text-green-500" />
                                Recommendations
                            </h4>
                            <ul className="space-y-3">
                                {result.recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-muted-foreground">{rec.recommendation}</p>
                                            {/* <Button variant="link" size="sm" className="h-auto p-0 text-xs">Apply Suggestion</Button> */}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                         {result.riskScore > 0 &&
                            <Alert variant="destructive">
                                <ShieldAlert className="h-4 w-4" />
                                <AlertTitle>Manual Review Recommended</AlertTitle>
                                <AlertDescription>
                                    AI analysis provides suggestions, not final decisions. Always have a human expert review communications before dissemination.
                                </AlertDescription>
                            </Alert>
                         }
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SemioticAssessmentDisplay;
