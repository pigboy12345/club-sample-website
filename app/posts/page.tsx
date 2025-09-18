import React from 'react';
import { FileText } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { posts as staticPosts } from '../data/posts';
import type { Post, Category } from '../../types';
import PostsGrid from '../components/PostsGrid';

async function getPosts(): Promise<Post[]> {
  if (!supabase) return staticPosts.map(p => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    author: p.author,
    date: p.date,
    image: p.image,
    category_id: 0,
    category: { id: 0, name: p.category }
  }));

  const { data, error } = await supabase
    .from('posts')
  .select('id,title,excerpt,content,author,date,image,category_id, categories ( id, name )')
    .order('date', { ascending: false })
    .limit(20);
  if (error) {
    // eslint-disable-next-line no-console
    console.error('Supabase posts error', error.message);
    return [];
  }
  return (data || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    date: row.date,
    image: row.image,
    category_id: row.category_id,
    category: row.categories as Category
  }));
}

const Posts = async () => {
  const posts = await getPosts();
  
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
            <PostsGrid posts={posts} />

            {/* Load More Button */}
            <div className="text-center mt-12">
              <button className="bg-slate-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105" disabled>
                Load More (coming soon)
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Posts;