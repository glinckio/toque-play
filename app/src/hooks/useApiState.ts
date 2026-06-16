import { useQuery, type UseQueryResult } from '@tanstack/react-query';

/**
 * Wraps react-query useQuery to expose a consistent loading/error/empty state.
 *
 * Usage:
 *   const { data, isLoading, isError, isEmpty, retry } =
 *     useApiState(['users', page], () => api.get(`/users?page=${page}`));
 */
export interface UseApiStateResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  error: unknown;
  retry: () => void;
}

export function useApiState<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  options?: { enabled?: boolean; isEmpty?: (data: T) => boolean },
): UseApiStateResult<T> {
  const result = useQuery<T>({
    queryKey,
    queryFn,
    enabled: options?.enabled,
  }) as UseQueryResult<T>;

  const isEmpty =
    !!result.data &&
    (options?.isEmpty
      ? options.isEmpty(result.data)
      : Array.isArray(result.data)
        ? result.data.length === 0
        : false);

  return {
    data: result.data,
    isLoading: result.isLoading,
    isError: result.isError,
    isEmpty,
    error: result.error,
    retry: () => result.refetch(),
  };
}
