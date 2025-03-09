import { Spinner } from "@chakra-ui/react";
import { useEffect, useRef, useState, useCallback } from "react";
import ProductCard1 from "../../Components/Card/ProductCard1";
import { NewsItem } from "../../hooks/useSWRNews";
import FilterInput from "../../Components/FilterInput";
import axios from "axios";
import { apiBaseUrl } from "../../Constant/config";

interface PaginationMeta {
  totalNews: number;
  totalPages: number;
  currentPage: number;
  success: boolean;
}

const Articles = ({ themeMode, type, filters, setFilters }: any) => {
  const [page, setPage] = useState<number>(1);
  const [isLoading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [displayedItems, setDisplayedItems] = useState<NewsItem[]>([]);
  const [filterText, setFilterText] = useState("");
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    totalNews: 0,
    totalPages: 0,
    currentPage: 1,
    success: false,
  });
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchNews = async (pageNumber: number) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pageNumber.toString(),
        limit: filters.quantity.toString(),
        order: filters.sort === "Z to A" ? "desc" : "asc",
        sortBy: "title",
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await axios.get(`${apiBaseUrl}/news/all?${params}`);
      const {
        news: newData,
        totalNews,
        totalPages,
        currentPage,
        success,
      } = response.data;

      // Update pagination metadata
      setPaginationMeta({
        totalNews,
        totalPages,
        currentPage,
        success,
      });

      // Check if we've reached the last page
      setHasMore(currentPage < totalPages);

      if (pageNumber === 1) {
        setDisplayedItems(newData || []);
      } else {
        setDisplayedItems((prev) => [...prev, ...(newData || [])]);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && hasMore && !isLoading) {
        const bottomOffset = firstEntry.boundingClientRect.bottom;
        const windowHeight = window.innerHeight;

        // Only load more if the element is near the bottom of the viewport
        if (bottomOffset <= windowHeight + 50) {
          // 50px threshold from bottom
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          timeoutRef.current = setTimeout(() => {
            setPage((prevPage) => prevPage + 1);
          }, 500);
        }
      }
    },
    [hasMore, isLoading]
  );

  useEffect(() => {
    fetchNews(page);
  }, [page]);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: [0.5, 0.75, 1.0], // Multiple thresholds for better detection
    };

    const observer = new IntersectionObserver(handleIntersect, options);

    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [hasMore, isLoading, handleIntersect]);

  // Reset everything when filters change
  useEffect(() => {
    setPage(1);
    setDisplayedItems([]);
    setHasMore(true);
    setPaginationMeta({
      totalNews: 0,
      totalPages: 0,
      currentPage: 1,
      success: false,
    });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    fetchNews(1);
  }, [filters]);

  // Clean up timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // console.log(filters);

  return (
    <div>
      <div className="md:mt-6 mt-4">
        <FilterInput
          type={type}
          filterText={filterText}
          setFilterText={setFilterText}
          setFilters={setFilters}
          filters={filters}
          handler={(inputValue) => setFilterText(inputValue)}
        />
      </div>

      <div className="md:mt-6 mt-4 rounded-lg p-2">
        {isLoading && displayedItems.length === 0 ? (
          <div
            className="w-full flex justify-center items-center"
            style={{ minHeight: type ? "776px" : "908px" }}
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
          <>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 py-5">
              {displayedItems.map((item, index) => (
                <div
                  ref={index === displayedItems.length - 1 ? lastItemRef : null}
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

            {isLoading && displayedItems.length > 0 && (
              <div className="flex justify-center py-4">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="md"
                />
              </div>
            )}

            {!hasMore && displayedItems.length > 0 && (
              <div className="text-center py-4 text-gray-500">
                {`Showing ${displayedItems.length} of ${paginationMeta.totalNews} articles`}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Articles;
