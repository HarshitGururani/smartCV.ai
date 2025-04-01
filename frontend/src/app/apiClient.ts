import { ResumeDataType } from "@/types/document-types";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

//create documents
export const createDocument = async (documentData: ResumeDataType) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/document/create`,
      documentData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: unknown) {
    console.error(
      "Api Error",
      axios.isAxiosError(error)
        ? error.response?.data || error.response
        : error instanceof Error
        ? error.message
        : "Unknown Error"
    );
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data || error.response
        : error instanceof Error
        ? error.message
        : "Failed to update document"
    );
  }
};

//fetch all documents
export const fetchAllDocuments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/document/all`, {
      withCredentials: true,
    });
    console.log(response.data);
    return response.data;
  } catch (error: unknown) {
    console.error(
      "Api Error",
      axios.isAxiosError(error)
        ? error.response?.data || error.response
        : error instanceof Error
        ? error.message
        : "Unknown Error"
    );
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data || error.response
        : error instanceof Error
        ? error.message
        : "Failed to fetch all documents"
    );
  }
};

//fetch document by id
export const getDocumentById = async (documentId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/document/${documentId}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: unknown) {
    console.error(
      "Api Error",
      axios.isAxiosError(error)
        ? error.response?.data || error.response
        : error instanceof Error
        ? error.message
        : "Unknown Error"
    );
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data || error.response
        : error instanceof Error
        ? error.message
        : "Failed to fetch document"
    );
  }
};

//update document
export const updateDocument = async (
  documentData: ResumeDataType,
  documentId: string
) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/document/updated/${documentId}`,
      documentData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error(
      "Api Error",
      axios.isAxiosError(error)
        ? error.response?.data || error.response
        : error instanceof Error
        ? error.message
        : "Unknown Error"
    );
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data || error.response
        : error instanceof Error
        ? error.message
        : "Failed to update document"
    );
  }
};
