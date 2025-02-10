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



interface filterProperties{
  sort: string,
  quantity: number,
    startDate: string,
    endDate: string,
    order: string,
    search: string | undefined
  }


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

const ArticleMainPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const dispatch = useDispatch();

  const [filterText, setFilterText] = useState<string>("");

  // Show first 10 items initially

 const [filters, setFilters] = useState<filterProperties>({
    sort: "A to Z",
    quantity: 5,
    startDate: "",
    endDate: "",
    order: "desc",
    search: ""
  });

  
  const lastVisitedId = useSelector((state: RootState) =>
    getLastVisitedId(state)
  );

  if (lastVisitedId) {
    setTimeout(() => {
      scrollToById(lastVisitedId);
      dispatch(addLastVisited(""));
    }, 300);
  }

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
              <FilterInput
                type={type}
                filterText={filterText}
                setFilterText={setFilterText}
                setFilters={setFilters}
                filters={filters}
              />
            </div>
            <Articles />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ArticleMainPage;
