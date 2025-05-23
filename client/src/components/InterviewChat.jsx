import { useState, useRef, useEffect } from 'react';
import {
    Mic,
    Send,
    Volume2,
    RotateCw,
    ChevronLeft,
    Sparkles,
    Bot,
    User,
    VolumeX
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const InterviewChat = () => {
    const { topic } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'ai',
            content: `Welcome to your ${topic} interview practice! I'm your AI interviewer. Let's start with a fundamental question.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const chatEndRef = useRef(null);
    const recognitionRef = useRef(null);

    // Sample questions based on topic
    const topicQuestions = {
        javascript: [
            "Explain the event loop in JavaScript and how it handles asynchronous operations.",
            "How would you implement a debounce function from scratch?",
            "What are the key differences between ES6 classes and prototype-based inheritance?"
        ],
        react: [
            "Walk me through the React component lifecycle in modern functional components.",
            "How would you optimize performance in a large React application?",
            "Explain the difference between React context and Redux - when would you use each?"
        ]
    };

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

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setInput(''); // Clear input when starting to listen
        }
        setIsListening(!isListening);
    };

    const speak = (text) => {
        if ('speechSynthesis' in window && !isMuted) {
            setIsSpeaking(true);
            window.speechSynthesis.cancel(); // Cancel any ongoing speech

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.92;
            utterance.pitch = 1.1;
            utterance.volume = 0.9;

            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        // Generate AI response after short delay
        setTimeout(() => {
            const questions = topicQuestions[topic.toLowerCase()] || [
                "That's interesting. Can you elaborate on your approach?",
                "How would you handle edge cases in this scenario?",
                "What alternative solutions did you consider?"
            ];

            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            const aiResponse = {
                id: Date.now() + 1,
                role: 'ai',
                content: randomQuestion,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, aiResponse]);
            speak(aiResponse.content);
        }, 1000);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={20} />
                        <span className="font-medium">Back to Topics</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                            <Sparkles size={16} className="text-blue-500" />
                            <span className="text-sm font-medium text-blue-700">{topic} Interview</span>
                        </div>

                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className={`p-2 rounded-full ${isMuted ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'}`}
                            aria-label={isMuted ? "Unmute AI voice" : "Mute AI voice"}
                        >
                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Chat Container */}
            <main className="flex-1 overflow-y-auto py-6 px-4 max-w-4xl mx-auto w-full">
                <AnimatePresence initial={false}>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${message.role === 'ai' ? 'justify-start' : 'justify-end'} mb-6`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl p-5 relative ${message.role === 'ai'
                                    ? 'bg-white shadow-sm border border-gray-100'
                                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`flex-shrink-0 mt-0.5 ${message.role === 'ai' ? 'text-blue-500' : 'text-blue-200'}`}>
                                        {message.role === 'ai' ? <Bot size={18} /> : <User size={18} />}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`${message.role === 'ai' ? 'text-gray-800' : 'text-white'} whitespace-pre-wrap`}>
                                            {message.content}
                                        </p>
                                        <div className={`text-xs mt-2 ${message.role === 'ai' ? 'text-gray-500' : 'text-blue-200'}`}>
                                            {message.timestamp}
                                        </div>
                                    </div>
                                </div>

                                {message.role === 'ai' && (
                                    <button
                                        onClick={() => speak(message.content)}
                                        disabled={isSpeaking || isMuted}
                                        className={`absolute -bottom-4 right-4 p-2 rounded-full shadow-md ${isSpeaking
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'} transition-colors`}
                                        aria-label="Hear again"
                                    >
                                        {isSpeaking ? (
                                            <RotateCw size={16} className="animate-spin" />
                                        ) : (
                                            <Volume2 size={16} />
                                        )}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    <div ref={chatEndRef} />
                </AnimatePresence>
            </main>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 py-4 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="relative flex items-center">
                        <div className="flex-1 relative">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={isListening ? "Listening..." : "Type your answer or use voice..."}
                                className="w-full p-4 pr-16 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={1}
                                style={{ minHeight: '56px', maxHeight: '120px' }}
                            />

                            <button
                                onClick={toggleListening}
                                className={`absolute right-14 bottom-3 p-2 rounded-full transition-colors ${isListening
                                    ? 'bg-red-500 text-white animate-pulse'
                                    : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'}`}
                                aria-label={isListening ? "Stop listening" : "Start voice input"}
                            >
                                <Mic size={20} />
                            </button>
                        </div>

                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className={`ml-3 p-3 rounded-xl ${input.trim()
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'} transition-colors`}
                            aria-label="Send message"
                        >
                            <Send size={20} />
                        </button>
                    </div>

                    <div className="mt-3 text-xs text-gray-500 text-center">
                        {isListening ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span>Listening... Speak now</span>
                            </div>
                        ) : (
                            <span>Press <kbd className="px-2 py-1 bg-gray-100 rounded-md">Enter</kbd> to send</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewChat;