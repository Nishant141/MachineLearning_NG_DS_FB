// src/ai/flows/assumption-checker.ts
'use server';

/**
 * @fileOverview A GenAI-powered tool that helps evaluate the assumptions of linear regression
 * (linearity, multicollinearity) and suggests data transformations to address violations.
 *
 * - assumptionChecker - A function that handles the assumption checking process.
 * - AssumptionCheckerInput - The input type for the assumptionChecker function.
 * - AssumptionCheckerOutput - The return type for the assumptionChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssumptionCheckerInputSchema = z.object({
  dataDescription: z
    .string()
    .describe('A description of the dataset including column names and types.'),
  analysisGoal: z.string().describe('The goal of the linear regression analysis.'),
});

export type AssumptionCheckerInput = z.infer<typeof AssumptionCheckerInputSchema>;

const AssumptionCheckerOutputSchema = z.object({
  linearity: z.string().describe('An analysis of the linearity assumption.'),
  multicollinearity: z
    .string()
    .describe('An analysis of the multicollinearity assumption, using VIF.'),
  suggestedTransformations:
    z.string().describe('Suggested data transformations to address violations.'),
});

export type AssumptionCheckerOutput = z.infer<typeof AssumptionCheckerOutputSchema>;

export async function assumptionChecker(
  input: AssumptionCheckerInput
): Promise<AssumptionCheckerOutput> {
  return assumptionCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assumptionCheckerPrompt',
  input: {schema: AssumptionCheckerInputSchema},
  output: {schema: AssumptionCheckerOutputSchema},
  prompt: `You are an expert data scientist specializing in linear regression diagnostics.

You will analyze the provided dataset description and analysis goal to evaluate the assumptions of linear regression: linearity and multicollinearity.

Based on your analysis, suggest appropriate data transformations to address any violations of these assumptions.

Dataset Description: {{{dataDescription}}}
Analysis Goal: {{{analysisGoal}}}

Output:
Linearity Analysis: <Linearity analysis>
Multicollinearity Analysis: <Multicollinearity analysis using Variance Inflation Factor (VIF)>
Suggested Transformations: <Suggested data transformations>
`,
});

const assumptionCheckerFlow = ai.defineFlow(
  {
    name: 'assumptionCheckerFlow',
    inputSchema: AssumptionCheckerInputSchema,
    outputSchema: AssumptionCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
