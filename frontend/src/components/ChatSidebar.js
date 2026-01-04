import { PlusCircle, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ChatSidebar = ({
  conversations,
  currentConversation,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}) => {
  return (
    <div className="w-72 bg-white border-r border-border flex flex-col" data-testid="chat-sidebar">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-fraunces font-semibold text-ink mb-4">
          Research Agent
        </h1>
        <Button
          onClick={onNewConversation}
          className="w-full bg-klein text-white hover:bg-klein/90 rounded-full h-11 font-medium transition-transform active:scale-95"
          data-testid="new-conversation-btn"
        >
          <PlusCircle className="mr-2 h-4 w-4" strokeWidth={1.5} />
          New Research
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="mx-auto h-12 w-12 mb-2 opacity-30" strokeWidth={1.5} />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group relative p-3 rounded-sm border cursor-pointer transition-all ${
                  currentConversation?.id === conv.id
                    ? "bg-klein/10 border-klein"
                    : "bg-white border-border hover:border-klein/50"
                }`}
                onClick={() => onSelectConversation(conv)}
                data-testid={`conversation-${conv.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">
                      {conv.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      {new Date(conv.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    data-testid={`delete-conversation-${conv.id}`}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;