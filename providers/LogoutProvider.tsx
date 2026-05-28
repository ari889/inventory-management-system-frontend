import { signOut, useSession } from "next-auth/react";
import React, { useEffect } from "react";

const LogoutProvider = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/login" });
    }
  }, [session]);

  return <div>LogoutProvider</div>;
};

export default LogoutProvider;
