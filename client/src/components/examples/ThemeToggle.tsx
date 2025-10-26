import { ThemeToggle } from "../ThemeToggle";
import { ThemeProvider } from "@/hooks/useTheme";

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background p-8">
        <ThemeToggle />
        <p className="text-foreground">Toggle theme in the top right corner</p>
      </div>
    </ThemeProvider>
  );
}
