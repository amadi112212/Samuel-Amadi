import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Hi! I am FalconBot. How can I help you with data plans today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !process.env.API_KEY) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
            { role: 'user', parts: [{ text: userMsg }] }
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT,
        },
      });

      const text = response.text || "I'm sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting to the network right now." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!process.env.API_KEY) return null; // Don't render if no key

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-falcon-600 hover:bg-falcon-700 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-80 sm:w-96 flex flex-col h-[500px] border border-falcon-200">
          <div className="bg-falcon-800 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold flex items-center"><MessageSquare size={18} className="mr-2"/> Falcon Support AI</h3>
            <button onClick={() => setIsOpen(false)} className="hover:text-falcon-200">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-falcon-600 text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 rounded-bl-none shadow-sm flex items-center">
                  <Loader2 className="animate-spin h-4 w-4 text-falcon-600 mr-2" />
                  <span className="text-xs text-gray-500">FalconBot is typing...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t bg-white rounded-b-lg">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about plans..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-falcon-500"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-falcon-600 text-white p-2 rounded-full hover:bg-falcon-700 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;