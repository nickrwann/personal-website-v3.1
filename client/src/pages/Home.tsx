import { ChatScreen } from "@/components/ChatScreen";
import { NWBadge } from "@/components/NWBadge";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <>
      <NWBadge />
      <ThemeToggle />
      <ChatScreen />
    </>
  );
}
