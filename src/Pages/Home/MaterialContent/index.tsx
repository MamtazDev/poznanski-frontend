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
  const swiperRef = useRef<SwiperInstance | null>(null);
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


  const handleNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
  };

  const handlePrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };



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
            {/* {cardData?.materials
              .reduce<any[][]>((rows:any, item:any, index:any) => {
                const rowIndex = Math.floor(index / itemsPerRow);
                if (!rows[rowIndex]) rows[rowIndex] = [];
                rows[rowIndex].push(item);
                return rows;
              }, [])
              .map((row, rowIndex) => (
                <SwiperSlide key={rowIndex} className="md:mb-16 mb-8">
                   <div className="grid grid-cols-1 gap-5">
                    {row.map((item, index) => (
                      <div key={index}>
                        <MaterialCard
                          key={item.id}
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
              ))} */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-5">
              {cardData?.reduce<any[][]>((rows, item, index) => {
                  const rowIndex = Math.floor(index / itemsPerRow);
                  if (!rows[rowIndex]) rows[rowIndex] = [];
                  rows[rowIndex].push(item);
                  return rows;
                }, [])
                .map((row, rowIndex) => (
                  <SwiperSlide key={rowIndex} className="md:mb-16 mb-8">
                    <div className="grid grid-cols-1 gap-5">
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

            </div>

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
              <div className="absolute top-1/2 left-[-40px] transform -translate-y-1/2 z-10 hidden md:block">
                <button onClick={handlePrev} className="swiper-button-prev">
                  <IoIosArrowBack className="text-3xl text-gray-600 hover:text-black" />
                </button>
              </div>

              <div className="absolute top-1/2 right-[-40px] transform -translate-y-1/2 z-10 hidden md:block">
                <button onClick={handleNext} className="swiper-button-next">
                  <IoIosArrowForward className="text-3xl text-gray-600 hover:text-black" />
                </button>
              </div>
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
