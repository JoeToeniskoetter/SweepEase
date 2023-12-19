import "../styles/global.css";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import type { AppType } from "next/app";

import { api } from "~/utils/api";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <ReactQueryDevtools />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
