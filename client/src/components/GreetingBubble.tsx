export function GreetingBubble() {
  return (
    <div className="flex justify-center mb-4" data-testid="container-greeting">
      <div className="bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-sm">
        <p className="text-base font-medium" data-testid="text-greeting">
          Hi, I'm Nick!
        </p>
      </div>
    </div>
  );
}
