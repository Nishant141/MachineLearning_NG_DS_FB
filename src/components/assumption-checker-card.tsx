'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { assumptionChecker, AssumptionCheckerOutput } from '@/ai/flows/assumption-checker';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from './ui/skeleton';
import { BrainCircuit } from 'lucide-react';

type AssumptionCheckerCardProps = {
  dataDescription: string;
  independentVar: string;
  dependentVar: string;
};

export default function AssumptionCheckerCard({ dataDescription, independentVar, dependentVar }: AssumptionCheckerCardProps) {
  const [analysisGoal, setAnalysisGoal] = useState(`Predict ${dependentVar} based on ${independentVar} to understand their relationship.`);
  const [isPending, startTransition] = useTransition();
  const [aiResult, setAiResult] = useState<AssumptionCheckerOutput | null>(null);

  const handleCheckAssumptions = () => {
    startTransition(async () => {
      const result = await assumptionChecker({
        dataDescription,
        analysisGoal,
      });
      setAiResult(result);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary"/>
            AI Assumption Checker
        </CardTitle>
        <CardDescription>Use AI to check for violations of linear regression assumptions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="analysis-goal">Analysis Goal</Label>
          <Textarea
            id="analysis-goal"
            value={analysisGoal}
            onChange={(e) => setAnalysisGoal(e.target.value)}
            className="h-24"
          />
        </div>
        <Button onClick={handleCheckAssumptions} disabled={isPending} className="w-full">
          {isPending ? 'AI is thinking...' : 'Check Assumptions'}
        </Button>

        {isPending && (
          <div className="space-y-2 pt-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {aiResult && (
          <Accordion type="single" collapsible className="w-full pt-4">
            <AccordionItem value="linearity">
              <AccordionTrigger>Linearity Analysis</AccordionTrigger>
              <AccordionContent className="prose prose-sm dark:prose-invert">
                {aiResult.linearity}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="multicollinearity">
              <AccordionTrigger>Multicollinearity Analysis</AccordionTrigger>
              <AccordionContent className="prose prose-sm dark:prose-invert">
                {aiResult.multicollinearity}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="transformations">
              <AccordionTrigger>Suggested Transformations</AccordionTrigger>
              <AccordionContent className="prose prose-sm dark:prose-invert">
                {aiResult.suggestedTransformations}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
