import {FileFromEditor} from '../Components/TipTap/TipTap';
import {Article} from '../hooks/usePaginatedNews';
import {apiGetReq, apiPostReq} from './api-functions';

type ArticleData = {
	title: string;
	intro: string;
	content: string;
	files: FileFromEditor[];
};

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
