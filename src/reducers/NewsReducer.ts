import {PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit';
import {RootState} from '.';
import {ArticleToDisplay} from '../Pages/Home/NewsContent/Carousel';

interface NewsState {
	news: Record<number, ArticleToDisplay[]>;
	error: string | null;
	loading: boolean;
	lastVisited?: string;
}
const initialState: NewsState = {
	news: {},
	error: null,
	loading: false,
	lastVisited: '',
};

// const newsSlice = createSlice({
//   name: 'news',
//   initialState,
//   reducers: {
//     setNews: (state, action: PayloadAction<Partial<newsState>>) => {
//       state.news = action.payload.news ?? state.news;
//       state.totalPages = action.payload.totalPages ?? state.totalPages;
//       state.page = action.payload.page ?? state.page;
//     },
//     appendNews: (state, action: PayloadAction<ArticleToDisplay[]>) => {
//       const existingIds = new Set(state.news.map(article => article._id));
//       const uniqueNews = action.payload.filter(article => !existingIds.has(article._id));
//       state.news = [...state.news, ...uniqueNews];
//       state.page = state.page + 1;
//     },
//   },
// });
const getTags = (tags: string) => tags.split('#').slice(1);
const filterOutDuplicates = (news: ArticleToDisplay[]) => {
  const uniqueNews = [];
  const uniqueIds = new Set();
  for (const article of news) {
    if (!uniqueIds.has(article._id)) {
      uniqueNews.push(article);
      uniqueIds.add(article._id);
    }
  }
  return uniqueNews;
}


export const selectNewsState = (state: RootState) => state.news;


export const selectAllNews = createSelector(
	[selectNewsState],
	(articlesState) => {
		const allArticles: ArticleToDisplay[] = [];
		for (const page in articlesState.news) {
			if (
				Object.prototype.hasOwnProperty.call(articlesState.news, page)
			) {
				allArticles.push(...articlesState.news[page]);
			}
		}
		return allArticles;
	}
);

export const getTargetNews = createSelector(
	[selectNewsState, (_, id) => id],
	(articlesState, id) => {
		const targetArticle = Object.values(articlesState.news)
			.flat()
			.find((article) => article._id === id);
		return targetArticle;
	}
);

export const getLastPageNumber = createSelector(
	[selectNewsState],
	(articlesState) => {
		return Object.keys(articlesState.news).length + 1;
	}
);

export const getLastVisitedId = createSelector(
	[selectNewsState],
	(articlesState) => {
		return articlesState.lastVisited;
	}
);

export const get5RandomNewsByTags = createSelector(
	[selectAllNews, (_, tags) => tags],
	(allNews, tags) => {
		const newsByTags = allNews.filter((article) =>
      getTags(`${article.tags}`).some((tag) => tags.includes(tag))
    );

    const shuffledNews = filterOutDuplicates(newsByTags).sort(() => 0.5 - Math.random());
    return shuffledNews.slice(0, 5);
	}
);

const newsSlice = createSlice({
	name: 'news',
	initialState,
	reducers: {
		fetchStart(state) {
			state.loading = true;
		},
		fetchSuccess(
			state,
			action: PayloadAction<{data: ArticleToDisplay[]; page: number}>
		) {
			state.loading = false;
			state.news[action.payload.page] = action.payload.data;
		},
		fetchError(state, action: PayloadAction<string>) {
			state.loading = false;
			state.error = action.payload;
		},
		updatePage(
			state,
			action: PayloadAction<{data: ArticleToDisplay[]; page: number}>
		) {
			state.news[action.payload.page] = action.payload.data;
		},
		appendPage(
			state,
			action: PayloadAction<{data: ArticleToDisplay[]; page: number}>
		) {
			if (!state.news[action.payload.page]) {
				state.news[action.payload.page] = action.payload.data;
			} else {
				const existingData = state.news[action.payload.page];
				const newData = action.payload.data.filter(
					(newArticle) =>
						!existingData.some(
							(existingArticle) =>
								existingArticle._id === newArticle._id
						)
				);
				state.news[action.payload.page] = [...existingData, ...newData];
			}
		},
		addLastVisited(state, action: PayloadAction<string>) {
			state.lastVisited = action.payload;
		},
	},
});
export const {
	fetchStart,
	fetchSuccess,
	fetchError,
	updatePage,
	appendPage,
	addLastVisited,
} = newsSlice.actions;

// export const {setNews, appendNews} = newsSlice.actions;
export default newsSlice.reducer;
