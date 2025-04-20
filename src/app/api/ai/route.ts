// src/app/api/ai/plantUmlAssistant/route.ts
import removePlantUMLBlock from '@/lib/removePlantUMLBlock';
import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { 
      prompt, 
      currentCode, 
      diagramType, 
      model = 'gemini-2.0-flash',
      ollamaBaseUrl = 'http://localhost:11434'  // Default Ollama server URL
    } = await request.json();

    // Validate required inputs
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log("Selected model:", model);
    
    // Initialize the model based on user selection
    let llm;
    
    // Model selection logic
    if (model && typeof model === 'string') {
      if (model.startsWith('gpt')) {
        llm = new ChatOpenAI({
          modelName: model,
          temperature: 0.2,
          apiKey: process.env.OPENAI_API_KEY,
        });
      } else if (model.startsWith('gemini')) {
        console.log("Initializing Google Generative AI");
        llm = new ChatGoogleGenerativeAI({
          model: model,
          apiKey: process.env.GEMINI_API_KEY || '',
          temperature: 0.2,
        });
        // console.log("Google Generative AI initialized");
        
      } else if (model.startsWith('claude')) {
        llm = new ChatAnthropic({
          modelName: model,
          apiKey: process.env.ANTHROPIC_API_KEY || '',
          temperature: 0.2,
        });
      } else if (model.startsWith('ollama:')) {
        // Extract the actual model name after "ollama:" prefix
        const ollamaModel = model.replace('ollama:', '');
        
        llm = new ChatOllama({
          model: ollamaModel,
          baseUrl: ollamaBaseUrl,
          temperature: 0.2,
        });
      } else {
        // Default to OpenAI if model string doesn't match any known prefix
        console.log("Using default OpenAI model");
        llm = new ChatOpenAI({
          modelName: 'gpt-3.5-turbo',
          temperature: 0.2,
          apiKey: process.env.OPENAI_API_KEY,
        });
      }
    } else {
      // Fallback if model is undefined or not a string
      console.log("Model parameter is invalid, using default");
      llm = new ChatOpenAI({
        modelName: 'gpt-3.5-turbo',
        temperature: 0.2,
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    // Create a prompt template
    const promptTemplate = PromptTemplate.fromTemplate(
      `You are an expert PlantUML developer. Given the following {diagramType} diagram code and a user request, provide an improved version of the PlantUML code.

CURRENT PLANTUML CODE:
{currentCode}

USER REQUEST:
{prompt}

Only respond with valid PlantUML code. Do not include explanations or markdown formatting. Make sure the code is syntactically correct and follows PlantUML best practices. Preserve any existing structure unless explicitly asked to change it. Add helpful comments in the code where appropriate.`
    );

    // Create a chain
    const chain = promptTemplate
      .pipe(llm)
      .pipe(new StringOutputParser());

    // Execute the chain
    console.log(chain)
    const suggestedCode = await chain.invoke({
      prompt,
      currentCode: currentCode || '',
      diagramType: diagramType || 'sequence'
    });
    console.log("Suggested Code:", suggestedCode);
    
    // Process the result to remove any markdown code blocks if present
    const cleanedCode = removePlantUMLBlock(suggestedCode.trim());
    
    // Return the generated code
    return NextResponse.json({ suggestedCode: cleanedCode });

  } catch (error) {
    console.error('Error in PlantUML AI Assistant:', error);
    return NextResponse.json(
      { error: 'Failed to generate PlantUML suggestion', details: error },
      { status: 500 }
    );
  }
}