"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Avatar } from "@chakra-ui/react";
import { GoDotFill } from "react-icons/go";
import { IoLocationOutline } from "react-icons/io5";
import { BsCalendar2Date } from "react-icons/bs";
import { Share2, MessageSquare } from "lucide-react";
import useSWR from "swr";
import Comments from "../../Components/common/Comments";
import { PostModels } from "../../Constant/api-requests";
import Layout from "../../Components/Layout";
import SocialShare from "../../Components/SocialShare/SocialShare";
import { BiCommentDetail } from "react-icons/bi";
import BreadCrumb from "../../Components/BreadCrumb";
import { apiBaseUrl } from "../../Constant/config";
import moment from "moment";
import getVideoThumbnail from "../../lib/services";

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
  songs: string[];
}

interface ISong {
  _id: string;
  title: string;
  thumbnail: string;
  artists: Artist[];
  description: string;
  date: string;
}

interface ArtistDetailPageProps {
  themeMode: boolean; // true for light, false for dark
  type?: boolean;
}

const TopArtist: React.FC<ArtistDetailPageProps> = ({ themeMode, type }) => {
  const { id } = useParams<{ id: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(6);
  const [radio, setRadio] = useState<Radio | null>(null);
  const swiperRef = useRef<any>(null);

  // Fetch data
  const fetcher = () =>
    fetch(`http://localhost:8000/api/album/${id}`).then((res) => res.json());
  const { data, error } = useSWR(`/api/album/${id}`, fetcher);

  useEffect(() => {
    if (data) {
      setRadio(data);
    }
  }, [data]);

  const commentFormRef = useRef<HTMLDivElement | null>(null);

  const handleScrollToCommentForm = () => {
    if (commentFormRef.current) {
      commentFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      }); // ✅ No error
    }
  };

  // Pagination logic
  const totalSongs = radio?.songs?.length || 0;
  const totalPages = Math.ceil(totalSongs / entriesPerPage);
  const indexOfLastSong = currentPage * entriesPerPage;
  const indexOfFirstSong = indexOfLastSong - entriesPerPage;
  const currentSongs: ISong[] =
    (radio?.songs as unknown as ISong[])
      ?.slice(indexOfFirstSong, indexOfLastSong)
      .map((song) => ({
        _id: song._id,
        title: song.title,
        thumbnail: song.thumbnail,
        artists: song.artists,
        description: song.description,
        date: song.date,
      })) || [];

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  console.log(currentSongs);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const [relatedNewsPage, setRelatedNewsPage] = useState(1);
  const [hasMoreRelated, setHasMoreRelated] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [displayedRelatedAlbums, setDisplayedRelatedAlbums] = useState<any[]>(
    []
  );
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ITEMS_PER_PAGE = 6;

  // Add this effect to load first page when component mounts
  useEffect(() => {
    if (id) {
      fetchMoreRelatedAlbum(1);
    }
  }, [id]);

  // Update the scroll handler
  useEffect(() => {
    if (!hasMoreRelated || loadingMore) return;

    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const lastItem = lastItemRef.current;
      if (!lastItem) return;

      const containerBottom = container.scrollTop + container.clientHeight;
      const lastItemPosition = lastItem.offsetTop + lastItem.clientHeight;
      const threshold = 50; // pixels before bottom

      if (
        containerBottom + threshold >= lastItemPosition &&
        !loadingMore &&
        hasMoreRelated
      ) {
        fetchMoreRelatedAlbum(relatedNewsPage + 1);
        setRelatedNewsPage((prev) => prev + 1);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMoreRelated, loadingMore, relatedNewsPage]);

  // Update the fetch function to handle errors better
  const fetchMoreRelatedAlbum = async (pageNumber: number) => {
    try {
      setLoadingMore(true);
      const response = await fetch(
        `${apiBaseUrl}/album/${id}/related?page=${pageNumber}&limit=${ITEMS_PER_PAGE}`
      );
      const newData = await response.json();

      if (newData?.relatedAlbums?.length) {
        if (pageNumber === 1) {
          // For first page, replace existing data
          setDisplayedRelatedAlbums(newData.relatedAlbums);
        } else {
          // For subsequent pages, append data
          setDisplayedRelatedAlbums((prev) => [
            ...prev,
            ...newData.relatedAlbums,
          ]);
        }
        // Only set hasMore to true if we received the full page size
        setHasMoreRelated(newData.relatedNews.length === ITEMS_PER_PAGE);
      } else {
        setHasMoreRelated(false);
      }
    } catch (error) {
      console.error("Error fetching more related news:", error);
      setHasMoreRelated(false);
    } finally {
      setLoadingMore(false);
    }
  };

  if (error)
    return (
      <div
        className={`flex justify-center items-center h-screen w-full ${themeMode ? "bg-white" : "bg-black"}`}
      >
        <p
          className={`text-xl font-semibold ${themeMode ? "text-black" : "text-white"}`}
        >
          Error loading data.
        </p>
      </div>
    );

  if (!radio)
    return (
      <div
        className={`flex justify-center items-center h-screen w-full ${themeMode ? "bg-white" : "bg-black"}`}
      >
        <p
          className={`text-xl font-semibold ${themeMode ? "text-black" : "text-white"}`}
        >
          Loading...
        </p>
        <div
          className={`w-6 h-6 ml-2 border-4 border-t-transparent rounded-full animate-spin ${
            themeMode
              ? "border-r-[#5A1073] border-b-[#5A1073] border-l-[#5A1073]"
              : "border-r-[#2FC4B2] border-b-[#2FC4B2] border-l-[#2FC4B2]"
          }`}
        ></div>
      </div>
    );

  return (
    <Layout themeMode={themeMode} type={type}>
      <div className={`container mx-auto px-4 w-full `}>
        <div className="">
          {/* Breadcrumb */}
          {!type && (
            <div className="md:mt-12 mt-8">
              <BreadCrumb />
            </div>
          )}

          {/* Artist Header */}
          <h2
            className={`text-5xl font-bold mt-5 ${themeMode ? "text-[#252733]" : "text-white"}`}
          >
            {radio.title}
          </h2>

          {/* Thumbnail */}
          <img
            src={radio.thumbnail || "/placeholder.svg"}
            className="w-full mt-12 rounded-xl"
            alt="Thumbnail"
          />

          {/* Artist Info */}
          <div className="mt-7 flex gap-3 items-center">
            <Avatar src={radio.artists[0]?.profileImg} />
            <div>
              <h2
                className={`text-2xl font-semibold ${themeMode ? "text-[#252733]" : "text-white"}`}
              >
                {radio.artists[0]?.name}
              </h2>
              <p className={`${themeMode ? "text-[#6D6E76]" : "text-white"}`}>
                {radio.artists[0]?.description}
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-between items-start flex-wrap lg:flex-nowrap">
            <div className="flex-grow">
              {/* Description Card */}
              <div
                className={`p-6 rounded-2xl shadow-lg mt-6 ${themeMode ? "bg-white" : "bg-[#242526]"}`}
              >
                <p
                  className={`flex gap-1 items-center font-medium ${themeMode ? "text-[#252733]" : "text-[#BBBCC0]"}`}
                >
                  4.9k Views
                  <span className="flex gap-2 items-center">
                    <GoDotFill
                      className={`${themeMode ? "text-[#D9D9D9]" : "text-[#D9D9D9]"}`}
                    />{" "}
                    4 Hours Ago
                  </span>
                </p>
                <p
                  className={`${themeMode ? "text-[#6D6E76]" : "text-[#BBBCC0]"}`}
                >
                  {radio.description}
                </p>
                <button
                  className={`mt-4 font-bold ${themeMode ? "text-[#5A1073]" : "text-[#3BD6C6]"}`}
                >
                  View More
                </button>
              </div>

              {/* Main Content Grid */}
              <div className="w-full mt-8">
                {/* Songs List - Takes 2/3 of the grid */}
                <div className="w-full">
                  <h2
                    className={`text-xl font-semibold mb-4 ${themeMode ? "text-black" : "text-white"}`}
                  >
                    Songs
                  </h2>

                  {/* Songs Table */}
                  {currentSongs.length > 0 ? (
                    <div className="space-y-2">
                      {currentSongs.map((item, i) => (
                        <div
                          key={i}
                          className={`w-full flex items-center gap-4 p-4 rounded-lg ${
                            themeMode
                              ? "bg-white border border-gray-100"
                              : "bg-[#242526] border border-gray-800"
                          }`}
                        >
                          <div className="flex items-center gap-3 w-full md:max-w-[40%]">
                            <span
                              className={`w-6 text-center ${themeMode ? "text-gray-500" : "text-gray-400"}`}
                            >
                              {i + 1}
                            </span>
                            <div className="min-w-[50px] min-h-[50px] max-w-[50px] max-h-[50px]  rounded-full overflow-hidden bg-gray-200">
                              <img
                                src={item?.thumbnail}
                                alt="Song"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-[100px]">
                              <p
                                className={`oneLine font-medium ${themeMode ? "text-gray-900" : "text-white"}`}
                              >
                                {item?.title?.slice(0, 20)}
                              </p>
                              <span
                                className={`text-start text-xs px-2 py-0.5 rounded-full lg:hidden ${
                                  themeMode
                                    ? "bg-[#F0E6FF] text-[#5A1073]"
                                    : "bg-[#2FC4B2] text-white"
                                }`}
                              >
                                {item?.artists[0]?.name}
                              </span>
                            </div>
                          </div>
                          <div className="w-full max-w-[100px] hidden lg:inline-block">
                            <span
                              className={`text-start text-xs px-2 py-0.5 rounded-full ${
                                themeMode
                                  ? "bg-[#F0E6FF] text-[#5A1073]"
                                  : "bg-[#2FC4B2] text-white"
                              }`}
                            >
                              {item?.artists[0]?.name}
                            </span>
                          </div>
                          <div className="flex justify-end items-center flex-grow gap-4">
                            <div className="w-full hidden lg:block">
                              <span
                                className={`oneLine text-start ${themeMode ? "text-gray-700" : "text-gray-300"}`}
                              >
                                {item?.description?.slice(0, 50)}
                              </span>
                            </div>
                            <div>
                              <span
                                className={`${themeMode ? "text-gray-700" : "text-gray-300"}`}
                              >
                                {item?.date &&
                                  moment(item?.date).format("DD/MM/YYYY")}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <button
                                className={`rounded-full p-2 ${
                                  themeMode
                                    ? "text-[#5A1073] hover:bg-[#F0E6FF]"
                                    : "text-[#2FC4B2] hover:bg-gray-800"
                                }`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-gray-500">No songs found</p>
                    </div>
                  )}

                  {/* Pagination */}
                  {/* <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${themeMode ? "text-gray-600" : "text-gray-400"}`}
                      >
                        Show
                      </span>
                      <select
                        value={entriesPerPage}
                        onChange={(e) =>
                          setEntriesPerPage(Number(e.target.value))
                        }
                        className={`rounded border px-2 py-1 text-sm ${
                          themeMode
                            ? "bg-white border-gray-300 text-gray-900"
                            : "bg-[#242526] border-gray-700 text-white"
                        }`}
                      >
                        <option value={6}>6</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                      <span
                        className={`text-sm ${themeMode ? "text-gray-600" : "text-gray-400"}`}
                      >
                        entries
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className={`p-1 ${
                          currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        } ${themeMode ? "text-gray-700" : "text-gray-300"}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="11 17 6 12 11 7"></polyline>
                          <polyline points="18 17 13 12 18 7"></polyline>
                        </svg>
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={`p-1 ${
                          currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        } ${themeMode ? "text-gray-700" : "text-gray-300"}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                      </button>
                      <span
                        className={`px-3 py-1 rounded ${themeMode ? "bg-gray-100 text-gray-900" : "bg-gray-800 text-white"}`}
                      >
                        {currentPage}
                      </span>
                      <span
                        className={`text-sm ${themeMode ? "text-gray-600" : "text-gray-400"}`}
                      >
                        of {totalPages || 6}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages || 6)
                          )
                        }
                        disabled={currentPage === (totalPages || 6)}
                        className={`p-1 ${
                          currentPage === (totalPages || 6)
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        } ${themeMode ? "text-gray-700" : "text-gray-300"}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                      <button
                        onClick={() => setCurrentPage(totalPages || 6)}
                        disabled={currentPage === (totalPages || 6)}
                        className={`p-1 ${
                          currentPage === (totalPages || 6)
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        } ${themeMode ? "text-gray-700" : "text-gray-300"}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="13 17 18 12 13 7"></polyline>
                          <polyline points="6 17 11 12 6 7"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div> */}
                </div>
              </div>
              {/* Comments Section */}
              {radio?._id && (
                <div className="mt-12">
                  <div ref={commentFormRef}>
                    <Comments postId={radio?._id} type={PostModels.artist} />
                  </div>
                </div>
              )}
            </div>

            <div className="min-w-[258px]">
              {/* Sidebar - Takes 1/3 of the grid */}
              <div className={``}>
                {/* Tags */}
                <div
                  className={`mt-6 mb-2 ${themeMode ? "bg-white" : "bg-[#242526]"} p-2 rounded-lg`}
                >
                  <h3
                    className={`text-lg font-semibold mb-2 ${themeMode ? "text-black" : "text-white"}`}
                  >
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-4 py-1 rounded-full text-sm ${
                        themeMode
                          ? "bg-[#F0E6FF] text-[#5A1073]"
                          : "bg-[#2FC4B2] text-white"
                      }`}
                    >
                      Wildlife
                    </span>
                    <span
                      className={`px-4 py-1 rounded-full text-sm ${
                        themeMode
                          ? "bg-[#F0E6FF] text-[#5A1073]"
                          : "bg-[#2FC4B2] text-white"
                      }`}
                    >
                      Wildlife
                    </span>
                  </div>
                </div>

                {/* Related Content */}
                <div
                  ref={containerRef}
                  className={` ${themeMode ? "bg-white" : "bg-[#242526]"} p-3 rounded-lg mt-6`}
                >
                  <h3
                    className={`text-lg font-semibold mb-4 ${themeMode ? "text-black" : "text-white"}`}
                  >
                    Related Content
                  </h3>
                  <div className="space-y-4 overflow-y-auto max-h-[300px] h-full">
                    {displayedRelatedAlbums.map((item) => (
                      <div key={item} className="flex gap-3">
                        <img
                          src={getVideoThumbnail(item?.songs?.[0]?.youTube)}
                          alt="Related content"
                          className="w-[60px] h-[60px] rounded-md object-cover"
                        />
                        <div>
                          <p
                            className={`twoLine text-sm ${themeMode ? "text-gray-900" : "text-white"}`}
                          >
                            {item?.title}
                          </p>
                          <p
                            className={`oneLine text-xs ${themeMode ? "text-gray-500" : "text-gray-400"}`}
                          >
                            {item?.userId?.length > 0
                              ? item.userId[0].nickname
                              : "Unknown"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Actions */}

              <div className="flex justify-center gap-3 items-center mt-2">
                <SocialShare
                  shareUrl={window.location.href}
                  title={radio.title || "Default Article Title"}
                />

                <button
                  className="flex items-center  gap-2 px-4 py-2 rounded-full bg-white shadow-md hover:bg-purple-100 transition text-sm font-medium w-[120px] h-[40px]"
                  style={{
                    color: themeMode ? "#5A1073" : "#2FC4B2",
                    backgroundColor: themeMode ? "white" : "#242526",
                  }}
                  onClick={() => handleScrollToCommentForm()}
                >
                  <BiCommentDetail className="text-lg" />
                  <span>Comment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TopArtist;

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import Layout from "../../Components/Layout";
// import { PageBasicProps } from "../../AppMain";
// import BreadCrumb from "../../Components/BreadCrumb";
// import topartist from "../../assets/svg/top-artist.svg";
// import topastistsinger from "../../assets/png/top-astist-singer.png";
// import singer from "../../assets/svg/artists1.svg";
// import { GoDotFill } from "react-icons/go";
// import { IoLocationOutline } from "react-icons/io5";
// import { BsCalendar2Date } from "react-icons/bs";
// import CommentSection from "./CommentSection";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Swiper as SwiperInstance } from "swiper";
// import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
// import useSWR from "swr";
// import { useParams } from "react-router-dom";
// import { Avatar } from "@chakra-ui/react";
// import CommentForm from "../../Components/Comment";
// import { PostModels } from "../../Constant/api-requests";
// import { ArticleToDisplay } from "../Home/NewsContent/Carousel";
// import { useSelector } from "react-redux";
// import { RootState } from "../../reducers";
// import {
//   addLastVisited,
//   get5RandomNewsByTags,
//   getLastVisitedId,
//   getTargetNews,
// } from "../../reducers/NewsReducer";
// import { useDispatch } from "react-redux";
// import Comments from "../../Components/common/Comments";
// interface Artist {
//   _id: string;
//   name: string;
//   profileImg: string;
//   description: string;
//   star: number;
//   __v: number;
// }

// interface User {
//   _id: string;
//   nickname: string;
//   email: string;
//   password: string;
//   role: string;
//   isVerified: boolean;
//   __v: number;
//   refreshToken: string | null;
//   profilePicture: string;
// }
// interface Radio {
//   _id: string;
//   title: string;
//   description: string;
//   youTube: string;
//   artists: Artist[];
//   userId: User;
//   tags: string;
//   thumbnail: string;
//   date: string;
//   confirmed: boolean;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   songs: string[];
// }
// const TopArtist: React.FC<PageBasicProps> = ({ themeMode, type }) => {
//   const swiperRef = useRef<SwiperInstance | null>(null);
//   const { id } = useParams<{ id: string }>();
//   const targetNewsSelected = useSelector((state: RootState) =>
//     getTargetNews(state, id)
//   );
//   // const url = useLocation().pathname;
//   const lastVisitedId = useSelector((state: RootState) =>
//     getLastVisitedId(state)
//   );
//   const dispatch = useDispatch();
//   const [pageData, setPageData] = useState<ArticleToDisplay>();
//   const [, ...tagsToRemap] = targetNewsSelected?.tags?.split("#") || [];
//   const tags = tagsToRemap;
//   const pageDataTags = useMemo(() => pageData?.tags || [], [pageData?.tags]);
//   const [showShareOptions, setShowShareOptions] = useState(false);

//   const relatedData: ArticleToDisplay[] = useSelector((state: RootState) =>
//     get5RandomNewsByTags(state, pageDataTags || [])
//   );
//   const filteredRelatedData = useMemo(() => {
//     return relatedData.filter((news) => data.news._id !== id);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [relatedData, id]);

//   useEffect(() => {
//     setPageData(targetNewsSelected);
//   }, [targetNewsSelected]);

//   useEffect(() => {
//     if (!lastVisitedId || lastVisitedId !== id) {
//       dispatch(addLastVisited(`${id}`));
//     }
//   }, [lastVisitedId, id, dispatch]);

//   const handleNext = () => {
//     if (swiperRef.current) {
//       swiperRef.current.slideNext();
//     }
//   };

//   const handlePrev = () => {
//     if (swiperRef.current) {
//       swiperRef.current.slidePrev();
//     }
//   };

//   // Fetch data
//   const fetcher = () =>
//     fetch(`http://localhost:8000/api/album/${id}`).then((res) => res.json());
//   const { data, error } = useSWR(`/api/album/${id}`, fetcher);
//   const [radio, setRadio] = useState<Radio | null>(null);

//   useEffect(() => {
//     if (data) {
//       setRadio(data);
//       // console.log(data, "album")
//     }
//   }, [data]);

//   if (error) return <div>Error loading data.</div>;
//   if (!radio)
//     return (
//       <div
//         className="flex justify-center items-center h-screen w-full"
//         style={{
//           backgroundColor: themeMode ? "white" : "black",
//         }}
//       >
//         <p
//           className="text-xl font-semibold"
//           style={{
//             color: themeMode ? "black" : "white",
//           }}
//         >
//           Loading...
//         </p>
//         <div
//           className="w-6 h-6 ml-2 border-4 border-t-transparent rounded-full animate-spin"
//           style={{
//             borderRightColor: themeMode ? "#5A1073" : "#2FC4B2",
//             borderBottomColor: themeMode ? "#5A1073" : "#2FC4B2",
//             borderLeftColor: themeMode ? "#5A1073" : "#2FC4B2",
//           }}
//         ></div>
//       </div>
//     );

//   return (
//     <Layout themeMode={themeMode} type={type}>
//       <div className="flex justify-center">
//         <div className="container">
//           {!type && (
//             <div className="md:mt-12 mt-8">
//               <BreadCrumb />
//             </div>
//           )}
//           <h2
//             className="text-5xl font-bold mt-5"
//             style={{
//               color: themeMode ? "#252733" : "#FFF",
//             }}
//           >
//             {radio.title}
//           </h2>

//           <img
//             src={radio.thumbnail}
//             className="w-full mt-12 rounded-xl"
//             alt="Thumbnail"
//           />
//           <div className="mt-7 flex gap-3 items-center">
//             <Avatar src={radio.artists[0]?.profileImg} />
//             <div>
//               <h2
//                 className="text-2xl font-semibold"
//                 style={{
//                   color: themeMode ? "#252733" : "#FFF",
//                 }}
//               >
//                 {radio.artists[0]?.name}
//               </h2>
//               <p
//                 style={{
//                   color: themeMode ? "#6D6E76" : "#fff",
//                 }}
//               >
//                 {radio.artists[0]?.description}
//               </p>
//             </div>
//           </div>
//           <div
//             className="p-6 rounded-2xl shadow-lg mt-6"
//             style={{ backgroundColor: themeMode ? "#FFF" : "#242526" }}
//           >
//             <p
//               className="flex gap-1 items-center font-medium"
//               style={{
//                 color: themeMode ? "#252733" : "#BBBCC0",
//               }}
//             >
//               4.9k Views
//               <span className="flex gap-2 items-center">
//                 <GoDotFill
//                   style={{
//                     color: themeMode ? "#D9D9D9" : "D9D9D9",
//                   }}
//                 />{" "}
//                 4 Hours Ago
//               </span>
//             </p>
//             <p
//               style={{
//                 color: themeMode ? "#6D6E76" : "#BBBCC0",
//               }}
//             >
//               {radio.description}
//             </p>
//             <button
//               className="mt-4 font-bold"
//               style={{
//                 color: themeMode ? "#5A1073" : "#3BD6C6",
//               }}
//             >
//               View More
//             </button>
//           </div>

//           {radio.songs.length > 0 && (
//             <div className="mt-12">
//               <h1
//                 className="text-xl font-semibold"
//                 style={{
//                   color: themeMode ? "black" : "#fff",
//                 }}
//               >
//                 Related Videos
//               </h1>
//               {/* Swiper for related videos */}
//               <div className="w-full mt-10 relative">
//                 <Swiper
//                   onSwiper={(swiper: any) => (swiperRef.current = swiper)}
//                   slidesPerView={4}
//                   spaceBetween={30}
//                   loop={true}
//                   breakpoints={{
//                     1200: { slidesPerView: 4 },
//                     1024: { slidesPerView: 2 },
//                     768: { slidesPerView: 2 },
//                     425: { slidesPerView: 1 },
//                   }}
//                 >
//                   {radio.songs.map((songId: string, index: number) => (
//                     <SwiperSlide key={index}>
//                       <div
//                         className="p-5 rounded-3xl mt-6"
//                         style={{
//                           backgroundColor: themeMode ? "#FFF" : "#242526",
//                           color: themeMode ? "black" : "#fff",
//                           borderRadius: "25px",
//                           border: `2px solid ${themeMode ? "#f8f8ff" : "#242526"}`,
//                         }}
//                       >
//                         <img src={singer} alt="img" className="w-full" />
//                         <button
//                           className="py-1 px-5 text-center rounded-full font-semibold mt-4"
//                           style={{
//                             backgroundColor: themeMode ? "#E8ECFE" : "#3BD6C6",
//                             color: themeMode ? "#5A1073" : "#5A1073",
//                           }}
//                         >
//                           {radio.tags}
//                         </button>
//                         <p className="mt-2 text-lg font-semibold">
//                           Drake Ignites the Stage with Spectacular New Concert
//                           Experience!
//                         </p>
//                         <div className="flex gap-2 items-center">
//                           <p
//                             className="flex gap-1 items-center"
//                             style={{
//                               color: themeMode ? "#9B9CA1" : "#9B9CA1",
//                             }}
//                           >
//                             <IoLocationOutline /> New York
//                           </p>
//                           <GoDotFill
//                             style={{
//                               color: themeMode ? "#D9D9D9" : "D9D9D9",
//                             }}
//                           />
//                           <p
//                             className="flex gap-1 items-center"
//                             style={{
//                               color: themeMode ? "#9B9CA1" : "#9B9CA1",
//                             }}
//                           >
//                             <BsCalendar2Date /> 20/4/2023
//                           </p>
//                         </div>
//                       </div>
//                     </SwiperSlide>
//                   ))}
//                 </Swiper>

//                 {/* Custom Navigation Buttons */}
//                 <div className="absolute top-1/2 left-[-40px] transform -translate-y-1/2 z-10">
//                   <button onClick={handlePrev} className="swiper-button-prev">
//                     <IoIosArrowBack className="text-3xl text-gray-600 hover:text-black" />
//                   </button>
//                 </div>

//                 <div className="absolute top-1/2 right-[-40px] transform -translate-y-1/2 z-10">
//                   <button onClick={handleNext} className="swiper-button-next">
//                     <IoIosArrowForward className="text-3xl text-gray-600 hover:text-black" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* <CommentSection themeMode={themeMode} type={type} /> */}
//           {/* <CommentForm
//             postModel={PostModels.news}
//             commentData={pageData?.commentsSection ?? null}
//           /> */}
//           {radio?._id && (
//             <Comments postId={radio?._id} type={PostModels.artist} />
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default TopArtist;
