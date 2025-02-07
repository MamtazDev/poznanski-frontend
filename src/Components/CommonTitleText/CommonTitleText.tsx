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
import { IoLocationOutline } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import { BsCalendar2Date } from "react-icons/bs";
import singer from "../../assets/svg/artists1.svg"
import { useDispatch } from "react-redux";
import { openPlayer } from "../../reducers/PlayerReducer";
import { useNavigate } from "react-router-dom";

type Song = {
  youTube?: string;
};

type IProps = {
  headTitle: string;
  data: { _id: string; title?: string; location?: string; tags?: string; date?: string; songs?: Song[] }[];

};

type Product = {
  _id: string;
  title?: string;
  location?: string;
  tags?: string;
  date?: string;
  songs?: Song[];
};

const fetcher = async (url: string): Promise<any> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch data");
  return response.json();
};

const CommonTitleText: React.FC<IProps> = ({ data = [], headTitle }) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    console.log(id);
    navigate(`/${id}`);

  };
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

  const dispatch = useDispatch();


  const getYouTubeID = (url: string) => {
    if (!url) {
        console.error("YouTube URL is invalid or missing.");
        return ""; // or return null, based on your logic
    }

    let videoId = "";
    if (url.includes("youtube.com/watch")) {
        videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
    }
    return videoId;
};


  const handlePlay = (youTube?: string) => {
    if (!youTube) {
        console.error("YouTube URL is missing.");
        return;
    }
    const videoId = getYouTubeID(youTube);
    if (!videoId) {
        console.error("Invalid YouTube video ID.");
        return;
    }
    dispatch(openPlayer(videoId));
};


    if (!Array.isArray(data)) {
      console.error("Expected an array, received:", data);
      return <p>No data available</p>;
    }
  return (
    <div className="mt-12 relative">
      <h2
        className="text-xl font-semibold"
        style={{ color: themeMode ? "#252733" : "#FFF" }}
      >
        {headTitle}
      </h2>
      <div className="w-full mt-10 relative">
        {/* Swiper Component */}
        <Swiper
          onSwiper={(swiper: any) => (swiperRef.current = swiper)}
          slidesPerView={4}
          spaceBetween={30}
          loop={true}
          // pagination={{ clickable: true }}
          breakpoints={{
            1440: { slidesPerView: 4 },
            1024: { slidesPerView: 3 },
            768: { slidesPerView: 2 },
            425: { slidesPerView: 1 },
            375: { slidesPerView: 1 },
          }}
        >
          {data.map((item: any) => (
            <SwiperSlide
              key={item._id}
            >

              <div className='p-5 rounded-3xl mt-6'
            onClick={() => handleClick(item._id)}
                style={{
                  backgroundColor: themeMode ? "#FFF" : "#242526",
                  color: themeMode ? "black" : "#fff",
                  borderRadius: "25px",
                  border: `2px solid ${themeMode ? "#f8f8ff" : "#242526"}`
                }}>

                <div
                  className={`relative bg-gray-100 cursor-pointer h-48 rounded-md overflow-hidden ${!themeMode && "dark-bg-color"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay(item.songs?.[0]?.youTube);
                    }}
                >
                  {/* YouTube Thumbnail */}
                  <img
                    src={`https://img.youtube.com/vi/${getYouTubeID(item.songs[0]?.youTube)}/hqdefault.jpg`}
                    className="w-full h-full object-cover"
                    alt="YouTube Thumbnail"
                  />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {themeMode ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="58"
                        height="57"
                        viewBox="0 0 58 57"
                        fill="none"
                      >
                        <circle cx="29" cy="28.5" r="28" fill="#5A1073" />
                        <path
                          d="M22.6 17.3L41.8 28.8L22.2 39.6L22.6 17.3Z"
                          fill="white"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="55"
                        height="55"
                        viewBox="0 0 55 55"
                        fill="none"
                      >
                        <circle cx="27.5" cy="27.5" r="27.5" fill="#2FC4B2" />
                        <path
                          d="M20.8 16L39.3 27.1L20.5 37.5L20.8 16Z"
                          fill="#111217"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                {
                  item.tags && <>
                  </>
                }
                <button className='py-1 px-5 text-center rounded-full font-semibold mt-4'
                  style={{
                    backgroundColor: themeMode ? "#E8ECFE" : "#3BD6C6",
                    color: themeMode ? "#5A1073" : "#5A1073"
                  }}>{item.tags}</button>
                {
                  item.title && <>
                    <p className='mt-2 text-lg font-semibold' >{item.title}</p>
                  </>
                }

                <div className='space-y-2'>
                  {
                    item.location && <>
                      <p className='flex gap-1 items-center' style={{
                        color: themeMode ? "#9B9CA1" : "#9B9CA1"
                      }}><IoLocationOutline /> {item.location}</p>
                      <GoDotFill style={{ color: themeMode ? "#D9D9D9" : "D9D9D9", }} />
                    </>
                  }
                  {item.date && <>
                    <p className='flex gap-1 items-center' style={{
                      color: themeMode ? "#9B9CA1" : "#9B9CA1"
                    }}><BsCalendar2Date />{item.date}</p>
                  </>}
                </div>
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
  );
};

export default CommonTitleText;
