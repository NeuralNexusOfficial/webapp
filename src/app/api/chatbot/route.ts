import { NextResponse } from 'next/server';
import OpenAI from 'openai';

import { hackathonFAQ } from '@/data/hackathon-faq';

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const message = body.message;

    const completion =
      await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',

        messages: [
          {
            role: 'system',
            content: `
You are the official AI assistant for AOT Hackathon: Architects of Tomorrow — a global innovation-driven hackathon by Fraylon.

Answer questions ONLY based on the provided hackathon knowledge base below. Be friendly, concise, and helpful.
Use bullet points and short paragraphs for readability. Format prize amounts with $ symbol.

If someone asks about something not covered in the knowledge base, politely say:
"I don't have that specific information yet. Please reach out to our team for more details!"

Hackathon Knowledge Base:
${hackathonFAQ}
            `,
          },

          {
            role: 'user',
            content: message,
          },
        ],

        temperature: 0.3,
      });

    return NextResponse.json({
      success: true,
      reply:
        completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: 'Something went wrong',
      },
      { status: 500 }
    );
  }
}