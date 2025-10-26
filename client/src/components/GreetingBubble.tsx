export function GreetingBubble() {
  return (
    <div className="flex justify-center mb-6" data-testid="container-greeting">
      <h1 className="text-2xl font-semibold text-foreground" data-testid="text-greeting">
        Hi, I'm Nick!
      </h1>
    </div>
  );
}
