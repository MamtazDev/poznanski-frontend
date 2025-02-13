import { Spinner } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ProductCard1 from "../../Components/Card/ProductCard1";
import { NewsItem, usePaginatedNews } from "../../hooks/useSWRNews";
import { RootState } from "../../reducers";
import { getLastPageNumber } from "../../reducers/NewsReducer";

const Articles = ({ themeMode, type }: any) => {
  const currentPage = useSelector((state: RootState) =>
    getLastPageNumber(state)
  );
  const [selectedPage, setSelectedPage] = useState<number>(currentPage);
  const pageSize = 100;

  const [isloading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [displayedItems, setDisplayedItems] = useState<NewsItem[]>([]);

  const { data, loading, forceRevalidateAll, totalPages } = usePaginatedNews(
    pageSize,
    selectedPage
  );

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);



  const loadMoreItems = () => {
    if (loading || visibleCount >= data.length) return;
    setLoading(true);

    setTimeout(() => {
      setVisibleCount((prev) => prev + 3);
      setLoading(false);
    }, 1000);
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 5) {
      loadMoreItems();
    }
  };

  const handleWindowScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 10) {
      loadMoreItems();
    }
  };


  const setDisplayUpdatedName = () => {
    setDisplayedItems(data.slice(0, visibleCount));
  };

  useEffect(() => {
    if (data && data.length>0 ){
      setDisplayUpdatedName();
    }    
  }, [data]);

  

  useEffect(() => {
    window.addEventListener("scroll", handleWindowScroll);
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, []);

  return (
    <div>
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="md:mt-12 mt-8 max-h-[800px] overflow-y-auto rounded-lg p-2 scrollbar-hide"
        style={{ width: "100%",
         }}
      >
        {loading || !data ? (
          <div className="w-full flex justify-center items-center" style={{ minHeight: type ? "776px" : "908px" }}>
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="lg" />
          </div>
        ) : (
          <>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 xl:grid-cols-4 gap-4 py-5">
              {displayedItems?.map((item) => (
                <div id={item._id} key={`main-news-card-${item._id}`} className="w-full">
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
            {isloading && (
              <div className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-700 text-white">
                <p className="text-lg text-gray-300 font-medium animate-pulse bg-gray-800 px-6 py-2 rounded-lg shadow-lg">
                  Loading more...
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Articles;
