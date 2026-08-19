import { Suspense } from "react";
import { HomeView } from "@/components/home/HomeView";
import { LoadingFallback } from "@/components/ui/LoadingFallback";

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeView />
    </Suspense>
  );
}
