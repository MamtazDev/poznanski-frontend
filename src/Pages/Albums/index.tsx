import React, { ChangeEvent, useState, useEffect } from "react";
import BreadCrumb from "../../Components/BreadCrumb";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import PaginationBar from "../../Components/PaginationBar";
import { apiGetReq } from "../../Constant/api-functions";
import Layout from "../../Components/Layout";
import { fileUrl } from "../../Constant/config";
import NewReleaseCard from "../../Components/Card/NewReleaseCard";
import { Spinner } from "@chakra-ui/react";
import "../mainPageStyle.css";
import { PageBasicProps } from "../../AppMain";

interface Product {
  id: string;
  title: string;
  img: string;
  category: string;
  date: string;
  link: string;
  location: string;
  artist: string;
  star: number;
}
interface inputProducts {
  _id: string;
  title: string;
  img: string;
  category: string;
  date: string | Date;
  link: string;
  location: string;
  artist: string;
  star: number;
}

const AlbumsMainPage: React.FC<PageBasicProps> = ({themeMode, type}) => {
  const [selectedPage, setSelectedPage] = useState<string>("1");
  const [pages, setPages] = useState<string>("0");
  const [rowsPerPage, setRowsPerPage] = useState<number>(12);
  const [filterText, setFilterText] = useState<string>("");
  const [cardData, setCardData] = useState<Product[]>([]);
  const [cardNum, setCardNum] = useState<number>(4);
  const [lineNum, setLineNum] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);
    const [filters, setFilters] = useState({
      sort: "A to Z",
      limit: 7,
      startDate: "",
      endDate: "",
      order:"desc"
    });

  const handleData = (response: any) => {
    let newProducts: Product[] = [];
    const pages = Math.ceil(response.all / rowsPerPage);
    setPages(pages.toString());
    response.products.map((item: inputProducts) => {
      const inputDate: Date = new Date(item.date);
      const formattedDate =
        inputDate.getDate() +
        "/" +
        (inputDate.getMonth() + 1) +
        "/" +
        inputDate.getFullYear();
      const temp: Product = {
        id: item._id,
        title: item.title,
        img: fileUrl + item.img,
        category: item.category,
        date: formattedDate,
        link: item.link,
        location: item.location,
        artist: item.artist,
        star: item.star,
      };
      newProducts.push(temp);
    });
    setCardData(newProducts);
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

  useEffect(() => {
    setRowsPerPage(cardNum * lineNum);
  }, [cardNum, lineNum]);

  useEffect(() => {
    setLoading(true);
    apiGetReq("/product", {
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
    apiGetReq("/product", {
      rowsPerPage: rowsPerPage,
      curPage: selectedPage,
      filter: filterText,
    })
      .then((res) => {
        setLoading(false);
        handleData(res);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [selectedPage, rowsPerPage, filterText]);

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
              <ContentTitle titleType="NEW RELEASES" title="New Releases" />
            </div>
            <div className="md:mt-6 mt-4">
              <FilterInput type={type} filterText={filterText} setFilterText={setFilterText} setFilters={setFilters} filters={filters}/>
            </div>
            <div
              className={`md:mt-12 mt-8`}
              style={{ minHeight: type ? "816px" : "1147px", width: "100%" }}
            >
              {loading ? (
                <div
                  className="w-full flex justify-center items-center"
                  style={{ minHeight: type ? "816px" : "1147px" }}
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
                        <div
                          key={`main-relases-card-${index}`}
                          className="w-full"
                        >
                          <NewReleaseCard
                            type={type ? "vertical" : "horizontal"}
                            img={item.img}
                            feature={item.category}
                            title={item.artist}
                            date={item.date}
                            link={item.link}
                          />
                        </div>
                      )
                  )}
                </div>
              )}
            </div>
            <div className={`flex ${type ? "justify-center" : "justify-end"}`}>
              {/* <PaginationBar
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
                pages={pages}
              /> */}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AlbumsMainPage;
