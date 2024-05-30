"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    signOut({ redirect: false })
      .then(() => {
        router.push("/");
      })
      .catch(() => {
        router.push("/");
      });
  }, [router]);

  return null;
}
