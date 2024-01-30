import { useState } from "react";

export function useActionQuery<T>(fetcher: () => Promise<T | null>): {
  data: T | null;
  loading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  fetcher()
    .then((result) => {
      setData(result);
      setLoading(false);
    })
    .catch((err) => {
      setError(err);
      setLoading(false);
    });

  return { data, loading, error };
}
