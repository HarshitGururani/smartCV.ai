import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../apiClient";
const useGetDocumentById = (documentId: string) => {
  const query = useQuery({
    queryKey: ["document", documentId],
    queryFn: () => apiClient.getDocumentById(documentId),
    retry: 3,
    // enabled: !documentId,
  });

  return query;
};

export default useGetDocumentById;
