'use client';

import { useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hi! Ask me anything about the hackathon.',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(updatedMessages);

    const currentInput = input;

    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
        }),
      });

      const data = await res.json();

      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content:
            data.reply ||
            'Sorry, something went wrong.',
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content:
            'Error connecting to chatbot.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Button */}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white text-black font-bold shadow-2xl hover:scale-105 transition-all"
      >
        AI
      </button>

      {/* Chat Window */}

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] h-[520px] bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">

          {/* Header */}

          <div className="px-5 py-4 border-b border-white/10 bg-black">
            <h2 className="text-white font-bold text-lg">
              Hackathon Assistant
            </h2>

            <p className="text-white/40 text-xs mt-1">
              Ask questions about the event
            </p>
          </div>

          {/* Messages */}

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'ml-auto bg-white text-black'
                    : 'bg-white/5 text-white border border-white/10'
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div className="bg-white/5 text-white border border-white/10 px-4 py-3 rounded-2xl text-sm w-fit">
                Thinking...
              </div>
            )}
          </div>

          {/* Input */}

          <div className="p-4 border-t border-white/10 flex gap-2">
            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
              placeholder="Ask something..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="px-5 rounded-xl bg-white text-black font-medium hover:opacity-90 transition-all"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}