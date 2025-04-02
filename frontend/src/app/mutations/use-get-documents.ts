"use client";
import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../apiClient";
import { useAuth } from "@clerk/nextjs";
const useGetDocuments = () => {
  const queryKey = ["documents"];
  const { getToken } = useAuth();
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const token: string | null = await getToken();
      if (!token) throw new Error("Unauthorized: No token received");
      return apiClient.fetchAllDocuments(token);
    },
  });

  console.log("query fetch all:", query.data ?? "Loading...");

  return query;
};

export default useGetDocuments;
