'use client';

import { useEffect, useRef, useState } from 'react';
import {
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  MessageScrollerProvider,
} from '@/components/ui/message-scroller';
import { Message, MessageContent, MessageHeader } from '@/components/ui/message';
import { colorForMember } from '@/lib/member-colors';

export type ChatMessage = {
  id: string;
  memberId: string;
  memberName: string;
  text: string;
  ts: number;
};

type Props = {
  messages: ChatMessage[];
  onSend?: (text: string) => void;
  placeholder?: string;
  className?: string;
};

export default function ChatPanel({
  messages,
  onSend,
  placeholder = 'Mesaj yaz…',
  className = '',
}: Props) {
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }, [messages.length]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t || !onSend) return;
    onSend(t);
    setText('');
  }

  return (
    <div className={`flex h-full min-h-0 flex-col bg-[var(--panel,#102b22)] ${className}`}>
      <MessageScrollerProvider>
        <MessageScroller className="flex-1 min-h-0">
          <MessageScrollerViewport>
            <MessageScrollerContent className="gap-3 p-3">
              {messages.map((m) => {
                const bg = colorForMember(m.memberId);
                return (
                  <MessageScrollerItem key={m.id} scrollAnchor={m.id === messages.at(-1)?.id}>
                    <Message>
                      <MessageContent
                        className="rounded-xl px-3.5 py-2.5 text-[var(--ink,#f3f6ea)] shadow-sm"
                        style={{ background: bg }}
                      >
                        <MessageHeader className="px-0 pb-0.5 text-[11px] font-semibold opacity-80">
                          {m.memberName}
                        </MessageHeader>
                        <div className="text-sm leading-snug">{m.text}</div>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                );
              })}
              <div ref={endRef} />
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton direction="end" />
        </MessageScroller>
      </MessageScrollerProvider>

      {onSend && (
        <form onSubmit={submit} className="flex gap-2 border-t border-[#365346] p-2.5">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            className="flex-1 rounded-lg border border-[#365346] bg-[#071b13] px-3 py-2 text-sm text-[var(--ink,#f3f6ea)] outline-none focus:border-[#d5ff62]"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="rounded-lg bg-[#d5ff62] px-4 py-2 text-sm font-semibold text-[#142016] disabled:opacity-40"
          >
            Gönder
          </button>
        </form>
      )}
    </div>
  );
}
