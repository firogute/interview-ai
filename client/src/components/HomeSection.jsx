import React from "react";
import {
    Code,
    Database,
    Lightbulb,
    FileJson,
    FileType,
    Layers,
    Server,
    Cpu,
    BarChart,
    Home,
} from "lucide-react";
import { Link } from "react-router-dom"

function HomeSection() {
    const topics = [
        {
            title: "JavaScript",
            icon: <FileJson className="h-6 w-6 text-yellow-500" />,
            description:
                "Practice core JavaScript concepts, closures, async programming, and ES6+ features.",
        },
        {
            title: "React",
            icon: <Layers className="h-6 w-6 text-blue-500" />,
            description:
                "Master React hooks, component lifecycle, state management, and performance optimization techniques.",
        },
        {
            title: "Node.js",
            icon: <Server className="h-6 w-6 text-green-500" />,
            description:
                "Learn backend development with Node.js, Express, REST APIs, and authentication flows.",
        },
        {
            title: "Database",
            icon: <Database className="h-6 w-6 text-purple-500" />,
            description:
                "Practice SQL queries, database design, and ORM concepts for modern web applications.",
        },
        {
            title: "System Design",
            icon: <Cpu className="h-6 w-6 text-red-500" />,
            description:
                "Prepare for system design interviews with distributed systems, scaling, and architecture patterns.",
        },
        {
            title: "Data Structures",
            icon: <BarChart className="h-6 w-6 text-indigo-500" />,
            description:
                "Master algorithms and data structures for technical interviews at top tech companies.",
        },
    ];

    return (
        <>
            <header className="text-center mb-12 flex flex-col items-center gap-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                    AI Interview Practice
                </h1>
                <p className="text-gray-600 text-xl max-w-2xl leading-relaxed">
                    Practice your interview skills with an AI interviewer using voice
                </p>
            </header>
            <main>
                <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
                    Select an Interview Topic
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topics.map((topic, index) => (
                        <div
                            key={index}
                            className="flex flex-col p-6 bg-white shadow-lg rounded-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex justify-between items-start gap-3 mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 flex-grow">
                                    {topic.title}
                                </h2>
                                <div className="flex-shrink-0">{topic.icon}</div>
                            </div>
                            <p className="text-gray-500 mb-6">{topic.description}</p>
                            <Link to={`/interview/${topic.title.toLowerCase()}`} className="mt-auto"><button className="bg-black text-white w-full py-2.5 rounded-lg hover:bg-gray-800 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 cursor-pointer">
                                Start Practice
                            </button></Link>
                        </div>
                    ))}
                </div>
            </main >
        </>
    );
}

export default HomeSection;
