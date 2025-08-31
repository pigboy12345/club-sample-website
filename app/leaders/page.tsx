import React from 'react';
import { Users, Mail, Phone, Award } from 'lucide-react';


const Leaders = () => {
  const leaders = [
    {
      name: 'Rajesh Kumar',
      position: 'President',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      email: 'rajesh@bappuji.org',
      phone: '+91 9876543210',
      experience: '15 years in community service',
      achievements: ['Community Excellence Award 2023', 'Cultural Heritage Preservation']
    },
    {
      name: 'Priya Nair',
      position: 'Vice President',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      email: 'priya@bappuji.org',
      phone: '+91 9876543211',
      experience: '12 years in arts & culture',
      achievements: ['Arts Promotion Award 2022', 'Youth Mentorship Excellence']
    },
    {
      name: 'Suresh Menon',
      position: 'Secretary',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      email: 'suresh@bappuji.org',
      phone: '+91 9876543212',
      experience: '10 years in administration',
      achievements: ['Administrative Excellence 2023', 'Event Management Expert']
    },
    {
      name: 'Lakshmi Pillai',
      position: 'Treasurer',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      email: 'lakshmi@bappuji.org',
      phone: '+91 9876543213',
      experience: '8 years in financial management',
      achievements: ['Financial Transparency Award', 'Budget Management Excellence']
    },
    {
      name: 'Arun Krishnan',
      position: 'Sports Coordinator',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      email: 'arun@bappuji.org',
      phone: '+91 9876543214',
      experience: '14 years in sports development',
      achievements: ['Sports Development Award 2023', 'Youth Athletics Champion']
    },
    {
      name: 'Meera Thomas',
      position: 'Cultural Director',
      image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      email: 'meera@bappuji.org',
      phone: '+91 9876543215',
      experience: '11 years in cultural programs',
      achievements: ['Cultural Heritage Award 2022', 'Traditional Arts Preservation']
    }
  ];

  return (
    <main className="pt-16">
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-cyan-100 to-blue-100 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <Users className="w-16 h-16 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Our Leadership Team
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the dedicated individuals who guide BAPPUJI towards excellence in community service,
              cultural preservation, and youth empowerment.
            </p>
          </div>
        </section>

        {/* Leaders Grid */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leaders.map((leader, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {leader.name}
                    </h3>
                    <p className="text-blue-600 font-semibold mb-4">
                      {leader.position}
                    </p>
                    <p className="text-gray-600 mb-4 text-sm">
                      {leader.experience}
                    </p>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-blue-500" />
                        <a href={`mailto:${leader.email}`} className="hover:text-blue-600 transition-colors">
                          {leader.email}
                        </a>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-blue-500" />
                        <a href={`tel:${leader.phone}`} className="hover:text-blue-600 transition-colors">
                          {leader.phone}
                        </a>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="border-t pt-4">
                      <div className="flex items-center mb-2">
                        <Award className="w-4 h-4 mr-2 text-yellow-500" />
                        <span className="text-sm font-semibold text-gray-700">Achievements</span>
                      </div>
                      <ul className="space-y-1">
                        {leader.achievements.map((achievement, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Leaders;