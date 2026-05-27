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
        model: 'openai/gpt-oss-120b',

        messages: [
          {
            role: 'system',
            content: `
You are an AI assistant for the Neural Nexus Hackathon.

Answer ONLY based on the provided hackathon information.

If the answer is not available, politely say:
"I could not find that information."

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