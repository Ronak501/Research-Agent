import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const ChatInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6" data-testid="chat-input-form">
      <div className="relative">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your research question..."
          className="min-h-[100px] pr-14 bg-white border-2 border-border focus-visible:border-klein rounded-xl resize-none text-base placeholder:text-muted-foreground/70 shadow-sm"
          disabled={isLoading}
          data-testid="chat-input"
        />
        <Button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="absolute bottom-3 right-3 bg-klein text-white hover:bg-klein/90 rounded-full h-10 w-10 p-0 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="send-message-btn"
        >
          <Send className="h-4 w-4" strokeWidth={1.5} />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;