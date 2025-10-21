'use server';

/**
 * @fileOverview Generates a step-by-step breakdown of tasks from natural language input, asking clarifying questions as needed.
 *
 * - generateTaskBreakdown - A function that handles the task breakdown process.
 * - GenerateTaskBreakdownInput - The input type for the generateTaskBreakdown function.
 * - GenerateTaskBreakdownOutput - The return type for the generateTaskBreakdown function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTaskBreakdownInputSchema = z.object({
  task: z.string().describe('The to-do item in natural language.'),
});
export type GenerateTaskBreakdownInput = z.infer<
  typeof GenerateTaskBreakdownInputSchema
>;

const GenerateTaskBreakdownOutputSchema = z.object({
  steps: z.array(z.string()).describe('The step-by-step breakdown of the task.'),
  confirmed: z.boolean().describe('Whether the user has confirmed the task breakdown.'),
  followUpQuestions: z
    .array(z.string())
    .optional()
    .describe('Follow-up questions to clarify ambiguous details.'),
});
export type GenerateTaskBreakdownOutput = z.infer<
  typeof GenerateTaskBreakdownOutputSchema
>;

export async function generateTaskBreakdown(
  input: GenerateTaskBreakdownInput
): Promise<GenerateTaskBreakdownOutput> {
  return generateTaskBreakdownFlow(input);
}

const generateTaskBreakdownPrompt = ai.definePrompt({
  name: 'generateTaskBreakdownPrompt',
  input: {schema: GenerateTaskBreakdownInputSchema},
  output: {schema: GenerateTaskBreakdownOutputSchema},
  prompt: `You are a helpful AI assistant that breaks down tasks into actionable steps.

  Based on the user's input, generate a step-by-step breakdown of the task. If the task is ambiguous or requires more information, ask follow-up questions to clarify the details. Once you have a clear understanding of the task, generate the steps and confirm with the user.

  Task: {{{task}}}`,
});

const generateTaskBreakdownFlow = ai.defineFlow(
  {
    name: 'generateTaskBreakdownFlow',
    inputSchema: GenerateTaskBreakdownInputSchema,
    outputSchema: GenerateTaskBreakdownOutputSchema,
  },
  async input => {
    const {output} = await generateTaskBreakdownPrompt(input);
    return output!;
  }
);
