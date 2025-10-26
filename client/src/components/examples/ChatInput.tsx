import { ChatInput } from "../ChatInput";

export default function ChatInputExample() {
  const handleSend = (message: string) => {
    console.log("Message sent:", message);
  };

  const handleRefresh = () => {
    console.log("Refresh clicked");
  };

  return (
    <div className="min-h-screen bg-background">
      <ChatInput onSend={handleSend} onRefresh={handleRefresh} />
    </div>
  );
}
