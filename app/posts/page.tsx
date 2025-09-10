import React from 'react';
import { FileText, Calendar, User, Heart, MessageCircle, Share2, Eye } from 'lucide-react';

import { posts } from '../data/posts';

const Posts = () => {
  
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
              Our Posts & Stories
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