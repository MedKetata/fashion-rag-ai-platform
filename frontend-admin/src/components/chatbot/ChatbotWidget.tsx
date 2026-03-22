import { useState, useEffect, useRef } from "react";
import { LuMessageCircle, LuSend } from "react-icons/lu";
import { sendMessage, getChatHistory } from "../../services/chatService";

type Product = {
  product_id: number;
  productDisplayName?: string;
  image_url: string;
};

type Message = {
  sender: "user" | "bot";
  text: string;
  products?: Product[];
};

type HistoryMessage = {
  role: "user" | "assistant";
  content:
      | string
      | {
    answer?: string;
    products?: Product[];
  };
};

const ChatbotWidget = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [showBubble, setShowBubble] = useState<boolean>(false);
  const [typedText, setTypedText] = useState<string>("");

  const proactiveMessage =
      "Hi! I can help you find the perfect fashion item 👗";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [botThinking, setBotThinking] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const show = () => {
      setShowBubble(true);

      setTimeout(() => {
        setShowBubble(false);
      }, 8000);
    };

    show();

    const interval = setInterval(show, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!showBubble) return;

    let index = 0;

    const interval = setInterval(() => {
      setTypedText(proactiveMessage.slice(0, index));

      index++;

      if (index > proactiveMessage.length) {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [showBubble]);

  useEffect(() => {
    if (!showBubble) {
      setTypedText("");
    }
  }, [showBubble]);

  useEffect(() => {
    if (!open || messages.length > 0) return;

    const loadHistory = async () => {
      try {
        const history = (await getChatHistory()) as HistoryMessage[];

        const formatted: Message[] = history.map((msg) => {
          if (msg.role === "assistant" && typeof msg.content !== "string") {
            return {
              sender: "bot",
              text: msg.content?.answer || "",
              products: msg.content?.products || []
            };
          }

          return {
            sender: "user",
            text: typeof msg.content === "string" ? msg.content : "",
            products: []
          };
        });

        setMessages(formatted);
      } catch {
        console.error("Failed to load chat history");
      }
    };

    loadHistory();
  }, [open, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      sender: "user",
      text: input
    };

    setMessages((prev) => [...prev, userMessage]);

    const messageText = input;

    setInput("");
    setBotThinking(true);

    try {
      const data = await sendMessage(messageText);

      const botMessage: Message = {
        sender: "bot",
        text: data.answer,
        products: data.products || []
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const botMessage: Message = {
        sender: "bot",
        text: "Sorry, something went wrong."
      };

      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setBotThinking(false);
    }
  };

  return (
      <>
        {showBubble && !open && (
            <div className="fixed bottom-24 right-5 bg-white text-black p-4 rounded-xl shadow-xl w-64">
              <p className="text-sm font-medium">{typedText}</p>

              <p className="text-xs text-gray-500 mt-1">
                Chat with our AI assistant
              </p>
            </div>
        )}

        <button
            onClick={() => {
              setOpen(!open);
              setShowBubble(false);
            }}
            className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl shadow-xl hover:bg-purple-700 transition"
        >
          <LuMessageCircle />
        </button>

        {open && (
            <div className="fixed bottom-24 right-5 w-[430px] h-[450px] bg-slate-900 rounded-2xl shadow-2xl flex flex-col p-4 text-white">
              <h3 className="mb-3 font-semibold">Fashion AI Assistant</h3>

              <div className="flex-1 overflow-y-auto bg-slate-800 rounded-lg p-3 mb-3 space-y-2">
                {messages.map((msg, i) => (
                    <div key={`msg-${i}`} className="space-y-2">
                      <div
                          className={`p-2 rounded-lg max-w-[80%] ${
                              msg.sender === "user"
                                  ? "bg-purple-600 ml-auto"
                                  : "bg-slate-700"
                          }`}
                      >
                        {msg.text}
                      </div>

                      {msg.products && msg.products.length > 0 && (
                          <div className="grid grid-cols-2 gap-2">
                            {msg.products.map((product) => (
                                <div
                                    key={product.product_id}
                                    className="bg-slate-700 rounded-lg p-2"
                                >
                                  <img
                                      src={product.image_url}
                                      alt={product.productDisplayName || "product"}
                                      className="rounded-md w-full"
                                      loading="lazy"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display =
                                            "none";
                                      }}
                                  />

                                  <p className="text-xs mt-1">
                                    {product.productDisplayName}
                                  </p>
                                </div>
                            ))}
                          </div>
                      )}
                    </div>
                ))}

                {botThinking && (
                    <div className="bg-slate-700 p-2 rounded-lg w-fit text-sm flex gap-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce delay-150">.</span>
                      <span className="animate-bounce delay-300">.</span>
                    </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="flex items-center gap-3">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                    className="flex-1 h-12 px-4 rounded-xl bg-slate-800 text-white outline-none cursor-text focus:ring-2 focus:ring-purple-500"
                    placeholder="Ask Me ..."
                />

                <button
                    onClick={handleSendMessage}
                    disabled={!input.trim()}
                    className="bg-purple-600 h-10 w-10 rounded-full hover:bg-purple-700 transition disabled:opacity-40 flex items-center justify-center"
                >
                  <LuSend size={18} />
                </button>
              </div>
            </div>
        )}
      </>
  );
};

export default ChatbotWidget;