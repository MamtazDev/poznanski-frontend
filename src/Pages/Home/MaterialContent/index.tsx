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
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperInstance } from "swiper";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
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

const MaterialContent: React.FC<{ filter: string }> = ({ filter }) => {
  const [cardNum, setCardNum] = useState<number>(3);
  const [cardData, setCardData] = useState<CartInterface | null>(null); // Set type to CartInterface or null
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const swiperRef = useRef<SwiperInstance | null>(null);
  useEffect(() => {
    setLoading(true);
    setCardData(null); // Reset previous data

    fetch(`${apiBaseUrl}/materials`)
      .then((res) => res.json())
      .then((data) => {
        setCardData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching materials:", error);
        setLoading(false);
      });
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
  return cardData && cardData.materials.length ? (
    <div className="flex justify-center">
      <div className="container md:mt-36 md:pt-1.5 mt-20">
        <div className="flex justify-between">
          <ContentTitle titleType="VIDEOS" title="Materials" />
          <div className="flex items-end">
            <div className="md:block hidden">
              <DetailButton
                text="See All Videos"
                btnType="web"
                onClick={() => navigate("/material")}
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
            {cardData.materials.reduce<any[][]>((rows, item, index) => {
              const rowIndex = Math.floor(index / 2);
              if (!rows[rowIndex]) rows[rowIndex] = [];
              rows[rowIndex].push(item);
              return rows;
            }, []).map((row, rowIndex) => (
              <SwiperSlide key={rowIndex}>
                <div className="grid grid-cols-1 gap-5">
                  {row.map((item) => (
                    <div key={item.id} >
                     <MaterialCard
                key={item.id}
                id={item.id}
                type="horizontal" // Or "vertical" based on your preference
                video={item.youTube}
                data={item}
                feature={item.tags} // Joining tags if you want to display them as a string
                title={item.title}
                date={item.date}
                link={item.youTube}
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
  ) : (
    <div>
  {loading ? (
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
    <p>No data available</p>
  )}
</div>

  );
};

export default MaterialContent;
