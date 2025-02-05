import { axiosInstance } from "./axiosInstance";

// issue a book
export const IssueBook = async (payload) => {
    try {
      const response = await axiosInstance.post("/api/issues/issue-new-book", payload);
      if(response.data.success) {
      return response.data;
      }else{
        throw new Error(response.data.message);
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong.",
      };
    }
  }

// get issues
export const GetIssues = async (payload) => {
    try {
      const response = await axiosInstance.post("/api/issues/get-issues" , payload);
      return response.data;
    } catch (error) {
      throw error;
    }
}

// return a book
export const ReturnBook = async (payload) => {
    try {
      const response = await axiosInstance.post("/api/issues/return-book", payload);
      return response.data;
    } catch (error) {
      throw error;
    }
}

// delete an issue
export const DeleteIssue = async (payload) => {
    try {
      const response = await axiosInstance.post("/api/issues/delete-issue", payload);
      return response.data;
    } catch (error) {
      throw error;
    }
}

// edit an issue
export const EditIssue = async (payload) => {
    try {
      const response = await axiosInstance.post("/api/issues/edit-issue", payload);
      return response.data;
    } catch (error) {
      throw error;
    }
}