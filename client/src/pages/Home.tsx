import { NWBadge } from "@/components/NWBadge";
import { ThemeToggle } from "@/components/ThemeToggle";
import ChatPage from "./ChatPage";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <NWBadge />
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="max-w-3xl mx-auto h-screen">
        <ChatPage />
      </div>
    </div>
  );
}
