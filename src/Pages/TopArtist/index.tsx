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
import { openPlayer } from "../../reducers/PlayerReducer";
import { useDispatch } from "react-redux";

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
  youTube: string;
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
  const dispatch = useDispatch();

  const handlePlay = (item: any) => {
    // console.log(item, "item")
    const youTubeLink = item?.youTube;
    if (youTubeLink) {
      const videoId = youTubeLink.split("v=")[1]?.split("&")[0];
      if (videoId) {
        dispatch(openPlayer(videoId));
      }
    }
  };
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
  const [showFullDescription, setShowFullDescription] = useState(false);
  const toggleDescription = () => setShowFullDescription(!showFullDescription);
  const currentSongs: ISong[] =
    (radio?.songs as unknown as ISong[])
      ?.slice(indexOfFirstSong, indexOfLastSong)
      .map((song) => ({
        _id: song._id,
        youTube: song.youTube,
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

  // console.log(currentSongs);

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
          className={`w-6 h-6 ml-2 border-4 border-t-transparent rounded-full animate-spin ${themeMode
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
            className={`md:text-5xl text-2xl font-bold mt-5 ${themeMode ? "text-[#252733]" : "text-white"}`}
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
                <div style={{ backgroundColor: themeMode ? "#FFF" : "#242526" }}>
                  <p style={{ color: themeMode ? "#6D6E76" : "#BBBCC0" }}>
                    {showFullDescription ? radio.description : radio.description?.slice(0, 200) + (radio.description.length > 100 ? "..." : "")}
                  </p>
                  {radio.description.length > 100 && (
                    <button
                      className="mt-4 font-bold"
                      style={{ color: themeMode ? "#5A1073" : "#3BD6C6" }}
                      onClick={toggleDescription}
                    >
                      {showFullDescription ? "View Less" : "View More"}
                    </button>
                  )}
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="w-full mt-8">
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
                          className={`w-full flex items-center gap-4 p-4 rounded-lg ${themeMode
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
                            </div>
                          </div>

                          <div className="flex justify-end items-center flex-grow gap-4">
                            <div className="w-full hidden lg:block">
                              <span
                                className={`text-start ${themeMode ? "text-gray-700" : "text-gray-300"}`}
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
                                onClick={() => handlePlay(item)}
                                className={`rounded-full p-2 ${themeMode
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
                      className={`px-4 py-1 rounded-full text-sm ${themeMode
                        ? "bg-[#F0E6FF] text-[#5A1073]"
                        : "bg-[#2FC4B2] text-white"
                        }`}
                    >
                      Wildlife
                    </span>
                    <span
                      className={`px-4 py-1 rounded-full text-sm ${themeMode
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
