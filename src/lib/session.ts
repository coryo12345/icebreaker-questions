"use client";

import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export type SessionData = {
  username: string;
  isLoggedIn: boolean;
};

export const defaultSession: SessionData = {
  username: "",
  isLoggedIn: false,
};

const SESSION_API_ROUTE = "/api/session";

// helper to automatically convert response to json
async function fetchJSON<JSON = unknown>(
  url: RequestInfo,
  options?: RequestInit
): Promise<JSON> {
  return fetch(url, {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    ...options,
  }).then((r) => r.json());
}

export function useSession() {
  const { data: session, isLoading } = useSWR(
    SESSION_API_ROUTE,
    fetchJSON<SessionData>,
    { fallbackData: defaultSession }
  );

  const { trigger: register } = useSWRMutation(
    SESSION_API_ROUTE,
    (url: string, { arg }: { arg: { username: string; password: string } }) =>
      fetchJSON<SessionData>(url, {
        method: "PUT",
        body: JSON.stringify({
          username: arg.username,
          password: arg.password,
        }),
      })
  );

  const { trigger: login } = useSWRMutation(
    SESSION_API_ROUTE,
    (url: string, { arg }: { arg: { username: string; password: string } }) =>
      fetchJSON<SessionData>(url, {
        method: "POST",
        body: JSON.stringify({
          username: arg.username,
          password: arg.password,
        }),
      })
  );

  const { trigger: logout } = useSWRMutation(SESSION_API_ROUTE, (url: string) =>
    fetchJSON<SessionData>(url, { method: "DELETE" })
  );

  return {
    session,
    isLoading,
    register,
    login,
    logout,
  };
}
