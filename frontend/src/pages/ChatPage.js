import { useState, useEffect } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";
import ResearchCanvas from "@/components/ResearchCanvas";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation.id);
    }
  }, [currentConversation]);

  const loadConversations = async () => {
    try {
      const response = await axios.get(`${API}/chat/conversations`);
      setConversations(response.data);
    } catch (error) {
      console.error("Error loading conversations:", error);
      toast.error("Failed to load conversations");
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await axios.get(`${API}/chat/conversations/${conversationId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Failed to load messages");
    }
  };

  const createNewConversation = async () => {
    try {
      const response = await axios.post(`${API}/chat/conversations`, {
        title: "New Research",
      });
      const newConv = response.data;
      setConversations([newConv, ...conversations]);
      setCurrentConversation(newConv);
      setMessages([]);
      toast.success("New conversation started");
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Failed to create conversation");
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      await axios.delete(`${API}/chat/conversations/${conversationId}`);
      setConversations(conversations.filter((c) => c.id !== conversationId));
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
      toast.success("Conversation deleted");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Failed to delete conversation");
    }
  };

  const sendMessage = async (content) => {
    if (!currentConversation) {
      await createNewConversation();
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/chat/message`, {
        conversation_id: currentConversation.id,
        content: content,
      });

      setMessages([...messages, response.data.user_message, response.data.ai_message]);
      
      if (messages.length === 0) {
        const firstWords = content.split(" ").slice(0, 6).join(" ");
        const updatedConversations = conversations.map((c) =>
          c.id === currentConversation.id ? { ...c, title: firstWords } : c
        );
        setConversations(updatedConversations);
        setCurrentConversation({ ...currentConversation, title: firstWords });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" data-testid="chat-page">
      <ChatSidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onSelectConversation={setCurrentConversation}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
      />
      
      <div className="flex-1 flex">
        <div className="w-2/5 flex flex-col border-r border-border">
          <div className="flex-1 overflow-y-auto">
            <ChatMessages messages={messages} isLoading={isLoading} />
          </div>
          <div className="border-t border-border">
            <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
          </div>
        </div>
        
        <div className="flex-1">
          <ResearchCanvas messages={messages} />
        </div>
      </div>
    </div>
  );
}