import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconCarGarage,
  IconShoppingCart,
  IconRobot,
  IconSearch,
  IconDeviceAnalytics,
  IconCurrencyDollar,
  IconCircleCheck
} from "@tabler/icons-react";
import Chatbot from "../components/Chatbot";
import GrabPayPopup from "../components/GrabPayPopup";

const SIMULATED_MESSAGES = [
  { from: "bot", text: "Hi!" },
  { from: "user", text: "Hello! What can you do?" },
  { from: "bot", text: "How can I help you today?" },
  { from: "user", text: "Can you help me book a ride to the airport?" },
  { from: "bot", text: "Absolutely! I can help you book rides, get travel insurance, or check loan eligibility." },
  { from: "user", text: "That's awesome! How do I get started?" },
  { from: "bot", text: "Just type your request or click 'Login to Continue' to use all features." },
];

export default function LandingPage({ animateOnLoad }) {
  const [showGrabPayPopup, setShowGrabPayPopup] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const useCasesRef = useRef(null);
  const howItWorksRef = useRef(null);
  const [useCasesVisible, setUseCasesVisible] = useState(false);
  const [howItWorksVisible, setHowItWorksVisible] = useState(false);
  const [simMessages, setSimMessages] = useState([SIMULATED_MESSAGES[0]]);
  const [simStep, setSimStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (animateOnLoad) setStartAnimation(true);
  }, [animateOnLoad]);

  // Simulate chat messages
  useEffect(() => {
    if (simStep < SIMULATED_MESSAGES.length) {
      const timer = setTimeout(() => {
        setSimMessages((msgs) => [...msgs, SIMULATED_MESSAGES[simStep]]);
        setSimStep((s) => s + 1);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [simStep]);

  // Intersection Observer for fade-in sections
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === "usecases") setUseCasesVisible(true);
            if (entry.target.id === "howitworks") setHowItWorksVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );
    if (useCasesRef.current) observer.observe(useCasesRef.current);
    if (howItWorksRef.current) observer.observe(howItWorksRef.current);
    return () => observer.disconnect();
  }, []);

  const handleShowGrabPayPopup = () => setShowGrabPayPopup(true);

  return (
    <div className="bg-white text-gray-900 font-sans flex flex-col min-h-screen min-h-0 overflow-hidden">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 shadow-md sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <img src="/GrabVoyaige_logo1.png" alt="voyAIge logo" className="h-8" />
          <span className="text-2xl font-semibold text-green-600">voyAIge</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-semibold">
          <a href="#product" className="group relative hover:text-green-600 transition">Product<span className="nav-underline" /></a>
          <a href="#usecases" className="group relative hover:text-green-600 transition">Use Cases<span className="nav-underline" /></a>
          <a href="#howitworks" className="group relative hover:text-green-600 transition">How It Works<span className="nav-underline" /></a>
          <a href="#contact" className="group relative hover:text-green-600 transition">Contact<span className="nav-underline" /></a>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition transform hover:scale-105">Request Demo</button>
      </nav>

      {/* Hero Section: Centered Layout */}
      <section className={`px-6 animated-gradient flex flex-col md:flex-row items-center justify-center gap-12 min-h-[calc(100vh-88px)] min-h-0 overflow-hidden ${startAnimation ? 'animate-hero-fade-in' : ''}`}>
        {/* Left: Intro Text */}
        <div className={`max-w-xl w-full text-center mx-auto ${startAnimation ? 'animate-slide-up' : ''}`}>
          <h1 className="text-5xl font-semibold mb-4 text-green-700">
          Empowering Travel Commerce with AI-driven Financial Concierge
          </h1>
          <p className="text-xl text-gray-600 max-w-xl mb-6">
          Seamlessly discover, plan, and pay for your travel services with the power of AI-powered fintech agents.
          </p>
          <p className="text-md italic text-gray-500 mb-10">
          From booking rides and managing payments to securing travel insurance and instant loans — let VoyAIge simplify your journey.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition transform hover:scale-105"
              onClick={() => navigate('/login')}
            >
              Login to Continue
            </button>
            <button className="border border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-green-100 transition transform hover:scale-105">
              View Architecture
            </button>
          </div>
        </div>
        {/* Right: Chatbot */}
        <div className={`flex items-center justify-center w-full max-w-2xl mx-auto h-full min-h-0 ${startAnimation ? 'animate-slide-up-delay' : ''}`}>
          <Chatbot messages={simMessages} disableInput />
        </div>
      </section>

      {/* Use Cases */}
      <section id="usecases" ref={useCasesRef} className={`py-20 px-6 max-w-6xl mx-auto transition-opacity duration-700 ${useCasesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 className="text-3xl font-semibold mb-10 text-center">Use Cases</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          <div className={`bg-white rounded-lg shadow p-6 text-center ${startAnimation ? 'animate-stagger-1' : ''}`}>
            <img src="/Flight Booking.png" alt="Flight Booking" className="w-20 h-20 mx-auto mb-4 rounded-md object-cover" />
            <h3 className="font-semibold text-lg mb-2">Flight Booking</h3>
            <p>Effortlessly search, compare, and book flights with AI-powered recommendations for the best routes and prices.</p>
          </div>
          <div className={`bg-white rounded-lg shadow p-6 text-center ${startAnimation ? 'animate-stagger-2' : ''}`}>
            <img src="/Insurance Buying.png" alt="Insurance Buying" className="w-20 h-20 mx-auto mb-4 rounded-md object-cover" />
            <h3 className="font-semibold text-lg mb-2">Insurance Buying</h3>
            <p>Instantly discover and purchase the most suitable insurance plans, tailored to your needs by our intelligent agent.</p>
          </div>
          <div className={`bg-white rounded-lg shadow p-6 text-center ${startAnimation ? 'animate-stagger-3' : ''}`}>
            <img src="/Loan Eligibility.png" alt="Loan Eligibility" className="w-20 h-20 mx-auto mb-4 rounded-md object-cover" />
            <h3 className="font-semibold text-lg mb-2">Loan Eligibility</h3>
            <p>Check your eligibility and get personalized loan offers in seconds, with transparent terms and instant approval.</p>
          </div>
          <div className={`bg-white rounded-lg shadow p-6 text-center ${startAnimation ? 'animate-stagger-4' : ''}`}>
            <img src="/PayLater.png" alt="PayLater" className="w-20 h-20 mx-auto mb-4 rounded-md object-cover" />
            <h3 className="font-semibold text-lg mb-2">PayLater</h3>
            <p>Shop now and pay later with flexible, AI-matched payment plans that fit your lifestyle and budget.</p>
          </div>
          <div className={`bg-white rounded-lg shadow p-6 text-center ${startAnimation ? 'animate-stagger-5' : ''}`}>
            <img src="/Airport ride booking.png" alt="Airport Ride Booking" className="w-20 h-20 mx-auto mb-4 rounded-md object-cover" />
            <h3 className="font-semibold text-lg mb-2">Airport Ride Booking</h3>
            <p>Book airport rides seamlessly, with real-time fare comparisons and instant confirmations powered by AI.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="howitworks" ref={howItWorksRef} className={`py-20 bg-green-50 px-6 transition-opacity duration-700 ${howItWorksVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 className="text-3xl font-semibold text-center mb-10">How It Works</h2>
        <div className="grid md:grid-cols-5 gap-4 text-center">
          <div className={startAnimation ? 'animate-stagger-1' : ''}>
            <IconSearch className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <p>Search Intent<br/><span className='text-xs text-gray-500'>Users express what they need—our AI understands and refines their intent.</span></p>
          </div>
          <div className={startAnimation ? 'animate-stagger-2' : ''}>
            <IconRobot className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <p>AI Agent + MCP<br/><span className='text-xs text-gray-500'>Our intelligent agent leverages the Model Context Protocol (MCP) to find the best options.</span></p>
          </div>
          <div className={startAnimation ? 'animate-stagger-3' : ''}>
            <IconDeviceAnalytics className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <p>Compare Products<br/><span className='text-xs text-gray-500'>Instantly compare products, services, and financing options tailored to user needs.</span></p>
          </div>
          <div className={startAnimation ? 'animate-stagger-4' : ''}>
            <IconCurrencyDollar className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <p>Choose Financing<br/><span className='text-xs text-gray-500'>Select from flexible payment methods, including BNPL, cash advance, and more.</span></p>
          </div>
          <div className={startAnimation ? 'animate-stagger-5' : ''}>
            <IconCircleCheck className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <p>Checkout<br/><span className='text-xs text-gray-500'>Complete purchases securely and effortlessly, all within a unified experience.</span></p>
          </div>
        </div>
        <img
          src="/GrabMaps.png"
          alt="How it works"
          className="mx-auto mt-12 max-w-5xl rounded-xl shadow-xl"
        />
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-10">Contact Us</h2>
        <p className="text-center text-gray-600 mb-8">
          Got a question, feedback, or partnership idea? Drop us a message — we'd love to hear from you!
        </p>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-semibold text-lg mb-2">📧 Email</h3>
            <p className="text-gray-600">support@voyAIge.io</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">📞 Phone</h3>
            <p className="text-gray-600">+91 98765 43210</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">📍 Address</h3>
            <p className="text-gray-600">27th Floor, Grab Tower, Singapore 068914</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t mt-20 py-10 text-center text-sm text-gray-500">
        © 2025 voyAIge. All rights reserved.
      </footer>

      <GrabPayPopup open={showGrabPayPopup} onClose={() => setShowGrabPayPopup(false)} />

      <style>{`
        .animate-hero-fade-in {
          animation: heroFadeIn 1.2s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 1s 0.2s cubic-bezier(0.4,0,0.2,1) both;
        }
        .animate-slide-up-delay {
          animation: slideUp 1s 0.5s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-stagger-1 { animation: fadeInStagger 0.8s 0.2s both; }
        .animate-stagger-2 { animation: fadeInStagger 0.8s 0.4s both; }
        .animate-stagger-3 { animation: fadeInStagger 0.8s 0.6s both; }
        .animate-stagger-4 { animation: fadeInStagger 0.8s 0.8s both; }
        .animate-stagger-5 { animation: fadeInStagger 0.8s 1s both; }
        @keyframes fadeInStagger {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animated-gradient {
          background: linear-gradient(120deg, #f0fdf4, #d1fae5, #f0fdf4, #bbf7d0);
          background-size: 200% 200%;
          animation: gradientMove 8s ease-in-out infinite alternate;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .nav-underline {
          display: block;
          position: absolute;
          left: 0; right: 0; bottom: -2px;
          height: 2px;
          background: linear-gradient(90deg, #22c55e, #16a34a);
          border-radius: 2px;
          width: 0%;
          transition: width 0.3s cubic-bezier(.4,0,.2,1);
        }
        .group:hover .nav-underline {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
