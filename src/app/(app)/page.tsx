import { Suspense } from "react";
import { HomeView } from "@/components/home/HomeView";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading...</div>}>
      <HomeView />
    </Suspense>
  );
}
