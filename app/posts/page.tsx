import React from 'react';
import { FileText } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { posts as staticPosts } from '../data/posts';
import type { Post, Category } from '../../types';
import PostsGrid from '../components/PostsGrid';
import PageBanner from '../components/PageBanner';

// Ensure this page is rendered dynamically on Vercel so new data appears immediately
export const dynamic = 'force-dynamic';

async function getPosts(): Promise<Post[]> {
  if (!supabase)
    return staticPosts.map(p => ({
      id: p.id,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      author: p.author,
      date: p.date,
      image: p.image,
      images: (p as any).images || [],
      video: (p as any).video ?? null,
      category_id: 0,
      category: { id: 0, name: (p as any).category }
    }));

  const { data, error } = await supabase
    .from('posts')
    .select('id,title,excerpt,content,author,date,image,images,video,category_id, categories ( id, name )')
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
    images: row.images,
    video: row.video ?? null,
    category_id: row.category_id,
    category: row.categories as Category
  }));
}

const Posts = async () => {
  const posts = await getPosts();

  return (
    <main className="bg-[#f6f3ee] pt-[4.5rem] sm:pt-20">
      <PageBanner
        eyebrow="From the club"
        title="Posts & stories"
        subtitle="Explore updates and stories from community programmes across arts, sports, and service."
        icon={<FileText className="h-7 w-7" />}
        image="/images/posts-stories.png"
      />

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <PostsGrid posts={posts} />
          {posts.length > 0 && (
            <p className="mt-10 text-center text-sm text-stone-500">Showing the latest stories.</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default Posts;