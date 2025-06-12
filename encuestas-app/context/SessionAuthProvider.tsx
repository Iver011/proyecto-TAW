  "use client";

  import { SessionProvider } from "next-auth/react";

  interface Props {
    children: React.ReactNode;
  }

  const SessionAuthProvider = ({ children }: Props) => {
    return <SessionProvider refetchInterval={0}
                            refetchOnWindowFocus={false}>{children}</SessionProvider>;
  };
  export default SessionAuthProvider;