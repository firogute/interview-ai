import React from "react";
import { Globe, Mail, BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex flex-col gap-4 max-w-md">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-800">
                AI Interview Practice
              </h3>
            </div>
            <p className="text-gray-500 text-sm">
              Helping candidates worldwide prepare for technical interviews
              through AI-powered voice practice sessions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3">
              <h4 className="font-medium text-gray-700">Resources</h4>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-800 hover:underline"
              >
                Interview Guides
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-800 hover:underline"
              >
                Practice Questions
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-800 hover:underline"
              >
                Career Tips
              </a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-medium text-gray-700">Support</h4>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-800 hover:underline"
              >
                Help Center
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-800 hover:underline"
              >
                Feedback
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-800 hover:underline"
              >
                Contact Us
              </a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-medium text-gray-700">Legal</h4>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-800 hover:underline"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-800 hover:underline"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-800 hover:underline"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>Educational resource for global job seekers</span>
          </div>
          <div>
            © {new Date().getFullYear()} AI Interview Practice. Worldwide
            rights.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
