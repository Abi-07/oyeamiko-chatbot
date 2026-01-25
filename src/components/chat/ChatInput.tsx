"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
    sendMessage: () => void;
    isLoading: boolean;
}

export function ChatInput({
    input,
    setInput,
    sendMessage,
    isLoading,
}: ChatInputProps) {
    return (
        <div className="p-4">
            <form
                className="flex w-full space-x-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                }}
            >
                <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                            sendMessage();
                        }
                    }}

                />
                <Button type="submit" disabled={isLoading}>
                    Send
                </Button>
            </form>
        </div>
    );
}
