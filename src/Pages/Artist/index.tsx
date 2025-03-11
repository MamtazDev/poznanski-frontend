import React, { useEffect, useState, useRef, useCallback } from "react";
import { PageBasicProps } from "../../AppMain";
import BreadCrumb from "../../Components/BreadCrumb";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import Layout from "../../Components/Layout";
import { apiBaseUrl, fileUrl } from "../../Constant/config";
import ArtistsCarousel from "../Home/Artists/Carousel";
import "../mainPageStyle.css";
import { useNavigate } from "react-router-dom";
import avatar from "../../assets/png/profileImage2.png";
import { Avatar, Spinner } from "@chakra-ui/react";
import axios from "axios";

interface ArtistsData {
  id: string;
  _id?: string;
  name: string;
  img: string;
  profileImg: any;
  description: string;
  products: [
    {
      title: string;
      location: string;
      date: string;
      category: string;
      img: string;
      profileImg: string;
    },
  ];
}

interface PaginationMeta {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  success: boolean;
}

const ArtistMainPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const navigate = useNavigate();
  const [cardNum, setCardNum] = useState<number>(4);
  const [state, setState] = useState<boolean>(false);
  const [artists, setArtists] = useState<ArtistsData[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [lineNum, setLineNum] = useState<number>(3);
  const [filterCardNum, setFilterCardNum] = useState<number>(4);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);
  const [filterText, setFilterText] = useState<string>("");
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    totalRecords: 0,
    totalPages: 0,
    currentPage: 1,
    success: false,
  });

  const [filters, setFilters] = useState({
    sort: "A to Z",
    quantity: 2,
    startDate: "",
    endDate: "",
    order: "desc",
    search: "",
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1350) {
        setCardNum(3);
        setFilterCardNum(4);
        setState(false);
        if (window.innerWidth < 1050) {
          setCardNum(2);
          setFilterCardNum(3);
        }
        if (window.innerWidth < 768) {
          setCardNum(1);
          setFilterCardNum(2);
          setState(true);
        }
      } else {
        setFilterCardNum(4);
        setCardNum(4);
        setState(false);
      }
      setLineNum(window.innerWidth < 768 ? 2 : 3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchData = async (pageNumber: number) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pageNumber.toString(),
        limit: filters.quantity.toString(),
        order: filters.sort === "Z to A" ? "desc" : "asc",
        sortBy: "name",
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await axios.get(`${apiBaseUrl}/artist?${params}`);
      const {
        data: newData,
        total,
        currentPage,
        totalPages,
        success,
      } = response.data;

      setPaginationMeta({
        totalRecords: total || 0,
        totalPages: totalPages || Math.ceil((total || 0) / filters.quantity),
        currentPage: currentPage || pageNumber,
        success: success || false,
      });

      setHasMore(currentPage < totalPages);

      const formattedData = newData.map((item: any) => ({
        id: item.artist._id,
        name: item.artist.name,
        img: fileUrl + item.artist.profileImg,
        profileImg: item.artist.profileImg,
        description: item.artist.description,
        products: item.products,
      }));

      if (pageNumber === 1) {
        setArtists(formattedData);
      } else {
        setArtists((prev) => [...prev, ...formattedData]);
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
      if (firstEntry.isIntersecting && hasMore && !loading) {
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
    [hasMore, loading]
  );

  useEffect(() => {
    fetchData(page);
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

  useEffect(() => {
    setPage(1);
    setArtists([]);
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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClick = (id: string) => {
    navigate(`/artist/${id}`);
  };

  return (
    <Layout themeMode={themeMode} type={type}>
      <div className="flex justify-center mt-10">
        <div className="container">
          {!type && (
            <div className="md:mt-12 mt-10">
              <BreadCrumb />
            </div>
          )}
          <div className="md:mt-7 mt-3">
            <ContentTitle titleType="TOP HITS" title="Our Top Artists" />
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
            {loading && artists.length === 0 ? (
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
                {artists?.map((artist, idx) => (
                  <div
                    key={idx}
                    ref={idx === artists.length - 1 ? lastItemRef : null}
                    id={artist._id}
                    className="flex flex-col md:ml-4 ml-2 gap-1 md:gap-3 md:mt-20 mt-6 shadow-md rounded-2xl"
                    style={{ backgroundColor: themeMode ? "" : "#242526" }}
                  >
                    <div
                      className={`p-5 rounded-2xl ${hoveredCard === `${idx}` && (themeMode ? "artists-body" : "artists-body-dark")}`}
                      style={{ transition: "0.5s ease-in-out" }}
                      onMouseEnter={() => setHoveredCard(`${idx}`)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="flex items-start w-full">
                        <div onClick={() => handleClick(artist.id)}>
                          <Avatar
                            src={artist?.profileImg || avatar}
                            className="rounded-full object-cover w-28 md:w-[118px]"
                            size={{ base: "lg", md: "2xl" }}
                          />
                        </div>
                        <div className="flex flex-col md:ml-4 ml-2 gap-1 md:gap-3">
                          <div
                            className={`artist-name md:text-xl text-md ${!themeMode && "title-dark-color"}`}
                          >
                            {artist.name}
                          </div>
                          <div className="artist-description line-clamp-3">
                            {artist.description}
                          </div>
                        </div>
                      </div>
                      {artist?.products?.length > 0 && (
                        <div
                          className={`md:px-5 transition-all ease-in-out ${hoveredCard === idx.toString() ? "h-full" : "h-0 overflow-hidden"}`}
                        >
                          <ArtistsCarousel
                            cardNum={cardNum}
                            cardData={artist.products}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && artists.length > 0 && (
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

                {!hasMore && artists.length > 0 && (
                  <div className="text-center py-4 text-gray-500">
                    {`Showing ${artists.length} of ${paginationMeta.totalRecords} artists`}
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

export default ArtistMainPage;
