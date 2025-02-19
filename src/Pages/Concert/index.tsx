import React from "react";
import { ChangeEvent, useState, useEffect, useMemo } from "react";
import BreadCrumb from "../../Components/BreadCrumb";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import PaginationBar from "../../Components/PaginationBar";
import { apiGetReq } from "../../Constant/api-functions";
import DetailButton from "../../Components/Buttons/DetailButton";
import Layout from "../../Components/Layout";
import { apiBaseUrl, fileUrl } from "../../Constant/config";
import { Button, Image } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
import Carousel from "../../Components/Carousel";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "../mainPageStyle.css";
import type { PageBasicProps } from "../../AppMain";
import { Swiper, SwiperSlide } from "swiper/react";
import playIcon from "../../assets/svg/play-icon.svg";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import useSWR from "swr";
import Card from "./Card";
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
  isFeatured: boolean;
}
// interface inputProducts {
//   _id: string;
//   name: string;
//   img: string;
//   category: string;
//   timeframe: {
//     start: string | Date;
//     end: string | Date;
//   };
//   link: string;
//   location: string;
//   description: string;
//   isFeatured: boolean;
// }
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

const ConcertMainPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  // const [selectedPage, setSelectedPage] = useState<number>(1);
  // const [pages, setPages] = useState<number>(0);
  const [filterText, setFilterText] = useState<string>("");
  const [cardData, setCardData] = useState<CartInterface>();
  const [cardNum, setCardNum] = useState<number>(4);
  const [lineNum, setLineNum] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);
  // const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  // const [nonFeaturedProducts, setNonFeaturedProducts] = useState<Product[]>([]);
  // const [entriesPerPage, setEntriesPerPage] = useState<number>(5);
  // const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
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

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR('http://localhost:8000/api/concert', fetcher);

  if (error) return <p>Error loading concerts.</p>;
  if (!data) return <p>Loading...</p>;

  console.log('Concert Data:', data); // Logs data to console
  return (
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
            <FilterInput
              type={type}
              handler={handleSearch}
              filterText={filterText}
              setFilterText={setFilterText}
              setFilters={setFilters}
              filters={filters}
            />
          </div>

          <div className="md:mt-16">
            <Swiper
              pagination={{
                dynamicBullets: true,
                clickable: true,
              }}
              modules={[Pagination]}
              className="mySwiper event-carousel">
              {cardData?.isFeatured && Array.isArray(cardData.isFeatured) ? (
                cardData?.isFeatured.map((item, idx) => (
                  <SwiperSlide key={idx} className="p-2 md:mb-16 mb-8">
                    <div
                      className={`grid md:grid-cols-2 grid-cols-1  md:gap-20 gap-6`}>
                      <div className={`relative`}>
                        <Image
                          src={item.img}
                          className="object-cover h-full w-full"
                          alt={item.img}
                          borderRadius={type ? "18px" : "25px"}
                        />
                        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer">
                          <img src={playIcon} alt="icon" />
                        </div>
                      </div>
                      <div className={`flex flex-col`}>
                        <div
                          className={`${themeMode ? "ticket-detail-tilte" : "ticket-detail-tilte-dark"}`}
                          style={{ fontSize: type ? "22px" : "48px" }}>
                          {item.name}
                        </div>
                        <div
                          className={`${themeMode ? "ticket-detail" : "ticket-detail-dark"} md:mt-6 mt-3`}>
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
                        <div className={`flex mt-4`}>
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none">
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
                            className={`flex ml-2 items-center ${themeMode ? "ticket-detail" : "ticket-detail-dark"}`}>
                            {item.date}
                          </div>
                        </div>
                        {!type && (
                          <div className="md:mt-10 mt-8">
                            <Link to={item.link} target="_blank">
                              <DetailButton
                                text="Buy Tickets Of Concert"
                                btnType="web"
                              />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <p>No featured items available</p>
              )}
            </Swiper>
            {type && (
              <div className="md:mt-10 mt-8">
                <DetailButton text="Buy Tickets Of Concert" btnType="mobile" />
              </div>
            )}
          </div>
          <div
            className={`md:mt-16 mt-8`}
            style={{ minHeight: type ? "250px" : "150px", width: "100%" }}>
            {loading ? (
              <div
                className="w-full flex justify-center items-center"
                style={{ minHeight: type ? "689px" : "450px" }}>
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
                    <Card idx={idx} themeMode={themeMode} item={item} />
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConcertMainPage;
