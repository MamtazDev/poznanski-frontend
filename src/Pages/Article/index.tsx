import React, { useState, useEffect } from "react";
import BreadCrumb from "../../Components/BreadCrumb";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import Layout from "../../Components/Layout";
import ProductCard1 from "../../Components/Card/ProductCard1";
import { Button, Spinner } from "@chakra-ui/react";
import "../mainPageStyle.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import {
  addLastVisited,
  getLastPageNumber,
  getLastVisitedId,
} from "../../reducers/NewsReducer";
import { isInViewport } from "../../Constant/helpers";
import DelayedComponent from "../../Components/_utility/DelayedComponent";
import useBreadCrumb from "../../Components/BreadCrumb";
import { PageBasicProps } from "../../AppMain";
import { useParams } from "react-router-dom";
import { usePaginatedNews } from "../../hooks/useSWRNews";

export const getFirstTag = (tags: string) => {
  return tags.split("#")[0];
};

const scrollToById = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      // behavior: 'smooth',
      block: "center",
    });
  }
};

const ArticleMainPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const dispatch = useDispatch();
  const currentPage = useSelector((state: RootState) =>
    getLastPageNumber(state)
  );
  const [selectedPage, setSelectedPage] = useState<number>(currentPage);
  const [cardNum, setCardNum] = useState<number>(4);
   const [filterText, setFilterText] = useState<string>("");
  const [loadNexPage, setLoadNextPage] = useState<boolean>(false);
  const loadNextPageElementRef = React.createRef<HTMLDivElement>();
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
  // const { data, loading, forceRevalidateAll, totalPages } = usePaginatedNews(
  //   pageSize,
  //   selectedPage
  // );

  const { data, loading, forceRevalidateAll, totalPages, error } =
    usePaginatedNews(pageSize, selectedPage);

  const currentPageByLength = Math.ceil(data.length / pageSize);

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
    }, 30000); // Revalidate every 30 seconds
    return () => clearInterval(interval);
  }, [forceRevalidateAll]);

  const checkVisibility = () => {
    if (loadNextPageElementRef.current) {
      setLoadNextPage(isInViewport(loadNextPageElementRef.current));
    }
  };

  useEffect(() => {
    checkVisibility();
    const handleResize = () => {
      if (window.innerWidth > 1280) {
        setCardNum(4);
      } else {
        setCardNum(3);
        if (window.innerWidth < 1024) {
          setCardNum(2);
          if (window.innerWidth < 768) {
            setCardNum(1);
          }
        }
      }
    };
    handleResize();
    window.addEventListener("scroll", checkVisibility);
    window.addEventListener("resize", checkVisibility);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
      window.removeEventListener("resize", handleResize);
    };
  }, [checkVisibility]);

  useEffect(() => {
    if (loadNexPage) {
      loadMore();
    }
  }, [loadNexPage]);
  {
    console.log(data, "daaaaaaaaaa");
  }

  return (
    <>
      <h1 className="text-white">Here is will come news data</h1>
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

            <div
              className={`md:mt-12 mt-8`}
              style={{
                minHeight: type ? "843px" : "1235.7px",
                width: "100%",
              }}
            >
              {loading || !data ? (
                <div
                  className="w-full flex justify-center items-center"
                  style={{
                    minHeight: type ? "776px" : "908px",
                  }}
                >
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="lg"
                  />
                </div>
              ) : (
                <div className={`grid lg:grid-cols-3 gap-4 py-5`}>
                  {data?.map((item) => (
                    <div
                      id={item._id}
                      key={`main-news-card-${item._id}`}
                      className="w-full"
                    >
                      <ProductCard1
                        type={type ? "vertical" : "horizontal"}
                        img={item?.files && item.files[0]}
                        tags={`${item.tags}`}
                        title={item.title}
                        date={`${item.date}`.split("T")[0]}
                        _id={item._id}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ArticleMainPage;
