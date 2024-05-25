import { FileFromEditor } from "../Components/TipTap/TipTap";
import { apiPostReq } from "./api-functions"

type ArticleData = {
    title: string;
    intro: string;
    content: string;
    files: FileFromEditor[];
}

export const createArticleRequest = async (articleData: ArticleData) => {
    await apiPostReq('/create-users-article', articleData, true)
}