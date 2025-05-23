import React from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import HomeSection from "./components/HomeSection";
import InterviewChat from "./components/InterviewChat";

function App() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Routes>
        <Route path="/" element={<HomeSection />} />
        <Route path="/interview/:topic" element={<InterviewChat />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;