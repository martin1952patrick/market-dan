'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Mail, Trash2, MailOpen, Loader2, Inbox } from 'lucide-react';
import { dbService, SellerMessage } from '@/lib/services/dbService';

interface Props {
  sellerId: string;
  onUnreadChange?: (count: number) => void;
}

export default function MessagesInbox({ sellerId, onUnreadChange }: Props) {
  const [messages, setMessages] = useState<SellerMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const rows = await dbService.fetchSellerMessages(sellerId);
    setMessages(rows);
    setLoading(false);
    onUnreadChange?.(rows.filter((m) => !m.isRead).length);
  }, [sellerId, onUnreadChange]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const toggleRead = async (m: SellerMessage) => {
    await dbService.markSellerMessageRead(m.id, !m.isRead);
    load();
  };

  const remove = async (m: SellerMessage) => {
    await dbService.deleteSellerMessage(m.id);
    load();
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Messages</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Messages sent by visitors from your public profile. Reply directly to their email.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          <Loader2 size={16} className="animate-spin" /> Loading messages…
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-xl border p-8 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <Inbox size={32} className="mx-auto mb-2" style={{ color: 'var(--muted-foreground)' }} />
          <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>No messages yet</p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
            When someone uses &quot;Contact this seller&quot; on your profile, it will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <div
              key={`seller-msg-${m.id}`}
              className="rounded-xl border p-4"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: m.isRead ? 'var(--border)' : 'var(--primary)',
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={`mailto:${m.senderEmail}`}
                      className="text-sm font-semibold truncate"
                      style={{ color: 'var(--primary)' }}
                    >
                      {m.senderEmail}
                    </a>
                    {!m.isRead && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(194,105,42,0.15)', color: 'var(--primary)' }}>
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {m.createdAt ? new Date(m.createdAt).toISOString().slice(0, 16).replace('T', ' ') + ' UTC' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleRead(m)}
                    className="p-1.5 rounded-lg"
                    style={{ color: 'var(--muted-foreground)' }}
                    title={m.isRead ? 'Mark as unread' : 'Mark as read'}
                    aria-label={m.isRead ? 'Mark as unread' : 'Mark as read'}
                  >
                    {m.isRead ? <Mail size={16} /> : <MailOpen size={16} />}
                  </button>
                  <button
                    onClick={() => remove(m)}
                    className="p-1.5 rounded-lg"
                    style={{ color: '#DC2626' }}
                    title="Delete message"
                    aria-label="Delete message"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--foreground)' }}>{m.message}</p>
              <a
                href={`mailto:${m.senderEmail}`}
                className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}
              >
                <Mail size={13} /> Reply by email
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
