// src/app/api/ai/plantUmlAssistant/route.ts
import removePlantUMLBlock from '@/lib/removePlantUMLBlock';
import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextAuth';
import { prisma } from '@/lib/prisma';
// import { PrismaClient } from '@prisma/client';
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth"; // Adjust import path as needed

// const prisma = new PrismaClient();

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isCodeResponse?: boolean;
}

// Fallback in-memory storage for unauthenticated users
const conversationStore = new Map<string, ConversationMessage[]>();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { 
      prompt, 
      currentCode, 
      diagramType, 
      model = 'gemini-2.0-flash',
      ollamaBaseUrl = 'http://localhost:11434',
      conversationHistory = [],
      sessionId,
      maxHistoryLength = 10,
      diagramId // New parameter to link conversation to diagram
    } = await request.json();

    // Validate required inputs
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log("Selected model:", model);
    
    // Get user session
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Generate or use existing session ID
    const currentSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    let conversation: ConversationMessage[] = [];
    let dbConversation = null;

    // Try to load from database if user is authenticated and diagramId is provided
    if (userId && diagramId) {
      try {
        dbConversation = await prisma.diagramConversation.findUnique({
          where: {
            diagramId: diagramId
          },
          include: {
            messages: {
              orderBy: {
                timestamp: 'asc'
              }
            }
          }
        });

        if (dbConversation) {
          conversation = dbConversation.messages.map(msg => ({
            role: msg.role as 'user' | 'assistant' | 'system',
            content: msg.content,
            timestamp: Number(msg.timestamp),
            isCodeResponse: msg.isCodeResponse
          }));
        }
      } catch (error) {
        console.error('Error loading conversation from database:', error);
      }
    }

    // Fallback to in-memory storage or existing conversation history
    if (conversation.length === 0) {
      conversation = conversationStore.get(currentSessionId) || conversationHistory || [];
    }
    
    // Add system message if this is a new conversation
    if (conversation.length === 0) {
      const systemMessage: ConversationMessage = {
        role: 'system',
        content: `You are an expert PlantUML developer assistant. You help users create and modify ${diagramType} diagrams. 

CURRENT DIAGRAM CODE:
${currentCode || 'No existing code'}

Guidelines:
- When providing PlantUML code, respond with ONLY the code and mark it as a code response
- For questions, explanations, or general discussion, provide helpful text responses
- Always ensure PlantUML code is syntactically correct
- Preserve existing structure unless explicitly asked to change it
- Add helpful comments in the code where appropriate
- If asked to modify the diagram, provide the complete updated code`,
        timestamp: Date.now()
      };
      conversation.push(systemMessage);
    }

    // Add user message to conversation
    const userMessage: ConversationMessage = {
      role: 'user',
      content: prompt,
      timestamp: Date.now()
    };
    conversation.push(userMessage);

    // Initialize the model based on user selection
    let llm;
    
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
      } else if (model.startsWith('claude')) {
        llm = new ChatAnthropic({
          modelName: model,
          apiKey: process.env.ANTHROPIC_API_KEY || '',
          temperature: 0.2,
        });
      } else if (model.startsWith('ollama:')) {
        const ollamaModel = model.replace('ollama:', '');
        llm = new ChatOllama({
          model: ollamaModel,
          baseUrl: ollamaBaseUrl,
          temperature: 0.2,
        });
      } else {
        console.log("Using default OpenAI model");
        llm = new ChatOpenAI({
          modelName: 'gpt-3.5-turbo',
          temperature: 0.2,
          apiKey: process.env.OPENAI_API_KEY,
        });
      }
    } else {
      llm = new ChatOpenAI({
        modelName: 'gpt-3.5-turbo',
        temperature: 0.2,
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    // Convert conversation to LangChain message format
    const messages = conversation.map(msg => {
      switch (msg.role) {
        case 'system':
          return new SystemMessage(msg.content);
        case 'user':
          return new HumanMessage(msg.content);
        case 'assistant':
          return new AIMessage(msg.content);
        default:
          return new HumanMessage(msg.content);
      }
    });

    // Get response from LLM
    const response = await llm.invoke(messages);
    const responseContent = response.content as string;

    console.log("AI Response:", responseContent);

    // Determine if this is a code response
    const isCodeResponse = responseContent.includes('@startuml') || 
                          responseContent.includes('@enduml') ||
                          prompt.toLowerCase().includes('code') ||
                          prompt.toLowerCase().includes('diagram') ||
                          prompt.toLowerCase().includes('modify') ||
                          prompt.toLowerCase().includes('change') ||
                          prompt.toLowerCase().includes('update');

    // Process the result to remove any markdown code blocks if present
    const cleanedResponse = removePlantUMLBlock(responseContent.trim());

    // Add AI response to conversation
    const aiMessage: ConversationMessage = {
      role: 'assistant',
      content: cleanedResponse,
      timestamp: Date.now(),
      isCodeResponse
    };
    conversation.push(aiMessage);

    // Trim conversation to maxHistoryLength (keep system message + recent messages)
    if (conversation.length > maxHistoryLength + 1) { // +1 for system message
      const systemMsg = conversation[0];
      const recentMessages = conversation.slice(-(maxHistoryLength));
      conversation = [systemMsg, ...recentMessages];
    }

    // Save to database if user is authenticated and diagramId is provided
    if (userId && diagramId) {
      console.log("Saving conversation to database");
      
      try {
        // Create or update conversation
        if (!dbConversation) {
          console.log("New conversation:", { diagramId, userId, sessionId: currentSessionId });
          dbConversation = await prisma.diagramConversation.create({
            data: {
              diagramId: diagramId,
              userId: userId,
              sessionId: currentSessionId
            }
          });
        }

        // Save the last two messages (user and AI) to database
        const messagesToSave = conversation.slice(-2).filter(msg => msg.role !== 'system');
        
        await prisma.diagramConversationMessage.createMany({
          data: messagesToSave.map(msg => ({
            conversationId: dbConversation!.id,
            role: msg.role,
            content: msg.content,
            isCodeResponse: msg.isCodeResponse || false,
            timestamp: BigInt(msg.timestamp)
          }))
        });

        // Clean up old messages if conversation is too long
        const messageCount = await prisma.diagramConversationMessage.count({
          where: { conversationId: dbConversation.id }
        });

        if (messageCount > maxHistoryLength) {
          const oldMessages = await prisma.diagramConversationMessage.findMany({
            where: { conversationId: dbConversation.id },
            orderBy: { timestamp: 'asc' },
            take: messageCount - maxHistoryLength
          });

          await prisma.diagramConversationMessage.deleteMany({
            where: {
              id: { in: oldMessages.map(msg => msg.id) }
            }
          });
        }

      } catch (error) {
        console.error('Error saving conversation to database:', error);
        // Fall back to in-memory storage
        conversationStore.set(currentSessionId, conversation);
      }
    } else {
      // Store in memory for unauthenticated users
      conversationStore.set(currentSessionId, conversation);
    }

    // Clean up old in-memory conversations (simple cleanup - remove sessions older than 24 hours)
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    for (const [sessionId, messages] of conversationStore.entries()) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && (now - lastMessage.timestamp) > maxAge) {
        conversationStore.delete(sessionId);
      }
    }

    // Return the response with conversation context
    return NextResponse.json({ 
      suggestedCode: isCodeResponse ? cleanedResponse : undefined,
      response: cleanedResponse,
      isCodeResponse,
      conversationHistory: conversation.filter(msg => msg.role !== 'system'), // Don't send system message to frontend
      sessionId: currentSessionId
    });

  } catch (error) {
    console.error('Error in PlantUML AI Assistant:', error);
    return NextResponse.json(
      { error: 'Failed to generate PlantUML suggestion', details: error },
      { status: 500 }
    );
  }
}

// New endpoint to clear conversation
export async function DELETE(request: NextRequest) {
  try {
    const { diagramId, sessionId } = await request.json();
    
    // Get user session
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (userId && diagramId) {
      // Clear from database
      const conversation = await prisma.diagramConversation.findUnique({
        where: { diagramId: diagramId }
      });

      if (conversation) {
        await prisma.diagramConversationMessage.deleteMany({
          where: { conversationId: conversation.id }
        });
        
        await prisma.diagramConversation.delete({
          where: { id: conversation.id }
        });
      }
    }

    // Also clear from memory if sessionId provided
    if (sessionId) {
      conversationStore.delete(sessionId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing conversation:', error);
    return NextResponse.json(
      { error: 'Failed to clear conversation' },
      { status: 500 }
    );
  }
}