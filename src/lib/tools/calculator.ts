import { evaluate } from "mathjs";
import { z } from "zod";

export const calculatorToolSchema = z.object({
  expression: z.string().describe("Mathematical expression to evaluate (e.g., '2 + 2', 'sqrt(16)', 'sin(pi/2)')"),
});

export type CalculatorInput = z.infer<typeof calculatorToolSchema>;

export function calculator(input: CalculatorInput): string {
  const { expression } = input;
  
  try {
    const result = evaluate(expression);
    return `${expression} = ${result}`;
  } catch (error) {
    console.error("Calculator error:", error);
    return `Error evaluating expression: ${expression}. Please check the syntax.`;
  }
}
