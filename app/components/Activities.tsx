import React from 'react';

const Activities: React.FC = () => {
  const activities = [
    {
      title: 'SPORTS TOURNAMENTS',
      description: 'Sports tournaments and events admin',
      image: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=500',
      color: 'from-red-100 to-orange-100'
    },
    {
      title: 'ARTS & CULTURAL PROGRAMS',
      description: 'Inter style, sports, and cultural',
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=500',
      color: 'from-yellow-100 to-amber-100'
    },
    {
      title: 'YOUTH EMPOWERMENT WORKSHOPS',
      description: 'Social gatherings',
      image: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=500',
      color: 'from-green-100 to-emerald-100'
    },
    {
      title: 'SOCIAL SERVICE INITIATIVES',
      description: 'Social service initiatives',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=500',
      color: 'from-blue-100 to-cyan-100'
    }
  ];

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

              <button className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg w-full">
                Read More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Activities;