import React from "react";

import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import HomeSection from "./components/HomeSection";
import InterviewChat from "./components/InterviewChat";

function App() {

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <header className="text-center mb-12 flex flex-col items-center gap-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
          AI Interview Practice
        </h1>
        <p className="text-gray-600 text-xl max-w-2xl leading-relaxed">
          Practice your interview skills with an AI interviewer using voice
        </p>
      </header>
      <Routes>
        <Route path="/" element={<HomeSection />} />
        <Route path="/javascript" element={<InterviewChat />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
