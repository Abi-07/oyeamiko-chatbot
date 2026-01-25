"use client";

import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Message } from "@/types/chat";
import { Copy, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { markdownComponents } from "./MarkDownComponent";

interface ChatMessageItemProps {
    message: Message;
    onRetry?: (message: Message) => void;
}

export function ChatMessageItem({
    message,
    onRetry,
}: ChatMessageItemProps) {
    const isUser = message.role === "user";
    const [copied, setCopied] = useState(false);

    async function copyToClipboard() {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

    return (
        <div
            className={clsx(
                "flex mb-4",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div
                className={clsx(
                    "flex items-start gap-3 max-w-[80%]",
                    isUser && "flex-row-reverse"
                )}
            >
                <Avatar className="w-8 h-8">
                    <AvatarFallback
                        className={clsx(
                            isUser
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                        )}
                    >
                        {isUser ? "U" : "AI"}
                    </AvatarFallback>
                </Avatar>

                <div
                    className={clsx(
                        "relative p-3 rounded-lg text-sm leading-relaxed",
                        isUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted",
                        message.error && "border border-destructive"
                    )}
                >
                    {/* Markdown + syntax highlighting */}
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                    >
                        {message.content}
                    </ReactMarkdown>


                    {/* Streaming cursor */}
                    {message.isStreaming && (
                        <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                    )}

                    {/* Action buttons (AI only) */}
                    {!isUser && (
                        <div className="absolute -bottom-7 right-0 flex gap-1">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={copyToClipboard}
                            >
                                <Copy className="w-4 h-4" />
                            </Button>

                            {message.error && onRetry && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => onRetry(message)}
                                >
                                    <RefreshCcw className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    )}

                    {copied && (
                        <span className="absolute -top-5 right-0 text-xs text-muted-foreground">
                            Copied
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
