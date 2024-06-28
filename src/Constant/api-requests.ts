import {FileFromEditor} from '../Components/TipTap/TipTap';
import {Article} from '../hooks/usePaginatedNews';
import {apiGetReq, apiPostReq} from './api-functions';

type ArticleData = {
	title: string;
	intro: string;
	content: string;
	files: FileFromEditor[];
};
// auth
export const fetchCSRF = async () => {
	return await apiGetReq('auth/csrf-token', {}).then((res) => res.csrfToken);
};

export const checkIfLoggedIn = async (): Promise<any> => {
	return await apiGetReq('auth/verify', {});
};

export const refreshTokenRequest = async () => {
	await apiPostReq('auth/refresh-token', {}, false);
};
// user
export const loginRequest = async (
	password: string,
	email?: string,
	nickname?: string
) => {
	// generate csrf token in case user has just logged out
	// await fetchCSRF();
	await apiPostReq('auth/login', {email, password, nickname}, false);
};

export const logoutRequest = async () => {
	await apiPostReq('auth/logout', {}, false);
};

export const registerRequest = async (
	password: string,
	email: string,
	nickname: string
) => {
	await apiPostReq('auth/register', {nickname, email, password}, false);
};

export const verifyEmailRequest = async (token: string) => {
	await apiPostReq(`auth/verify-email/${token}`, {}, false);
};
// news
export const createArticleRequest = async (articleData: FormData) => {
	await apiPostReq('news/create/unknown', articleData, true);
};

// export const editArticleRequest = async (articleData: ArticleData, articleId: string) => {
//     await apiPostReq(`news/edit/${articleId}`, articleData, true)
// }

export const getNewsRequests = async (
	page: number,
	pageSize: number
): Promise<{news: Article[]; totalPages: number}> => {
	return await apiGetReq(
		`news/get/unknown?page=${page}&pageSize=${pageSize}`,
		{}
	);
};
// comments
export enum PostModels {
	news = 'News',
	comment = 'Comment',
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
		{content, parentCommentId},
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
}: GetCommentRequest & {page: number; pageSize: number}) => {
	if(parentCommentId) {
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
