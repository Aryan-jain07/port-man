"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect root traffic straight to the main operational layout
    router.push("/dashboard");
  }, [router]);

  return <div className="min-h-screen bg-slate-950" />;
}
