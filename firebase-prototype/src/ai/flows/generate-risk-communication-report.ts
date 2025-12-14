'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating real-time reports on risk communication activities and outcomes, highlighting any emerging trends.
 *
 * - generateRiskCommunicationReport - A function that generates the risk communication report.
 * - GenerateRiskCommunicationReportInput - The input type for the generateRiskCommunicationReport function.
 * - GenerateRiskCommunicationReportOutput - The return type for the generateRiskCommunicationReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRiskCommunicationReportInputSchema = z.object({
  activitiesData: z.string().describe('A JSON string containing data about recent risk communication activities.'),
  outcomesData: z.string().describe('A JSON string containing data about the outcomes of recent risk communication activities.'),
});
export type GenerateRiskCommunicationReportInput = z.infer<typeof GenerateRiskCommunicationReportInputSchema>;

const GenerateRiskCommunicationReportOutputSchema = z.object({
  report: z.string().describe('A comprehensive report on risk communication activities and outcomes, highlighting any emerging trends.'),
});
export type GenerateRiskCommunicationReportOutput = z.infer<typeof GenerateRiskCommunicationReportOutputSchema>;

export async function generateRiskCommunicationReport(input: GenerateRiskCommunicationReportInput): Promise<GenerateRiskCommunicationReportOutput> {
  return generateRiskCommunicationReportFlow(input);
}

const generateRiskCommunicationReportPrompt = ai.definePrompt({
  name: 'generateRiskCommunicationReportPrompt',
  input: {schema: GenerateRiskCommunicationReportInputSchema},
  output: {schema: GenerateRiskCommunicationReportOutputSchema},
  prompt: `You are an expert in public health risk communication.
  Your task is to generate a real-time report based on the provided data, highlighting any emerging trends that require attention.

  Analyze the following data on risk communication activities:
  {{activitiesData}}

  Analyze the following data on the outcomes of these activities:
  {{outcomesData}}

  Based on your analysis, create a report that includes:
  - An overview of recent activities and their outcomes.
  - Identification of any emerging trends or patterns.
  - Recommendations for actions to address these trends.

  Ensure the report is clear, concise, and actionable for health officials.
  `,
});

const generateRiskCommunicationReportFlow = ai.defineFlow(
  {
    name: 'generateRiskCommunicationReportFlow',
    inputSchema: GenerateRiskCommunicationReportInputSchema,
    outputSchema: GenerateRiskCommunicationReportOutputSchema,
  },
  async input => {
    const {output} = await generateRiskCommunicationReportPrompt(input);
    return output!;
  }
);
