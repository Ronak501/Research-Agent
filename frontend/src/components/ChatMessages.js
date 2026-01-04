import { User, Bot, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";

export const ChatMessages = ({ messages, isLoading }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-8" data-testid="chat-empty-state">
        <div className="text-center max-w-md">
          <div className="mb-6 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1692889783742-7d99b124c402?crop=entropy&cs=srgb&fm=jpg&q=85"
              alt="Empty state"
              className="w-full h-48 object-cover rounded-sm"
            />
          </div>
          <h2 className="text-2xl font-fraunces font-semibold text-ink mb-3">
            Start Your Research
          </h2>
          <p className="text-muted-foreground">
            Ask me anything. I'm here to help you explore, analyze, and understand complex topics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full" ref={scrollRef} data-testid="chat-messages">
      <div className="p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 animate-slide-up ${
              message.role === "user" ? "" : "bg-muted/30 -mx-6 px-6 py-4"
            }`}
            data-testid={`message-${message.role}`}
          >
            <div className="flex-shrink-0">
              {message.role === "user" ? (
                <div className="w-8 h-8 rounded-full bg-klein flex items-center justify-center">
                  <User className="h-4 w-4 text-white" strokeWidth={1.5} />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" strokeWidth={1.5} />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">
                {message.role === "user" ? "You" : "Research Agent"}
              </p>
              <div className="prose prose-sm max-w-none">
                <p className="text-ink leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 animate-slide-up bg-muted/30 -mx-6 px-6 py-4" data-testid="loading-indicator">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">
                Research Agent
              </p>
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-klein" strokeWidth={1.5} />
                <span className="text-sm text-muted-foreground">Researching...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;