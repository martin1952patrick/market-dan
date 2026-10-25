'use client';
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Tag, Calendar, AlertCircle, X, Save } from 'lucide-react';
import { BlogPost } from '@/lib/mockData';
import { useAppStore } from '@/lib/AppContext';
import AppImage from '@/components/ui/AppImage';
import { Toaster, toast } from 'sonner';

export default function AdminBlog() {
  const { blogPosts, saveBlogPost, toggleBlogPublish, deleteBlogPost } = useAppStore();
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const openNew = () => {
    setEditingPost({
      id: `blog-${Date.now()}`,
      title: '',
      excerpt: '',
      content: '',
      author: 'Nairobi Spot Editorial',
      publishedDate: new Date().toISOString().split('T')[0],
      status: 'draft',
      coverImage: '',
      coverImageAlt: '',
      tags: [],
    });
    setShowEditor(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost({ ...post });
    setShowEditor(true);
  };

  const handleSavePost = () => {
    if (!editingPost) return;
    setSaving(true);
    setTimeout(() => {
      saveBlogPost(editingPost);
      toast.success(editingPost.status === 'published' ? 'Post published successfully' : 'Post saved as draft');
      setSaving(false);
      setShowEditor(false);
      setEditingPost(null);
    }, 600);
  };

  const handleTogglePublish = (id: string) => {
    const post = blogPosts.find((p) => p.id === id);
    toggleBlogPublish(id);
    toast.success(post?.status === 'published' ? 'Post unpublished (draft)' : 'Post published');
  };

  const executeDelete = () => {
    if (!deleteTarget) return;
    deleteBlogPost(deleteTarget);
    toast.success('Blog post deleted');
    setDeleteTarget(null);
  };

  return (
    <div className="max-w-screen-lg">
      <Toaster position="bottom-right" richColors />

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Blog Posts</h2>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {blogPosts.filter((p) => p.status === 'published').length} published · {blogPosts.filter((p) => p.status === 'draft').length} drafts
          </p>
        </div>
        <button onClick={openNew} className="btn-primary px-4 py-2 text-sm flex items-center gap-2 flex-shrink-0">
          <Plus size={15} /> New Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {blogPosts.map((post) => (
          <div key={`blog-row-${post.id}`} className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            {post.coverImage && (
              <div className="h-36 overflow-hidden">
                <AppImage src={post.coverImage} alt={post.coverImageAlt} width={600} height={300} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-bold text-sm leading-snug line-clamp-2 flex-1" style={{ color: 'var(--foreground)' }}>{post.title || 'Untitled Post'}</h3>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${post.status === 'published' ? 'badge-active' : 'badge-draft'}`}>
                  {post.status}
                </span>
              </div>
              <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: 'var(--muted-foreground)' }}>{post.excerpt}</p>
              <div className="flex items-center gap-3 text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
                <span className="flex items-center gap-1"><Calendar size={11} />{post.publishedDate}</span>
                <span>{post.author}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.map((tag) => (
                  <span key={`post-tag-${post.id}-${tag}`} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(194,105,42,0.08)', color: 'var(--primary)' }}>
                    <Tag size={9} />{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <button onClick={() => openEdit(post)} className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs flex-1 justify-center">
                  <Edit2 size={12} /> Edit
                </button>
                <button
                  onClick={() => handleTogglePublish(post.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex-1 justify-center"
                  style={{
                    backgroundColor: post.status === 'published' ? '#FEF3C7' : '#DCFCE7',
                    color: post.status === 'published' ? '#D97706' : '#16A34A',
                  }}
                >
                  {post.status === 'published' ? <><EyeOff size={12} /> Unpublish</> : <><Eye size={12} /> Publish</>}
                </button>
                <button
                  onClick={() => setDeleteTarget(post.id)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
                  title="Delete this post permanently"
                  aria-label="Delete post"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Blog editor modal */}
      {showEditor && editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(28,20,16,0.7)' }}>
          <div className="rounded-2xl border shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="sticky top-0 border-b px-6 py-4 flex items-center justify-between z-10" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>
                {blogPosts.find((p) => p.id === editingPost.id) ? 'Edit Post' : 'New Blog Post'}
              </h3>
              <button onClick={() => { setShowEditor(false); setEditingPost(null); }} className="p-1.5 rounded-lg" style={{ color: 'var(--muted-foreground)' }} aria-label="Close editor">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Post Title</label>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="input-base w-full px-3 py-2.5 text-sm"
                  placeholder="e.g. How to Choose the Right Sofa…"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Excerpt</label>
                <p className="text-xs mb-1.5" style={{ color: 'var(--muted-foreground)' }}>A short summary shown on the blog preview cards (1–2 sentences)</p>
                <textarea
                  value={editingPost.excerpt}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  rows={2}
                  className="input-base w-full px-3 py-2.5 text-sm resize-none"
                  placeholder="Brief summary of the article…"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Cover Image URL</label>
                <input
                  type="url"
                  value={editingPost.coverImage}
                  onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                  className="input-base w-full px-3 py-2.5 text-sm"
                  placeholder="https://images.unsplash.com/…"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Author</label>
                  <input
                    type="text"
                    value={editingPost.author}
                    onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                    className="input-base w-full px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Published Date</label>
                  <input
                    type="date"
                    value={editingPost.publishedDate}
                    onChange={(e) => setEditingPost({ ...editingPost, publishedDate: e.target.value })}
                    className="input-base w-full px-3 py-2.5 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editingPost.tags.join(', ')}
                  onChange={(e) => setEditingPost({ ...editingPost, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
                  className="input-base w-full px-3 py-2.5 text-sm"
                  placeholder="Sofas, Buying Guide, Living Room"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Status</label>
                <div className="flex gap-2">
                  {(['draft', 'published'] as const).map((s) => (
                    <button
                      key={`post-status-${s}`}
                      type="button"
                      onClick={() => setEditingPost({ ...editingPost, status: s })}
                      className="px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize"
                      style={{
                        backgroundColor: editingPost.status === s ? 'var(--primary)' : 'var(--muted)',
                        color: editingPost.status === s ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 border-t px-6 py-4 flex gap-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <button onClick={() => { setShowEditor(false); setEditingPost(null); }} className="btn-secondary flex-1 py-2.5 text-sm">Cancel</button>
              <button
                onClick={handleSavePost}
                disabled={saving}
                className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                ) : (
                  <><Save size={15} /> {editingPost.status === 'published' ? 'Publish Post' : 'Save Draft'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(28,20,16,0.6)' }}>
          <div className="rounded-2xl border p-6 max-w-sm w-full shadow-modal" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base mb-1" style={{ color: 'var(--foreground)' }}>Delete this post?</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  <strong>{blogPosts.find((p) => p.id === deleteTarget)?.title}</strong> will be permanently removed. This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1 py-2.5 text-sm">Cancel</button>
              <button onClick={executeDelete} className="flex-1 py-2.5 text-sm font-semibold rounded-lg" style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}>Delete Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}