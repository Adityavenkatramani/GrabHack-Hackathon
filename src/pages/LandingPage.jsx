import React, { useState } from "react";
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

export default function LandingPage() {
  const [showGrabPayPopup, setShowGrabPayPopup] = useState(false);

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
          <a href="#product" className="hover:text-green-600">Product</a>
          <a href="#usecases" className="hover:text-green-600">Use Cases</a>
          <a href="#howitworks" className="hover:text-green-600">How It Works</a>
          <a href="#contact" className="hover:text-green-600">Contact</a>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition">Request Demo</button>
      </nav>

      {/* Hero Section: Horizontal Layout */}
      <section className="px-6 bg-gradient-to-b from-white to-green-50 flex flex-col md:flex-row items-stretch justify-center gap-12 animate-hero-fade-in h-[36rem] min-h-0 overflow-hidden">
        {/* Left: Intro Text */}
        <div className="flex-1 text-center md:text-left max-w-xl animate-slide-up">
          <h1 className="text-5xl font-semibold mb-4 text-green-700">
          Empowering Travel Commerce with AI-driven Financial Concierge
          </h1>
          <p className="text-xl text-gray-600 max-w-xl mb-6">
          Seamlessly discover, plan, and pay for your travel services with the power of AI-powered fintech agents.
          </p>
          <p className="text-md italic text-gray-500 mb-10">
          From booking rides and managing payments to securing travel insurance and instant loans — let VoyAIge simplify your journey.</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition">Try Demo</button>
            <button className="border border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-green-100 transition">
              View Architecture
            </button>
          </div>
        </div>
        {/* Right: Chatbot */}
        <div className="flex-1 flex items-center justify-center w-full max-w-2xl animate-slide-up-delay h-full min-h-0">
          <Chatbot onShowGrabPay={handleShowGrabPayPopup} />
        </div>
      </section>

      {/* Use Cases */}
      <section id="usecases" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-10 text-center">Use Cases</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center animate-stagger-1">
            <img src="/Flight Booking.png" alt="Flight Booking" className="w-20 h-20 mx-auto mb-4 rounded-md object-cover" />
            <h3 className="font-semibold text-lg mb-2">Flight Booking</h3>
            <p>Effortlessly search, compare, and book flights with AI-powered recommendations for the best routes and prices.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center animate-stagger-2">
            <img src="/Insurance Buying.png" alt="Insurance Buying" className="w-20 h-20 mx-auto mb-4 rounded-md object-cover" />
            <h3 className="font-semibold text-lg mb-2">Insurance Buying</h3>
            <p>Instantly discover and purchase the most suitable insurance plans, tailored to your needs by our intelligent agent.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center animate-stagger-3">
            <img src="/Loan Eligibility.png" alt="Loan Eligibility" className="w-20 h-20 mx-auto mb-4 rounded-md object-cover" />
            <h3 className="font-semibold text-lg mb-2">Loan Eligibility</h3>
            <p>Check your eligibility and get personalized loan offers in seconds, with transparent terms and instant approval.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center animate-stagger-4">
            <img src="/PayLater.png" alt="PayLater" className="w-20 h-20 mx-auto mb-4 rounded-md object-cover" />
            <h3 className="font-semibold text-lg mb-2">PayLater</h3>
            <p>Shop now and pay later with flexible, AI-matched payment plans that fit your lifestyle and budget.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center animate-stagger-5">
            <img src="/Airport ride booking.png" alt="Airport Ride Booking" className="w-20 h-20 mx-auto mb-4 rounded-md object-cover" />
            <h3 className="font-semibold text-lg mb-2">Airport Ride Booking</h3>
            <p>Book airport rides seamlessly, with real-time fare comparisons and instant confirmations powered by AI.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="howitworks" className="py-20 bg-green-50 px-6">
        <h2 className="text-3xl font-semibold text-center mb-10">How It Works</h2>
        <div className="grid md:grid-cols-5 gap-4 text-center">
          <div className="animate-stagger-1">
            <IconSearch className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <p>Search Intent<br/><span className='text-xs text-gray-500'>Users express what they need—our AI understands and refines their intent.</span></p>
          </div>
          <div className="animate-stagger-2">
            <IconRobot className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <p>AI Agent + MCP<br/><span className='text-xs text-gray-500'>Our intelligent agent leverages the Model Context Protocol (MCP) to find the best options.</span></p>
          </div>
          <div className="animate-stagger-3">
            <IconDeviceAnalytics className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <p>Compare Products<br/><span className='text-xs text-gray-500'>Instantly compare products, services, and financing options tailored to user needs.</span></p>
          </div>
          <div className="animate-stagger-4">
            <IconCurrencyDollar className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <p>Choose Financing<br/><span className='text-xs text-gray-500'>Select from flexible payment methods, including BNPL, cash advance, and more.</span></p>
          </div>
          <div className="animate-stagger-5">
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
      `}</style>
    </div>
  );
}
