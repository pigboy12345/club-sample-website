import React from 'react';
import { notFound } from 'next/navigation';
import { FileText, Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import PostImageCarousel from '../../components/PostImageCarousel';
import { posts as staticPosts } from '../../data/posts';
import type { Post, Category } from '../../../types';

// Ensure this page is rendered dynamically for fresh data
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getPost(id: string): Promise<Post | null> {
  // Parse ID - handle both numeric and string IDs
  const postId = parseInt(id, 10);
  
if (!supabase) {
    // Fallback to static data when Supabase is not available
    const post = staticPosts.find(p => p.id === postId);
    if (post) {
      return {
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        date: post.date,
        image: post.image,
        images: (post as any).images || [],
        video: (post as any).video ?? null,
        category_id: 0,
        category: { id: 0, name: (post as any).category }
      };
    }
    return null;
  }

  const { data, error } = await supabase
    .from('posts')
    .select('id,title,excerpt,content,author,date,image,images,video,category_id, categories ( id, name )')
    .eq('id', postId)
    .single();

  if (error || !data) {
    console.error('Error fetching post:', error?.message);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    author: data.author,
    date: data.date,
    image: data.image,
    images: data.images || [],
    category_id: data.category_id,
    category: data.categories as Category
  };
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Culture: 'bg-purple-100 text-purple-800',
    Youth: 'bg-blue-100 text-blue-800',
    Service: 'bg-green-100 text-green-800',
    Sports: 'bg-orange-100 text-orange-800',
    Environment: 'bg-emerald-100 text-emerald-800',
    Empowerment: 'bg-pink-100 text-pink-800'
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  const allImages = post.images && post.images.length > 0 ? [post.image!, ...post.images] : [post.image!];

  return (
    <main className="pt-16">
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
        {/* Back Navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Link
            href="/posts"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Posts
          </Link>
        </div>

        {/* Post Detail Section */}
        <section className="py-8 lg:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Responsive Layout: Stack on mobile, side-by-side on tablet/desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Media Section - Video preferred, else images */}
                <div className="relative aspect-video md:aspect-auto bg-gray-100">
                  {post.video ? (
                    <video
                      src={post.video}
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : allImages.length > 1 ? (
                    <PostImageCarousel images={allImages} title={post.title} />
                  ) : (
                    <img
                      src={allImages[0]}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Content Section - Right on desktop/tablet, Bottom on mobile */}
                <div className="p-6 md:p-8 lg:p-10 flex flex-col">
                  {/* Category & Date */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getCategoryColor(post.category?.name || 'General')}`}>
                      {post.category?.name || 'General'}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(post.date)}
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {post.title}
                  </h1>

                  {/* Author */}
                  <div className="flex items-center mb-6 text-gray-700">
                    <User className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-base">By {post.author}</span>
                  </div>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <div className="mb-6">
                      <p className="text-lg text-gray-700 font-medium leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="border-t border-gray-200 mb-6" />

                  {/* Content */}
                  <div className="prose max-w-none text-gray-800 leading-relaxed">
                    <p className="whitespace-pre-line text-base md:text-lg">
                      {post.content}
                    </p>
                  </div>

                </div>
              </div>
            </article>

            {/* Back to Posts Button */}
            <div className="text-center mt-8">
              <Link
                href="/posts"
                className="inline-flex items-center bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                View All Posts
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
