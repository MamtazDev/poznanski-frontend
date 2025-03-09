import { Spinner } from "@chakra-ui/react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { PageBasicProps } from "../../AppMain";
import BreadCrumb from "../../Components/BreadCrumb";
import MaterialCard from "../../Components/Card/MaterialCard";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import Layout from "../../Components/Layout";
import "../mainPageStyle.css";
import { apiBaseUrl } from "../../Constant/config";
import { useToast } from "@chakra-ui/react";

interface Product {
  _id: unknown;
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  youTube: string;
  tags: string;
  date: string;
  videoId: string;
  channelId: string;
  channelTitle: string;
  playlistId: string;
}

interface filterProperties {
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

const MaterialMainPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const [page, setPage] = useState<number>(1);
  const [filterText, setFilterText] = useState<string>("");
  const [displayedItems, setDisplayedItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(true);
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toast = useToast();

  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    totalRecords: 0,
    totalPages: 0,
    currentPage: 1,
    success: false,
  });

  const [filters, setFilters] = useState<filterProperties>({
    sort: "Z to A",
    quantity: 5,
    startDate: "",
    endDate: "",
    order: "desc",
    search: "",
  });

  const fetchPlaylists = async (pageNumber: number) => {
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

      const response = await fetch(`${apiBaseUrl}/playlist?${params}`);
      const data = await response.json();
      const {
        data: newData,
        totalItems: total,
        totalPages,
        currentPage,
        success,
      } = data;

      // Update pagination metadata
      setPaginationMeta({
        totalRecords: total || 0,
        totalPages: totalPages || Math.ceil((total || 0) / filters.quantity),
        currentPage: currentPage || pageNumber,
        success: success || false,
      });

      // Check if we've reached the last page
      setHasMore(currentPage < totalPages);

      const mappedData = newData.map((item: any) => ({
        id: item._id,
        title: item.title,
        description: item.description,
        thumbnail: item.thumbnail,
        videoId: item.videoId,
        channelId: item.channelId,
        youTube: item.youTube,
        channelTitle: item.channelTitle,
        playlistId: item.playlistId,
        tags: item.tags || "",
        date: new Date(item.publishedAt).toISOString().split("T")[0],
      }));

      if (pageNumber === 1) {
        setDisplayedItems(mappedData);
      } else {
        setDisplayedItems((prev) => [...prev, ...mappedData]);
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setHasMore(false);
      toast({
        title: "Error fetching playlists",
        description: error.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && hasMore && !loading) {
        const bottomOffset = firstEntry.boundingClientRect.bottom;
        const windowHeight = window.innerHeight;

        // Only load more if the element is near the bottom of the viewport
        if (bottomOffset <= windowHeight + 50) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          timeoutRef.current = setTimeout(() => {
            setPage((prevPage) => prevPage + 1);
          }, 500);
        }
      }
    },
    [hasMore, loading]
  );

  useEffect(() => {
    fetchPlaylists(page);
  }, [page]);

  useEffect(() => {
    if (!hasMore || loading) return;

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
  }, [hasMore, loading, handleIntersect]);

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
    fetchPlaylists(1);
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
    <Layout themeMode={themeMode}>
      <div className="flex justify-center">
        <div className="container">
          {!type && (
            <div className="md:mt-12 mt-8">
              <BreadCrumb />
            </div>
          )}
          <div className="md:mt-7 mt-10">
            <ContentTitle titleType="VIDEOS" title="Materials" />
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
          <div className="md:mt-12 mt-8">
            {loading && displayedItems.length === 0 ? (
              <div
                className="w-full flex justify-center items-center"
                style={{ minHeight: "908px" }}
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
                  {displayedItems.length > 0 ? (
                    displayedItems.map((item, index) => (
                      <div
                        ref={
                          index === displayedItems.length - 1
                            ? lastItemRef
                            : null
                        }
                        key={`main-video-card-${index}`}
                        className="w-full"
                      >
                        <MaterialCard
                          type={type ? "vertical" : "horizontal"}
                          video={item.videoId}
                          data={item}
                          id={item.id}
                          thumbnail={item.thumbnail}
                          feature={item.tags}
                          title={item.title}
                          date={item.date}
                          link={item.youTube}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-blue-500 text-5xl py-3 text-center">
                      There is no data
                    </p>
                  )}
                </div>

                {loading && displayedItems.length > 0 && (
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

                {displayedItems.length > 0 && (
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

export default MaterialMainPage;
