import React, { ChangeEvent, useState, useEffect } from "react";
import BreadCrumb from "../../Components/BreadCrumb";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import Layout from "../../Components/Layout";
import { Spinner } from "@chakra-ui/react";
import TVCard from "../../Components/Card/TVCard";
import "../mainPageStyle.css";
import { PageBasicProps } from "../../AppMain";
import PaginationBar from "../../Components/PaginationBar";

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

const VideoMainPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(12);
  const [filterText, setFilterText] = useState<string>("");
  const [cardData, setCardData] = useState<Product[]>([]);
  const [cardNum, setCardNum] = useState<number>(4);
  const [lineNum, setLineNum] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);
  const [displayData, setDisplayData] = useState<Product[]>([]);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(5);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/products");
        const data = await response.json();
        setCardData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1280) {
        setCardNum(4);
        setLineNum(3);
      } else {
        setCardNum(3);
        if (window.innerWidth < 1024) {
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
    const startIdx = (selectedPage - 1) * entriesPerPage;
    const endIdx = startIdx + entriesPerPage;
    setDisplayData(cardData.slice(startIdx, endIdx));
  }, [selectedPage, entriesPerPage, cardData]);


  const handleEntriesChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setSelectedPage(1); 
  };

  const pages = Math.ceil(cardData.length / entriesPerPage);

  return (
    <>
      <Layout type={type} themeMode={themeMode}>
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
              <ContentTitle titleType="TOP HITS" title="TV/RADIO" />
            </div>
            <div className="md:mt-6 mt-4">
              <FilterInput type={type} />
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
                  } gap-4 py-5 mb-16`}
                >
                  {displayData.map((item, index) => (
                    <div key={`main-video-card-${index}`} className="w-full">
                      <TVCard
                        type={type ? "vertical" : "horizontal"}
                        img={item.img}
                        feature={item.title}
                        title={item.artist}
                        link={item.link}
                      />
                    </div>
                  ))}
                </div>
              )}
              <div
                className={`flex ${type ? "justify-center" : "justify-end"}`}
              >
                {/* <PaginationBar
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                  pages={pages}
                  entriesPerPage={0}
                  setEntriesPerPage={function (
                    value: React.SetStateAction<number>
                  ): void {
                    throw new Error("Function not implemented.");
                  }}
                /> */}
                <PaginationBar
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                  pages={pages}
                  entriesPerPage={entriesPerPage}
                  setEntriesPerPage={setEntriesPerPage}
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default VideoMainPage;
