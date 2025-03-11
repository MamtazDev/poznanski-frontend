import React, { useState, useEffect, useMemo, useRef } from "react";
import ContentTitle from "../../Components/ContentTitle";
import Layout from "../../Components/Layout";
import CommentForm from "../../Components/Comment";
import { Link, useParams } from "react-router-dom";
import { Image } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "../mainPageStyle.css";
import { PageBasicProps } from "../../AppMain";
import { ArticleToDisplay } from "../Home/NewsContent/Carousel";
import {
  addLastVisited,
  get5RandomNewsByTags,
  getLastVisitedId,
  getTargetNews,
} from "../../reducers/NewsReducer";
import useSWR from "swr";
import TipTap from "../../Components/TipTap/TipTap";
import DelayedComponent from "../../Components/_utility/DelayedComponent";
import { PostModels } from "../../Constant/api-requests";
import defaultimg from "../../assets/png/novideo.png";
import singer from "../../assets/png/ticketBanner.png";
import BreadCrumb from "./../../Components/BreadCrumb/index";
import SocialShare from "../../Components/SocialShare/SocialShare";
import { BiCommentDetail } from "react-icons/bi";
import Comments from "../../Components/common/Comments";

// eslint-disable-next-line @typescript-eslint/no-redeclare
interface CommentForm {
  id: string;
  img: string;
  comment: string;
}

const ArticleDetailPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
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
  const [loading, setLoading] = useState(true);

  const tags = tagsToRemap;
  const pageDataTags = useMemo(() => pageData?.tags || [], [pageData?.tags]);
  // const [showShareOptions, setShowShareOptions] = useState(false);

  const commentFormRef = useRef<HTMLDivElement | null>(null);

  const handleScrollToCommentForm = () => {
    if (commentFormRef.current) {
      commentFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      }); // ✅ No error
    }
  };

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

  // dihan

  // create a function to fetch from api
  // set data to a useState
  let urlEndoint = "http://localhost:8000/api/news";
  const fetcher = () =>
    fetch(`http://localhost:8000/api/news/${id}`).then((res) => res.json());
  const { data, error } = useSWR(`${urlEndoint}/${id}`, fetcher);
  // Local state to store the response
  const [news, setNews] = useState(null);
  // When the data is fetched, set it to the local state
  useEffect(() => {
    if (data) {
      setNews(data); // Set the fetched data to local state
    }
  }, [data]);

  const [relatedNewsPage, setRelatedNewsPage] = useState(1);
  const [hasMoreRelated, setHasMoreRelated] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [displayedRelatedNews, setDisplayedRelatedNews] = useState<any[]>([]);
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ITEMS_PER_PAGE = 6;

  // Add this effect to load first page when component mounts
  useEffect(() => {
    if (id) {
      fetchMoreRelatedNews(1);
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
        fetchMoreRelatedNews(relatedNewsPage + 1);
        setRelatedNewsPage((prev) => prev + 1);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMoreRelated, loadingMore, relatedNewsPage]);

  // Update the fetch function to handle errors better
  const fetchMoreRelatedNews = async (pageNumber: number) => {
    try {
      setLoadingMore(true);
      const response = await fetch(
        `${urlEndoint}/${id}/related?page=${pageNumber}&limit=${ITEMS_PER_PAGE}`
      );
      const newData = await response.json();

      if (newData?.relatedNews?.length) {
        if (pageNumber === 1) {
          // For first page, replace existing data
          setDisplayedRelatedNews(newData.relatedNews);
        } else {
          // For subsequent pages, append data
          setDisplayedRelatedNews((prev) => [...prev, ...newData.relatedNews]);
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

  if (error) return <div>Error loading data.</div>;
  // if (loading) return <p>Loading...</p>;
  if (!news)
    return (
      <div
        className="flex justify-center items-center h-screen w-full"
        style={{
          backgroundColor: themeMode ? "white" : "black",
        }}
      >
        <p
          className="text-xl font-semibold "
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

  const wordArray =
    data?.news?.tags && typeof data?.news?.tags === "string"
      ? data?.news?.tags.split(",").map((word: string) => word.trim())
      : [];

  // console.log("wordArray", wordArray, typeof data?.news?.tags);

  return (
    <Layout themeMode={themeMode} type={type}>
      <div className="flex justify-center ">
        <div className="container">
          {type ? (
            ""
          ) : (
            <div className="md:mt-12 mt-8">
              <BreadCrumb />
            </div>
          )}
          <div>
            <div>
              <div className="md:mt-7 mt-10">
                <ContentTitle
                  titleType="NEWS"
                  title={data?.news?.title || "News Page Title"}
                />
              </div>
              <p
                className={`py-5 text-left ${!themeMode ? "text-[#BBBCC0]" : "text-[#6D6E76]"}`}
              >
                <b>{data?.news?.intro}</b>
              </p>
              <div className="flex lg:flex-row flex-col justify-between mx-auto gap-5">
                <div className="lg:w-[900px]">
                  <Image
                    src={data?.news?.files?.[0] || defaultimg}
                    alt="Uploaded file"
                    className="rounded-2xl w-full md:h-[494px] object-cover flex justify-center"
                  />
                  <DelayedComponent delay={200}>
                    <TipTap
                      themeMode={themeMode}
                      content={pageData?.content}
                      editable={false}
                    />
                    <div
                      className={`${themeMode ? "editorContainer" : "editorContainerDark"} h-full p-4 mt-4  rounded-md `}
                      dangerouslySetInnerHTML={{
                        __html: data?.news?.content || "",
                      }}
                      style={{
                        color: themeMode ? "black" : "white",
                      }}
                    />
                    {/* <CommentForm
                      // ref={commentFormRef}
                      postModel={PostModels.news}
                      commentData={pageData?.commentsSection ?? null}
                    /> */}
                    <div ref={commentFormRef}>
                      {data?.news?._id && (
                        <Comments
                          postId={data?.news?._id}
                          type={PostModels.news}
                        />
                      )}
                    </div>
                  </DelayedComponent>
                </div>
                <div className=" lg:w-[400px] lg:mx-auto">
                  <div
                    className={`shadow-md rounded-2xl ${
                      !type
                        ? themeMode
                          ? "right-card"
                          : "right-card-dark"
                        : ""
                    } mb-6  py-4 px-3`}
                  >
                    <div
                      className={`${themeMode ? "tag-card-title" : "tag-card-title-dark"} text-left md:mb-3 mb-4`}
                    >
                      Tagi
                    </div>
                    {tags ? (
                      <div className="flex flex-wrap gap-2 mt-2 md:mt-0 ">
                        {wordArray?.map(
                          (tag: string, index: React.Key | null | undefined) =>
                            tag && (
                              <span
                                key={index}
                                className={`px-2 py-1 rounded-full md:text-sm text-[10px] font-semibold ${
                                  !themeMode && "btn-dark-bg-color"
                                }`}
                                style={{
                                  backgroundColor: themeMode
                                    ? "#E8ECFE"
                                    : "#2FC4B2",
                                  color: themeMode ? "#5A1073" : "#5A1073",
                                }}
                              >
                                {tag}
                              </span>
                            )
                        )}
                      </div>
                    ) : (
                      <p
                        style={{
                          color: themeMode ? "black" : "white",
                        }}
                      >
                        no tags here
                      </p>
                    )}

                    {filteredRelatedData?.length > 0 && (
                      <div
                        className={`${themeMode ? "right-card" : "right-card-dark"} px-3 py-4`}
                      >
                        <div
                          className={`${themeMode ? "tag-card-title" : "tag-card-title-dark"} text-left`}
                        >
                          Zobacz również
                        </div>
                        <div className={`flex flex-col gap-3 md:mt-3 mt-4`}>
                          {displayedRelatedNews.map((newsItem, index) => (
                            <Link
                              to={`/news/${newsItem._id}`}
                              key={newsItem._id}
                            >
                              <div
                                ref={
                                  index === displayedRelatedNews.length - 1
                                    ? lastItemRef
                                    : null
                                }
                                className={`flex gap-2 mb-3 p-2 rounded-2xl transition-colors duration-300
                                ${themeMode ? "hover:bg-[#FFFFFF] hover:shadow-lg" : "hover:bg-[#242526]"}`}
                              >
                                <img
                                  src={newsItem?.files?.[0] || singer}
                                  alt="news thumbnail"
                                  className="h-[62px] w-[62px] object-cover rounded"
                                />
                                <div
                                  className={`flex flex-col justify-center overflow-hidden`}
                                >
                                  <div
                                    className={`${themeMode ? "tag-title" : "tag-title-dark"} w-full text-left`}
                                    style={{
                                      fontSize: type ? "14px" : "12px",
                                    }}
                                  >
                                    {newsItem.title}
                                  </div>
                                  <p
                                    className={`mt-1 ${themeMode ? "text-stone-500" : "text-stone-300"} w-full text-left text-xs`}
                                  >
                                    {newsItem.intro.slice(0, type ? 100 : 75) +
                                      "..."}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* <SocialShare
                  themeMode={themeMode}
                  url={url}
                  title={`${pageData?.title}`}
                /> */}
                  </div>
                  {/* Related Content */}
                  {(displayedRelatedNews.length > 0 || loadingMore) && (
                    <div className="shadow-md rounded-2xl relative">
                      {/* Sticky header */}
                      <div
                        className="sticky top-0 z-10 py-4 px-3 rounded-t-2xl"
                        style={{
                          backgroundColor: themeMode ? "white" : "#242526",
                          borderBottom: themeMode
                            ? "1px solid #eee"
                            : "1px solid #333",
                        }}
                      >
                        <h2
                          className="font-semibold text-xl"
                          style={{ color: themeMode ? "black" : "white" }}
                        >
                          Related Content
                        </h2>
                      </div>

                      {/* Scrollable content */}
                      <div
                        ref={containerRef}
                        className="max-h-[500px] overflow-y-auto scrollbar-hide"
                      >
                        <div className="py-4 px-3">
                          {loadingMore && displayedRelatedNews.length === 0 ? (
                            <div className="flex justify-center py-4">
                              <div
                                className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                                style={{
                                  borderColor: themeMode
                                    ? "#5A1073"
                                    : "#2FC4B2",
                                  borderTopColor: "transparent",
                                }}
                              ></div>
                            </div>
                          ) : displayedRelatedNews.length > 0 ? (
                            <>
                              <div className="space-y-3">
                                {displayedRelatedNews.map((newsItem, index) => (
                                  <Link
                                    to={`/news/${newsItem._id}`}
                                    key={newsItem._id}
                                  >
                                    <div
                                      ref={
                                        index ===
                                        displayedRelatedNews.length - 1
                                          ? lastItemRef
                                          : null
                                      }
                                      className={`flex gap-2 p-2 rounded-2xl transition-colors duration-300
                                      ${themeMode ? "hover:bg-[#FFFFFF] hover:shadow-lg" : "hover:bg-[#242526]"}`}
                                    >
                                      <img
                                        src={newsItem?.files?.[0] || singer}
                                        alt="news thumbnail"
                                        className="h-[62px] w-[62px] object-cover rounded"
                                      />
                                      <div>
                                        <p
                                          className="font-semibold line-clamp-1"
                                          style={{
                                            color: themeMode
                                              ? "black"
                                              : "white",
                                          }}
                                        >
                                          {newsItem.title}
                                        </p>
                                        <p
                                          className="text-sm font-medium line-clamp-1"
                                          style={{
                                            color: themeMode
                                              ? "black"
                                              : "white",
                                          }}
                                        >
                                          {newsItem.intro}
                                        </p>
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                              {/* Bottom Loading Indicator */}
                              {loadingMore && (
                                <div className="sticky bottom-0 left-0 right-0 py-3 bg-gradient-to-t from-white dark:from-[#242526] to-transparent">
                                  <div className="flex justify-center items-center gap-2">
                                    <div
                                      className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                                      style={{
                                        borderColor: themeMode
                                          ? "#5A1073"
                                          : "#2FC4B2",
                                        borderTopColor: "transparent",
                                      }}
                                    ></div>
                                    <span
                                      style={{
                                        color: themeMode
                                          ? "#5A1073"
                                          : "#2FC4B2",
                                      }}
                                    >
                                      Loading more...
                                    </span>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : null}
                        </div>
                        {/* Sticky See More Button - only show if there are more items to load and not currently loading */}
                        {hasMoreRelated && !loadingMore && (
                          <div
                            className="sticky bottom-0 py-3 text-center shadow-md"
                            style={{
                              backgroundColor: themeMode ? "white" : "#242526",
                            }}
                          >
                            <Link
                              to="/news"
                              className="font-semibold"
                              style={{
                                color: themeMode ? "#5A1073" : "#2FC4B2",
                              }}
                            >
                              See More..
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 items-center mt-2">
                    <SocialShare
                      shareUrl={window.location.href}
                      title={data?.news?.title || "Default Article Title"}
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
        </div>
      </div>
    </Layout>
  );
};

export default ArticleDetailPage;
