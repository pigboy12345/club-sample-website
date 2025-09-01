"use client"
import React, { useState } from 'react';

const About: React.FC = () => {
  const [showFullText, setShowFullText] = useState(false);

  const fullText = `Bappuji Kala Kayika Samskarika Vedhi (Bappuji Arts, Sports & Cultural Forum) is a vibrant community forum rooted in the heart of Kalkuzhy, Thrissur.
              <br /><br />
              Established in the late 1970s and proudly re-established in 2014, we continue to stand as a beacon of secular and democratic values, committed to the holistic growth of our village and its people,especially youth.
              <br /><br />
              Our initiatives span across arts, sports, culture, and social service, creating opportunities to nurture talent, inspire creativity, and strengthen community bonds. From lively festivals and competitions to meaningful service projects, we bring people together in the spirit of unity and progress.
              <br /><br />
              At Bappuji Kala Kayika Samskarika Vedhi, we believe every voice matters and every effort counts. Together, we are building a more connected, engaged, and forward-thinking Kalkuzhy.`;

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