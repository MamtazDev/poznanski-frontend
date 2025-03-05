import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DetailButton from "../../../Components/Buttons/DetailButton";
import ContentTitle from "../../../Components/ContentTitle";
import { apiBaseUrl } from "../../../Constant/config";
import MaterialCard from "../../../Components/Card/MaterialCard";
import { RootState } from "../../../reducers";
import { useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Swiper as SwiperInstance } from "swiper";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Navigation, Pagination } from "swiper/modules";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useToast } from "@chakra-ui/react";
interface MaterialData {
  id: string;
  title: string;
  description: string;
  youTube: string;
  tags: string;
  date: string;
}

interface CartInterface {
  materials: MaterialData[];
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
  // const [cardNum, setCardNum] = useState<number>(3);
  // const [cardData, setCardData] = useState<CartInterface | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [type, setPropsType] = useState<boolean>(false);
  const [showPagination, setShowPagination] = useState(window.innerWidth < 768);
  const [showNavigation, setShowNavigation] = useState(window.innerWidth >= 768);
  const [itemsPerRow, setItemsPerRow] = useState(3);
  const [cardNum, setCardNum] = useState(window.innerWidth < 768 ? 1 : 3);
  const [filterText, setFilterText] = useState<string>("");
  const [cardData, setCardData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const toast = useToast();

  // useEffect(() => {
  //   setLoading(true);
  //   setCardData(null); // Reset previous data

  //   fetch(`${apiBaseUrl}/playlist`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data, "playlost")
  //       setCardData(data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching materials:", error);
  //       setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCardNum(2);
        if (window.innerWidth < 768) setCardNum(1);
      } else {
        setCardNum(3);
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

      if (width >= 1480) {
        setItemsPerRow(2);
        setShowNavigation(true);
        setShowPagination(false);
      } else if (width >= 768) {
        setItemsPerRow(2);
        setShowNavigation(true);
        setShowPagination(false);
      } else {
        setItemsPerRow(5);
        setShowNavigation(false);
        setShowPagination(true);
      }

      console.log("Width:", width, "ShowPagination:", showPagination);
    };

    updateUI();
    window.addEventListener("resize", updateUI);
    return () => window.removeEventListener("resize", updateUI);
  }, [showPagination]);



  const fetchPlaylists = async (page: number) => {
    setLoading(true);
    try {
      const result = await fetch(`${apiBaseUrl}/playlist?page=${page}&limit=10`);
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
      setCardData(mappedData);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
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
    fetchPlaylists(currentPage);
  }, [currentPage]);


  const swiperRef = useRef<SwiperClass | null>(null);
  const [showPrevButton, setShowPrevButton] = useState<boolean>(false);
  const [showNextButton, setShowNextButton] = useState<boolean>(true);


  const handleSlideChange = () => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;

      const slidesPerView = Array.isArray(swiper.params.slidesPerView)
        ? swiper.params.slidesPerView[0] || 1
        : swiper.params.slidesPerView || 1;

      const isFirstSlide = swiper.activeIndex === 0;
      const isLastSlide = swiper.activeIndex >= swiper.slides.length - slidesPerView;

      setShowPrevButton(!isFirstSlide);
      setShowNextButton(!isLastSlide);
    }
  };

  const handleNext = () => swiperRef.current?.slideNext();
  const handlePrev = () => swiperRef.current?.slidePrev();

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
          <Swiper
            onSwiper={(swiper: any) => (swiperRef.current = swiper)}
            onSlideChange={handleSlideChange}
            pagination={showPagination ? { clickable: true } : false} // ✅
            slidesPerView={3}
            slidesPerGroup={2}
            spaceBetween={10}
            loop={false}
            navigation={showNavigation}
            modules={[Navigation, Pagination]}
            breakpoints={{
              1440: { slidesPerView: 3, slidesPerGroup: 2 },
              1024: { slidesPerView: 3, slidesPerGroup: 3 },
              768: { slidesPerView: 2, slidesPerGroup: 2 },
              425: { slidesPerView: 1, slidesPerGroup: 1 },
            }}
            className="news-carousel"
          >
              {cardData?.reduce<any[][]>((rows, item, index) => {
                  const rowIndex = Math.floor(index / itemsPerRow);
                  if (!rows[rowIndex]) rows[rowIndex] = [];
                  rows[rowIndex].push(item);
                  return rows;
                }, [])
                .map((row, rowIndex) => (
                  <SwiperSlide key={rowIndex} className="md:mb-16 mb-8 md:p-4">
                    <div className="grid grid-cols-1 gap-6">
                      {row.map((item, index) => (
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
                      ))}
                    </div>
                  </SwiperSlide>
                ))}
          </Swiper>

          {/* Pagination Dots - Only visible on mobile */}
          {showPagination && (
            <div className={` flex justify-center mt-4 !relative !bottom-0
              ${themeMode ? "swiper-pagination" : "dark-swiper-pagination"}`}
            ></div>
          )}

          {/* Custom Navigation Buttons - Hidden on Mobile */}
          {showNavigation && (
            <>
              {showPrevButton && (
               <div className="absolute top-[46%] left-[-52px] transform -translate-y-1/2 z-10 hidden md:block">
               <button onClick={handlePrev} className="swiper-button-prev">
                 <IoIosArrowBack className={`text-3xl text-gray-600  ${themeMode? "hover:text:black":"hover:text-white"}`} />
               </button>
               </div>
              )}
              {showNextButton && (
                <div className="absolute top-[46%] right-[-52px] transform -translate-y-1/2 z-10 hidden md:block">
                <button onClick={handleNext} className="swiper-button-next">
                  <IoIosArrowForward className={`text-3xl text-gray-600  ${themeMode? "hover:text:black":"hover:text-white"}`} />
                </button>
                </div>
              )}
            </>
          )}
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
  )

};

export default MaterialContent;
