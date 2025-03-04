import React, { useState, useEffect, useRef } from "react";
import ContentTitle from "../../../Components/ContentTitle";
import DetailButton from "../../../Components/Buttons/DetailButton";
import { apiBaseUrl } from "../../../Constant/config";
import { useNavigate } from "react-router-dom";
import ProductCard1 from "../../../Components/Card/ProductCard1";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Swiper as SwiperInstance } from "swiper";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Navigation, Pagination } from "swiper/modules";
import { Button } from "@mui/material";
import { AiOutlineArrowRight } from "react-icons/ai";
import { text } from 'stream/consumers';

interface Product {
  id: string;
  title: string;
  description: string;
  youTube?: string;
  tags: string;
  date: string;
  files?: string[];
}

interface CartInterface {
  news: Product[];
  totalNews: number;
  totalPages: number;
  currentPage: number;
  success: boolean;
}

const NewsContent: React.FC<{ filterText: string }> = ({ filterText }) => {
  // const [cardNum, setCardNum] = useState<number>(3);
  const [cardData, setCardData] = useState<CartInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  // const swiperRef = useRef<SwiperInstance | null>(null);
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [showPagination, setShowPagination] = useState(window.innerWidth < 768);
  const [showNavigation, setShowNavigation] = useState(window.innerWidth >= 768);
  const [itemsPerRow, setItemsPerRow] = useState(3);
  const [cardNum, setCardNum] = useState(window.innerWidth < 768 ? 1 : 3);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setCardData(null);

        const response = await fetch(`${apiBaseUrl}/news/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }

        const data = await response.json();
        if (data?.news?.length) {
          setCardData(data);
        } else {
          console.warn("No news available in the API response");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

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


  // function handlePlay(youTube: any): void {
  //   throw new Error("Function not implemented.");
  // }

  return cardData && cardData.news.length > 0 ? (
    <div className="flex justify-center">
      <div className="container md:mt-36 mt-20 md:pt-1.5">
        <div className="flex justify-between mb-10">
          <ContentTitle titleType="NEWS" title="Top News Of The Day" />
          <div className="flex items-end">
            <div className="md:block hidden">
              <DetailButton
                text="See All News"
                btnType="web"
                onClick={() => navigate("/news")}
              />
            </div>
          </div>
        </div>
        <div className="w-full relative">
          <Swiper
            onSwiper={(swiper: any) => (swiperRef.current = swiper)}
            onSlideChange={handleSlideChange}
            pagination={showPagination ? { clickable: true } : false} // ✅
            slidesPerView={3}
            slidesPerGroup={2}
            spaceBetween={20}
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
            {cardData?.news
              .reduce<Product[][]>((rows, item, index) => {
                const rowIndex = Math.floor(index / itemsPerRow);
                if (!rows[rowIndex]) rows[rowIndex] = [];
                rows[rowIndex].push(item);
                return rows;
              }, [])
              .map((row, rowIndex) => (
                <SwiperSlide key={rowIndex} className="md:mb-16 mb-8 md:p-4">
                  <div className="grid grid-cols-1 gap-5">
                    {row.map((item, index) => (
                      <div key={index}>
                        <ProductCard1
                          type="vertical"
                          img={item.files && item.files[0]}
                          tags={item.tags}
                          title={item.title}
                          date={item.date}
                          _id={item.id}
                        />
                      </div>
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
            onClick={() => navigate("/news")}
          >
            See All News
            <AiOutlineArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  ) : loading ? (
    <div
      className="flex justify-center items-center h-screen w-full"
      style={{ backgroundColor: themeMode ? "white" : "black" }}
    >
      <p
        className="text-xl font-semibold"
        style={{ color: themeMode ? "black" : "white" }}
      >
        Loading...
      </p>
      <div
        className="w-6 h-6 ml-2 border-4 border-t-transparent rounded-full animate-spin"
        style={{
          borderRightColor: themeMode ? "#5A1073" : "#2FC4B2",
          borderBottomColor: themeMode ? "#5A1073" : "#2FC4B2",
          borderLeftColor: themeMode ? "#5A1073" : "#2FC4B2",
        }} >
      </div>
    </div>
  ) : (
    <div>No news available</div>
  );
};

export default NewsContent;
