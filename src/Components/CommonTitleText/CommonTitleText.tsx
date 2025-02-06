import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import ProductCard1 from "../Card/ProductCard1";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperInstance } from "swiper";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

type IProps = {
  title: string;
  data:any
};

const CommonTitleText: React.FC<IProps> = ({ title,data }) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);


  // Swiper reference
  const swiperRef = useRef<SwiperInstance | null>(null);

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

  return (
    <div className="mt-12 relative">
      <h2
        className="text-xl font-semibold"
        style={{ color: themeMode ? "#252733" : "#FFF" }}
      >
        {title}
      </h2>

      <div className="w-full mt-10 relative">
        {/* Swiper Component */}
        <Swiper
          onSwiper={(swiper:any) => (swiperRef.current = swiper)}
          slidesPerView={4}
          spaceBetween={30}
          loop={true}
          // pagination={{ clickable: true }}
          breakpoints={{
            1200: { slidesPerView: 3 },
            900: { slidesPerView: 2 },
            600: { slidesPerView: 1 },
          }}
        >
          {data.map((item:any) => (
            <SwiperSlide key={item._id}>
              <ProductCard1
                type="vertical"
                img={item?.files?.[0] || ""}
                tags={item.tags || ""}
                title={item.title || ""}
                date={item.date ? item.date.split("T")[0] : ""}
                _id={item._id}
              />
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
  );
};

export default CommonTitleText;
