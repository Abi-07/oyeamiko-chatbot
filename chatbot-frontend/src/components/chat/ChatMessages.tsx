"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/chat";
import { ChatMessageItem } from "./ChatMessageItem";

interface ChatMessagesProps {
    messages: Message[];
    isLoading: boolean;
    scrollRef: React.RefObject<HTMLDivElement | null>;
    onRetry?: (message: Message) => void;
}

export function ChatMessages({
    messages,
    isLoading,
    scrollRef,
    onRetry,
}: ChatMessagesProps) {
    return (
        <div className="flex-1 overflow-hidden border-b">
            <ScrollArea className="h-full p-4" ref={scrollRef}>
                {messages.map((m) => (
                    <ChatMessageItem
                        key={m.id}
                        message={m}
                        onRetry={onRetry}
                    />
                ))}
                {messages.length === 0 && !isLoading && (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                        Start a conversation ✨
                    </div>
                )}

                {isLoading && (
                    <div className="text-xs text-muted-foreground animate-pulse">
                        AI is thinking...
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
