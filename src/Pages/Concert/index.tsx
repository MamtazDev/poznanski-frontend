import React, { ChangeEvent, useState, useEffect } from "react";
import BreadCrumb from "../../Components/BreadCrumb";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import PaginationBar from "../../Components/PaginationBar";
import { apiGetReq } from "../../Constant/api-functions";
import DetailButton from "../../Components/Buttons/DetailButton";
import Layout from "../../Components/Layout";
import { fileUrl } from "../../Constant/config";
import { Button, Image } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
import Carousel from "../../Components/Carousel";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "../mainPageStyle.css";
import { PageBasicProps } from "../../AppMain";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
// import ticketImg from "../../assets/png/ticketBanner.png"

interface Product {
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
  isFeatured:boolean
}

const ConcertMainPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(0);
  const [filterText, setFilterText] = useState<string>("");
  const [cardData, setCardData] = useState<Product[]>([]);
  const [cardNum, setCardNum] = useState<number>(4);
  const [lineNum, setLineNum] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [nonFeaturedProducts, setNonFeaturedProducts] = useState<Product[]>([]);

  // const handleData = (response: any) => {
  //   let newProducts: Product[] = [];
  //   const totalPages = Math.ceil(response.all / 6);
  //   setPages(totalPages); // No need to convert to string
  //   response.products.forEach((item: inputProducts) => {
  //     const inputDate1: Date = new Date(item.timeframe.start);
  //     const inputDate2: Date = new Date(item.timeframe.end);
  //     const formattedTimeframe =
  //       inputDate1.getUTCHours() +
  //       ":" +
  //       (inputDate1.getUTCMinutes() < 10 ? "0" : "") +
  //       inputDate1.getUTCMinutes() +
  //       "-" +
  //       inputDate2.getUTCHours() +
  //       ":" +
  //       (inputDate2.getUTCMinutes() < 10 ? "0" : "") +
  //       inputDate2.getUTCMinutes();
  //     const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
  //       inputDate1
  //     );
  //     const temp: Product = {
  //       id: item._id,
  //       name: item.name,
  //       img: fileUrl + item.img,
  //       category: item.category,
  //       month: `${month}`,
  //       date: `${inputDate1.getDate()}`,
  //       timeframe: formattedTimeframe,
  //       link: item.link,
  //       location: item.location,
  //       description: item.description,
  //     };
  //     newProducts.push(temp);
  //   });
  //   setCardData(newProducts);
    
  // };


  const handleData = (response: any) => {
    let newProducts: Product[] = [];
    const totalPages = Math.ceil(response.all / 6);
    setPages(totalPages);
    
    let featured: Product[] = [];
    let nonFeatured: Product[] = [];

    response.products.forEach((item: inputProducts) => {
      const inputDate1: Date = new Date(item.timeframe.start);
      const inputDate2: Date = new Date(item.timeframe.end);
      const formattedTimeframe =
        inputDate1.getUTCHours() +
        ":" +
        (inputDate1.getUTCMinutes() < 10 ? "0" : "") +
        inputDate1.getUTCMinutes() +
        "-" +
        inputDate2.getUTCHours() +
        ":" +
        (inputDate2.getUTCMinutes() < 10 ? "0" : "") +
        inputDate2.getUTCMinutes();
      const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(inputDate1);
      
      const temp: Product = {
        id: item._id,
        name: item.name,
        img: fileUrl + item.img,
        category: item.category,
        month: `${month}`,
        date: `${inputDate1.getDate()}`,
        timeframe: formattedTimeframe,
        link: item.link,
        location: item.location,
        description: item.description,
      };

      if (item.isFeatured) {
        featured.push(temp);
      } else {
        nonFeatured.push(temp);
      }
    });

    setFeaturedProducts(featured);
    setNonFeaturedProducts(nonFeatured);
  };

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

  // useEffect(() => {
  //   setLoading(true);
  //   apiGetReq("/concert", {
  //     rowsPerPage: 6,
  //     curPage: selectedPage, // This is now a number
  //     filter: filterText,
  //   })
  //     .then((res) => {
  //       handleData(res);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //     });
  // }, []);

  // useEffect(() => {
  //   setLoading(true);
  //   apiGetReq("/concert", {
  //     rowsPerPage: 6,
  //     curPage: selectedPage,
  //     filter: filterText,
  //   })
  //     .then((res) => {
  //       setLoading(false);
  //       handleData(res);
  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //     });
  // }, [selectedPage, filterText]);

  useEffect(() => {
    setLoading(true);
  
    fetch("http://localhost:8000/api/concert")
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data); 
  
        if (data.success) {
          handleData(data); 
        }
  
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching concerts:", error);
        setLoading(false);
      });
  }, [selectedPage, filterText]);



  return (
    <>
      <Layout themeMode={themeMode} type={type}>
        <div className="flex justify-center">
          <div className="container">
            {type ? (
              ""
            ) : (
              <div className="md:mt-12 mt-8">
                <BreadCrumb />
              </div>
            )}
            <div className="md:mt-7 mt-10">
              <ContentTitle
                titleType="TOP HITS"
                title="Book Your Spot In Events"
              />
            </div>
            <div className="md:mt-6 mt-4">
              <FilterInput type={type} filterText={filterText} setFilterText={setFilterText}/>
            </div>
            <div className="md:mt-16">
              <Swiper
                pagination={{
                  dynamicBullets: true,
                }}
                modules={[Pagination]}
                className="mySwiper"
              >
                {featuredProducts.map((item, idx) => (
                  <SwiperSlide className="p-2 md:mb-16 mb-8">
                    <div
                      key={`ticket-detail-${idx}`}
                      className={`grid md:grid-cols-2 grid-cols-1 md:gap-20 gap-6`}
                    >
                      <div className={`relative`}>
                        <Image
                          // src={item?.img}
                          src={"https://i.ibb.co.com/5KchHq8/ticket-Banner.png"}
                          className="cursor-pointer object-cover h-full w-full"
                          alt={item.img}
                          borderRadius={type ? "18px" : "25px"}
                        />
                      </div>
                      <div className={`flex flex-col`}>
                        <div
                          className={`${themeMode ? "ticket-detail-tilte" : "ticket-detail-tilte-dark"}`}
                          style={{ fontSize: type ? "22px" : "48px" }}
                        >
                          {item.name}
                        </div>
                        <div
                          className={`${themeMode ? "ticket-detail" : "ticket-detail-dark"} md:mt-6 mt-3`}
                        >
                          {item.description}
                        </div>
                        <div
                          className={`flex md:mt-4 mt-3 ${themeMode ? "" : ""}`}
                        >
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
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
                            className={`flex ml-2 items-center ${themeMode ? "ticket-detail" : "ticket-detail-dark"}`}
                          >
                            {item.location}
                          </div>
                        </div>
                        <div className={`flex mt-4 ${themeMode ? "" : ""}`}>
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z"
                                stroke={themeMode ? "#6D6E76" : "#BBBCC0"}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M15.7099 15.1798L12.6099 13.3298C12.0699 13.0098 11.6299 12.2398 11.6299 11.6098V7.50977"
                                stroke={themeMode ? "#6D6E76" : "#BBBCC0"}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div
                            className={`flex ml-2 items-center ${themeMode ? "ticket-detail" : "ticket-detail-dark"}`}
                          >
                            {item.date}
                          </div>
                        </div>
                        {!type && (
                          <div className="md:mt-10 mt-8">
                            <DetailButton
                              text="buy Tickets Of Concert"
                              btnType="web"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {type && (
                <div className="md:mt-10 mt-8">
                  <DetailButton
                    text="buy Tickets Of Concert"
                    btnType="mobile"
                  />
                </div>
              )}
            </div>

            <div
              className={`md:mt-16 mt-8`}
              style={{ minHeight: type ? "689px" : "450px", width: "100%" }}
            >
              {loading ? (
                <div
                  className="w-full flex justify-center items-center"
                  style={{ minHeight: type ? "689px" : "450px" }}
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
                <div
                  className={`${themeMode ? "book-back" : "book-back-dark"}`}
                >
                  {nonFeaturedProducts.map(
                    (item, idx) =>
                      item &&
                      (!type ? (
                        <div
                          className={`grid grid-cols-4 ${idx !== 0 && "ticket-top-border"} items-center px-3 shadow-md rounded-2xl`}
                          style={{ height: 75 }}
                        >
                          <div className="flex items-center">
                            <div
                              className={`ticket-date pr-2 ${!themeMode && "text-dark-color"}`}
                            >
                              {item.date}
                            </div>
                            <div
                              className={`ticket-month ${!themeMode && "text-dark-color"}`}
                            >
                              <div>{item.month}</div>
                              <div>{item.timeframe}</div>
                            </div>
                          </div>
                          <div
                            className={`ticket-type text-center ${!themeMode && "title-dark-color"}`}
                          >
                            {item.name}
                          </div>
                          <div className="flex  justify-center items-center">
                            <div
                              className={`ticket-category ${!themeMode && "btn-dark-bg-color"}`}
                            >
                              {item.category}
                            </div>
                          </div>
                          <div>
                            <Button
                              size="md"
                              height="30px"
                              width="105px"
                              border="2px"
                              borderColor={themeMode ? "#5A1073" : "#2FC4B2"}
                              borderWidth="1px"
                              borderRadius="5px"
                              color={themeMode ? "#5A1073" : "#2FC4B2"}
                              fontFamily="Urbanist"
                              fontSize="14px"
                              fontWeight="600"
                              backgroundColor={themeMode ? "#FFF" : "#242526"}
                            >
                              Buy Ticket
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={`book-mobile-${idx}`}
                          className={`${idx !== 0 && "ticket-top-border"} p-3`}
                        >
                          <div className={`flex justify-between `}>
                            <div
                              className={`ticket-date-2 ${!themeMode && "title-dark-color"}`}
                            >
                              {item.date} {item.month}
                            </div>
                            <div
                              className={`ticket-timeframe ${!themeMode && "title-dark-color"}`}
                            >
                              {item.timeframe}
                            </div>
                          </div>
                          <div className="flex justify-between mt-3">
                            <div
                              className={`ticket-type-2 ${!themeMode && "title-dark-color"}`}
                            >
                              {item.name}
                            </div>
                            <div
                              className={`ticket-category-2 ${!themeMode && "btn-dark-bg-color"}`}
                            >
                              {item.category}
                            </div>
                          </div>
                          <div className="mt-3 flex justify-end">
                            <Button
                              variant="outlined"
                              size="md"
                              height="32px"
                              width="100%"
                              border="2px"
                              borderColor={themeMode ? "#5A1073" : "#2FC4B2"}
                              borderWidth="1px"
                              borderRadius="8px"
                              color={themeMode ? "#5A1073" : "#2FC4B2"}
                              fontFamily="Urbanist"
                              fontSize="12px"
                              fontWeight="600"
                              backgroundColor={themeMode ? "#FFF" : "#242526"}
                              _active={
                                themeMode
                                  ? {
                                      background: "#5A1073",
                                      color: "#FFF",
                                    }
                                  : {
                                      background: "#2FC4B2",
                                      color: "#5A1073",
                                    }
                              }
                            >
                              Buy Ticket
                            </Button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>
            <div
              className={`md:mt-16 mt-8 flex ${type ? "justify-center" : "justify-end"}`}
            >
              <PaginationBar
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
                pages={pages}
                entriesPerPage={0}
                setEntriesPerPage={function (
                  value: React.SetStateAction<number>
                ): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ConcertMainPage;
