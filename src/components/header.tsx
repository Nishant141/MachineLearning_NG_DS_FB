import { ChartLine } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 z-10">
      <nav className="flex w-full items-center justify-between text-lg font-medium">
        <a
          href="#"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <ChartLine className="h-6 w-6 text-primary" />
          <h1 className="font-headline text-foreground">Regression Analysis Suite</h1>
        </a>
      </nav>
    </header>
  );
}
