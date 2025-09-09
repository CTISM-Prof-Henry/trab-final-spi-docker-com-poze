'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {

  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userRole = sessionStorage.getItem("user_role");
    setRole(userRole);

    if (role === "ADMIN") {
      router.push("/portal-admin");
    } else if (role === "ALUNO" || role === "PROFESSOR") {
      router.push("/portal-usuario");
    } else {
      router.push("/login")
    }
  });

  return (
    <div>
    </div>
  );
}
