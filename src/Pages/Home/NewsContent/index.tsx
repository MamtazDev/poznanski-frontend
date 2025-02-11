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
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperInstance } from "swiper";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

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
  const [cardNum, setCardNum] = useState<number>(3);
  const [cardData, setCardData] = useState<CartInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const swiperRef = useRef<SwiperInstance | null>(null);
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

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

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  function handlePlay(youTube: any): void {
    throw new Error("Function not implemented.");
  }

  return cardData && cardData.news.length > 0 ? (
    <div className="flex justify-center">
      <div className="container md:mt-36 mt-20 md:pt-1.5">
        <div className="flex justify-between">
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
        <div className="w-full mt-10 relative">
          <Swiper
            onSwiper={(swiper: any) => (swiperRef.current = swiper)}
            slidesPerView={3}
            slidesPerGroup={2}
            spaceBetween={20}
            loop={false}
            navigation={true}
            breakpoints={{
              1440: { slidesPerView: 3, slidesPerGroup: 2 },
              1024: { slidesPerView: 3, slidesPerGroup: 3 },
              768: { slidesPerView: 2, slidesPerGroup: 2 },
              425: { slidesPerView: 1, slidesPerGroup: 1 },
            }}
          >
            {cardData?.news.reduce<Product[][]>((rows, item, index) => {
              const rowIndex = Math.floor(index / 2);
              if (!rows[rowIndex]) rows[rowIndex] = [];
              rows[rowIndex].push(item);
              return rows;
            }, []).map((row, rowIndex) => (
              <SwiperSlide key={rowIndex}>
                <div className="flex flex-col gap-5">
                  {row.map((item) => (
                    <div key={item.id} >
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

          {/* Custom Navigation Buttons */}
          <div className="absolute top-1/2 left-[-40px] transform -translate-y-1/2 z-10">
            <button onClick={handlePrev} className="swiper-button-prev">
              <IoIosArrowBack className="text-3xl text-gray-600 hover:text-black" />
            </button>
          </div>

          <div className="absolute top-1/2 right-[-40px] transform -translate-y-1/2 z-10">
            <button onClick={handleNext} className="swiper-button-next">
              <IoIosArrowForward className="text-3xl text-gray-600 hover:text-black" />
            </button>
          </div>
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
        }}
      ></div>
    </div>
  ) : (
    <div>No news available</div>
  );
};

export default NewsContent;
