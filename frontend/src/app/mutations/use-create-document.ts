"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../apiClient";
import toast from "react-hot-toast";

export const useCreateMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: apiClient.createDocument,
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
