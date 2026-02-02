'use client';

import { useState } from 'react';
import type { DataPoint, AnalysisState } from '@/lib/analysis';
import DataInputPanel from '@/components/data-input-panel';
import ResultsDisplay from '@/components/results-display';
import { performAnalysis } from '@/lib/analysis';

export default function RegressionDashboard() {
  const [analysisState, setAnalysisState] = useState<AnalysisState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunAnalysis = (
    data: DataPoint[],
    independentVar: string,
    dependentVar: string
  ) => {
    setIsLoading(true);
    setError(null);
    setAnalysisState(null);
    
    // Simulate network delay for better UX
    setTimeout(() => {
        const result = performAnalysis(data, independentVar, dependentVar);
        if (result.status === 'error') {
            setError(result.message);
            setAnalysisState(null);
        } else {
            setAnalysisState(result);
        }
        setIsLoading(false);
    }, 500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <DataInputPanel onRunAnalysis={handleRunAnalysis} isAnalysisPending={isLoading} />
      </div>
      <div className="lg:col-span-2">
        <ResultsDisplay analysisState={analysisState} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
}
