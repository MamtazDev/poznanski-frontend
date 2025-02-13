import React, { useState, useEffect, useMemo } from "react";
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
import defaultimg from "../../assets/svg/userIcon.svg";
import singer from "../../assets/png/ticketBanner.png";
import BreadCrumb from './../../Components/BreadCrumb/index';
import SocialShare from "../../Components/SocialShare/SocialShare";

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
  const tags = tagsToRemap;
  const pageDataTags = useMemo(() => pageData?.tags || [], [pageData?.tags]);
  // const [showShareOptions, setShowShareOptions] = useState(false);

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
      setNews(data);  // Set the fetched data to local state
    }
  }, [data]);

  if (error) return <div>Error loading data.</div>;
  if (!news) return (
    <div className="flex justify-center items-center h-screen w-full"
      style={{
        backgroundColor: themeMode ? "white" : "black"
      }}>
      <p className="text-xl font-semibold " style={{
        color: themeMode ? "black" : "white"
      }} >Loading...</p>
      <div className="w-6 h-6 ml-2 border-4 border-t-transparent rounded-full animate-spin"
        style={{
          borderRightColor: themeMode ? "#5A1073" : "#2FC4B2",
          borderBottomColor: themeMode ? "#5A1073" : "#2FC4B2",
          borderLeftColor: themeMode ? "#5A1073" : "#2FC4B2",
        }}>
      </div>
    </div>
  );



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
                <div className="lg:w-[500px] lg:mx-auto">
                  <div
                    className={`shadow-md rounded-2xl ${!type ? (themeMode ? 'right-card' : 'right-card-dark') : ''
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
                                className={`px-2 py-1 rounded-full md:text-sm text-[10px] font-semibold ${!themeMode && "btn-dark-bg-color"
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
                  <div className="max-h-[500px] overflow-y-auto scrollbar-hide shadow-md rounded-2xl relative">
                    <div className="rounded-lg py-4 px-3">
                      <h2 className="font-semibold md:mb-3 mb-4 text-xl" style={{ color: themeMode ? "black" : "white" }}>
                        Related Content
                      </h2>

                      {data?.relatedNews?.map((newsItem: { _id: React.Key | null | undefined; files: any[]; title: string | number | boolean | React.ReactElement; intro: string | number | boolean | React.ReactElement }) => (
                        <div key={newsItem._id} className={`flex gap-2 mb-3 p-2 rounded-2xl transition-colors duration-300
                          ${themeMode ? "hover:bg-[#FFFFFF] hover:shadow-lg" : "hover:bg-[#242526]"}`}

                        >
                          <img src={newsItem?.files?.[0] || singer} alt="news thumbnail" className="h-[62px] w-[62px] object-cover rounded" />
                          <div>
                            <p className="font-semibold line-clamp-1" style={{ color: themeMode ? "black" : "white" }}>
                              {newsItem.title}
                            </p>
                            <p className="text-sm font-medium line-clamp-1" style={{ color: themeMode ? "black" : "white" }}>
                              {newsItem.intro}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Sticky See More Button */}
                    <div className="sticky bottom-0 py-3 text-center shadow-md"
                      style={{
                        backgroundColor: themeMode ? "white" : "#242526"
                      }}>
                      <Link to="/news" className="font-semibold" style={{
                        color: themeMode ? "#5A1073" : "#2FC4B2",
                      }}>See More..</Link>
                    </div>
                  </div>
                  <SocialShare
                    shareUrl="https://yourwebsite.com/article"
                    title="Check out this amazing article!" />
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
