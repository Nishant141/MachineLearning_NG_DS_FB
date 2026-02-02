import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Ruler, Sigma, Percent } from 'lucide-react';
import type { AnalysisState } from '@/lib/analysis';

type MetricsGridProps = {
  metrics: AnalysisState['status'] extends 'success' ? AnalysisState['results']['metrics'] : never;
};

const formatMetric = (value: number) => {
    if (Math.abs(value) > 1000 || Math.abs(value) < 0.01 && value !== 0) {
        return value.toExponential(2);
    }
    return value.toFixed(3);
}

export default function MetricsGrid({ metrics }: MetricsGridProps) {
  const metricCards = [
    {
      title: 'R² Score',
      value: formatMetric(metrics.r2),
      icon: Percent,
      description: 'Variance explained',
    },
    {
      title: 'MAE',
      value: formatMetric(metrics.mae),
      icon: Target,
      description: 'Mean Absolute Error',
    },
    {
      title: 'MSE',
      value: formatMetric(metrics.mse),
      icon: Ruler,
      description: 'Mean Squared Error',
    },
    {
      title: 'RMSE',
      value: formatMetric(metrics.rmse),
      icon: Sigma,
      description: 'Root Mean Squared Error',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricCards.map(({ title, value, icon: Icon, description }) => (
        <Card key={title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
