/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import * as apiClient from "../apiClient";
import { ResumeDataType } from "@/types/document-types";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";

const useUpdateDocument = () => {
  const params = useParams();
  const documentId = params.documentId as string;
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async (documentData: ResumeDataType) => {
      const token = await getToken();
      if (!token) throw new Error("Unauthorized: No token received");
      return apiClient.updateDocument(documentData, documentId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["document", documentId],
      });
    },
    onError: () => {
      toast.error("Failed to update document");
    },
  });

  return mutation;
};

export default useUpdateDocument;
