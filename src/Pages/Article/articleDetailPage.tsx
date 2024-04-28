import React, { useState, useEffect } from "react";
import BreadCrumb from "../../Components/BreadCrumb";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import Layout from "../../Components/Layout";
import Comment from "../../Components/Comment";
import { useParams } from "react-router-dom";
import { Image, Spinner } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "../mainPageStyle.css";
import { apiGetReq } from "../../Constant/api-functions";
import { fileUrl } from "../../Constant/config";
import { changeData1 } from "../../Constant/helpers";

interface TagData {
  _id: string;
  name: string;
}

interface PageDataProps {
  tagData: {
    _id: string;
    name: string;
  }[];
}

interface Content {
  subHead: string;
  img: string;
  description: string;
}

interface News {
  id: string;
  title: string;
  feature: string;
  date: string;
  content: Content[];
  link: string;
}

interface inputNews {
  _id: string;
  title: string;
  tag: string;
  date: string;
  content: Content[];
  link: string;
}

interface inputComment {
  _id: string;
  entityId: string;
  commentId: string;
  name: string;
  email: string;
  website: string;
  comment: string;
}

interface Comment {
  id: string;
  img: string;
  comment: string;
}

const ArticleDetailPage: React.FC<PageDataProps> = (props) => {
  const { id } = useParams<{ id: string }>();
  const [type, setType] = useState<boolean>(false);
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageData, setPageData] = useState<News>();
  const [relatedData, setRelatedData] = useState<News[]>();
  const [tags, setTags] = useState<TagData[]>([]);

  useEffect(() => {
    setTags(props.tagData);
  }, [props.tagData]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setType(true);
      } else {
        setType(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    apiGetReq("/news/id", { id }).then((res) => {
      setLoading(false);
      let newsContent: Content[] = [];
      res.news[0].content.map((item: Content) => {
        newsContent.push({
          subHead: item.subHead,
          img: fileUrl + item.img,
          description: item.description,
        });
      });
      const formattedDate1 = changeData1(res.news[0].date);
      setPageData({
        id: res.news[0]._id,
        title: res.news[0].title,
        feature: res.news[0].tag,
        date: formattedDate1,
        content: newsContent,
        link: res.news[0].link,
      });
      let relatedNews: News[] = [];
      res.relatedNews.map((item: inputNews) => {
        const formattedDate2 = changeData1(item.date);
        let newRelatedContent: Content[] = [];
        item.content.map((contentData) => {
          newRelatedContent.push({
            subHead: contentData.subHead,
            img: fileUrl + contentData.img,
            description: contentData.description,
          });
        });
        const temp: News = {
          id: item._id,
          title: item.title,
          feature: item.tag,
          content: newRelatedContent,
          date: formattedDate2,
          link: item.link,
        };
        relatedNews.push(temp);
      });
      setRelatedData(relatedNews);
    });
  }, [id]);

  useEffect(() => {}, [id]);

  return (
    <Layout>
      <div className="flex justify-center">
        <div className="container">
          {type ? (
            ""
          ) : (
            <div className="md:mt-12 mt-8">
              <BreadCrumb routeName={["Home", "News"]} />
            </div>
          )}
          <div className="flex md:flex-row flex-col gap-8">
            <div className="md:w-4/5 w-full">
              <div className="md:mt-7 mt-10">
                <ContentTitle
                  titleType="NEWS"
                  title={pageData?.title || "News Page Title"}
                />
              </div>
              <div className="md:mt-6 mt-4">
                <FilterInput type={type} />
              </div>
              <div className={`md:mt-16 mt-8`}>
                {loading ? (
                  <div className="w-full h-full flex justify-center items-center">
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue.500"
                      size="lg"
                    />
                  </div>
                ) : (
                  <div className={`flex flex-col w-full`}>
                    {pageData?.content.map((item, idx) => (
                      <div className="flex flex-col w-full md:mb-12 mb-6">
                        <Image
                          src={item.img}
                          className="cursor-pointer object-cover w-full"
                          height={type ? "257px" : "494px"}
                          alt={item.img}
                          borderRadius={type ? "16px" : "25px"}
                        />
                        <div
                          className={`${themeMode ? "sub-head" : "sub-head-dark"} text-left md:mt-12 mt-6`}
                          style={{ fontSize: type ? "18px" : "20px" }}
                        >
                          {item.subHead}
                        </div>
                        <div
                          className={`${themeMode ? "description" : "description-dark"} md:mt-6 mt-4 text-left`}
                          style={{ lineHeight: type ? "26.5px" : "24px" }}
                        >
                          {item.description}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div
              className={`md:w-1/5 w-full`}
              style={{ marginTop: type ? "0px" : "300px" }}
            >
              <div
                className={`${!type ? (themeMode ? "right-card" : "right-card-dark") : ""} mb-6 w-full py-4 px-3`}
              >
                <div
                  className={`${themeMode ? `tag-card-title` : `tag-card-title-dark`} text-left md:mb-3 mb-4`}
                >
                  tags
                </div>
                <div className={`flex flex-wrap gap-3`}>
                  {tags ? (
                    tags.map((tag, idx) => (
                      <div
                        key={`article-key-tag-${idx}`}
                        className={`${themeMode ? "category-tag" : `category-tag-dark`}`}
                      >
                        {tag.name}
                      </div>
                    ))
                  ) : (
                    <div className="w-full h-full flex justify-center items-center">
                      <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="lg"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`${themeMode ? "right-card" : "right-card-dark"} px-3 py-4`}
              >
                <div
                  className={`${themeMode ? `tag-card-title` : `tag-card-title-dark`} text-left`}
                >
                  Related Content
                </div>
                <div className={`flex flex-col gap-3 md:mt-3 mt-4`}>
                  {relatedData &&
                    relatedData.map((item, idx) => (
                      <div className={`flex gap-3`}>
                        <Image
                          src={item.content[0].img}
                          className="cursor-pointer object-cover"
                          height={type ? "54px" : "62px"}
                          width={type ? "54px" : "62px"}
                          alt={item.content[0].img}
                          borderRadius={type ? "8px" : "10px"}
                        />
                        <div className={`flex flex-col justify-center`}>
                          <div
                            className={`${themeMode ? "tag-title" : "tag-title-dark"} w-full text-left`}
                            style={{ fontSize: type ? "14px" : "12px" }}
                          >
                            {item.title}
                          </div>
                          <div
                            className={`mt-1 ${themeMode ? "tag-sub-title" : "tag-sub-title-dark"} w-full text-left`}
                          >
                            {item.content[0].subHead}
                          </div>
                        </div>
                      </div>
                    ))}
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
