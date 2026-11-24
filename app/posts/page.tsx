"use client";

import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { posts as staticPosts } from '../data/posts';
import type { Post, Category } from '../../types';
import PostsGrid from '../components/PostsGrid';
import PageBanner from '../components/PageBanner';

function getStaticPosts(): Post[] {
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
}

async function getPosts(): Promise<Post[]> {
  if (!supabase) return getStaticPosts();

  try {
    let { data, error } = await supabase
      .from('posts')
      .select('id,title,excerpt,content,author,date,image,images,video,category_id, categories ( id, name )')
      .order('date', { ascending: false })
      .limit(20);

    if (error) {
      const fallback = await supabase
        .from('posts')
        .select('id,title,excerpt,content,author,date,image,category_id, categories ( id, name )')
        .order('date', { ascending: false })
        .limit(20);
      if (fallback.error || !fallback.data) return getStaticPosts();
      data = fallback.data.map((row: any) => ({ ...row, images: [], video: null }));
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      excerpt: row.excerpt,
      content: row.content,
      author: row.author,
      date: row.date,
      image: row.image,
      images: row.images || [],
      video: row.video ?? null,
      category_id: row.category_id,
      category: row.categories as Category
    }));
  } catch {
    return getStaticPosts();
  }
}

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getPosts()
      .then((loadedPosts) => {
        if (active) setPosts(loadedPosts);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

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
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2" aria-label="Loading posts">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="aspect-[4/3] animate-pulse rounded-3xl bg-stone-200" />
              ))}
            </div>
          ) : (
            <PostsGrid posts={posts} />
          )}
          {posts.length > 0 && (
            <p className="mt-10 text-center text-sm text-stone-500">Showing the latest stories.</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default Posts;