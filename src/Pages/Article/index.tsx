import React, { useState, useEffect, ChangeEvent } from "react";
import BreadCrumb from "../../Components/BreadCrumb";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import PaginationBar from "../../Components/PaginationBar";
import { apiGetReq } from "../../Constant/api-functions";
import Layout from "../../Components/Layout";
import { fileUrl } from "../../Constant/config";
import ProductCard1 from "../../Components/Card/ProductCard1";
import { Spinner } from "@chakra-ui/react";
import "../mainPageStyle.css";

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

const ArticleMainPage = () => {
  const [type, setType] = useState<boolean>(false);
  const [selectedPage, setSelectedPage] = useState<string>("1");
  const [pages, setPages] = useState<string>("0");
  const [rowsPerPage, setRowsPerPage] = useState<number>(12);
  const [filterText, setFilterText] = useState<string>("");
  const [cardData, setCardData] = useState<News[]>([]);
  const [cardNum, setCardNum] = useState<number>(4);
  const [lineNum, setLineNum] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setRowsPerPage(cardNum * lineNum);
  }, [cardNum, lineNum]);

  const handleData = (response: any) => {
    let newsData: News[] = [];
    const pages = Math.ceil(response.all / rowsPerPage);
    setPages(pages.toString());
    response.news.map((item: inputNews) => {
      const inputDate: Date = new Date(item.date);
      const options: object = {
        year: "numeric",
        day: "numeric",
        month: "long",
      };
      const formattedDate: string = inputDate.toLocaleDateString(
        "en-US",
        options
      );
      let newContent: Content[] = [];
      item.content.map((contentData) => {
        newContent.push({
          subHead: contentData.subHead,
          img: fileUrl + contentData.img,
          description: contentData.description,
        });
      });
      const temp: News = {
        id: item._id,
        title: item.title,
        feature: item.tag,
        content: newContent,
        date: formattedDate,
        link: item.link,
      };
      newsData.push(temp);
    });
    setCardData(newsData);
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
            setLineNum(7);
          }
        }
      }

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

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(e.target.value));
  };

  useEffect(() => {
    setLoading(true);
    apiGetReq("/news", {
      rowsPerPage: rowsPerPage,
      curPage: selectedPage,
      filter: filterText,
    })
      .then((res) => {
        handleData(res);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    apiGetReq("/news", {
      rowsPerPage: rowsPerPage,
      curPage: selectedPage,
      filter: filterText,
    })
      .then((res) => {
        handleData(res);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [selectedPage, rowsPerPage, filterText]);

  const handleClick = (id: string) => {
    console.log(id);
    console.log("cil");
  };

  return (
    <>
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
            <div className="md:mt-7 mt-10">
              <ContentTitle titleType="NEWS" title="See Our Latest News" />
            </div>
            <div className="md:mt-6 mt-4">
              <FilterInput type={type} />
            </div>
            <div
              className={`md:mt-12 mt-8`}
              style={{ minHeight: type ? "843px" : "1235.7px", width: "100%" }}
            >
              {loading ? (
                <div
                  className="w-full flex justify-center items-center"
                  style={{ minHeight: type ? "776px" : "908px" }}
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
                  className={`grid ${cardNum === 4 && "grid-cols-4"} ${cardNum === 3 && "grid-cols-3"} ${cardNum === 2 && "grid-cols-2"} gap-4 py-5`}
                >
                  {cardData.map(
                    (item, index) =>
                      item && (
                        <div key={`main-news-card-${index}`} className="w-full">
                          <ProductCard1
                            type={type ? "vertical" : "horizontal"}
                            img={item.content[0].img}
                            feature={item.feature}
                            title={item.title}
                            date={item.date}
                            id={item.id}
                          />
                        </div>
                      )
                  )}
                </div>
              )}
            </div>
            <div className={`flex ${type ? "justify-center" : "justify-end"}`}>
              {/* {!type && (
                <div className={`flex gap-3`}>
                  <div
                    className={`flex items-center rows-text rows-text`}
                    style={{ color: themeMode ? "#252733" : "#FFF" }}
                  >
                    Show
                  </div>
                  <Select
                    color={themeMode ? "black" : "white"}
                    backgroundColor={themeMode ? "" : "#242526"}
                    width={type ? "" : "55px"}
                    height={type ? "" : "26px"}
                    onChange={handleSelectChange}
                    fontSize={type ? "" : "14px"}
                    outline={"unset"}
                    border={"unset"}
                  >
                    <option
                      style={{
                        color: themeMode ? "black" : "white",
                        backgroundColor: themeMode ? "white" : "#242526",
                      }}
                      value="5"
                    >
                      5
                    </option>
                    <option
                      style={{
                        color: themeMode ? "black" : "white",
                        backgroundColor: themeMode ? "white" : "#242526",
                      }}
                      value="10"
                    >
                      10
                    </option>
                    <option
                      style={{
                        color: themeMode ? "black" : "white",
                        backgroundColor: themeMode ? "white" : "#242526",
                      }}
                      value="15"
                    >
                      15
                    </option>
                  </Select>
                  <div
                    className={`flex items-center gap-2 rows-text`}
                    style={{ color: themeMode ? "#252733" : "#FFF" }}
                  >
                    entries
                  </div>
                </div>
              )} */}
              <PaginationBar
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
                pages={pages}
              />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ArticleMainPage;
