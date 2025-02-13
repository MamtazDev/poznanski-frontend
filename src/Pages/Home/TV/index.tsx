import React, { useState, useEffect, useRef } from "react";
import ContentTitle from "../../../Components/ContentTitle";
import DetailButton from "../../../Components/Buttons/DetailButton";
import CarouselComponent from "./Carousel";
import { apiBaseUrl, fileUrl } from "../../../Constant/config";
import { useNavigate } from "react-router-dom";
import "./style.css";
import TVCard from "../../../Components/Card/TVCard";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperInstance } from "swiper";
interface TVData {
  youTube: string | undefined;
  artists: any;
  _id: unknown;
  id: string;
  title: string;
  feature: string;
  img: string;
  link: string;
}

interface inputData {
  _id: string;
  title: string;
  category: string;
  img: string;
  link: string;
}
export interface filterProperties {
  sort: string,
  quantity: number,
  startDate: string,
  endDate: string,
  order: string,
  search: string | undefined
}
interface TVData {
  youTube: string | undefined;
  artists: any;
  _id: unknown;
  id: string;
  title: string;
  feature: string;
  img: string;
  link: string;
}

interface CardData {
  radio: TVData[];
}


const TV: React.FC<{ filter: string }> = ({ filter }) => {
  const [cardNum, setCardNum] = useState<number>(4);
  const [cardData, setCardData] = useState<TVData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const swiperRef = useRef<SwiperInstance | null>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     let url = `${apiBaseUrl}/radio`;
  //     let searchQuery = [];

  //     if (filter) {
  //       searchQuery.push(`search=${encodeURIComponent(filter)}`);
  //     }

  //     if (searchQuery.length > 0) {
  //       url = `${url}?${searchQuery.join("&")}`;
  //     }

  //     try {
  //       const response = await fetch(url);
  //       const data = await response.json();

  //       if (!data || !Array.isArray(data.records)) {
  //         // console.error("Invalid API response: ", data);
  //         setLoading(false);
  //         return;
  //       }

  //       const newData: TVData[] = data.records.map((item: inputData) => ({
  //         id: item._id,
  //         title: item.category,
  //         feature: item.title,
  //         img: fileUrl + item.img,
  //         link: item.link,
  //       }));

  //       setCardData(newData);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [filter]);

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth < 1024) {
  //       setCardNum(3);
  //       if (window.innerWidth < 768) setCardNum(1);
  //     } else {
  //       setCardNum(4);
  //     }
  //   };
  //   handleResize();

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  const fetchData = async (inputValue?: filterProperties) => {
    setLoading(true);
    let url = `${apiBaseUrl}/radio`; // Default URL
    // Building the query string based on available filter properties
    let searchQuery = [];

    if (inputValue?.search) {
      searchQuery.push(`search=${encodeURIComponent(inputValue.search)}`);
    }

    if (inputValue?.sort) {
      searchQuery.push(`order=${encodeURIComponent(inputValue.sort)}`);
    }

    if (inputValue?.quantity) {
      searchQuery.push(`limit=${inputValue.quantity}`);
    }

    if (inputValue?.startDate) {
      searchQuery.push(`startDate=${encodeURIComponent(inputValue.startDate)}`);
    }

    if (inputValue?.endDate) {
      searchQuery.push(`endDate=${encodeURIComponent(inputValue.endDate)}`);
    }

    // if (inputValue?.order) {
    //   searchQuery.push(`order=${encodeURIComponent(inputValue.order)}`);
    // }

    // If there are query parameters, append them to the URL
    if (searchQuery.length > 0) {
      url = `${url}?${searchQuery.join('&')}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setCardData(data.records);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
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
  return (
    <div className="flex justify-center">
      <div className="container md:mt-36 md:pt-1.5 mt-20">
        <div className="flex justify-between">
          <ContentTitle titleType="TOP HITS" title="TV/Radio" />
          <div className="flex items-end">
            <div className="md:block hidden">
              <DetailButton
                text="See All Music"
                btnType="web"
                onClick={() => navigate("/radio")}
              />
            </div>
          </div>
        </div>

        {/* <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-5 mb-16`}
        >
          {cardData.length > 0 ? cardData.map((item, index) => (
            <div key={index} className="w-full">
              <TVCard
                data={item}
                id={item._id}
                video=""
                youTube={item.youTube}
                feature={item.title}
                title={item.artists?.[0]?.name || "Unknown Artist"}
                link={item.link}
              />
            </div>
          )) : <p className="text-blue-500 text-5xl py-3 text-center">There is no data</p>}
        </div> */}

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
            {cardData?.reduce<TVData[][]>((rows: TVData[][], item: TVData, index: number) => {
              const rowIndex = Math.floor(index / 2);
              if (!rows[rowIndex]) rows[rowIndex] = [];
              rows[rowIndex].push(item);
              return rows;
            }, []).map((row:any, rowIndex:any) => (
              <SwiperSlide key={rowIndex}>
                <div className="grid grid-cols-1 gap-5">
                  {row.map((item:any) => (
                    <div key={item.id}>
                      <TVCard
                        data={item}
                        id={item._id}
                        video=""
                        youTube={item.youTube}
                        feature={item.title}
                        title={item.artists?.[0]?.name || "Unknown Artist"}
                        link={item.link}
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
  )
};

export default TV;
