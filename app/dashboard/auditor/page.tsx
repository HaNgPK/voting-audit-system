"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuditorVoting } from "@/src/components/voting/AuditorVoting";

export default function AuditorPage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/auth/login");
    }
  }, [router]);

  return <AuditorVoting />;
}
