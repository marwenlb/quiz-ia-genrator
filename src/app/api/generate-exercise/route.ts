import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  try {
    // Collect form data
    const formData = await req.formData();
    
    // Extract relevant fields
    const topic = formData.get("topic") as string || "Programming";
    const description = formData.get("description") as string || "";
    const difficulty = formData.get("difficulty") as string || "moderate";
    const timer = formData.get("timer") as string || "10";

    // Validate inputs
    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" }, 
        { status: 400 }
      );
    }

    // Generate prompt for exercise creation
    const prompt = `You are an expert programming tutor creating a coding exercise.

Context:
- Topic: ${topic}
- Difficulty: ${difficulty}
- Time Limit: ${timer} minutes
- Additional Description: ${description}

Generate a comprehensive programming exercise following this strict JSON structure:
{
  "exercise": {
    "id": "unique_id_here",
    "title": "Descriptive Exercise Title",
    "description": "Detailed problem statement explaining the coding challenge",
    "initialCode": "// Initial code template with function signature",
    "solution": "// Complete solution to the problem",
    "tests": "// Unit tests to validate the solution",
    "difficulty": "${difficulty}",
    "estimatedTime": "${timer}"
  }
}

Requirements:
1. Ensure the exercise is appropriate for the specified difficulty level
2. Provide a clear, concise problem statement
3. Include a practical initial code template
4. Create a complete, correct solution
5. Generate meaningful unit tests
6. Use modern JavaScript/TypeScript practices
7. Make the exercise realistic and educational`;

    // Call OpenAI to generate the exercise
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ 
        role: "system", 
        content: "You are a professional coding instructor creating programming exercises." 
      }, { 
        role: "user", 
        content: prompt 
      }],
      response_format: { type: "json_object" },
      max_tokens: 4000,
      temperature: 0.7,
    });

    // Extract and parse the JSON response
    const content = response.choices[0].message.content;
    
    if (!content) {
      return NextResponse.json(
        { error: "No exercise generated" }, 
        { status: 500 }
      );
    }

    // Parse the JSON and validate
    let parsedExercise;
    try {
      parsedExercise = JSON.parse(content);
      
      // Additional validation
      if (!parsedExercise.exercise || !parsedExercise.exercise.title) {
        throw new Error("Invalid exercise format");
      }
    } catch (parseError) {
      console.error("Parsing error:", parseError);
      return NextResponse.json(
        { error: "Failed to parse exercise", details: content }, 
        { status: 500 }
      );
    }

    // Return the generated exercise
    return NextResponse.json(parsedExercise, {
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("Exercise generation error:", error);
    
    // Detailed error response
    return NextResponse.json(
      { 
        error: "Error generating exercise", 
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  }
}

// Ensure the route supports both POST and OPTIONS methods
export async function OPTIONS() {
  return NextResponse.json({ status: "ok" }, { 
    headers: {
      "Allow": "POST, OPTIONS",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    } 
  });
}