// src/app/project/[slug]/edit/actions.ts
"use server"; // Marks all functions in this file as Server Actions

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// --- Configuration ---
const MODEL_NAME = "gemini-1.5-flash-latest"; // Or your preferred model (e.g., "gemini-pro")
const API_KEY = process.env.GEMINI_API_KEY;

const generationConfig = {
  temperature: 0.6,       // Adjust creativity (0=deterministic, 1=max creative)
  topK: 1,
  topP: 1,
  maxOutputTokens: 4096,  // Max length of the generated code
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// --- Initialization ---
let genAI: GoogleGenerativeAI | null = null;
if (!API_KEY) {
  console.error("FATAL ERROR: GEMINI_API_KEY environment variable is not set.");
  // Application might not function correctly without the API key.
} else {
  genAI = new GoogleGenerativeAI(API_KEY);
}

// --- Action Result Interface ---
interface ActionResult {
  success: boolean;
  data?: string; // The generated diagram code
  error?: string; // Error message if failed
}

// --- Server Action Function ---
interface GenerateSuggestionParams {
  userPrompt: string;
  diagramName: string; // e.g., "Login Sequence", "User Class Model"
  currentDiagramCode: string;
}

export async function generateSuggestionAction(params: GenerateSuggestionParams): Promise<ActionResult> {
  const { userPrompt, diagramName, currentDiagramCode } = params;

  // Validate Initialization and Input
  if (!genAI) {
    console.error("Gemini SDK not initialized. API key might be missing or invalid.");
    return { success: false, error: "Server configuration error: AI service is unavailable." };
  }
  if (!userPrompt?.trim()) {
    return { success: false, error: "Please provide a description of what you want the AI to do." };
  }

  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  // --- Prompt Engineering ---
  const fullPrompt = `
You are an expert assistant specialized in generating and modifying PlantUML diagram code.
The user is working on a diagram named "${diagramName}". Infer the diagram type (sequence, class, etc.) if possible from the name or code.

Current PlantUML Code:
\`\`\`plantuml
${currentDiagramCode || "@startuml\n\n@enduml"}
\`\`\`

User's Request: "${userPrompt}"

Instructions:
1. Analyze the current PlantUML code and the user's request carefully.
2. Modify the PlantUML code according to the request. If the request is vague (e.g., "improve this"), focus on syntax correction, readability improvements (layout, comments), or adding common elements based on the inferred diagram type.
3. IMPORTANT: Your response must contain ONLY the complete, updated, and valid PlantUML code.
4. The response MUST start exactly with "@startuml" and end exactly with "@enduml".
5. Do NOT include any explanations, apologies, introductions, markdown code fences (\`\`\`), or any text outside the @startuml ... @enduml block.
6. If the request is impossible, nonsensical for PlantUML, or ethically problematic, return the original diagram code unmodified.

Updated PlantUML Code:
`; // Gemini will append the code starting with @startuml

  try {
    console.log(`[Gemini Action] Sending prompt for diagram: "${diagramName}"`);
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig,
      safetySettings,
    });

    // --- Response Handling ---
    const response = result.response;
    if (!response) {
      // Handle cases where generation was blocked or failed
      const blockReason = result.promptFeedback?.blockReason;
      const safetyRatingsDetails = result.promptFeedback?.safetyRatings?.map(r => `${r.category}: ${r.probability}`).join(', ');
      console.warn(`[Gemini Action] Generation failed/blocked. Reason: ${blockReason || 'Unknown'}. Safety: [${safetyRatingsDetails || 'N/A'}]`);
      let userMessage = "AI generation failed.";
      if (blockReason === 'SAFETY') {
          userMessage = "The request was blocked due to safety settings. Please modify your prompt.";
      } else if (blockReason) {
          userMessage = `Generation blocked: ${blockReason}. Please revise your prompt.`;
      }
      return { success: false, error: userMessage };
    }

    const responseText = response.text();
    console.log(`[Gemini Action] Raw response received (length: ${responseText.length})`);

    // --- Cleanup and Validation ---
    let cleanedCode = responseText.trim();

    // Minimal cleanup: Remove potential leading/trailing markdown fences just in case AI slips.
    cleanedCode = cleanedCode.replace(/^```(?:plantuml)?\s*/, '').replace(/\s*```$/, '').trim();

    // Strict validation: Must start and end correctly.
    if (!cleanedCode.startsWith('@startuml') || !cleanedCode.endsWith('@enduml')) {
      console.error("[Gemini Action] AI response did not conform to expected PlantUML format.", cleanedCode.substring(0, 200) + "...");
      return { success: false, error: "AI returned content in an unexpected format. Please try again or refine your prompt." };
    }

    // Check if the result is identical to the input (might happen if AI can't fulfill request)
    if (cleanedCode === currentDiagramCode.trim()) {
         console.log("[Gemini Action] AI returned the original code. Request might have been unfulfillable or trivial.");
         // Return success, but maybe indicate no change was made? For now, just return the code.
         // Could add a specific message later if needed.
    }

    return { success: true, data: cleanedCode };

  } catch (error: any) {
    console.error("[Gemini Action] Unhandled error during Gemini API call:", error);
    let errorMessage = "Failed to generate suggestion due to an unexpected server error.";
    // Check for common error types
    if (error.message?.includes('API key') || error.status === 403 || error.status === 401) {
      errorMessage = "Server configuration error: Could not authenticate with the AI service.";
    } else if (error.message?.includes('quota')) {
      errorMessage = "AI service quota exceeded. Please try again later.";
    } else if (error.message?.includes('timeout') || error.message?.includes('network')) {
        errorMessage = "Network error connecting to the AI service. Please check your connection and try again.";
    }
    // Consider more specific logging for different error types server-side
    // logErrorToServer(error);
    return { success: false, error: errorMessage };
  }
}