import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import React, { useState, useEffect, useRef } from "react";
import Arrow from "../../../Components/ArrowBtn/HorizontalArrowBtn";
import MaterialCard from "../../../Components/Card/MaterialCard2";
import "./style.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Swiper as SwiperInstance } from "swiper";
import { Navigation } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";
interface CarouselProps {
  cardNum: number;
  cardData: {
    title: string;
    category: string;
    img: string;
    date: string;
    location: string;
    youTube?: string | undefined;
  }[];
}

const ArtistsCarousel: React.FC<CarouselProps> = ({ cardNum, cardData }) => {
  const [showPagination, setShowPagination] = useState(window.innerWidth < 768);
  const [showNavigation, setShowNavigation] = useState(window.innerWidth >= 768);
  const [itemsPerRow, setItemsPerRow] = useState(3);
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  const [newLoaded, setNewLoaded] = useState(false);
  const [newSliderRef, newInstanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop: true,
    created() {
      setNewLoaded(true);
    },
  });

  useEffect(() => { }, [newInstanceRef, newLoaded]);

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

      // console.log("Width:", width, "ShowPagination:", showPagination);
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




  return (
    <div className="w-full">
      <div className="w-full relative mt-10">
        {cardNum && cardNum !== 1 && (
          <div className="flex mt-10 w-full">
            <Swiper
              onSwiper={(swiper: any) => (swiperRef.current = swiper)}
              onSlideChange={handleSlideChange}
              modules={[Navigation]}
              spaceBetween={16}
              slidesPerView={1}
              loop={true}>
              {[...Array(Math.ceil(cardData.length / cardNum))].map((_, idx) => (
                <SwiperSlide key={`carousel-grid-${idx}`}>
                  <div className={`grid grid-cols-${cardNum} gap-4 py-5`}>
                    {[...Array(cardNum)].map((_, index) => {
                      const item = cardData[idx * cardNum + index];
                      return (
                        item && (
                          <div key={`card-${index}`} className="w-full">
                            <MaterialCard
                              type="horizontal"
                              youTube={item.youTube ?? ""}
                              feature={item.category}
                              title={item.title.slice(0, 100)}
                              date={`${item.date}`.split("T")[0]}
                              location={item.location}
                            />
                          </div>
                        )
                      );
                    })}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Arrows */}
            {showNavigation && cardData.length > 4 && (
              <>
                {showPrevButton && (
                  <div className="absolute top-[46%] left-[-52px] transform -translate-y-1/2 z-10 hidden md:block">
                    <button onClick={handlePrev} className="swiper-button-prev">
                      <IoIosArrowBack className={`text-3xl text-gray-600  ${themeMode ? "hover:text:black" : "hover:text-white"}`} />
                    </button>
                  </div>
                )}
                {showNextButton && (
                  <div className="absolute top-[46%] right-[-52px] transform -translate-y-1/2 z-10 hidden md:block">
                    <button onClick={handleNext} className="swiper-button-next">
                      <IoIosArrowForward className={`text-3xl text-gray-600  ${themeMode ? "hover:text:black" : "hover:text-white"}`} />
                    </button>
                  </div>
                )}
              </>
            )}



          </div>
        )}
      </div>
      {/* Single Card Display */}
      {cardNum === 1 && (
        <div className="mt-4 w-full gap-3 flex-col flex">
          {cardData[0] && (
            <MaterialCard
              youTube={cardData[0].youTube ?? ""}
              type="vertical"
              feature={cardData[0].category}
              title={cardData[0].title}
              date={cardData[0].date}
              location={cardData[0].location}
            />
          )}
          {cardData[1] && (
            <MaterialCard
              youTube={cardData[0].youTube ?? ""}
              type="vertical"
              // img={cardData[1]?.img}
              feature={cardData[1].category}
              title={cardData[1].title}
              date={cardData[1].date}
              location={cardData[1].location}
            />
          )}
          {cardData[2] && (
            <MaterialCard
              youTube={cardData[0].youTube ?? ""}
              type="vertical"
              // img={cardData[1]?.img}
              feature={cardData[1].category}
              title={cardData[1].title}
              date={cardData[1].date}
              location={cardData[1].location}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ArtistsCarousel;
