'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { parseCSV } from '@/lib/analysis';
import type { DataPoint } from '@/lib/analysis';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

type DataInputPanelProps = {
  onRunAnalysis: (data: DataPoint[], independentVar: string, dependentVar: string) => void;
  isAnalysisPending: boolean;
};

const placeholderData = `year,revenue,expenses
2015,100,80
2016,120,90
2017,150,100
2018,170,110
2019,200,120
2020,180,130
2021,220,140
2022,250,150
2023,280,160
2024,310,170`;

export default function DataInputPanel({ onRunAnalysis, isAnalysisPending }: DataInputPanelProps) {
  const [csvText, setCsvText] = useState(placeholderData);
  const [parsedData, setParsedData] = useState<{ data: DataPoint[], headers: string[] } | null>(null);
  const [independentVar, setIndependentVar] = useState<string>('');
  const [dependentVar, setDependentVar] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const handleParse = () => {
    try {
      const { data, headers } = parseCSV(csvText);
      setParsedData({ data, headers });
      setError(null);
      if (headers.length >= 2) {
        setIndependentVar(headers[0]);
        setDependentVar(headers[1]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to parse CSV.');
      setParsedData(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedData && independentVar && dependentVar) {
      onRunAnalysis(parsedData.data, independentVar, dependentVar);
    } else {
        setError('Please parse valid CSV data and select variables before running analysis.')
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>1. Input Data</CardTitle>
        <CardDescription>Paste your data in CSV format below, then parse and select your variables.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="csv-input">CSV Data</Label>
          <Textarea
            id="csv-input"
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder={placeholderData}
            className="h-48 font-mono text-xs"
          />
        </div>
        <Button onClick={handleParse} className="w-full">Parse CSV Data</Button>
        
        {error && (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {parsedData && (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="independent-var">Independent Variable (X)</Label>
                <Select value={independentVar} onValueChange={setIndependentVar}>
                  <SelectTrigger id="independent-var">
                    <SelectValue placeholder="Select X" />
                  </SelectTrigger>
                  <SelectContent>
                    {parsedData.headers.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dependent-var">Dependent Variable (Y)</Label>
                <Select value={dependentVar} onValueChange={setDependentVar}>
                  <SelectTrigger id="dependent-var">
                    <SelectValue placeholder="Select Y" />
                  </SelectTrigger>
                  <SelectContent>
                    {parsedData.headers.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
             <Button type="submit" className="w-full" disabled={isAnalysisPending}>
                {isAnalysisPending ? 'Analyzing...' : '2. Run Analysis'}
             </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
