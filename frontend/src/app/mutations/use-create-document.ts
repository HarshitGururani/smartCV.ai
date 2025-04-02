"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../apiClient";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { ResumeDataType } from "@/types/document-types";

export const useCreateMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async (documentData: ResumeDataType) => {
      const token = await getToken();
      if (!token) throw new Error("Unauthorized: No token received");
      return apiClient.createDocument(documentData, token);
    },
    onSuccess: (data) => {
      console.log("Success:", data);
      toast.success("Created Document");
      queryClient.invalidateQueries({ queryKey: ["document"] });
    },
    onError: (error) => {
      toast.error("Failed to create document " + error);
    },
  });

  return mutation;
};
