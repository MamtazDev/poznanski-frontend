import React, { useState, useEffect } from "react";
import BreadCrumb from "../../Components/BreadCrumb";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import PaginationBar from "../../Components/PaginationBar";
import { apiGetReq } from "../../Constant/api-functions";
import Layout from "../../Components/Layout";
import { Spinner } from "@chakra-ui/react";
import MaterialCard from "../../Components/Card/MaterialCard";
import "../mainPageStyle.css";
import { PageBasicProps } from "../../AppMain";

interface Product {
  id: string;
  title: string;
  description: string;
  youTube: string;
  tags: string;
  date: string;
}

const MaterialMainPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const [selectedPage, setSelectedPage] = useState<string>("1");
  const [pages, setPages] = useState<string>("0");
  const [rowsPerPage, setRowsPerPage] = useState<number>(12);
  const [filterText, setFilterText] = useState<string>("");
  const [cardData, setCardData] = useState<Product[]>([]);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [cardNum, setCardNum] = useState<number>(4);
  const [lineNum, setLineNum] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setRowsPerPage(cardNum * lineNum);
  }, [cardNum, lineNum]);

  const handleData = (response: any) => {
    let newProducts: Product[] = [];
    const pages = Math.ceil(response.materials.length / rowsPerPage);
    setPages(pages.toString());

    newProducts = response.materials.map((item: any) => ({
      id: item._id,
      title: item.title,
      description: item.description,
      youTube: item.youTube,
      tags: item.tags,
      date: new Date(item.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));

    setCardData(newProducts);
    setFilteredData(newProducts); 
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1280) {
        setCardNum(4);
        setLineNum(3);
      } else if (window.innerWidth < 1280) {
        setCardNum(3);
      } else if (window.innerWidth < 1024) {
        setCardNum(2);
      } else if (window.innerWidth < 768) {
        setCardNum(1);
        setLineNum(7);
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
    apiGetReq("http://localhost:8000/api/materials", {
      rowsPerPage: rowsPerPage,
      curPage: selectedPage,
      filter: filterText,
    })
      .then((res) => {
        handleData(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [selectedPage, rowsPerPage, filterText]);


  useEffect(() => {
    if (filterText) {
      const filtered = cardData.filter(
        (item) =>
          item.title.toLowerCase().includes(filterText.toLowerCase()) ||
          item.description.toLowerCase().includes(filterText.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(cardData);
    }
  }, [filterText, cardData]);


  return (
    <>
      <Layout themeMode={themeMode}>
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
              <ContentTitle titleType="VIDEOS" title="Materials" />
            </div>
            <div className="md:mt-6 mt-4">
              <FilterInput
                type={type}
                filterText={filterText}
                setFilterText={setFilterText}
              />
            </div>
            <div
              className={`md:mt-12 mt-8`}
              style={{ minHeight: type ? "776px" : "908px", width: "100%" }}
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
                  className={`grid ${
                    cardNum === 4 && "grid-cols-4"
                  } ${cardNum === 3 && "grid-cols-3"} ${
                    cardNum === 2 && "grid-cols-2"
                  } gap-4 py-5`}
                >
                  {filteredData.map((item, index) => (
                    <div key={`main-video-card-${index}`} className="w-full">
                      <MaterialCard
                        type={type ? "vertical" : "horizontal"}
                        video={item.youTube}
                        feature={item.tags}
                        title={item.title}
                        date={item.date}
                        location={""} 
                        link={item.youTube}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={`flex ${type ? "justify-center" : "justify-end"}`}>
              {/* Pagination component can be added here */}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default MaterialMainPage;
