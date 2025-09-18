"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Learning = () => {
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      router.push("/login");
    }
  }, [router]);

  return (
    <>learning</>
  );
};

export default Learning;
