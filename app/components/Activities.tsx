"use client"
import React, { useState } from 'react';

const Activities: React.FC = () => {
  const activities = [
    {
      title: 'SPORTS & RECREATION',
      description: 'Organizing and managing a variety of sports tournaments, events, and recreational activities for all age groups.',
      fullDescription: `We provide football coaching for children from the age of 5, nurturing young talents and preparing them for higher levels of competition. Along with regular football practice sessions, the club also organizes exciting football tournaments that bring together players and fans from within and outside our village.
<br/><br/>
In addition to football, we conduct badminton tournaments, carrom competitions, and chess matches, encouraging people of all ages to participate and showcase their skills.
<br/><br/>
Through these activities, we aim to create an active, engaging, and sports-loving community where passion, teamwork, and sportsmanship thrive.`,
      image: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=500',
      color: 'from-red-100 to-orange-100'
    },
    {
      title: 'ARTS & CULTURAL PROGRAMS',
      description: 'Inter style, sports, and cultural',
      fullDescription: `We take pride in celebrating arts and culture as the soul of our community. We conduct vibrant arts programs that give every member a platform to express their creativity and talent.
<br/> <br/>
We actively participate in arts, writing, and cultural competitions, showcasing our talents at various levels and bringing recognition to our village.
<br/> <br/>
We also offer dance classes for children and youth, helping them explore their artistic potential while connecting with our cultural heritage and modern styles.
<br/> <br/>
Through these activities, we strive to nurture creativity, confidence, and cultural pride in every generation of Kalkuzhy.`, image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=500',
      color: 'from-yellow-100 to-amber-100'
    },
    {
      title: 'YOUTH EMPOWERMENT WORKSHOPS',
      description: 'Social gatherings',
      fullDescription: `We believe that empowering youth is the key to building a progressive and dynamic community.To achieve this, we regularly organize counseling and motivational classes that guide our youngsters toward personal growth and confidence.
<br/><br/>
Our seminars and training programs cover a wide range of topics such as self- employment opportunities, cyber security awareness, and leadership skills, helping youth gain practical knowledge and skills for their future.
<br/><br/>
We also conduct football camps, karate training, and dance practice sessions, promoting physical fitness, discipline, and teamwork alongside creative expression.
<br/><br/>
Through these initiatives, we aim to create a generation that is skilled, confident, and ready to lead our community toward a brighter future.`,
      image: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=500',
      color: 'from-green-100 to-emerald-100'
    },
    {
      title: 'SOCIAL SERVICE INITIATIVES',
      description: 'Social service initiatives',
      fullDescription: `We are deeply committed to serving our community through a variety of social initiatives. We provide health fund support for the families of our members, ensuring timely help during medical needs and emergencies.
<br/><br/>
Through our Action Council, we conduct awareness classes and activities against drug abuse, guiding the youth toward a safer and healthier lifestyle.
<br/><br/>
Our members actively participate in volunteering efforts during wildfires and the rainy season, offering support and relief to those in need.
<br/><br/>
We also organize clean-up drives like the “Clean Muniyattu Kunnu” program, promoting environmental care and community responsibility.
<br/><br/>
These collective efforts reflect our belief in unity, compassion, and social responsibility, creating a stronger and more connected Kalkuzhy.`,
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=500',
      color: 'from-blue-100 to-cyan-100'
    }
  ];

  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  return (
    <section id="activities" className="py-20 bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
          ACTIVITIES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {activities.map((activity, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${activity.color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group`}
            >
              <div className="aspect-w-16 aspect-h-10 mb-6">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-40 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
                {activity.title}
              </h3>

              <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                {activity.description}
              </p>

              <button
                onClick={() => setSelectedActivity(activity)}
                className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg w-full"
              >
                Read More
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedActivity && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedActivity(null)} // Close on background click
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg relative overflow-y-auto max-h-[80vh] scrollbar-hide"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* Fixed Close Button */}
            <button
              onClick={() => setSelectedActivity(null)}
              className="fixed top-4 right-4 text-teal-600 hover:text-gray-700 text-2xl font-bold z-50"
            >
              &times;
            </button>

            <h3 className="text-xl font-bold text-teal-600 mb-4">{selectedActivity.title}</h3>
            <div
              className="text-gray-700 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: selectedActivity.fullDescription }}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Activities;
