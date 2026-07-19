import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { MIcon } from "./MIcon";
import { FadeUp } from "./FadeUp";

const SEED_MESSAGES: { role: "assistant" | "user"; text: string }[] = [
  {
    role: "assistant",
    text: "Welcome!   Ready to take your business to the next level?",
  },
  {
    role: "user",
    text: "Yes, I want a Ai agent that helps me grow.",
  },
  {
    role: "assistant",
    text: "Great choice. At Forge Systems, we build Ai agents that do more than look beautiful, they become powerful business tools that generate leads, build credibility, and support long-term growth.",
  },
];

const CANNED_REPLIES = [
  "That's a great question! Let me walk you through the key principles of cinematic web design using AI tools.",
  "Absolutely! I'll show you step-by-step how to create that effect. First, let's set up the project structure.",
  "Perfect — let's start with choosing the right video format and compression settings for web performance.",
];

interface ChatPanelProps {
  initialScroll?: "top" | "bottom";
  animateMessagesIn?: boolean;
}

export function ChatPanel({
  initialScroll = "top",
  animateMessagesIn = false,
}: ChatPanelProps) {
  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const canReplyRef = useRef(0);

  /* Set initial scroll position */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (initialScroll === "bottom") {
      el.scrollTop = el.scrollHeight;
    } else {
      el.scrollTop = 0;
    }
  }, [initialScroll]);

  /* Auto-scroll on new messages */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");

    /* Push a canned assistant reply after a short delay */
    const replyIndex = canReplyRef.current % CANNED_REPLIES.length;
    canReplyRef.current += 1;
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: CANNED_REPLIES[replyIndex] },
      ]);
    }, 800);
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-white/10" style={{ background: "rgba(8,8,10,0.6)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
        <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0">
          <MIcon name="auto_awesome" size={14} fill={1} className="text-white/60" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-white truncate">AI Workforce</div>
          <div className="text-[11px] text-white/40 truncate">Your business, powered by AI</div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide space-y-4 px-4 py-5 min-h-0">
        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          const bubble = (
            <div
              key={i}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isUser
                  ? "bg-white/15 text-white/90"
                  : "bg-white/5 text-white/70 border border-white/5"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          );

          if (animateMessagesIn && i < SEED_MESSAGES.length) {
            return (
              <FadeUp key={i} delay={i * 0.12} y={16}>
                {bubble}
              </FadeUp>
            );
          }

          return bubble;
        })}
      </div>

      {/* Input */}
      <div className="px-3 pb-3">
        <div className="liquid-glass rounded-2xl flex items-end gap-2 px-3 py-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            placeholder="Ask about the course..."
            className="flex-1 min-w-0 bg-transparent outline-none text-sm text-white/80 placeholder:text-white/30 resize-none leading-relaxed py-1"
          />
          <button
            onClick={send}
            className="shrink-0 bg-white text-black rounded-xl p-2 hover:bg-white/90 transition-colors cursor-pointer"
          >
            <MIcon name="arrow_upward" size={16} weight={600} />
          </button>
        </div>
      </div>
    </div>
  );
}
