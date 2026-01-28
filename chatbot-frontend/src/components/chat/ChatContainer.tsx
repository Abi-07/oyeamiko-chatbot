"use client";

import { Card } from "@/components/ui/card";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { useChat } from "@/hooks/useChat";

export function ChatContainer() {
    const chat = useChat();

    return (
        <Card className="w-full max-w-2xl mx-auto h-150] flex flex-col shadow-xl">
            <ChatMessages
                {...chat}
                onRetry={chat.retryMessage}
            />
            <ChatInput {...chat} />
        </Card>
    );
}
