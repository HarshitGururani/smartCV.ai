import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../apiClient";
import { useAuth } from "@clerk/nextjs";
const useGetDocumentById = (documentId: string) => {
  const { getToken } = useAuth();
  const query = useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Unauthorized: No token received");
      return apiClient.getDocumentById(documentId, token);
    },
    retry: 3,
    enabled: !!documentId, // Only run query when documentId is available
  });

  return query;
};

export default useGetDocumentById;
