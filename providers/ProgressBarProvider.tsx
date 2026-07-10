"use client";
import NextTopLoader from "nextjs-toploader";

export default function ProgressBarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NextTopLoader showSpinner={false} />
      {children}
    </>
  );
}
