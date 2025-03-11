/* eslint-disable react-hooks/exhaustive-deps */
import { Spinner } from "@chakra-ui/react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { PageBasicProps } from "../../AppMain";
import BreadCrumb from "../../Components/BreadCrumb";
import TVCard from "../../Components/Card/TVCard";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import Layout from "../../Components/Layout";
import "../mainPageStyle.css";
import { apiBaseUrl } from "../../Constant/config";
import axios from "axios";

interface Product {
  artists: any;
  _id: unknown;
  youTube: string;
  id: string;
  title: string;
  img: string;
  category: string;
  date: string;
  link: string;
  location: string;
  artist: string;
  star: number;
}

export interface filterProperties {
  sort: string;
  quantity: number;
  startDate: string;
  endDate: string;
  order: string;
  search: string | undefined;
}

interface PaginationMeta {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  success: boolean;
}

const VideoMainPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const [page, setPage] = useState<number>(1);
  const [isLoading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [displayedItems, setDisplayedItems] = useState<Product[]>([]);
  const [filterText, setFilterText] = useState<string>("");
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    totalRecords: 0,
    totalPages: 0,
    currentPage: 1,
    success: false,
  });
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [filters, setFilters] = useState<filterProperties>({
    sort: "Z to A",
    quantity: 5,
    startDate: "",
    endDate: "",
    order: "desc",
    search: "",
  });

  const fetchData = async (pageNumber: number) => {
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

      const response = await axios.get(`${apiBaseUrl}/radio?${params}`);
      const {
        records: newData,
        total,
        totalPages,
        currentPage,
        success,
      } = response.data;

      // Update pagination metadata
      setPaginationMeta({
        totalRecords: total || 0,
        totalPages: totalPages || Math.ceil((total || 0) / filters.quantity),
        currentPage: currentPage || pageNumber,
        success: success || false,
      });

      // Check if we've reached the last page
      setHasMore(currentPage < totalPages);

      if (pageNumber === 1) {
        setDisplayedItems(newData || []);
      } else {
        setDisplayedItems((prev) => [...prev, ...(newData || [])]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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
    fetchData(page);
  }, [page]);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: [0.5, 0.75, 1.0],
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
      totalRecords: 0,
      totalPages: 0,
      currentPage: 1,
      success: false,
    });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    fetchData(1);
  }, [filters]);

  // Clean up timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Layout type={type} themeMode={themeMode}>
      <div className="flex justify-center">
        <div className="container">
          {type ? (
            ""
          ) : (
            <div className="md:mt-12 mt-8">
              <BreadCrumb />
            </div>
          )}
          <div className="md:mt-7 mt-10">
            <ContentTitle titleType="TOP HITS" title="TV/RADIO" />
          </div>
          <div className="md:mt-6 mt-4">
            <FilterInput
              type={type}
              handler={(inputValue) => setFilterText(inputValue)}
              filterText={filterText}
              setFilterText={setFilterText}
              setFilters={setFilters}
              filters={filters}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-5">
                  {displayedItems.map((item, index) => (
                    <div
                      ref={
                        index === displayedItems.length - 1 ? lastItemRef : null
                      }
                      key={index}
                      className="w-full"
                    >
                      <TVCard
                        data={item}
                        id={item.id}
                        video=""
                        type={type ? "vertical" : "horizontal"}
                        youTube={item.youTube}
                        feature={item.title}
                        title={item.artists?.[0]?.name || "Unknown Artist"}
                        link={item.link}
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
                    {`Showing ${displayedItems.length} of ${paginationMeta.totalRecords} videos`}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoMainPage;
