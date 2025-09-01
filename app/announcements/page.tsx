import React from 'react';
import { Bell, Calendar, Clock, Pin, AlertCircle } from 'lucide-react';
import { announcements } from '../data/announcements';

const Announcements = () => {

  const getTypeColor = (type: string) => {
    const colors = {
      event: 'bg-purple-100 text-purple-800',
      workshop: 'bg-blue-100 text-blue-800',
      meeting: 'bg-gray-100 text-gray-800',
      sports: 'bg-green-100 text-green-800',
      service: 'bg-orange-100 text-orange-800',
      exhibition: 'bg-pink-100 text-pink-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') return <AlertCircle className="w-4 h-4 text-red-500" />;
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const pinnedAnnouncements = announcements.filter(ann => ann.isPinned);
  const regularAnnouncements = announcements.filter(ann => !ann.isPinned);

  return (
    <main className="pt-16">
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-cyan-100 to-blue-100 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <Bell className="w-16 h-16 text-teal-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Announcements & Notifications
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest news, events, and important information from BAPPUJI community.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Pinned Announcements */}
            {pinnedAnnouncements.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Pin className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-800">Pinned Announcements</h2>
                </div>
                <div className="space-y-6">
                  {pinnedAnnouncements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="bg-white rounded-xl shadow-lg border-l-4 border-blue-500 p-6 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(announcement.type)}`}>
                            {announcement.type.toUpperCase()}
                          </span>
                          {getPriorityIcon(announcement.priority)}
                          <Pin className="w-4 h-4 text-blue-500" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {announcement.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {announcement.content}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(announcement.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {announcement.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Announcements */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Announcements</h2>
              <div className="space-y-6">
                {regularAnnouncements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(announcement.type)}`}>
                          {announcement.type.toUpperCase()}
                        </span>
                        {getPriorityIcon(announcement.priority)}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {announcement.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {announcement.content}
                    </p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(announcement.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {announcement.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Announcements;
