export type DataPoint = { [key: string]: number };

export type AnalysisState = {
  status: 'success';
  results: {
    metrics: {
      mae: number;
      mse: number;
      rmse: number;
      r2: number;
    };
    regressionLine: {
      intercept: number;
      slope: number;
    };
    chartData: Array<DataPoint & { prediction: number | null }>;
  };
  variables: {
    independent: string;
    dependent: string;
  };
  dataDescription: string;
} | {
  status: 'error';
  message: string;
}

export function parseCSV(csvText: string): { data: DataPoint[], headers: string[] } {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must have a header and at least one data row.');
  }

  const headers = lines[0].split(',').map(h => h.trim());
  const data = lines.slice(1).map(line => {
    const values = line.split(',');
    const point: DataPoint = {};
    headers.forEach((header, index) => {
      const value = parseFloat(values[index]);
      point[header] = isNaN(value) ? 0 : value; // Defaulting to 0 for now, could be improved
    });
    return point;
  });

  return { data, headers };
}

function simpleLinearRegression(x: number[], y: number[]): { slope: number, intercept: number } {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

  const meanX = sumX / n;
  const meanY = sumY / n;

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = meanY - slope * meanX;

  return { slope, intercept };
}

function calculateMetrics(yTrue: number[], yPred: number[]): { mae: number, mse: number, rmse: number, r2: number } {
  const n = yTrue.length;
  const residuals = yTrue.map((y, i) => y - yPred[i]);
  
  const mae = residuals.reduce((sum, r) => sum + Math.abs(r), 0) / n;
  const mse = residuals.reduce((sum, r) => sum + r * r, 0) / n;
  const rmse = Math.sqrt(mse);

  const meanYTrue = yTrue.reduce((a, b) => a + b, 0) / n;
  const ssTotal = yTrue.reduce((sum, y) => sum + (y - meanYTrue) ** 2, 0);
  const ssResidual = residuals.reduce((sum, r) => sum + r * r, 0);
  const r2 = 1 - (ssResidual / ssTotal);

  return { mae, mse, rmse, r2 };
}

export function performAnalysis(data: DataPoint[], independentVar: string, dependentVar: string): AnalysisState {
  try {
    if (data.length < 2) {
      return { status: 'error', message: "Insufficient data. At least 2 data points are required for linear regression." };
    }

    const x = data.map(p => p[independentVar]).filter(v => v !== undefined && !isNaN(v));
    const y = data.map(p => p[dependentVar]).filter(v => v !== undefined && !isNaN(v));

    if (x.length !== y.length || x.length < 2) {
        return { status: 'error', message: "Mismatch in valid data points between selected variables, or insufficient valid data." };
    }

    const { slope, intercept } = simpleLinearRegression(x, y);
    const yPred = x.map(xi => slope * xi + intercept);
    const metrics = calculateMetrics(y, yPred);

    const chartData = data.map(point => ({
        ...point,
        prediction: point[independentVar] !== undefined ? slope * point[independentVar] + intercept : null
    }));

    return {
      status: 'success',
      results: {
        metrics,
        regressionLine: { slope, intercept },
        chartData,
      },
      variables: {
        independent: independentVar,
        dependent: dependentVar,
      },
      dataDescription: `The dataset contains ${data.length} records with columns: ${Object.keys(data[0]).join(', ')}. Analysis was performed to predict '${dependentVar}' using '${independentVar}'.`
    };
  } catch (error) {
    return {
        status: 'error',
        message: error instanceof Error ? error.message : 'An unknown error occurred during analysis.'
    }
  }
}
