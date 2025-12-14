"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export default function AuthInit() {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return null;
}
