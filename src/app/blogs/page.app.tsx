'use client';
import React, { useState } from 'react';
import { Calendar, Tag, Search } from 'lucide-react';
import { useAppStore } from '@/lib/AppContext';
import PublicTopbar from '@/components/PublicTopbar';
import PublicFooter from '@/components/PublicFooter';
import AppImage from '@/components/ui/AppImage';

export default function BlogsPage() {
  const { blogPosts } = useAppStore();
  const [search, setSearch] = useState('');

  const published = blogPosts?.filter((b) => b?.status === 'published') ?? [];

  const filtered = published?.filter((post) => {
    if (!search?.trim()) return true;
    const q = search?.toLowerCase();
    return (post?.title?.toLowerCase()?.includes(q) ||
    post?.excerpt?.toLowerCase()?.includes(q) ||
    post?.tags?.some((t) => t?.toLowerCase()?.includes(q)) || post?.author?.toLowerCase()?.includes(q));
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <PublicTopbar />

      <main className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 py-14">
        {/* Header */}
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
            Nairobi Spot Blog
          </span>
          <h1 className="text-3xl font-bold mt-1 mb-2" style={{ color: 'var(--foreground)' }}>
            Furniture Guides &amp; Tips
          </h1>
          <p className="text-sm max-w-xl" style={{ color: 'var(--muted-foreground)' }}>
            Expert advice on buying, styling, and caring for your furniture. Stay up to date with the latest trends from Kenya&apos;s furniture market.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-10">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e?.target?.value)}
            placeholder="Search articles…"
            className="input-base w-full pl-9 pr-4 py-2.5 text-sm"
          />
        </div>

        {/* Posts grid */}
        {filtered?.length === 0 ? (
          <div className="text-center py-20 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <p className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
              {search ? 'No articles match your search' : 'No blog posts yet'}
            </p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {search ? 'Try a different keyword.' : 'Check back soon — new articles are on the way.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered?.map((post, i) => (
              <article
                key={`blog-card-${post?.id}`}
                className="rounded-xl overflow-hidden border flex flex-col card-hover"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
              >
                {post?.coverImage && (
                  <div className="h-48 overflow-hidden flex-shrink-0">
                    <AppImage
                      src={post?.coverImage}
                      alt={post?.coverImageAlt || post?.title}
                      width={600}
                      height={350}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      priority={i === 0}
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post?.tags?.slice(0, 3)?.map((tag) => (
                      <span
                        key={`blog-tag-${post?.id}-${tag}`}
                        className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}
                      >
                        <Tag size={9} />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="font-bold text-base leading-snug mb-2 line-clamp-2" style={{ color: 'var(--foreground)' }}>
                    {post?.title}
                  </h2>
                  <p className="text-sm leading-relaxed line-clamp-3 mb-4 flex-1" style={{ color: 'var(--muted-foreground)' }}>
                    {post?.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-3 border-t" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {post?.publishedDate}
                    </span>
                    <span className="font-medium">{post?.author}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Count */}
        {filtered?.length > 0 && (
          <p className="text-xs mt-8 text-center" style={{ color: 'var(--muted-foreground)' }}>
            Showing {filtered?.length} article{filtered?.length !== 1 ? 's' : ''}
          </p>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
