'use client';
import type { AnalysisState } from '@/lib/analysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import MetricsGrid from '@/components/metrics-grid';
import RegressionChart from '@/components/regression-chart';
import AssumptionCheckerCard from '@/components/assumption-checker-card';
import { AlertTriangle, BarChart } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type ResultsDisplayProps = {
  analysisState: AnalysisState | null;
  isLoading: boolean;
  error: string | null;
};

const LoadingSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-80 w-full" />
        </CardContent>
    </Card>
)

export default function ResultsDisplay({ analysisState, isLoading, error }: ResultsDisplayProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Analysis Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    )
  }

  if (!analysisState || analysisState.status === 'error') {
    return (
        <Card className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
            <BarChart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground">Awaiting Analysis</h3>
            <p className="text-muted-foreground">Your results will be displayed here once you run an analysis.</p>
        </Card>
    );
  }

  const { results, variables, dataDescription } = analysisState;

  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
                <MetricsGrid metrics={results.metrics} />
            </CardContent>
        </Card>
        <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
                <RegressionChart data={results.chartData} xVar={variables.independent} yVar={variables.dependent} />
            </div>
            <div className="lg:col-span-2">
                <AssumptionCheckerCard
                    dataDescription={dataDescription}
                    independentVar={variables.independent}
                    dependentVar={variables.dependent}
                />
            </div>
        </div>
    </div>
  );
}
