import React, { useState, useEffect, useMemo } from "react";
import BreadCrumb from "../../Components/BreadCrumb";
import ContentTitle from "../../Components/ContentTitle";
import Layout from "../../Components/Layout";
import CommentForm from "../../Components/Comment";
import { Link, useLocation, useParams } from "react-router-dom";
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
import SocialShare from "../../Components/SocialShare/SocialShare";
import { PostModels } from "../../Constant/api-requests";
import defaultimg from "../../assets/svg/userIcon.svg";
import singer from "../../assets/png/ticketBanner.png";
import { color } from "framer-motion";
import { IoShareOutline } from "react-icons/io5";
import { BiCommentDetail } from "react-icons/bi";

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
  const url = useLocation().pathname;
  const lastVisitedId = useSelector((state: RootState) =>
    getLastVisitedId(state)
  );
  const dispatch = useDispatch();
  const [pageData, setPageData] = useState<ArticleToDisplay>();
  const [, ...tagsToRemap] = targetNewsSelected?.tags?.split("#") || [];
  const tags = tagsToRemap;
  const pageDataTags = useMemo(() => pageData?.tags || [], [pageData?.tags]);

  const relatedData: ArticleToDisplay[] = useSelector((state: RootState) =>
    get5RandomNewsByTags(state, pageDataTags || [])
  );
  const filteredRelatedData = useMemo(() => {
    return relatedData.filter((news) => data.news._id !== id);
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
      setNews(data);  // Set the fetched data to local state
    }
  }, [data]);
  // Handle loading and error states
  if (error) return <div>Error loading data.</div>;
  if (!news) return <div>Loading...</div>;
  const wordArray = tags ? data?.news?.tags.split(",").map((word: string) => word.trim()) : [];
  return (
    <Layout themeMode={themeMode} type={type}>
      <div className='flex justify-center '>
        <div className='container'>
          {type ? (
            ''
          ) : (
            <div className='md:mt-12 mt-8'>
              <BreadCrumb />
            </div>
          )}
          <div >
            <div>
              <div className='md:mt-7 mt-10'>
                <ContentTitle
                  titleType='NEWS'
                  title={data.news?.title || 'News Page Title'}
                />
              </div>
              <p
                className={`py-5 text-left ${!themeMode ? 'text-[#BBBCC0]' : 'text-[#6D6E76]'}`}
              >
                <b>{data.news?.intro}</b>
              </p>
              <div className='flex lg:flex-row flex-col justify-between mx-auto gap-5'>
                <div className="w-full ">
                  <Image
                    src={data?.news?.files?.[0] || defaultimg}
                    alt="Uploaded file"
                    className="rounded-2xl w-full h-[494px] border-solid border"
                  />
                  <DelayedComponent delay={200}>
                    <TipTap
                      themeMode={themeMode}
                      content={pageData?.content}
                      editable={false}
                    />
                    <div
                      className={`${themeMode ? "editorContainer" : "editorContainerDark"} min-h-screen ${themeMode === true ? "bg-gray-100" : "bg-gray-800"} p-4 mt-4 border border-gray-300 rounded-md min-h-[200px]`}
                      dangerouslySetInnerHTML={{ __html: data?.news?.content || "" }}
                    />
                    <CommentForm
                      postModel={PostModels.news}
                      commentData={pageData?.commentsSection ?? null}
                    />
                  </DelayedComponent>
                </div>
                <div className="w-[500px] mx-auto">
                  <div
                    className={`${!type ? (themeMode ? 'right-card' : 'right-card-dark') : ''
                      } mb-6  py-4 px-3`}
                  >
                    <div
                      className={`${themeMode ? 'tag-card-title' : 'tag-card-title-dark'} text-left md:mb-3 mb-4`}
                    >
                      Tagi
                    </div>
                    {tags ? (
                      <div className="flex flex-wrap gap-2 mt-2 md:mt-0 ">
                        {wordArray.map(
                          (tag: string, index: React.Key | null | undefined) =>
                            tag && (
                              <span
                                key={index}
                                className={`px-2 py-1 rounded-full md:text-sm text-[8px] font-semibold ${!themeMode && "btn-dark-bg-color"
                                  }`}
                                style={{
                                  backgroundColor: themeMode ? "#E8ECFE" : "#2FC4B2",
                                  color: themeMode ? "#5A1073" : "#5A1073",
                                }}
                              >
                                {tag}
                              </span>
                            )
                        )}
                      </div>
                    ) : (
                      <p style={{
                        color: themeMode ? "black" : "white"
                      }}>no tags here</p>
                    )}

                    {filteredRelatedData.length > 0 && (
                      <div
                        className={`${themeMode ? "right-card" : "right-card-dark"} px-3 py-4`}
                      >
                        <div
                          className={`${themeMode ? "tag-card-title" : "tag-card-title-dark"} text-left`}
                        >
                          Zobacz również
                        </div>
                        <div className={`flex flex-col gap-3 md:mt-3 mt-4`}>
                          {filteredRelatedData &&
                            filteredRelatedData.map((item) => (
                              <Link replace to={`/news/${item._id}`} key={item._id}>
                                <div className={`flex gap-3`}>
                                  <Image
                                    src={`${process.env.REACT_APP_FILES_URL + item.files[0].url}`}
                                    className="cursor-pointer object-cover"
                                    height={type ? "54px" : "62px"}
                                    width={type ? "54px" : "62px"}
                                    alt={item.files[0].name}
                                    borderRadius={type ? "8px" : "10px"}
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
                                      {item.title}
                                    </div>
                                    <p
                                      className={`mt-1 ${themeMode ? "text-stone-500" : "text-stone-300"} w-full text-left text-xs`}
                                    >
                                      {item.intro.slice(0, type ? 100 : 75) + "..."}
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
                  <div className="max-h-[400px] overflow-y-auto scrollbar-hide shadow-md rounded-2xl">
                    <div className={`rounded-lg mb-6  py-4 px-3 shadow-md`}>
                      <h2 className={`font-medium md:mb-3 mb-4 text-lg`} style={{
                        color: themeMode ? "black" : "white"
                      }}>
                        Related Content
                      </h2>

                      {data?.relatedNews?.map((newsItem: { _id: React.Key | null | undefined; files: any[]; title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; intro: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
                        <div key={newsItem._id} className="flex gap-2 mb-3">
                          <img src={newsItem?.files?.[0] || singer} alt="news thumbnail" className="h-[62px] w-[62px] object-cover rounded" />
                          <div>
                            <p className="text-xs font-semibold line-clamp-1" style={{ color: themeMode ? "black" : "white" }}>
                              {newsItem.title}
                            </p>
                            <p className="text-xs font-medium" style={{ color: themeMode ? "black" : "white" }}>
                              {newsItem.intro}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>



                  <div className="mt-6 flex justify-center">
                    <div className="flex gap-3">
                      {/* Share Button */}
                      <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md  hover:bg-purple-100 transition"
                      style={{
                        color: themeMode?"#5A1073":"#2FC4B2",
                        backgroundColor: themeMode ?"white":"#242526"
                      }}>
                        <IoShareOutline className="text-lg" />
                        <span className="text-sm font-medium">Share</span>
                      </button>

                      {/* Comment Button */}
                      <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md  hover:bg-purple-100 transition"
                      style={{
                        color: themeMode?"#5A1073":"#2FC4B2",
                        backgroundColor: themeMode ?"white":"#242526"
                      }}>
                        <BiCommentDetail className="text-lg" />
                        <span className="text-sm font-medium">Comment</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <>
              {/* {targetNewsSelected && pageData ? (
            <div className='flex md:flex-row flex-col gap-8'>
              <div className='md:w-4/6 w-full'>
                <div className='md:mt-7 mt-10'>
                  <ContentTitle
                    titleType='NEWS'
                    title={pageData?.title || 'News Page Title'}
                  />
                </div>
                <p
                  className={`py-5 text-left ${!themeMode ? 'text-[#BBBCC0]' : 'text-[#6D6E76]'}`}
                >
                  <b>{pageData?.intro}</b>
                </p>
                <Image
                  className={`rounded-2xl mx-auto border-solid border ${!themeMode && 'border-white'}`}
                  src={`${process.env.REACT_APP_FILES_URL}${pageData?.files[0].url}`}
                  alt='img'
                />
                <DelayedComponent delay={200}>
                  <TipTap
                    themeMode={themeMode}
                    content={pageData?.content}
                    editable={false}
                  />
                  <CommentForm
                    postModel={PostModels.news}
                    commentData={pageData?.commentsSection ?? null}
                  />
                </DelayedComponent>
              </div>
              <div className={`md:w-2/6 w-full`} style={{ marginTop: type ? '0px' : '300px' }}>
                <div
                  className={`${
                    !type ? (themeMode ? 'right-card' : 'right-card-dark') : ''
                  } mb-6 w-full py-4 px-3`}
                >
                  <div
                    className={`${themeMode ? 'tag-card-title' : 'tag-card-title-dark'} text-left md:mb-3 mb-4`}
                  >
                    Tagi
                  </div>
                  <div className={`flex flex-wrap gap-3`}>
                    {tags ? (
                      tags.map((tag, i) => (
                        <div
                          key={`article-key-tag-${tag + i}`}
                          className={`${themeMode ? 'category-tag' : 'category-tag-dark'}`}
                        >
                          {tag}
                        </div>
                      ))
                    ) : (
                      <div>No tags available</div>
                    )}
                  </div>
                </div>
                {filteredRelatedData.length > 0 && (
                  <div className={`${themeMode ? 'right-card' : 'right-card-dark'} px-3 py-4`}>
                    <div
                      className={`${themeMode ? 'tag-card-title' : 'tag-card-title-dark'} text-left`}
                    >
                      Zobacz również
                    </div>
                    <div className={`flex flex-col gap-3 md:mt-3 mt-4`}>
                      {filteredRelatedData &&
                        filteredRelatedData.map((item) => (
                          <Link replace to={`/news/${item._id}`} key={item._id}>
                            <div className={`flex gap-3`}>
                              <Image
                                src={`${process.env.REACT_APP_FILES_URL + item.files[0].url}`}
                                className='cursor-pointer object-cover'
                                height={type ? '54px' : '62px'}
                                width={type ? '54px' : '62px'}
                                alt={item.files[0].name}
                                borderRadius={type ? '8px' : '10px'}
                              />
                              <div className={`flex flex-col justify-center overflow-hidden`}>
                                <div
                                  className={`${themeMode ? 'tag-title' : 'tag-title-dark'} w-full text-left`}
                                  style={{
                                    fontSize: type ? '14px' : '12px',
                                  }}
                                >
                                  {item.title}
                                </div>
                                <p
                                  className={`mt-1 ${themeMode ? 'text-stone-500' : 'text-stone-300'} w-full text-left text-xs`}
                                >
                                  {item.intro.slice(0, type ? 100 : 75) + '...'}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
                <SocialShare
                  themeMode={themeMode}
                  url={url}
                  title={`${pageData?.title}`}
                />
              </div>
            </div>
          ) : (
            <div>No content available</div>
          )} */}
            </>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArticleDetailPage;
