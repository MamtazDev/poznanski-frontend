import {PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit';
import {Article} from '../hooks/usePaginatedNews';
import { RootState } from '.';



interface NewsState {
  news: Record<number, Article[]>;
  error: string | null;
  loading: boolean;
}
const initialState: NewsState = {
  news: {},
  error: null,
  loading: false,
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
//     appendNews: (state, action: PayloadAction<Article[]>) => {
//       const existingIds = new Set(state.news.map(article => article._id));
//       const uniqueNews = action.payload.filter(article => !existingIds.has(article._id));
//       state.news = [...state.news, ...uniqueNews];
//       state.page = state.page + 1;
//     },
//   },
// });
export const selectNewsState = (state: RootState) => state.news;

export const selectAllNews = createSelector(
  [selectNewsState],
  (articlesState) => {
    const allArticles: Article[] = [];
    for (const page in articlesState.news) {
      if (Object.prototype.hasOwnProperty.call(articlesState.news, page)) {
        allArticles.push(...articlesState.news[page]);
      }
    }
    return allArticles;
  }
);

export const getLastPageNumber = createSelector(
  [selectNewsState],
  (articlesState) => {
    return Object.keys(articlesState.news).length + 1;
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = true;
    },
    fetchSuccess(state, action: PayloadAction<{ data: Article[]; page: number }>) {
      state.loading = false;
      state.news[action.payload.page] = action.payload.data;
    },
    fetchError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updatePage(state, action: PayloadAction<{ data: Article[]; page: number }>) {
      state.news[action.payload.page] = action.payload.data;
    },
    appendPage(state, action: PayloadAction<{ data: Article[]; page: number }>) {
      if (!state.news[action.payload.page]) {
        state.news[action.payload.page] = action.payload.data;
      } else {
        const existingData = state.news[action.payload.page];
        const newData = action.payload.data.filter(newArticle =>
          !existingData.some(existingArticle => existingArticle._id === newArticle._id)
        );
        state.news[action.payload.page] = [...existingData, ...newData];
      }
    },
  },
});
export const { fetchStart, fetchSuccess, fetchError, updatePage, appendPage } = newsSlice.actions;


// export const {setNews, appendNews} = newsSlice.actions;
export default newsSlice.reducer;
