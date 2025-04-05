// src/app/api/ai/plantUmlAssistant/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Google AI with your API key
const googleAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: NextRequest) {
    console.log("#####################################form ai route");
    
  try {
    // Parse the request body
    const { prompt, currentCode, diagramType } = await request.json();

    // Validate required inputs
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Get the Gemini model (using pro vision for better context understanding)
    const model = googleAI.getGenerativeModel({ model: 'gemini-2.0-pro' });

    // Construct a detailed prompt to give context for the AI
    const systemPrompt = `You are an expert PlantUML developer. Given the following ${diagramType} diagram code and a user request, 
    provide an improved version of the PlantUML code.
    
    CURRENT PLANTUML CODE:
    ${currentCode}
    
    USER REQUEST:
    ${prompt}
    
    Only respond with valid PlantUML code. Do not include explanations or markdown formatting.
    Make sure the code is syntactically correct and follows PlantUML best practices.
    Preserve any existing structure unless explicitly asked to change it.
    Add helpful comments in the code where appropriate.`;

    // Generate the response from Gemini
    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    const suggestedCode = response.text().trim();
    console.log(suggestedCode);
    

    // Return the generated code
    return NextResponse.json({ suggestedCode });
  } catch (error) {
    console.error('Error in PlantUML AI Assistant:', error);
    return NextResponse.json(
      { error: 'Failed to generate PlantUML suggestion' },
      { status: 500 }
    );
  }
}