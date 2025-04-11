import { useState, useCallback } from 'react';
import { ApiError } from '@/services/api';

interface ApiState<T> {
  data: T | null;
  error: ApiError | null;
  loading: boolean;
}

interface UseApiResponse<T> extends ApiState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useApi<T>(
  apiFunc: (...args: any[]) => Promise<T>
): UseApiResponse<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setState({ data: null, error: null, loading: true });
        const data = await apiFunc(...args);
        setState({ data, error: null, loading: false });
        return data; // ✅ CHỈ THÊM DÒNG NÀY
      } catch (error) {
        setState({
          data: null,
          error: error instanceof ApiError ? error : new ApiError('An error occurred'),
          loading: false,
        });
        return undefined; // optional: giúp các nơi khác biết lỗi
      }
    },
    [apiFunc]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, loading: false });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}