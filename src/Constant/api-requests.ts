import axios from "axios";
import { FileFromEditor } from "../Components/TipTap/TipTap";
import { Article } from "../hooks/usePaginatedNews";
import { apiGetReq, apiPostReq, apiPutReq } from "./api-functions";

type ArticleData = {
  title: string;
  intro: string;
  content: string;
  files: FileFromEditor[];
};
// auth
export const fetchCSRF = async () => {
  return await apiGetReq("auth/csrf-token", {}).then((res) => res.csrfToken);
};

export const checkIfLoggedIn = async (): Promise<any> => {
  const resData = await apiGetReq("auth/verify", {})
  return resData;
};

export const refreshTokenRequest = async () => {
  await apiPostReq("auth/refresh-token", {}, false);
};

// user
export const loginRequest = async (
  password: string,
  email?: string,
  nickname?: string
) => {
  // generate csrf token in case user has just logged out
  // await fetchCSRF();
  await apiPostReq("auth/login", { email, password, nickname }, false);
};

export const logoutRequest = async () => {
  await apiPostReq("auth/logout", {}, false);
};

export const registerRequest = async (
  password: string,
  email: string,
  nickname: string
) => {
  const data = await apiPostReq("auth/register", { nickname, email, password }, false);
  return data
};

export const forgetPasswordReq = async (email: string) => {
  await apiPostReq("auth/forgot-password", { email }, false);
};

export const profileUpdateRequest = async (
  rafa: string,
  nickname: string,
  profilePicture?: string | null
) => {
  const reqData = {
    nickname,
    profilePicture,
  };
  const path = `/auth/users/${rafa}`;
  console.log("request Data", reqData, path)

  await apiPutReq(path, reqData);
};

// export const profileUpdateRequest = async (userId: string, nickname: string, profileImage: string) => {
//   const payload = { nickname, profilePicture: profileImage };

//   try {
//     const response = await axios.put(`http://localhost:8000/api/auth/users/${userId}`, payload);
//     return response.data;
//   }
//   catch (error) {
//     throw new Error("Error updating profile: " + error);
//   }
// };


export const profilePicRequest = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  const path = "/upload";
  const response = await apiPostReq(path, formData, true);
  return response.fileUrl;
};

export const verifyEmailRequest = async (token: string) => {
  await apiPostReq(`auth/verify-email/${token}`, {}, false);
};

// news
export const createArticleRequest = async (articleData: FormData) => {
  await apiPostReq("news/create-unknown", articleData, true);
};

export const verifyNewsAuthorRequest = async (
  confirmationToken: string,
  userData?: { userId: string; email: string }
) => {
  await apiPutReq(`news/verify-author`, { confirmationToken, userData });
};

// export const createArticleByUserRequest = async (articleData: FormData) => {
//   await apiPostReq("/news", articleData, true);
// };

export const createArticleByUserRequest = async (articleData: object) => {
  await apiPostReq("/news", articleData, false);
};

// export const editArticleRequest = async (articleData: ArticleData, articleId: string) => {
//     await apiPostReq(`news/edit/${articleId}`, articleData, true)
// }

export const getNewsRequests = async (
  page: number,
  pageSize: number
): Promise<{ news: Article[]; totalPages: number }> => {
  return await apiGetReq(`news/get?page=${page}&pageSize=${pageSize}`, {});
};
// comments
export enum PostModels {
  news = "News",
  comment = "Comment",
}

interface GetCommentRequest {
  entityModel: PostModels;
  postId: string;
  parentCommentId?: string | null;
}

interface AddCommentRequestType extends GetCommentRequest {
  content: string;
  parentCommentId?: string | null;
}

export const addCommentRequest = async ({
  entityModel,
  postId,
  content,
  parentCommentId,
}: AddCommentRequestType) => {
  await apiPostReq(
    `comment/${entityModel}/${postId}`,
    { content, parentCommentId },
    false
  );
};

export const getTopCommentsRequest = async ({
  entityModel,
  postId,
  parentCommentId,
}: GetCommentRequest) => {
  return await apiGetReq(`comment/${entityModel}/${postId}`, {});
};

export const getPaginatedCommentsRequest = async ({
  entityModel,
  postId,
  page,
  pageSize,
  parentCommentId,
}: GetCommentRequest & { page: number; pageSize: number }) => {
  if (parentCommentId) {
    return await apiGetReq(
      `comment/${entityModel}/${postId}/${page}?limit=${pageSize}&parentCommentId=${parentCommentId}`,
      {}
    );
  } else {
    return await apiGetReq(
      `comment/${entityModel}/${postId}/${page}?limit=${pageSize}`,
      {}
    );
  }
};
