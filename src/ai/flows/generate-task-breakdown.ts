'use server';

/**
 * @fileOverview Generates a step-by-step breakdown of tasks and a title from natural language input, asking clarifying questions as needed.
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
  title: z
    .string()
    .optional()
    .describe('A concise and relevant title for the to-do list.'),
  steps: z
    .array(z.string())
    .optional()
    .describe('The step-by-step breakdown of the task.'),
  confirmed: z
    .boolean()
    .describe('Whether the user has confirmed the task breakdown.'),
  followUpQuestion: z
    .string()
    .optional()
    .describe('A single follow-up question to clarify ambiguous details.'),
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

  Based on the user's input, generate a step-by-step breakdown of the task. If the task is ambiguous or requires more information, ask a single follow-up question to clarify the details.

  If you have enough information to generate a list, generate a concise and relevant title for the list, generate the steps, and set confirmed to true.
  If you need more information, ask one follow-up question and set confirmed to false.

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
