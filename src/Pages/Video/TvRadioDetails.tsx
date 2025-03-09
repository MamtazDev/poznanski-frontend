import React, { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../../Components/Layout";
import { PageBasicProps } from "../../AppMain";
import BreadCrumb from "../../Components/BreadCrumb";
import topartist from "../../assets/svg/top-artist.svg";
import topastistsinger from "../../assets/png/top-astist-singer.png";
import singer from "../../assets/svg/artists1.svg";
import { GoDotFill } from "react-icons/go";
import { IoLocationOutline } from "react-icons/io5";
import { BsCalendar2Date } from "react-icons/bs";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import CommentSection from "../TopArtist/CommentSection";
import useSWR from "swr";
import { useParams } from "react-router-dom";

// Import the Swiper instance type
import { Swiper as SwiperInstance } from "swiper";
import { Avatar } from "@chakra-ui/react";
import CommentForm from "../../Components/Comment";
import { PostModels } from "../../Constant/api-requests";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import {
  addLastVisited,
  get5RandomNewsByTags,
  getLastVisitedId,
  getTargetNews,
} from "../../reducers/NewsReducer";
import { useDispatch } from "react-redux";
import { ArticleToDisplay } from "../Home/NewsContent/Carousel";
import Comments from "../../Components/common/Comments";
import { FaRegFaceSadCry } from "react-icons/fa6";

interface Artist {
  _id: string;
  name: string;
  profileImg: string;
  description: string;
  star: number;
  __v: number;
}

interface User {
  _id: string;
  nickname: string;
  email: string;
  password: string;
  role: string;
  isVerified: boolean;
  __v: number;
  refreshToken: string | null;
  profilePicture: string;
}

interface Radio {
  _id: string;
  title: string;
  description: string;
  youTube: string;
  artists: Artist[];
  userId: User;
  tags: string;
  thumbnail: string;
  date: string;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  relatedNews: string[];
}

const TvRadioDetails: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  // Type the swiperRef to be of Swiper instance type
  const swiperRef = useRef<SwiperInstance | null>(null);
  const { id } = useParams<{ id: string }>();
  const targetNewsSelected = useSelector((state: RootState) =>
    getTargetNews(state, id)
  );
  // const url = useLocation().pathname;
  const lastVisitedId = useSelector((state: RootState) =>
    getLastVisitedId(state)
  );
  const dispatch = useDispatch();
  const [pageData, setPageData] = useState<ArticleToDisplay>();
  const [, ...tagsToRemap] = targetNewsSelected?.tags?.split("#") || [];
  const tags = tagsToRemap;
  const pageDataTags = useMemo(() => pageData?.tags || [], [pageData?.tags]);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const relatedData: ArticleToDisplay[] = useSelector((state: RootState) =>
    get5RandomNewsByTags(state, pageDataTags || [])
  );
  const filteredRelatedData = useMemo(() => {
    return relatedData.filter((news) => data.news._id !== id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relatedData, id]);

  useEffect(() => {
    setPageData(targetNewsSelected);
  }, [targetNewsSelected]);

  useEffect(() => {
    if (!lastVisitedId || lastVisitedId !== id) {
      dispatch(addLastVisited(`${id}`));
    }
  }, [lastVisitedId, id, dispatch]);

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

  // Fetch data
  const fetcher = () =>
    fetch(`http://localhost:8000/api/radio/${id}`).then((res) => res.json());
  const { data, error } = useSWR(`/api/radio/${id}`, fetcher);
  const [radio, setRadio] = useState<Radio | null>(null);
  const [relatedNews, setRelatedNews] = useState<any[]>([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const toggleDescription = () => setShowFullDescription(!showFullDescription);
  useEffect(() => {
    if (data) {
      setRadio(data.record);
      setRelatedNews(Array.isArray(data.relatedNews) ? data.relatedNews : []);
      console.log("Related News:", data.relatedNews);
    }
  }, [data]);

  if (error) return <div>Error loading data.</div>;
  if (!radio)
    return (
      <div
        className="flex justify-center items-center h-screen w-full"
        style={{
          backgroundColor: themeMode ? "white" : "black",
        }}
      >
        <p
          className="text-xl font-semibold"
          style={{
            color: themeMode ? "black" : "white",
          }}
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
    );

  const formattedMainTags =
    radio?.tags && typeof radio.tags === "string"
      ? radio.tags.split(",").map((tag) => tag.trim())
      : [];
  {
    /* Show up to 5 tags */
  }
  const displayedMainTags = formattedMainTags.slice(0, 5);

  return (
    <Layout themeMode={themeMode} type={type}>
      <div className="flex justify-center">
        <div className="container">
          {!type && (
            <div className="md:mt-12 mt-8">
              <BreadCrumb />
            </div>
          )}
          <h2
            className="text-5xl font-bold mt-5"
            style={{
              color: themeMode ? "#252733" : "#FFF",
            }}
          >
            {radio.title}
          </h2>
          {radio.thumbnail && (
            <img
              src={radio.thumbnail}
              className="w-full h-[596px] mt-12 rounded-xl"
              alt="Thumbnail"
            />
          )}

          <div className="mt-7 flex gap-3 items-center">
            <Avatar
              src={radio.artists[0]?.profileImg}
              className="cursor-pointer"
            />
            <div>
              <h2
                className="text-2xl font-semibold"
                style={{
                  color: themeMode ? "#252733" : "#FFF",
                }}
              >
                {radio.artists[0]?.name}
              </h2>
              <p
                style={{
                  color: themeMode ? "#6D6E76" : "#fff",
                }}
              >
                {radio.artists[0]?.description}
              </p>
            </div>
          </div>
          <div
            className="p-6 rounded-2xl shadow-lg mt-6"
            style={{ backgroundColor: themeMode ? "#FFF" : "#242526" }}
          >
            <p
              className="flex gap-1 items-center font-medium"
              style={{
                color: themeMode ? "#252733" : "#BBBCC0",
              }}
            >
              4.9k Views
              <span className="flex gap-2 items-center">
                <GoDotFill
                  style={{
                    color: themeMode ? "#D9D9D9" : "D9D9D9",
                  }}
                />{" "}
                4 Hours Ago
              </span>
            </p>
            <p style={{ color: themeMode ? "#6D6E76" : "#BBBCC0" }}>
              {showFullDescription
                ? radio.description
                : radio.description?.split(" ").slice(0, 50).join(" ") + "..."}
            </p>
            {radio.description?.split(" ").length > 50 && (
              <button
                className="mt-4 font-bold"
                style={{ color: themeMode ? "#5A1073" : "#3BD6C6" }}
                onClick={toggleDescription}
              >
                {showFullDescription ? "View Less" : "View More"}
              </button>
            )}
          </div>
          <div className="mt-3">
            {displayedMainTags?.map((tag, index) => (
              <button
                key={index}
                className="py-1 mt-1 ml-1 px-3 text-center rounded-full font-semibold"
                style={{
                  backgroundColor: themeMode ? "#E8ECFE" : "#3BD6C6",
                  color: "#5A1073",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
          {relatedNews.length > 0 && (
            <div className="mt-12">
              <h1
                className="text-xl font-semibold"
                style={{
                  color: themeMode ? "black" : "#fff",
                }}
              >
                Related Videos
              </h1>
              {/* Swiper for related videos */}
              <div className="w-full mt-10 relative">
                <Swiper
                  onSwiper={(swiper: any) => (swiperRef.current = swiper)}
                  slidesPerView={4}
                  spaceBetween={30}
                  loop={true}
                  breakpoints={{
                    1200: { slidesPerView: 4 },
                    1024: { slidesPerView: 2 },
                    768: { slidesPerView: 2 },
                    425: { slidesPerView: 1 },
                  }}
                >
                  {relatedNews?.map((item: Radio, index: number) => (
                    <SwiperSlide key={index}>
                      <RelatedDetails themeMode={themeMode} item={item} />
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
          )}

          {/* <CommentForm
            postModel={PostModels.news}
            commentData={pageData?.commentsSection ?? null}
          /> */}

          {radio._id && <Comments postId={radio._id} type={PostModels.news} />}
        </div>
      </div>
    </Layout>
  );
};

export default TvRadioDetails;

const RelatedDetails = ({ themeMode, item }: any) => {
  const formattedTags =
    item?.tags && typeof item.tags === "string"
      ? item.tags.split(",").map((tag: any) => tag.trim())
      : [];
  const displayedTags = formattedTags.slice(0, 5);

  console.log("item", item);
  return (
    <div
      className="p-5 rounded-3xl mt-6"
      style={{
        backgroundColor: themeMode ? "#FFF" : "#242526",
        color: themeMode ? "black" : "#fff",
        borderRadius: "25px",
        border: `2px solid ${themeMode ? "#f8f8ff" : "#242526"}`,
      }}
    >
      <img src={singer} alt="img" className="w-full" />
      {displayedTags.map((tag: any, index: any) => (
        <button
          key={index}
          className="py-1 mt-1 ml-1 px-3 text-center rounded-full font-semibold"
          style={{
            backgroundColor: themeMode ? "#E8ECFE" : "#3BD6C6",
            color: "#5A1073",
          }}
        >
          {tag}
        </button>
      ))}
      <p className="mt-2 text-lg font-semibold">{item.title}</p>
      <div className="flex gap-2 items-center">
        <GoDotFill
          style={{
            color: themeMode ? "#D9D9D9" : "D9D9D9",
          }}
        />
        <p
          className="flex gap-1 items-center"
          style={{
            color: themeMode ? "#9B9CA1" : "#9B9CA1",
          }}
        >
          <BsCalendar2Date />
          {item.date}
        </p>
      </div>
    </div>
  );
};
