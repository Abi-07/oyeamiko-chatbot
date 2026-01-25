import { http } from "./http";
import { Message } from "@/types/chat";

export async function sendChatMessage(
  message: string,
  history: Message[]
) {
  return http<{ response: string }>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat`,
    {
      method: "POST",
      body: JSON.stringify({ message, history }),
    }
  );
}
