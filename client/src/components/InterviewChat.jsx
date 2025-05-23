import { useState, useRef, useEffect } from 'react';
import { Mic, Send, Volume2, RotateCw } from 'lucide-react';

const InterviewChat = ({ topic }) => {
    const [messages, setMessages] = useState([
        { role: 'ai', content: `Hello! Let's practice ${topic} interview questions. Ready to begin?` }
    ]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const chatEndRef = useRef(null);
    const recognitionRef = useRef(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Initialize speech recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
        setIsListening(!isListening);
    };

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            setIsSpeaking(true);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;

        // Add user message
        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = {
                role: 'ai',
                content: `That's a good answer! Here's a follow-up question about ${topic}: Can you explain how you would handle a more advanced scenario?`
            };
            setMessages(prev => [...prev, aiResponse]);
            speak(aiResponse.content);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
            {/* Header */}
            <div className="border-b pb-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    {topic} Interview Practice
                </h2>
                <p className="text-gray-600">Practice with AI using voice or text</p>
            </div>

            {/* Chat Container */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                    >
                        <div
                            className={`max-w-3/4 rounded-lg p-4 ${msg.role === 'ai'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-blue-500 text-white'}`}
                        >
                            <p>{msg.content}</p>
                            {msg.role === 'ai' && (
                                <button
                                    onClick={() => speak(msg.content)}
                                    disabled={isSpeaking}
                                    className="mt-2 text-sm flex items-center gap-1 text-blue-500 hover:text-blue-700"
                                >
                                    <Volume2 size={16} />
                                    {isSpeaking ? 'Speaking...' : 'Hear again'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t pt-4">
                <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your answer or use voice..."
                            className="w-full p-3 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={toggleListening}
                            className={`absolute right-14 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${isListening
                                ? 'bg-red-500 text-white'
                                : 'text-gray-500 hover:text-blue-500'}`}
                        >
                            <Mic size={20} />
                        </button>
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </div>
                {isListening && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                        <div className="animate-pulse mr-2">Listening...</div>
                        <RotateCw size={16} className="animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewChat;