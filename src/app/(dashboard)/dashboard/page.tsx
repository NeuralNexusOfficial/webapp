"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth');
        return;
      }

      setName(user.user_metadata.name || "User");
    };

    getUser();
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold">
        Welcome, {name}
      </h1>

    </div>
  );
}