'use client';
import React from 'react';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { useAppStore } from '@/lib/AppContext';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

export default function BlogPreview() {
  const { blogPosts } = useAppStore();
  const published = blogPosts?.filter((b) => b?.status === 'published')?.slice(0, 3);

  if (published?.length === 0) return null;

  return (
    <section className="border-t py-14" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)' }}>
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>From the Blog</span>
            <h2 className="text-2xl font-bold mt-1" style={{ color: 'var(--foreground)' }}>Furniture Guides & Tips</h2>
          </div>
          <Link href="/blogs" className="hidden md:flex items-center gap-1 text-sm font-semibold transition-colors" style={{ color: 'var(--primary)' }}>
            All Articles <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {published?.map((post, i) => (
            <div key={`blog-prev-${post?.id}`} className="rounded-xl overflow-hidden border card-hover" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              {post?.coverImage && (
                <div className="h-44 overflow-hidden">
                  <AppImage
                    src={post?.coverImage}
                    alt={post?.coverImageAlt}
                    width={600}
                    height={350}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    priority={i === 0}
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post?.tags?.slice(0, 2)?.map((tag) => (
                    <span key={`blog-tag-${post?.id}-${tag}`} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
                      <Tag size={9} />
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="font-bold text-base leading-snug mb-2 line-clamp-2" style={{ color: 'var(--foreground)' }}>{post?.title}</h3>
                <p className="text-sm leading-relaxed line-clamp-2 mb-4" style={{ color: 'var(--muted-foreground)' }}>{post?.excerpt}</p>
                <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  <span className="flex items-center gap-1"><Calendar size={12} />{post?.publishedDate}</span>
                  <span>{post?.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}