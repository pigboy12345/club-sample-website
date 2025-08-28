"use client";
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-blue-50 to-cyan-100">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Voice of <span className="text-teal-600">Kalkuzhy</span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-700 mb-8 leading-relaxed">
          Celebrating Culture. Inspiring Growth.
        </p>
        <button onClick={() => window.location.href = '#about'} className="bg-slate-700 hover:bg-slate-800 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          About Us
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-teal-200 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-20 w-12 h-12 bg-cyan-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '2s' }}></div>
    </section>
  );
};

export default Hero;