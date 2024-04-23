"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface AuthProvider {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProvider) {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
    </>
  );
}
