import { useState, useRef, useEffect } from "react";
import {
  Send,
  X,
  MessageCircle,
  Minus,
  Paperclip,
  Mic,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import mascotImage from "@assets/generated_images/gas_utility_worker_mascot.png";

const BACKEND_URL = "http://127.0.0.1:8001/ask";

const SUGGESTED_ACTIONS = [
  "Pay Bill Online",
  "Check CNG Rates",
  "New Connection",
  "Report Gas Leakage",
];

export function MNGLChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! I'm your MNGL Virtual Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // ── sessionId persists across messages so the backend keeps conversation history
  const sessionIdRef = useRef(null);

  const scrollRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // ---------------- BACKEND API CALL ----------------
  async function sendMessageToBackend(userText) {
    const body = { question: userText };

    // Echo back sessionId after the first message so the backend
    // can look up this conversation's history
    if (sessionIdRef.current) {
      body.sessionId = sessionIdRef.current;
    }

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from backend");
    }

    const data = await response.json();

    // Store the sessionId returned by the backend for all future messages
    if (data.sessionId) {
      sessionIdRef.current = data.sessionId;
    }

    return data;
  }

  // ---------------- SEND MESSAGE HANDLER ----------------
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const data = await sendMessageToBackend(text);

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: data.answer,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          text: "Sorry, I'm unable to process your request right now. Please try again later.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[380px] max-w-[calc(100vw-2rem)] pointer-events-auto shadow-2xl rounded-xl overflow-hidden border bg-background"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-[#F7941D] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-white/30">
                  <AvatarImage src={mascotImage} />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg">MNGL Assistant</h3>
                  <p className="text-xs text-white/90">Online • AI Powered</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <Minus />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <X />
                </Button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="h-[450px] flex flex-col bg-[#f8f9fa]">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex gap-2 max-w-[80%] ${
                          msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {msg.sender === "bot" && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={mascotImage} />
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                        )}
                        {msg.sender === "user" && (
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                        )}

                        <div
                          className={`p-3 rounded-2xl text-sm shadow-sm ${
                            msg.sender === "user"
                              ? "bg-primary text-white rounded-tr-none"
                              : "bg-white text-gray-800 rounded-tl-none"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start gap-2 items-center">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={mascotImage} />
                      </Avatar>
                      <div className="bg-white px-4 py-2 rounded-2xl shadow-sm flex gap-1">
                        <span className="animate-bounce">•</span>
                        <span className="animate-bounce delay-150">•</span>
                        <span className="animate-bounce delay-300">•</span>
                      </div>
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              {/* Suggested Actions */}
              {messages.length < 2 && !isTyping && (
                <div className="px-4 pb-2">
                  <p className="text-xs mb-2 text-muted-foreground">
                    Suggested Actions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_ACTIONS.map((action) => (
                      <button
                        key={action}
                        onClick={() => handleSendMessage(action)}
                        className="text-xs border px-3 py-1.5 rounded-full hover:bg-primary/10"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 bg-white border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }}
                  className="flex gap-2"
                >
                  <Button variant="ghost" size="icon">
                    <Paperclip />
                  </Button>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your query..."
                    className="flex-1 rounded-full"
                  />
                  {inputValue ? (
                    <Button type="submit" size="icon">
                      <Send />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon">
                      <Mic />
                    </Button>
                  )}
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto h-16 w-16 rounded-full bg-primary text-white shadow-xl flex items-center justify-center relative"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>
    </div>
  );
}