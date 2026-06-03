'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Minus, Square, Maximize2 } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatSize = 'default' | 'medium' | 'fullscreen';

const SIZE_CONFIG: Record<ChatSize, string> = {
  default: 'fixed bottom-20 sm:bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[360px] h-[calc(100dvh-7rem)] sm:h-[520px] rounded-2xl',
  medium: 'fixed bottom-20 sm:bottom-16 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[480px] h-[calc(100dvh-7rem)] sm:h-[680px] rounded-2xl',
  fullscreen: 'fixed inset-4 w-auto h-auto rounded-2xl',
};

/* ── tiny markdown renderer ── */
function renderMarkdown(text: string) {
  // Process the text into HTML
  let html = text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
    // Headings (### ## #)
    .replace(/^### (.+)$/gm, '<h4 class="font-bold text-white mt-2 mb-1">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="font-bold text-white text-base mt-2 mb-1">$1</h3>')
    .replace(/^# (.+)$/gm, '<h2 class="font-bold text-white text-lg mt-2 mb-1">$1</h2>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="border-white/10 my-2" />')
    // Unordered list items
    .replace(/^[\-\*] (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    // Numbered list items
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Line breaks (double newline = paragraph break)
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');

  return html;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [chatSize, setChatSize] = useState<ChatSize>('default');
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm the **AOT Hackathon** assistant. Ask me about domains, prizes, registration, timelines, or anything else!",
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      // Don't close if clicking the toggle button
      if (target.closest('[data-chatbot-toggle]')) return;
      if (chatRef.current && !chatRef.current.contains(target)) {
        setOpen(false);
      }
    }

    // Small delay to avoid the click that opened the chat from immediately closing it
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

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

  function cycleSize() {
    const order: ChatSize[] = ['default', 'medium', 'fullscreen'];
    const idx = order.indexOf(chatSize);
    setChatSize(order[(idx + 1) % order.length]);
  }

  const sizeIcon = chatSize === 'default'
    ? <Square size={14} />
    : chatSize === 'medium'
      ? <Maximize2 size={14} />
      : <Minus size={14} />;

  return (
    <>
      {/* Floating Button — animated pulse + chat icon */}
      <button
        data-chatbot-toggle
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-white text-black shadow-2xl hover:scale-105 transition-all flex items-center justify-center group"
      >
        {open ? (
          <X size={22} className="transition-transform duration-200" />
        ) : (
          <>
            <MessageCircle size={22} className="transition-transform duration-200 group-hover:scale-110" />
            {/* Pulse rings */}
            <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
            <span className="absolute inset-[-3px] rounded-full border-2 border-white/30 animate-[pulse_2s_ease-in-out_infinite]" />
          </>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          ref={chatRef}
          className={`z-50 bg-zinc-950 border border-white/10 overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${SIZE_CONFIG[chatSize]}`}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/10 bg-black flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-lg">
                AOT Assistant
              </h2>
              <p className="text-white/40 text-xs mt-1">
                Architects of Tomorrow · Ask anything
              </p>
            </div>

            {/* Size controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={cycleSize}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                title={chatSize === 'default' ? 'Expand' : chatSize === 'medium' ? 'Fullscreen' : 'Minimize'}
              >
                {sizeIcon}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={14} />
              </button>
            </div>
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
                {msg.role === 'assistant' ? (
                  <div
                    className="chatbot-markdown prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                  />
                ) : (
                  msg.content
                )}
              </div>
            ))}

            {loading && (
              <div className="bg-white/5 text-white border border-white/10 px-4 py-3 rounded-2xl text-sm w-fit flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
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
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-white/20 transition-colors"
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="px-5 rounded-xl bg-white text-black font-medium hover:opacity-90 transition-all disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Chatbot markdown styles */}
      <style>{`
        .chatbot-markdown strong { font-weight: 700; color: white; }
        .chatbot-markdown em { font-style: italic; }
        .chatbot-markdown h2, .chatbot-markdown h3, .chatbot-markdown h4 { color: white; }
        .chatbot-markdown li { margin-bottom: 2px; }
        .chatbot-markdown hr { border-color: rgba(255,255,255,0.1); }
      `}</style>
    </>
  );
}