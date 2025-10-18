import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 phút - TĂNG LÊN
      cacheTime: 10 * 60 * 1000, // 10 phút
      refetchOnWindowFocus: false, // ✅ QUAN TRỌNG: tắt refetch khi focus
      refetchOnMount: false, // ✅ Tắt refetch khi component mount
      refetchOnReconnect: false, // ✅ Tắt refetch khi reconnect
    },
  },
});

export default queryClient;
