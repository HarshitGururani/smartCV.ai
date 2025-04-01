"use client";
import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../apiClient";
const useGetDocuments = () => {
  const queryKey = ["documents"];
  const query = useQuery({
    queryKey,
    queryFn: apiClient.fetchAllDocuments,
  });

  console.log("query fetch all:", query.data ?? "Loading...");

  return query;
};

export default useGetDocuments;
