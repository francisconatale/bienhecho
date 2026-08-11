import { ChatView } from "./components/chat-view";

export const metadata = {
  title: "Gemini Chat | Design Lab",
};

export default function GeminiChatPage() {
  return (
    <div className="relative w-full min-h-screen bg-surface">
      <main className="relative flex flex-col h-screen max-w-4xl mx-auto w-full">
        <ChatView />
      </main>
    </div>
  );
}
