import { FileText, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ResearchCanvas = ({ messages }) => {
  const aiMessages = messages.filter((m) => m.role === "assistant");

  if (aiMessages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-paper/50" data-testid="research-canvas-empty">
        <div className="text-center max-w-xl">
          <Sparkles className="mx-auto h-16 w-16 mb-6 text-klein opacity-30" strokeWidth={1.5} />
          <h2 className="text-3xl font-fraunces font-semibold text-ink mb-4">
            The Research Canvas
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Your research insights will appear here. This dedicated space is designed to help you
            focus on the information that matters, separated from the conversational flow.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full bg-paper/50" data-testid="research-canvas">
      <div className="p-8 space-y-6">
        <div className="mb-8">
          <h2 className="text-3xl font-fraunces font-semibold text-ink mb-2 flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-klein" strokeWidth={1.5} />
            Research Insights
          </h2>
          <p className="text-muted-foreground">
            {aiMessages.length} {aiMessages.length === 1 ? "response" : "responses"} collected
          </p>
        </div>

        <div className="space-y-6">
          {aiMessages.map((message, index) => (
            <div
              key={message.id}
              className="bg-white border border-border hover:border-klein/50 transition-colors p-6 rounded-sm group relative overflow-hidden animate-slide-up"
              data-testid={`research-insight-${index}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-klein/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-klein" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-mono text-muted-foreground mb-1">
                    {new Date(message.timestamp).toLocaleString()}
                  </p>
                  <h3 className="text-lg font-fraunces font-semibold text-ink">
                    Insight #{aiMessages.length - index}
                  </h3>
                </div>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-ink leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default ResearchCanvas;