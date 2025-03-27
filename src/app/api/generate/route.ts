import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];
  const notes = formData.get("notes");
  const totalQuizQuestions = parseInt(formData.get("quizCount")?.toString() || "5");
  const difficulty = formData.get("difficulty") || "Easy";
  const topic = formData.get("topic");

  if (files.length < 1 && !notes) {
    return new NextResponse("Please provide either a file or notes", {
      status: 400,
    });
  }

  // Convert files to base64
  const filesBase64 = await Promise.all(
    files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return buffer.toString("base64");
    })
  );

  // Prepare content for OpenAI
  const fileContents = filesBase64.map((b64, i) => 
    `File ${i + 1}: [Base64 encoded file of type ${files[i].type}]`
  ).join("\n");

  const prompt = `You are an expert tutor generating a challenging ${difficulty} quiz. Create a JSON object with a 'quiz' array containing ${totalQuizQuestions} multiple-choice quiz questions based on the following content:

Difficulty: ${difficulty}
Topic: ${topic || 'General'}
Content: ${fileContents || notes}

Generate questions that:
- Are clear and concise
- Test deep understanding of the subject
- Include realistic and challenging distractors
- Provide context when necessary

Generate the quiz strictly following this JSON format:
{
  "quiz": [
    {
      "id": 1,
      "question": "Precise, clear question text",
      "description": "Optional context or additional information to help understand the question",
      "options": {
        "a": "First plausible option",
        "b": "Second plausible option", 
        "c": "Third plausible option",
        "d": "Fourth plausible option"
      },
      "answer": "Correct option letter (a, b, c, or d)",
      "resources": ["Optional learning resources or references"],
      "explanation": "Optional explanation of the correct answer"
    }
  ]
}

Ensure:
- Questions are in the 'quiz' array
- Questions are numbered sequentially from 1 to ${totalQuizQuestions}
- All fields are populated
- The JSON is valid and parseable
- Only one correct answer per question`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo", 
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    // Directly return the JSON content
    const jsonContent = response.choices[0].message.content || '{"quiz":[]}';
    
    return new NextResponse(jsonContent, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return new NextResponse(JSON.stringify({ 
      error: "Error generating quiz questions", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }), { 
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}