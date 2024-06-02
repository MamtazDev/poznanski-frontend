import useSWR, { mutate as globalMutate } from 'swr';
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {AppDispatch, RootState} from '../reducers';
import {getNewsRequests} from '../Constant/api-requests';
import {
	appendPage,
	fetchError,
	fetchStart,
	fetchSuccess,
	getLastPageNumber,
	selectAllNews,
	updatePage,
} from '../reducers/NewsReducer';
import {set} from 'react-hook-form';
import _, {constant, get} from 'lodash';

export interface Article {
	title: string;
	intro: string;
	content: string;
	files: FileToSave[];
	nickname: string;
	_id: string;
	tags?: string;
	date?: Date;
}

export interface FileToSave {
	name: string;
	file: string;
	url: string;
	size: number;
}

const BACKEND_PAGE_SIZE = 18; // Backend fetches more data for smoother experience
const FRONTEND_PAGE_SIZE = 6; // Displayed on the frontend

const fetcher = getNewsRequests;

export const usePaginatedNews = (pageSize: number, page: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const { news, error, loading } = useSelector((state: RootState) => state.news);
  const currentPage = useSelector((state: RootState) => getLastPageNumber(state));
  const allNews: Article[] = useSelector((state: RootState) => selectAllNews(state));
  const pageData = useSelector((state: RootState) => state.news.news[page -1]);
  const [totalPages, setTotalPages] = useState(0);

  const {
    data: swrData,
    error: swrError,
    mutate,
  } = useSWR<{ news: Article[]; totalPages: number }>(
    `/api/news?page=${page}&pageSize=${pageSize}`,
    () => getNewsRequests(page, pageSize),
    {
      onLoadingSlow: () => dispatch(fetchStart()),
      onSuccess: (data) => {
        const { news: fetchedNews, totalPages } = data;
        setTotalPages((prevTotalPages) => Math.max(totalPages, prevTotalPages));

        // Check if the current page data is different from the fetched data
        if (!currentPage || page >= currentPage) {
          dispatch(fetchSuccess({ data: fetchedNews, page }));
        } else if (page === currentPage) {
          dispatch(updatePage({ data: fetchedNews, page }));
        }
      },
      onError: (error) => dispatch(fetchError(error.message)),
    }
  );

  const forceRevalidateAll = async () => {
    const pageKeys = Object.keys(news);
    const revalidatePromises = pageKeys.map(async (pageKey) => {
      const pageNum = Number(pageKey);
      const newData = await globalMutate(`/api/news?page=${pageNum}&pageSize=${pageSize}`, async () => {
        const response = await getNewsRequests(pageNum, pageSize);
        return response;
      }, false);  // Passing false to avoid immediate refetch
      if (newData?.news && !_.isEqual(newData.news, news[pageNum])) {
        dispatch(updatePage({ data: newData.news, page: pageNum }));
      }
    });

    await Promise.all(revalidatePromises);
  };

  return {
    data: allNews || swrData?.news,
    error: error || swrError,
    loading,
    forceRevalidateAll,
    totalPages,
  };
};

// export const usePaginatedNews = ({
// 	initialPage,
// 	pageSize,
// }: {
// 	initialPage: number;
// 	pageSize: number;
// }) => {
// 	const dispatch = useDispatch<AppDispatch>();
// 	const {news, totalPages} = useSelector((state: RootState) => state.news);
// 	const [currentPage, setCurrentPage] = useState(1);

// 	const fetcher = async (page: number, pageSize: number) => {
//         // Check if the page data is already in the Redux state
//         const startIndex = (page - 1) * pageSize;
//         const endIndex = page * pageSize;
//         const existingNews = news.slice(startIndex, endIndex);

//         if (existingNews.length === pageSize) {
//             return { news: existingNews, totalPages };
//         } else {
//             const data = await getNewsRequests(page, pageSize);
//             return data;
//         }
//     };

// 	const {data, error, isLoading} = useSWR<{
// 		news: Article[];
// 		totalPages: number;
// 	}>(
// 		`/api/news?page=${currentPage}&pageSize=${pageSize}`,
// 		() => fetcher(currentPage, pageSize),
// 		{revalidateOnFocus: false}
// 	);

// 	useEffect(() => {
// 		if(_.isEqual(news[0], data?.news[0])) {
// 			dispatch(setNews({news: data?.news, page:1}));
// 		} else {
// 		if (data) {
// 			const {news: fetchedNews, totalPages} = data;

// 			if (currentPage === 1 && news.length === 0) {
// 				dispatch(setNews({news: fetchedNews, totalPages}));
// 			} else if (currentPage !== 1 && currentPage <= totalPages) {
// 				dispatch(appendNews(fetchedNews));
// 			} else {
// 				setCurrentPage(totalPages);
// 			}
// 		}
// 	}
// 	}, [data]);

// 	const loadMore = () => {
// 		if (currentPage < totalPages) {
// 			setCurrentPage((prevPage) => prevPage + 1);
// 		}
// 	};

// 	return {
// 		news,
// 		error,
// 		isLoading: (!data && !error) || isLoading,
// 		loadMore,
// 		currentPage,
// 		totalPages,
// 	};
// };
