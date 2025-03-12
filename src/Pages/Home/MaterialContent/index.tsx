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
import { Navigation, Pagination, Grid } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useToast, Spinner } from "@chakra-ui/react";

interface Product {
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
  const toast = useToast();
  const swiperRef = useRef<SwiperClass | null>(null);

  const [cardData, setCardData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [cardNum, setCardNum] = useState(6); // Default for desktop
  const [showPagination, setShowPagination] = useState(false);
  const [showNavigation, setShowNavigation] = useState(true);

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setCardNum(6); // 3 columns × 2 rows
        setShowNavigation(true);
        setShowPagination(false);
      } else if (width >= 768) {
        setCardNum(4); // 2 columns × 2 rows
        setShowNavigation(true);
        setShowPagination(false);
      } else {
        setCardNum(5); // 1 column × 5 rows
        setShowNavigation(false);
        setShowPagination(true);
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const fetchPlaylists = async (page: number, append: boolean = false) => {
    if (!hasMore || loading) return;
    setLoading(true);

    try {
      const result = await fetch(
        `${apiBaseUrl}/playlist?page=${page}&limit=12`
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
  }, []);

  const [showNext, setShowNext] = useState(true);
  const [showPrev, setShowPrev] = useState(false);

  const handleSlideChange = () => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      setShowPrev(!swiper.isBeginning);
      setShowNext(!swiper.isEnd);

      // console.log("isBeginning", swiper.isBeginning, "isEnd", swiper.isEnd);
      // console.log("progress", swiper.progress);
      // Fetch only when moving forward
      if (swiper.progress > 0.7 && hasMore && !loading) {
        fetchPlaylists(currentPage + 1, true);
      }
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
      setShowPrev(true); // Always show Prev when moving forward

      if (hasMore && !loading) {
        fetchPlaylists(currentPage + 1, true);
      }
    }
  };

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
      setShowNext(true); // Ensure Next button is visible when going back
    }
  };

  return (
    <div className="flex justify-center">
      <div className="container md:mt-20 mt-10">
        <div className="flex justify-between">
          <ContentTitle titleType="VIDEOS" title="Materials" />
          <div className="md:block hidden">
            <DetailButton
              text="See All Videos"
              btnType="web"
              onClick={() => navigate("/playlist")}
            />
          </div>
        </div>

        <div className="w-full relative md:mt-10 mt-5">
          <div className="relative group">
            <Swiper
              onSwiper={(swiper: any) => (swiperRef.current = swiper)}
              onSlideChange={handleSlideChange}
              pagination={showPagination ? { clickable: true } : false}
              slidesPerView={cardNum / 2}
              slidesPerGroup={1}
              grid={{ rows: cardNum / 3, fill: "row" }}
              spaceBetween={10}
              loop={false}
              modules={[Navigation, Pagination, Grid]}
              breakpoints={{
                1024: { slidesPerView: 3, grid: { rows: 2, fill: "row" } },
                768: { slidesPerView: 2, grid: { rows: 2, fill: "row" } },
                320: { slidesPerView: 1, grid: { rows: 5, fill: "row" } },
              }}
              className="material-news-carousel"
            >
              {cardData.map((item, index) => (
                <SwiperSlide key={index} >
                  <div className="p-2">
                    <MaterialCard
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

              {loading && (
                <div className="absolute  inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <Spinner size="xl" color="purple.500" />
                </div>
              )}
            </Swiper>

            <>
              <div className="absolute top-[46%] left-[-52px] transform -translate-y-1/2 z-10 hidden md:block">
                <button onClick={handlePrev} className="swiper-button-prev">
                  <IoIosArrowBack
                    className={`text-3xl text-gray-600  ${themeMode ? "hover:text:black" : "hover:text-white"}`}
                  />
                </button>
              </div>

              <div className="absolute top-[46%] right-[-52px] transform -translate-y-1/2 z-10 hidden md:block">
                <button onClick={handleNext} className="swiper-button-next">
                  <IoIosArrowForward
                    className={`text-3xl text-gray-600  ${themeMode ? "hover:text:black" : "hover:text-white"}`}
                  />
                </button>
              </div>
            </>
          </div>
        </div>

        <div className="md:hidden block">
          <button
            className={`text-sm p-4 font-semibold text-[#5A1073] flex gap-2 items-center w-full text-center justify-center rounded-lg ${themeMode ? "bg-[#EFE7F1]" : "bg-[#2FC4B2]"}`}
            onClick={() => navigate("/playlist")}
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
