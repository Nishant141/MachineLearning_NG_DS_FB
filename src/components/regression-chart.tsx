'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { CartesianGrid, Legend, Line, Scatter, ComposedChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';

type RegressionChartProps = {
  data: Record<string, any>[];
  xVar: string;
  yVar: string;
};

export default function RegressionChart({ data, xVar, yVar }: RegressionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Regression Visualization</CardTitle>
        <CardDescription>
          Scatter plot of {yVar} vs. {xVar} with the fitted regression line.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[400px] w-full">
            <ResponsiveContainer>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xVar} type="number" name={xVar} domain={['dataMin', 'dataMax']} tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={{ stroke: 'hsl(var(--muted-foreground))' }} />
            <YAxis dataKey={yVar} type="number" name={yVar} domain={['dataMin', 'dataMax']} tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={{ stroke: 'hsl(var(--muted-foreground))' }} />
            <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
            <Legend />
            <Scatter name="Actual Data" dataKey={yVar} fill="hsl(var(--accent))" />
            <Line name="Regression Line" dataKey="prediction" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} />
          </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
