import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DetailButton from "../../../Components/Buttons/DetailButton";
import ContentTitle from "../../../Components/ContentTitle";
import { apiBaseUrl } from "../../../Constant/config";
import MaterialCard from "../../../Components/Card/MaterialCard";
import { RootState } from "../../../reducers";
import { useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Swiper as SwiperInstance } from "swiper";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Navigation, Pagination, Grid } from "swiper/modules";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useToast, Spinner } from "@chakra-ui/react";

interface MaterialData {
  id: string;
  title: string;
  description: string;
  youTube: string;
  tags: string;
  date: string;
}

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

const MaterialContent: React.FC<{ filter: string }> = ({ filter }) => {
  const navigate = useNavigate();
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [type, setPropsType] = useState<boolean>(false);
  const [showPagination, setShowPagination] = useState(window.innerWidth < 768);
  const [showNavigation, setShowNavigation] = useState(
    window.innerWidth >= 768
  );
  const [itemsPerRow, setItemsPerRow] = useState(3);
  const [cardNum, setCardNum] = useState(window.innerWidth < 768 ? 1 : 3);
  const [filterText, setFilterText] = useState<string>("");
  const [cardData, setCardData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setCardNum(6); // Desktop: 3 columns × 2 rows
      } else if (width >= 768) {
        setCardNum(4); // Medium: 2 columns × 2 rows
      } else {
        setCardNum(5); // Small: 1 column × 5 items (showing 5 items total)
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const updateUI = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setItemsPerRow(3); // Desktop: 3 columns
        setShowNavigation(true);
        setShowPagination(false);
      } else if (width >= 768) {
        setItemsPerRow(2); // Medium: 2 columns
        setShowNavigation(true);
        setShowPagination(false);
      } else {
        setItemsPerRow(1); // Small: 1 column
        setShowNavigation(false);
        setShowPagination(true);
      }
    };

    updateUI();
    window.addEventListener("resize", updateUI);
    return () => window.removeEventListener("resize", updateUI);
  }, [showPagination]);

  const fetchPlaylists = async (page: number, append: boolean = false) => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const result = await fetch(
        `${apiBaseUrl}/playlist?page=${page}&limit=${cardNum * 2}`
      );
      const data = await result.json();
      const mappedData = data.data.map((item: any) => ({
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

      setCardData((prev) => (append ? [...prev, ...mappedData] : mappedData));
      setTotalPages(data.totalPages);
      setCurrentPage(page);
      setHasMore(page < data.totalPages);
    } catch (error: any) {
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

  useEffect(() => {
    fetchPlaylists(1, false);
  }, [cardNum]);

  const swiperRef = useRef<SwiperClass | null>(null);
  const [showPrevButton, setShowPrevButton] = useState<boolean>(false);
  const [showNextButton, setShowNextButton] = useState<boolean>(true);

  const handleSlideChange = () => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      const isFirstSlide = swiper.activeIndex === 0;
      const isLastSlide = swiper.isEnd;

      setShowPrevButton(!isFirstSlide);
      setShowNextButton(!isLastSlide);

      // Load more data when reaching near the end
      if (swiper.progress > 0.7 && hasMore && !loading) {
        fetchPlaylists(currentPage + 1, true);
      }
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
      if (hasMore && !loading && swiperRef.current.progress > 0.7) {
        fetchPlaylists(currentPage + 1, true);
      }
    }
  };

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  return (
    <div className="flex justify-center">
      <div className="container md:mt-36 md:pt-1.5 mt-20">
        <div className="flex justify-between">
          <ContentTitle titleType="VIDEOS" title="Materials" />
          <div className="flex items-end">
            <div className="md:block hidden">
              <DetailButton
                text="See All Videos"
                btnType="web"
                onClick={() => navigate("/materials")}
              />
            </div>
          </div>
        </div>

        <div className="w-full relative mt-10">
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 rounded-lg">
              <div
                className={`p-6 rounded-lg ${themeMode ? "bg-white" : "bg-gray-800"} shadow-lg flex flex-col items-center gap-3`}
              >
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor={themeMode ? "gray.200" : "gray.600"}
                  color={themeMode ? "#5A1073" : "#2FC4B2"}
                  size="xl"
                />
                <span
                  className={`text-sm font-medium ${themeMode ? "text-gray-800" : "text-gray-200"}`}
                >
                  Loading more videos...
                </span>
              </div>
            </div>
          )}

          <div className="relative group">
            <Swiper
              onSwiper={(swiper: any) => (swiperRef.current = swiper)}
              onSlideChange={handleSlideChange}
              onReachEnd={() => {
                if (hasMore && !loading) {
                  fetchPlaylists(currentPage + 1, true);
                }
              }}
              pagination={showPagination ? { clickable: true } : false}
              slidesPerView={3}
              slidesPerGroup={1}
              grid={{
                rows: 2,
                fill: "row",
              }}
              spaceBetween={20}
              loop={false}
              modules={[Navigation, Pagination, Grid]}
              breakpoints={{
                1024: {
                  slidesPerView: 3,
                  slidesPerGroup: 1,
                  grid: { rows: 2, fill: "row" },
                },
                768: {
                  slidesPerView: 2,
                  slidesPerGroup: 1,
                  grid: { rows: 2, fill: "row" },
                },
                320: {
                  slidesPerView: 1,
                  slidesPerGroup: 1,
                  grid: { rows: 5, fill: "row" },
                },
              }}
              className="news-carousel"
            >
              {cardData.map((item, index) => (
                <SwiperSlide key={index} className="h-auto">
                  <div className="h-full p-2">
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
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons */}
            {showNavigation && (
              <>
                <button
                  onClick={handlePrev}
                  className={`absolute top-1/2 -left-12 transform -translate-y-1/2 z-10 hidden md:block transition-opacity duration-300 ${!showPrevButton ? "opacity-0" : "opacity-100"}`}
                  disabled={!showPrevButton || loading}
                >
                  <IoIosArrowBack
                    className={`text-4xl ${themeMode ? "text-gray-600 hover:text-black" : "text-gray-400 hover:text-white"}`}
                  />
                </button>
                <button
                  onClick={handleNext}
                  className={`absolute top-1/2 -right-12 transform -translate-y-1/2 z-10 hidden md:block transition-opacity duration-300 ${!hasMore && swiperRef.current?.isEnd ? "opacity-0" : "opacity-100"}`}
                  disabled={loading}
                >
                  <IoIosArrowForward
                    className={`text-4xl ${themeMode ? "text-gray-600 hover:text-black" : "text-gray-400 hover:text-white"}`}
                  />
                </button>
              </>
            )}
          </div>

          {/* Pagination for mobile */}
          {showPagination && (
            <div
              className={`flex justify-center mt-4 !relative !bottom-0 ${themeMode ? "swiper-pagination" : "dark-swiper-pagination"}`}
            />
          )}
        </div>
        <div className="md:hidden block mt-4">
          <button
            className={`text-sm p-4 font-semibold text-[#5A1073] flex gap-2 items-center w-full text-center justify-center rounded-lg ${themeMode ? "bg-[#EFE7F1]" : "bg-[#2FC4B2]"}`}
            onClick={() => navigate("/playlist")}
            disabled={loading}
          >
            See All Videos
            <AiOutlineArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialContent;
