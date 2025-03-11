import { Button, Image, Select, Spinner } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../../reducers';
import ContentTitle from '../../../Components/ContentTitle';
import FilterInput from '../../../Components/FilterInput';
import { apiBaseUrl } from '../../../Constant/config';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import playIcon from "../../../assets/svg/play-icon.svg";
import { Link } from 'react-router-dom';
import DetailButton from '../../../Components/Buttons/DetailButton';
import BookCard from './BookCard';
import { useDispatch } from 'react-redux';
import { openPlayer } from '../../../reducers/PlayerReducer';
import novideo from "../../../assets/png/novideo.png";
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

interface Product {
  ticket: any;
  id: string;
  name: string;
  img: string;
  category: string;
  month: string;
  date: string;
  timeframe: string;
  link: string;
  location: string;
  description: string;
  isFeatured: boolean;
}

interface inputProducts {
  _id: string;
  name: string;
  img: string;
  category: string;
  timeframe: {
    start: string | Date;
    end: string | Date;
  };
  link: string;
  location: string;
  description: string;
  isFeatured: boolean;
}

interface filterProperties {
  sort: string;
  quantity: number;
  startDate: string;
  endDate: string;
  order: string;
  search: string | undefined;
}

interface CartInterface {
  isFeatured: Product[];
  products: Product[];
}
const Book: React.FC<{ filter: string }> = ({ filter }) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [cardData, setCardData] = useState<CartInterface>();
  const [cardNum, setCardNum] = useState<number>(4);
  const [lineNum, setLineNum] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);
  const [mobileState, setMobileState] = useState<boolean>(false);
  const dispatch = useDispatch();

  const [filters, setFilters] = useState<filterProperties>({
    sort: "A to Z",
    quantity: 5,
    startDate: "",
    endDate: "",
    order: "desc",
    search: "",
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1280) {
        setCardNum(4);
        setLineNum(3);
      } else {
        setLineNum(3);
        setCardNum(3);
        if (window.innerWidth < 1024) {
          setLineNum(3);
          setCardNum(2);
          if (window.innerWidth < 768) {
            setCardNum(1);
            setLineNum(8);
          }
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchData = async (inputValue?: filterProperties) => {
    setLoading(true);
    let url = `${apiBaseUrl}/concert`;
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

    if (searchQuery.length > 0) {
      url = `${url}?${searchQuery.join("&")}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setCardData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
    // try {
    //   const response = await fetch(url);
    //   const jsonData = await response.json();

    //   const newConcert = jsonData.products.map((item: any) => {
    //     const inputDate = new Date(item.timeframe.start);

    //     const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(inputDate);
    //     const date = inputDate.getDate();

    //     return {
    //       id: item._id,
    //       name: item.name,
    //       img: fileUrl + item.img,
    //       category: item.category,
    //       link: item.link,
    //       location: item.location,
    //       description: item.description,
    //       month: `${month}`,
    //       date: `${date}`,
    //     };
    //   });
    //   setCardData(newConcert);
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // } finally {
    //   setLoading(false);
    // }
  };

  const [showPagination, setShowPagination] = useState(window.innerWidth < 768);
  const [showNavigation, setShowNavigation] = useState(window.innerWidth >= 768);
  const [itemsPerRow, setItemsPerRow] = useState(3);

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


  const handlePlay = (youTubeLink?: string) => {
    if (youTubeLink) {
      const videoId = extractYouTubeId(youTubeLink);
      if (videoId) {
        dispatch(openPlayer(videoId));
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (inputValue: string) => {
    fetchData(filters);
  };

  useEffect(() => {
    fetchData(filters);
  }, [filters]);

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:.*v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

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
    <>
      <div className="flex justify-center">
        <div className="container">
          <div className="md:mt-7 mt-10">
            <ContentTitle
              titleType="Concerts"
              title="Concerts Around You"
            />
          </div>

          <div className="w-full relative md:mt-8 mt-4">
            <Swiper
              onSwiper={(swiper: any) => (swiperRef.current = swiper)}
              onSlideChange={handleSlideChange}
              pagination={{
                dynamicBullets: true,
                clickable: true,
              }}
              modules={[Pagination]}
              className="mySwiper event-carousel">
              {cardData?.isFeatured && Array.isArray(cardData.isFeatured) ? (
                cardData.isFeatured.map((item, idx) => (
                  <SwiperSlide key={idx} className="p-2 md:mb-16 mb-8 md:p-4">
                    <div
                      className={`grid md:grid-cols-2 grid-cols-1  md:gap-20 gap-6`}>
                      <div className={`relative`} onClick={() => handlePlay(item.link)}>
                        {item.img ? (
                          <Image
                          src={item.img ? item.img : novideo}
                          className="md:rounded-3xl rounded-2xl object-cover h-full w-full"
                          alt={item.name || "No Video Available"}
                        />
                        ) : (
                          <img
                            src={novideo}
                            className="md:w-full w-[69px] h-[88px] md:h-[230px] object-cover rounded-lg"
                            alt="No Video Available"
                          />
                        )}
                        <div className="md:block hidden absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer">
                          <img src={playIcon} alt="icon" />
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer">
                          <img src={playIcon} alt="icon" style={{ height: "50px" }} />
                        </div>
                      </div>
                      <div className={`flex flex-col`}>
                        <div
                          className={`line-clamp-2 text-[22px] md:text-[48px] ${themeMode ? "ticket-detail-tilte" : "ticket-detail-tilte-dark"}`}
                        // style={{ fontSize: type ? "22px" : "48px" }}
                        >
                          {item.name}
                        </div>
                        <div
                          className={` line-clamp-3 ${themeMode ? "ticket-detail" : "ticket-detail-dark"} md:mt-6 mt-3`}>
                          {item.description}
                        </div>
                        <div className={`flex md:mt-4 mt-3`}>
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none">
                              <path
                                d="M11.9999 13.4295C13.723 13.4295 15.1199 12.0326 15.1199 10.3095C15.1199 8.58633 13.723 7.18945 11.9999 7.18945C10.2768 7.18945 8.87988 8.58633 8.87988 10.3095C8.87988 12.0326 10.2768 13.4295 11.9999 13.4295Z"
                                stroke={themeMode ? "#6D6E76" : "#BBBCC0"}
                                strokeWidth="1.5"
                              />
                              <path
                                d="M3.61971 8.49C5.58971 -0.169998 18.4197 -0.159997 20.3797 8.5C21.5297 13.58 18.3697 17.88 15.5997 20.54C13.5897 22.48 10.4097 22.48 8.38971 20.54C5.62971 17.88 2.46971 13.57 3.61971 8.49Z"
                                stroke={themeMode ? "#6D6E76" : "#BBBCC0"}
                                strokeWidth="1.5"
                              />
                            </svg>
                          </div>
                          <div
                            className={`flex ml-2 items-center ${themeMode ? "ticket-detail" : "ticket-detail-dark"}`}>
                            {item.location}
                          </div>
                        </div>
                        <div className="md:mt-10 mt-8">
                          <Link to={item.ticket} target="_blank">
                            <DetailButton
                              text="Buy Tickets Of Concert"
                              btnType="web"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <p>No featured items available</p>
              )}
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


          <div>
            <div className="md:mt-7 mt-10">
              <ContentTitle
                titleType="Buy Tickets"
                title="Book Your Spot In Events"
              />
            </div>
            {/* btn */}
            <div>
              <div className="flex  md:mt-8 mt-3 md:gap-4 gap-1">
                <Select
                  variant="outlined"
                  rounded="full"
                  height={!mobileState ? "46px" : "27px"}
                  width={!mobileState ? "180px" : "100px"}
                  background={themeMode ? "#E8ECFE" : "#242526"}
                  color={themeMode ? "black" : "white"}
                  fontSize={!mobileState ? "16px" : "10px"}
                  placeholder="Weekdays">
                  <option value="1"
                    style={{
                      backgroundColor: themeMode ? "#E8ECFE" : "#242526",
                      color: themeMode ? "black" : "white"
                    }}
                  >Monday</option>
                  <option value="2" style={{
                    backgroundColor: themeMode ? "#E8ECFE" : "#242526",
                    color: themeMode ? "black" : "white"
                  }}>Tuesday</option>
                  <option value="3" style={{
                    backgroundColor: themeMode ? "#E8ECFE" : "#242526",
                    color: themeMode ? "black" : "white"
                  }}>Wednesday</option>
                  <option value="4" style={{
                    backgroundColor: themeMode ? "#E8ECFE" : "#242526",
                    color: themeMode ? "black" : "white"
                  }}>Thursday</option>
                  <option value="5" style={{
                    backgroundColor: themeMode ? "#E8ECFE" : "#242526",
                    color: themeMode ? "black" : "white"
                  }}>Friday</option>
                </Select>
                <Select
                  variant="outlined"
                  rounded="full"
                  height={!mobileState ? "46px" : "28px"}
                  width={!mobileState ? "180px" : "150px"}
                  background={themeMode ? "#E8ECFE" : "#242526"}
                  color={themeMode ? "black" : "white"}
                  fontSize={!mobileState ? "16px" : "12px"}
                  placeholder="Event Type">
                  <option value="1" style={{
                    backgroundColor: themeMode ? "#E8ECFE" : "#242526",
                    color: themeMode ? "black" : "white"
                  }}>Concert Name</option>
                </Select>

                <Select
                  variant="outlined"
                  rounded="full"
                  height={!mobileState ? "46px" : "28px"}
                  width={!mobileState ? "180px" : "150px"}
                  background={themeMode ? "#E8ECFE" : "#242526"}
                  color={themeMode ? "black" : "white"}
                  fontSize={!mobileState ? "16px" : "12px"}
                  placeholder="Category">
                  <option value="1" style={{
                    backgroundColor: themeMode ? "#E8ECFE" : "#242526",
                    color: themeMode ? "black" : "white"
                  }}>Wildlife</option>
                </Select>
              </div>
            </div>

          </div>
          <div
            className={`md:mt-16 mt-8`}
          >
            {loading ? (
              <div
                className="w-full flex justify-center items-center"
              >
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="lg"
                />
              </div>
            ) : (
              <div className={`${themeMode ? "book-back" : "book-back-dark"}`}>
                {cardData?.products.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <BookCard idx={idx} themeMode={themeMode} item={item} />
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Book
