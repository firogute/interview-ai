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
} from "lucide-react";

function App() {
  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="text-center mb-12 flex flex-col items-center gap-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
            AI Interview Practice
          </h1>
          <p className="text-gray-600 text-xl max-w-2xl leading-relaxed">
            Practice your interview skills with an AI interviewer using voice
          </p>
        </header>
        <main className="">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
            Select an Interview Topic
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card flex flex-col items-center gap-4 p-6 bg-white shadow-lg rounded-lg mb-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-center gap-2 w-full">
                <h2 className="text-xl font-semibold text-gray-800">
                  Javascript
                </h2>
                <FileJson className="h-6 w-6 text-yellow-500" />
              </div>
              <p className="text-gray-500 leading-snug">
                Practice core JavaScript concepts, closures, async programming,
                and ES6+ features.
              </p>
              <button className="bg-black text-white w-full py-2.5 rounded-lg hover:bg-gray-800 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2">
                Start Practice
              </button>
            </div>
            <div className="card flex flex-col items-center gap-4 p-6 bg-white shadow-lg rounded-lg mb-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-center gap-2 w-full">
                <h2 className="text-xl font-semibold text-gray-800">
                  Javascript
                </h2>
                <FileJson className="h-6 w-6 text-yellow-500" />
              </div>
              <p className="text-gray-500 leading-snug">
                Practice core JavaScript concepts, closures, async programming,
                and ES6+ features. Lorem ipsum, dolor sit amet consectetur
                adipisicing elit. Fugit repellendus minus consequuntur
                voluptates error modi tempora, nobis mollitia eius voluptatem?
              </p>
              <button className="bg-black text-white w-full py-2.5 rounded-lg hover:bg-gray-800 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2">
                Start Practice
              </button>
            </div>
            <div className="card flex flex-col items-center gap-4 p-6 bg-white shadow-lg rounded-lg mb-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-center gap-2 w-full">
                <h2 className="text-xl font-semibold text-gray-800">
                  Javascript
                </h2>
                <FileJson className="h-6 w-6 text-yellow-500" />
              </div>
              <p className="text-gray-500 leading-snug">
                Practice core JavaScript concepts, closures, async programming,
                and ES6+ features.
              </p>
              <button className="bg-black text-white w-full py-2.5 rounded-lg hover:bg-gray-800 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2">
                Start Practice
              </button>
            </div>
            <div className="card flex flex-col items-center gap-4 p-6 bg-white shadow-lg rounded-lg mb-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-center gap-2 w-full">
                <h2 className="text-xl font-semibold text-gray-800">
                  Javascript
                </h2>
                <FileJson className="h-6 w-6 text-yellow-500" />
              </div>
              <p className="text-gray-500 leading-snug">
                Practice core JavaScript concepts, closures, async programming,
                and ES6+ features.
              </p>
              <button className="bg-black text-white w-full py-2.5 rounded-lg hover:bg-gray-800 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2">
                Start Practice
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
