import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, Loader2, Sparkles } from 'lucide-react';
import { streamChatResponse, transcribeAudio } from '../services/geminiService';
import { ChatMessage } from '../types';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Bonjour! Je suis l\'assistant virtuel d\'Aura Microlocs. Comment puis-je vous aider aujourd\'hui?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // Stream response
      const stream = streamChatResponse(history, userMessage.text);
      
      const modelMessageId = (Date.now() + 1).toString();
      let fullResponse = "";
      
      // Add initial empty model message
      setMessages(prev => [...prev, { id: modelMessageId, role: 'model', text: '', isThinking: true }]);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === modelMessageId 
            ? { ...msg, text: fullResponse, isThinking: false } 
            : msg
        ));
      }
      
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Une erreur est survenue." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsRecording(false);
        setIsLoading(true); // Transcription loading
        try {
            const transcription = await transcribeAudio(audioBlob);
            setInputText(prev => prev + " " + transcription);
        } catch (err) {
            console.error("Transcription failed", err);
        } finally {
            setIsLoading(false);
        }
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Impossible d'accéder au microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          type="button"
          title="Open chat assistant"
          aria-label="Open Aura Assistant"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-aura-accent text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 z-50 flex items-center justify-center"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-aura-gold/20 overflow-hidden font-sans">
          {/* Header */}
          <div className="bg-aura-dark p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
                <Sparkles size={18} className="text-aura-gold" />
                <h3 className="font-serif font-bold tracking-wide">Assistant Aura</h3>
            </div>
            <button
              type="button"
              title="Close chat"
              aria-label="Close chat assistant"
              onClick={() => setIsOpen(false)}
              className="hover:text-aura-accent transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-aura-light/30 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-aura-accent text-white rounded-tr-none'
                      : 'bg-white text-gray-800 shadow-md border border-gray-100 rounded-tl-none'
                  }`}
                >
                  {msg.isThinking && (
                    <div className="flex items-center space-x-2 text-aura-gold text-xs italic mb-1">
                         <Sparkles size={12} className="animate-spin" /> 
                         <span>Je réfléchis...</span>
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center space-x-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-aura-gold focus-within:ring-1 focus-within:ring-aura-gold transition-all">
                
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-aura-dark'}`}
              >
                {isLoading && !isRecording ? <Loader2 className="animate-spin" size={20}/> : <Mic size={20} />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Posez votre question..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-700"
                disabled={isLoading}
              />
              
              <button
                type="button"
                title="Send message"
                aria-label="Send message"
                onClick={handleSendMessage}
                disabled={isLoading || !inputText.trim()}
                className={`text-aura-accent hover:text-aura-gold transition-colors ${
                  (!inputText.trim() || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;