import { Spinner } from "@chakra-ui/react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { PageBasicProps } from "../../AppMain";
import BreadCrumb from "../../Components/BreadCrumb";
import NewReleaseCard from "../../Components/Card/NewReleaseCard";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import "../mainPageStyle.css";
import Layout from "./../../Components/Layout/index";
import { apiBaseUrl } from "../../Constant/config";
import axios from "axios";

interface Product {
  artists: { name: string }[];
  _id: string;
  title: string;
  img: string;
  category: string;
  date: string;
  link: string;
  location: string;
  artist: string;
  star: number;
  songs: { youTube?: string }[];
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
  totalAlbums: number;
  totalPages: number;
  currentPage: number;
  success: boolean;
}

const AlbumsMainPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const [page, setPage] = useState<number>(1);
  const [isLoading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [displayedItems, setDisplayedItems] = useState<Product[]>([]);
  const [filterText, setFilterText] = useState<string>("");
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    totalAlbums: 0,
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

      const response = await axios.get(`${apiBaseUrl}/album?${params}`);
      const {
        albums: newData,
        totalAlbums,
        totalPages,
        currentPage,
        success,
      } = response.data;

      setPaginationMeta({
        totalAlbums: totalAlbums || 0,
        totalPages:
          totalPages || Math.ceil((totalAlbums || 0) / filters.quantity),
        currentPage: currentPage || pageNumber,
        success: success || false,
      });

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

  useEffect(() => {
    setPage(1);
    setDisplayedItems([]);
    setHasMore(true);
    setPaginationMeta({
      totalAlbums: 0,
      totalPages: 0,
      currentPage: 1,
      success: false,
    });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    fetchData(1);
  }, [filters]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Layout themeMode={themeMode} type={type}>
      <div className="flex justify-center">
        <div className="container">
          {!type && (
            <div className="md:mt-12 mt-8">
              <BreadCrumb />
            </div>
          )}
          <div className="md:mt-7 mt-10">
            <ContentTitle titleType="NEW RELEASES" title="New Releases" />
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
                style={{ minHeight: "400px" }}
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
              <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-4 gap-5 mt-10 mb-10">
                {displayedItems.map((item, index) => (
                  <div
                    ref={
                      index === displayedItems.length - 1 ? lastItemRef : null
                    }
                    key={item._id}
                  >
                    <NewReleaseCard
                      id={item._id}
                      data={{ songs: item.songs }}
                      youTube="https://www.youtube.com/embed/6JYIGclVQdw"
                      title={item.title}
                      nickname={item.artists[0]?.name}
                      date={item.date}
                      link={item.link}
                      btn="See Details"
                    />
                  </div>
                ))}
              </div>
            )}

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
                {`Showing ${displayedItems.length} of ${paginationMeta.totalAlbums} albums`}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AlbumsMainPage;
