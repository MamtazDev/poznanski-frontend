import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageBasicProps } from "../../AppMain";
import BreadCrumb from "../../Components/BreadCrumb";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import Layout from "../../Components/Layout";
import { isInViewport } from "../../Constant/helpers";
import { NewsItem, usePaginatedNews } from "../../hooks/useSWRNews";
import { RootState } from "../../reducers";

import {
  addLastVisited,
  getLastPageNumber,
  getLastVisitedId,
} from "../../reducers/NewsReducer";
import "../mainPageStyle.css";

import Articles from "./artices";

export const getFirstTag = (tags: string) => {
  return tags.split("#")[0];
};

const scrollToById = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      block: "center",
    });
  }
};

interface Item {
  id: number;
  title: string;
}

const ArticleMainPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const dispatch = useDispatch();
  const currentPage = useSelector((state: RootState) =>
    getLastPageNumber(state)
  );
  const [selectedPage, setSelectedPage] = useState<number>(currentPage);
  const [, setCardNum] = useState<number>(4);
  const [filterText, setFilterText] = useState<string>("");
  const [loadNexPage, setLoadNextPage] = useState<boolean>(false);
  const loadNextPageElementRef = React.createRef<HTMLDivElement>();

  const [displayedItems, setDisplayedItems] = useState<NewsItem[]>([]);
// Show first 10 items initially



  const [filters, setFilters] = useState({
    sort: "A to Z",
    limit: 7,
    startDate: "",
    endDate: "",
    order:"desc"
  });
  
  const lastVisitedId = useSelector((state: RootState) =>
    getLastVisitedId(state)
  );
  const pageSize = 18;
 

  const { data, loading, forceRevalidateAll, totalPages } =
    usePaginatedNews(pageSize, selectedPage);
    console.log('dataaaaaaaaa',data)


  if (lastVisitedId) {
    setTimeout(() => {
      scrollToById(lastVisitedId);
      dispatch(addLastVisited(""));
    }, 300);
  }
  
  const loadMore = () => {
    setSelectedPage((prevPage) => {
      if (prevPage < totalPages) {
        return prevPage + 1;
      }
      return prevPage;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      forceRevalidateAll();
    }, 30000); 
    return () => clearInterval(interval);
  }, [forceRevalidateAll]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkVisibility = () => {
    if (loadNextPageElementRef.current) {
      setLoadNextPage(isInViewport(loadNextPageElementRef.current));
    }
  };
  
  const filteredData = data?.filter((item) =>
    item.title.toLowerCase().includes(filterText.toLowerCase())
  );


  // const setDisplayUpdatedName = () => {
  //   setDisplayedItems(filteredData.slice(0, visibleCount));

  // }
  


  // const [items, setItems] = useState(Array.from({ length: 20 }, (_, i) => i + 1));
  // const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  
 

  // useEffect(() => {
  //   setDisplayUpdatedName()
  // }, [ displayedItems, filteredData,visibleCount]);

  return (
    <>
      <Layout type={type} themeMode={themeMode}>
        <div className="flex justify-center">
          <div className="container">
            <div className="hidden sm:block md:mt-12 mt-8 ">
              <BreadCrumb />
            </div>
            <div className="md:mt-7 mt-10">
              <ContentTitle titleType="NEWS" title="See Our Latest News" />
            </div>
            <div className="md:mt-6 mt-4">
              <FilterInput type={type} filterText={filterText} setFilterText={setFilterText} setFilters={setFilters} filters={filters}/>
            </div>
            <Articles/>

          </div>
        </div>
      </Layout>
    </>
  );
};

export default ArticleMainPage;
