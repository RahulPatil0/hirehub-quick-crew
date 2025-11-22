import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your HireHub AI assistant. I can help you with:\n\n• Finding the right workers or jobs\n• Understanding how to use the platform\n• Tips for posting better job listings\n• Answering any questions you have\n\nHow can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // In a real implementation, this would call your AI service
      // For now, we'll simulate a response
      setTimeout(() => {
        const response = getAIResponse(input);
        const assistantMessage: Message = {
          role: "assistant",
          content: response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Failed to get response. Please try again.");
      setIsLoading(false);
    }
  };

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("post") && lowerQuery.includes("job")) {
      return "To post a job:\n\n1. Go to your Owner Dashboard\n2. Click 'Post New Job'\n3. Fill in job details (title, description, location, skills required)\n4. Set your budget and timeline\n5. Review and publish!\n\nMake sure to be clear about requirements and expectations for better applications.";
    }

    if (lowerQuery.includes("find") && lowerQuery.includes("worker")) {
      return "To find the right worker:\n\n1. Post a detailed job listing\n2. Review applications as they come in\n3. Check worker profiles and ratings\n4. Interview promising candidates\n5. Make your selection\n\nTip: Clear job descriptions attract better-matched candidates!";
    }

    if (lowerQuery.includes("apply") || lowerQuery.includes("application")) {
      return "To apply for jobs:\n\n1. Complete your worker profile with all skills\n2. Browse available jobs in the 'Hire Labour' section\n3. Read job descriptions carefully\n4. Click 'Apply' on jobs matching your skills\n5. Track your applications in your dashboard\n\nKeep your profile updated to get better job matches!";
    }

    if (lowerQuery.includes("profile")) {
      return "To optimize your profile:\n\n• Add a clear profile photo\n• List all relevant skills\n• Include your experience level\n• Write a compelling bio\n• Keep contact information updated\n• Add your location and availability\n\nA complete profile gets more visibility!";
    }

    if (lowerQuery.includes("payment") || lowerQuery.includes("rate")) {
      return "About payments:\n\n• Set competitive rates based on your skills\n• Negotiate fairly with employers\n• Payment terms should be agreed upfront\n• Keep records of all transactions\n• Report any payment issues to support\n\nFair pricing leads to better long-term relationships!";
    }

    return "I understand you're asking about: " + query + "\n\nI'm here to help with:\n• Job posting and applications\n• Profile optimization\n• Platform navigation\n• Best practices\n\nCould you be more specific about what you need help with?";
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-transform"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
          >
            <Card className="shadow-2xl border-primary/20 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-primary-hover p-4 flex items-center justify-between text-primary-foreground">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Assistant</h3>
                    <p className="text-xs opacity-90">Always here to help</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="h-96 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${
                        message.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback
                          className={
                            message.role === "assistant"
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary/10 text-secondary"
                          }
                        >
                          {message.role === "assistant" ? (
                            <Bot className="h-4 w-4" />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-60 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                              className="h-2 w-2 bg-primary rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-border bg-background">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
