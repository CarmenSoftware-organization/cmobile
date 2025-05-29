import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-xs w-full flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold text-center">Carmen Supply Chain Mobile App</h1>
        <p className="text-center text-muted-foreground text-base">
          Modern, mobile-first supply chain controls for hospitality. Fast, accessible, and easy to use.
        </p>
        <div className="flex flex-col gap-3 w-full">
          <Link href="/welcome" className="w-full">
            <Button size="lg" className="w-full">View Welcome Screen</Button>
          </Link>
          <Link href="/dashboard" className="w-full">
            <Button size="lg" variant="outline" className="w-full">Enter App</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
