import { ChatScreen } from "../ChatScreen";
import { ThemeProvider } from "@/hooks/useTheme";

export default function ChatScreenExample() {
  return (
    <ThemeProvider>
      <ChatScreen />
    </ThemeProvider>
  );
}
