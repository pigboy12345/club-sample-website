"use client";
import React, { useEffect, useState } from 'react';
import { Calendar, User, Share2, X } from 'lucide-react';
import type { Post, Category } from '../../types';
import { IoCloseCircleOutline } from "react-icons/io5";

interface Props {
    posts: Post[];
}

export default function PostsGrid({ posts }: Props) {
    const [selected, setSelected] = useState<Post | null>(null);

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

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setSelected(null);
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {posts.map((post) => (
                    <article
                        key={post.id}
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer"
                        onClick={() => setSelected(post)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') setSelected(post); }}
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
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(post.category?.name || 'General')}`}>
                                    {post.category?.name || 'General'}
                                </span>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {formatDate(post.date)}
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-gray-800 mb-3 leading-tight hover:text-blue-600 transition-colors">
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
                                    <button className="text-gray-400 hover:text-blue-600 transition-colors" onClick={(e) => { e.stopPropagation(); /* share behavior later */ }}>
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {selected && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center pt-14 justify-center">
                    <div className=" rounded-xl max-w-3xl w-full p-5 shadow-2xl max-h-[80vh] overflow-hidden relative bg-white flex flex-col">
                        <button
                            className="absolute top-3 right-3 rounded-full bg-white/90 border shadow hover:bg-white z-50 flex items-center justify-center"
                            aria-label="Close"
                            onClick={() => setSelected(null)}
                        >
                            <IoCloseCircleOutline className="w-7 h-7 text-gray-700" />
                        </button>
                        <div className="relative">
                            <img src={selected.image} alt={selected.title} className="w-full max-h-[40vh] object-cover" />
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="flex items-center justify-between mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(selected.category?.name || 'General')}`}>
                                    {selected.category?.name || 'General'}
                                </span>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="w-4 h-4 mr-1" /> {formatDate(selected.date)}
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{selected.title}</h3>
                            <div className="flex items-center mb-4 text-gray-700">
                                <User className="w-4 h-4 mr-2 text-gray-500" />
                                <span className="text-sm">By {selected.author}</span>
                            </div>
                            {selected.excerpt && (
                                <p className="text-gray-700 mb-4"><span className="font-semibold">Summary:</span> {selected.excerpt}</p>
                            )}
                            <div className="prose max-w-none text-gray-900 whitespace-pre-line">
                                {selected.content}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
