import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            ABOUT US
          </h2>
          <div className="bg-gray-50 rounded-2xl p-8 sm:p-12">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Nestled in the heart of Kalkuzhy, Thrissur, Bappuji Kala Kaylka Samskarika Vedhi is a vibrant 
              community forum dedicated to enriching lives through arts, sports, culture, and social service.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Our organization stands as a beacon of hope, fostering creativity, promoting cultural heritage, 
              and empowering individuals through various initiatives that bring positive change to our community.
            </p>
            <button className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;