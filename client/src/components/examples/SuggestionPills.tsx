import { SuggestionPills } from "../SuggestionPills";

export default function SuggestionPillsExample() {
  const handleClick = (text: string) => {
    console.log("Suggestion clicked:", text);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <SuggestionPills onSuggestionClick={handleClick} />
    </div>
  );
}
