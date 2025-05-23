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
import { Helmet } from 'react-helmet';

// Topic metadata with SEO-friendly descriptions
const TOPIC_METADATA = {
    javascript: {
        title: "JavaScript Interview Practice | AI Mock Interviews",
        description: "Practice core JavaScript concepts including closures, async programming, and ES6+ features with our AI interviewer",
        keywords: "JavaScript interview, JS questions, coding interview practice"
    },
    react: {
        title: "React.js Interview Practice | AI-Powered Mock Interviews",
        description: "Master React hooks, component lifecycle, state management and performance optimization techniques",
        keywords: "React interview, React.js questions, frontend interview"
    },
    'node.js': {
        title: "Node.js Interview Preparation | AI Coding Interview Simulator",
        description: "Practice backend development with Node.js, Express, REST APIs and authentication flows",
        keywords: "Node interview, backend questions, API design"
    },
    database: {
        title: "Database Interview Practice | SQL & NoSQL Questions",
        description: "Prepare for database interview questions on SQL queries, database design and ORM concepts",
        keywords: "SQL interview, database questions, system design"
    },
    'system-design': {
        title: "System Design Interview Practice | Scalability Questions",
        description: "Practice distributed systems, scaling patterns and architecture design for technical interviews",
        keywords: "System design interview, scalability questions, architecture"
    },
    'data-structures': {
        title: "Data Structures & Algorithms Interview Practice",
        description: "Master algorithms and data structures for technical interviews at top tech companies",
        keywords: "DSA interview, algorithm questions, coding challenges"
    }
};

const InterviewChat = () => {
    const { topic } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'ai',
            content: `Welcome to your ${topic} interview practice! I'll be your AI interviewer today. Let's begin with a fundamental question.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const chatEndRef = useRef(null);
    const recognitionRef = useRef(null);

    // Get current topic metadata or fallback
    const currentTopic = TOPIC_METADATA[topic.toLowerCase()] || {
        title: `${topic} Interview Practice`,
        description: `Practice ${topic} interview questions with our AI interviewer`,
        keywords: `${topic} interview, technical questions, coding practice`
    };

    // Sample questions with topic-specific follow-ups
    const topicQuestions = {
        javascript: [
            "Explain the event loop in JavaScript and how it handles asynchronous operations.",
            "How would you implement memoization from scratch?",
            "Compare prototypal inheritance with classical inheritance patterns."
        ],
        react: [
            "Explain the React Fiber architecture and its benefits.",
            "How would you optimize performance in a large React application?",
            "When would you choose Context API vs Redux for state management?"
        ],
        'node.js': [
            "Explain the Node.js event-driven architecture.",
            "How would you handle memory leaks in a Node application?",
            "Describe your approach to authentication in a REST API."
        ],
        database: [
            "Explain the differences between SQL and NoSQL databases.",
            "How would you design a schema for a social media platform?",
            "Describe approaches for database sharding and partitioning."
        ],
        'system-design': [
            "Design a URL shortening service like bit.ly",
            "How would you scale a chat application to 1M concurrent users?",
            "Explain CAP theorem and its implications."
        ],
        'data-structures': [
            "Implement and analyze a LRU cache",
            "Compare BFS and DFS traversal algorithms",
            "Explain time complexity of common sorting algorithms"
        ]
    };

    // Initialize speech recognition
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

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
            setIsSpeaking(true);
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.92;
            utterance.pitch = 1.1;
            utterance.volume = 0.9;

            // Try to use a natural-sounding voice
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('en'));
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }

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
                "Interesting perspective. Can you elaborate on that?",
                "How would you handle edge cases in this scenario?",
                "What metrics would you use to measure the success of this approach?"
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
        }, 800);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* SEO Optimization */}
            <Helmet>
                <title>{currentTopic.title}</title>
                <meta name="description" content={currentTopic.description} />
                <meta name="keywords" content={currentTopic.keywords} />
                <meta property="og:title" content={currentTopic.title} />
                <meta property="og:description" content={currentTopic.description} />
                <meta property="og:type" content="website" />
            </Helmet>

            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        {/* Back button */}
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ChevronLeft size={20} />
                            <span className="font-medium">All Topics</span>
                        </button>

                        {/* Dynamic topic title and description */}
                        <div className="text-center mx-4 flex-1">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                                {currentTopic.title.split('|')[0].trim()}
                            </h1>
                            <p className="text-gray-500 text-sm mt-1 hidden sm:block">
                                {currentTopic.description}
                            </p>
                        </div>

                        {/* Voice control */}
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