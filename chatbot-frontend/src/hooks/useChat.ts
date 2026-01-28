'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import { sendChatMessage } from '@/lib/api/chat.api';

// fallback for environments without crypto.randomUUID
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : uuidv4(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await sendChatMessage(input, messages);
      setMessages((prev) => [
        ...prev,
        {
          id:
            typeof crypto !== 'undefined' && crypto.randomUUID
              ? crypto.randomUUID()
              : uuidv4(),
          role: 'assistant',
          content: data.response,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function retryMessage(failed: Message) {
    setMessages((prev) => prev.filter((m) => m.id !== failed.id));

    setInput(failed.content);
    await sendMessage();
  }

  return {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    retryMessage,
    scrollRef,
  };
}
