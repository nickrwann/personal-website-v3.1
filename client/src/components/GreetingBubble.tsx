export function GreetingBubble() {
  return (
    <div className="flex justify-center mb-4" data-testid="container-greeting">
      <div className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg">
        <p className="text-sm font-medium" data-testid="text-greeting">
          Hi, I'm Nick!
        </p>
      </div>
    </div>
  );
}
