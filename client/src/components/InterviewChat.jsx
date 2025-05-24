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
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useDocumentTitle } from './hooks/useDocumentTitles';
import { generateAIContent } from '../api/aiService';

import MarkdownRenderer from './MarkDownRenderer';

const TOPIC_METADATA = {
    javascript: {
        title: "JavaScript Interview",
        description: "Practice core JS concepts, async programming, and modern ES6+ features",
        keywords: "JavaScript interview, JS questions, coding interview practice",
        icon: "💻",
        color: "text-yellow-500"
    },
    react: {
        title: "React Interview",
        description: "Master React hooks, component lifecycle, and state management",
        keywords: "React interview, React.js questions, frontend interview",
        icon: "⚛️",
        color: "text-blue-500"
    },
    'node.js': {
        title: "Node.js Interview",
        description: "Practice backend development with Node, Express, and REST APIs",
        keywords: "Node interview, backend questions, API design",
        icon: "🖥️",
        color: "text-green-500"
    },
    database: {
        title: "Database Interview",
        description: "Prepare for SQL, NoSQL, and database design questions",
        keywords: "SQL interview, database questions, system design",
        icon: "🗄️",
        color: "text-purple-500"
    },
    'system-design': {
        title: "System Design Interview",
        description: "Practice distributed systems and architecture patterns",
        keywords: "System design interview, scalability questions",
        icon: "📊",
        color: "text-red-500"
    },
    'data-structures': {
        title: "Data Structures Interview",
        description: "Master algorithms for technical interviews at top companies",
        keywords: "DSA interview, algorithm questions",
        icon: "🧮",
        color: "text-indigo-500"
    }
};

const InterviewChat = () => {
    const { topic } = useParams();
    useDocumentTitle(`${topic} Interview | AI Interview Practice`);
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [userHasInteracted, setUserHasInteracted] = useState(false);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const chatEndRef = useRef(null);
    const chatBoxRef = useRef(null);

    const recognitionRef = useRef(null);

    // Get current topic metadata
    const currentTopic = TOPIC_METADATA[topic] || {
        title: `${topic} Interview`,
        description: `Practice ${topic} interview questions`,
        keywords: `${topic} interview questions`,
        icon: "❓",
        color: "text-gray-500"
    };

    useEffect(() => {
        setMessages([{
            id: 1,
            role: 'ai',
            content: `Welcome to your ${currentTopic.title} practice! I'll be your AI interviewer. Let's begin.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    }, [topic]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                setInput(transcript);
            };

            recognitionRef.current.onend = () => setIsListening(false);
        }

        return () => {
            recognitionRef.current?.stop();
        };
    }, []);

    useEffect(() => {
        if (!userHasInteracted) return;
        if (chatBoxRef.current && chatEndRef.current) {
            chatBoxRef.current.scrollTo({
                top: chatEndRef.current.offsetTop,
                behavior: 'smooth',
            });
        }

    }, [messages, userHasInteracted]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setInput('');
        }
        setIsListening(!isListening);
    };

    const speak = (text) => {
        if ('speechSynthesis' in window && !isMuted) {
            const cleanText = text
                .replace(/```[\s\S]*?```/g, '')
                .replace(/`([^`]+)`/g, '$1')
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                .replace(/#+\s*/g, '')
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/\*(.*?)\*/g, '$1');

            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 0.9;
            utterance.pitch = 1;

            const voices = window.speechSynthesis.getVoices();
            const voice = voices.find(v => v.name.includes('Google')) || voices[0];
            if (voice) utterance.voice = voice;

            setIsSpeaking(true);
            utterance.onend = utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };


    const handleSend = async () => {
        setUserHasInteracted(true);
        if (!input.trim()) return;

        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            const res = await generateAIContent(input);

            const aiResponse = {
                id: Date.now() + 1,
                role: 'ai',
                content: res,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, aiResponse]);
            speak(aiResponse.content);
        } catch (error) {
            console.error("Error generating AI content:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'ai',
                content: "Sorry, I encountered an error processing your request.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }
    };

    return (
        <HelmetProvider>
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Helmet>
                    <title>{currentTopic.title} | AI Interview Coach</title>
                    <meta name="description" content={currentTopic.description} />
                    <meta name="keywords" content={currentTopic.keywords} />
                </Helmet>
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center">
                            <div className="flex justify-center items-center mb-4">
                                <span className={`text-3xl mr-3 ${currentTopic.color}`}>
                                    {currentTopic.icon}
                                </span>
                                <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                    {currentTopic.title} Practice
                                </h1>
                            </div>
                            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                                {currentTopic.description}
                            </p>
                        </div>
                    </div>
                </header>
                <main className="flex-1 py-8">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div ref={chatBoxRef} className="h-96 overflow-y-auto p-6 space-y-4">
                                <AnimatePresence initial={false}>
                                    {messages.map((message) => (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={`flex ${message.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div className={`max-w-3/4 rounded-2xl p-4 ${message.role === 'ai' ? 'bg-gray-50' : 'bg-blue-600 text-white'}`}>
                                                <div className="flex items-start space-x-3">
                                                    <div className={`flex-shrink-0 ${message.role === 'ai' ? 'text-gray-400' : 'text-blue-200'}`}>
                                                        {message.role === 'ai' ? <Bot size={18} /> : <User size={18} />}
                                                    </div>
                                                    <div>
                                                        <MarkdownRenderer content={message.content} />
                                                        <p className={`text-xs mt-1 ${message.role === 'ai' ? 'text-gray-500' : 'text-blue-200'}`}>
                                                            {message.timestamp}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </AnimatePresence>
                            </div>
                            <div className="bg-gray-50 px-4 py-4 border-t border-gray-200">
                                <div className="flex items-center gap-4 p-2 rounded-xl bg-white shadow-md border border-gray-200 max-w-3xl mx-auto">
                                    <button
                                        onClick={toggleListening}
                                        aria-label="Toggle voice input"
                                        className={`transition-colors duration-300 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${isListening
                                            ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                                            : 'bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200 focus:ring-gray-400'
                                            }`}
                                    >
                                        <Mic size={20} />
                                    </button>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSend();
                                                }
                                            }}
                                            placeholder={isListening ? "Listening..." : "Type your message..."}
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSend}
                                        disabled={!input.trim()}
                                        aria-label="Send message"
                                        className={`transition-colors duration-300 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${input.trim()
                                            ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 cursor-pointer'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                                <div className="mt-2 flex justify-between items-center">
                                    <p className="text-xs text-gray-500">
                                        {isListening ? (
                                            <span className="flex items-center">
                                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></span>
                                                Listening...
                                            </span>
                                        ) : (
                                            "Press Enter to send"
                                        )}
                                    </p>
                                    <button
                                        onClick={() => setIsMuted(!isMuted)}
                                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center cursor-pointer"
                                    >
                                        {isMuted ? (
                                            <>
                                                <VolumeX size={14} className="mr-1" />
                                                Unmute AI
                                            </>
                                        ) : (
                                            <>
                                                <Volume2 size={14} className="mr-1" />
                                                Mute AI
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <footer className="bg-white border-t border-gray-200 py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center justify-center w-full text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                            <ChevronLeft size={18} className="mr-2" />
                            Back to all interview topics
                        </button>
                    </div>
                </footer>
            </div>
        </HelmetProvider>
    );
};

export default InterviewChat;