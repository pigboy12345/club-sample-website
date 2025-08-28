"use client"
import React, { useState } from 'react';

const About: React.FC = () => {
  const [showFullText, setShowFullText] = useState(false);

  const fullText = `Nestled in the heart of Kalkuzhy, Thrissur, Bappuji Kala Kayika Samskarika Vedhi (Bappuji Arts, Sports, and Cultural Forum) is a vibrant community hub dedicated to enriching lives and fostering unity.
              <br /><br />
              With roots tracing back to the late 1970s and a proud re-establishment in 2014, we stand as a beacon of secular and democratic values, driving the holistic growth of our village, especially its youth.
              <br /><br />
              Through a colorful blend of artistic initiatives, sporting events, cultural celebrations, and dedicated social service, we aim to nurture talent, spark creativity, and strengthen the bonds that make our community thrive.
              <br /><br />
              Together, we are shaping a more connected, engaged, and forward-thinking Kalkuzhy , where every voice matters and every effort counts.`;

  const words = fullText.split(/\s+/);
  const shortText = words.slice(0, 60).join(' ');
  const remainingText = words.slice(60).join(' ');

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
            ABOUT US
          </h2>
          <div className="p-4 sm:p-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              <span dangerouslySetInnerHTML={{ __html: shortText }} />
              {!showFullText && words.length > 60 && (
                <span>...</span>
              )}
              {showFullText && (
                <span dangerouslySetInnerHTML={{ __html: remainingText }} />
              )}
            </p>
            {!showFullText && words.length > 60 && (
              <button onClick={() => setShowFullText(true)} className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Read More
              </button>
            )}
            {showFullText && (
              <button onClick={() => setShowFullText(false)} className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Read Less
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;