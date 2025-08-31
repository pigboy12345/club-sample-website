import React from 'react';
import { FileText, Calendar, User, Heart, MessageCircle, Share2, Eye } from 'lucide-react';

const Posts = () => {
  const posts = [
    {
      id: 1,
      title: 'Celebrating Our Cultural Heritage: A Journey Through Traditional Arts',
      excerpt: 'Discover how BAPPUJI is preserving and promoting the rich cultural heritage of Kalkuzhy through various traditional art forms and cultural programs.',
      content: 'Our recent cultural festival showcased the incredible diversity and richness of our local traditions...',
      author: 'Meera Thomas',
      date: '2025-01-10',
      image: 'https://images.pexels.com/photos/1043458/pexels-photo-1043458.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      category: 'Culture',
      likes: 45,
      comments: 12,
      views: 234
    },
    {
      id: 2,
      title: 'Youth Empowerment: Building Tomorrow\'s Leaders Today',
      excerpt: 'Learn about our comprehensive youth development programs that are shaping the next generation of community leaders and change-makers.',
      content: 'Through our youth empowerment workshops, we have successfully mentored over 200 young individuals...',
      author: 'Arun Krishnan',
      date: '2025-01-08',
      image: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      category: 'Youth',
      likes: 67,
      comments: 18,
      views: 456
    },
    {
      id: 3,
      title: 'Community Service: Making a Difference One Step at a Time',
      excerpt: 'Read about our latest community service initiatives and how we\'re working together to create positive change in our neighborhood.',
      content: 'Last month, our volunteers came together for a massive community cleanup drive that transformed...',
      author: 'Priya Nair',
      date: '2025-01-05',
      image: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      category: 'Service',
      likes: 89,
      comments: 25,
      views: 678
    },
    {
      id: 4,
      title: 'Sports Excellence: Fostering Athletic Spirit in Our Community',
      excerpt: 'Explore how our sports programs are promoting fitness, teamwork, and healthy competition among community members of all ages.',
      content: 'Our annual sports tournament brought together over 300 participants from different age groups...',
      author: 'Rajesh Kumar',
      date: '2025-01-03',
      image: 'https://images.pexels.com/photos/163444/sport-tug-of-war-team-effort-163444.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      category: 'Sports',
      likes: 52,
      comments: 15,
      views: 389
    },
    {
      id: 5,
      title: 'Environmental Conservation: Our Green Initiatives',
      excerpt: 'Discover our ongoing efforts to protect and preserve the environment through tree plantation drives, waste management programs, and awareness campaigns.',
      content: 'Environmental conservation has always been close to our hearts. This year, we planted over 500 trees...',
      author: 'Suresh Menon',
      date: '2025-01-01',
      image: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      category: 'Environment',
      likes: 73,
      comments: 20,
      views: 512
    },
    {
      id: 6,
      title: 'Women Empowerment: Supporting Our Community\'s Strength',
      excerpt: 'Learn about our women empowerment programs that provide skill development, entrepreneurship support, and leadership opportunities.',
      content: 'Our women empowerment initiative has successfully helped 150+ women develop new skills and start their own businesses...',
      author: 'Lakshmi Pillai',
      date: '2024-12-28',
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      category: 'Empowerment',
      likes: 94,
      comments: 31,
      views: 723
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      Culture: 'bg-purple-100 text-purple-800',
      Youth: 'bg-blue-100 text-blue-800',
      Service: 'bg-green-100 text-green-800',
      Sports: 'bg-orange-100 text-orange-800',
      Environment: 'bg-emerald-100 text-emerald-800',
      Empowerment: 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <main className="pt-16">
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-cyan-100 to-blue-100 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <FileText className="w-16 h-16 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Community Posts & Stories
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore inspiring stories, updates, and insights from our vibrant community initiatives and programs.
            </p>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(post.date)}
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-800 mb-3 leading-tight hover:text-blue-600 transition-colors cursor-pointer">
                      {post.title}
                    </h2>

                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600 font-medium">{post.author}</span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Eye className="w-4 h-4" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </div>
                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-12">
              <button className="bg-slate-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
                Load More Posts
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Posts;