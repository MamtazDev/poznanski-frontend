import { Spinner } from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { PageBasicProps } from "../../AppMain";
import BreadCrumb from "../../Components/BreadCrumb";
import TVCard from "../../Components/Card/TVCard";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import Layout from "../../Components/Layout";
import PaginationBar from "../../Components/PaginationBar";
import "../mainPageStyle.css";

interface Product {
  youTube: string;
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
  const [filters, setFilters] = useState({
    sort: "A to Z",
    limit: 7,
    startDate: "",
    endDate: "",
    order: "desc"
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/radio");
        const data = await response.json();
        setCardData(data);
        console.log(data, "radio data")
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

  useEffect(() => {
    const filteredData = cardData.filter((product) =>
      product.title.toLowerCase().includes(filterText.toLowerCase())
    );

    const startIdx = (selectedPage - 1) * entriesPerPage;
    const endIdx = startIdx + entriesPerPage;
    setDisplayData(filteredData.slice(startIdx, endIdx));
  }, [filterText, selectedPage, entriesPerPage, cardData]);


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
              <FilterInput type={type} filterText={filterText} setFilterText={setFilterText} setFilters={setFilters} filters={filters} />
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
                  className={`grid ${cardNum === 4 && "grid-cols-4"
                    } ${cardNum === 3 && "grid-cols-3"} ${cardNum === 2 && "grid-cols-2"
                    } gap-4 py-5 mb-16`}
                >
                  {displayData.map((item, index) => (
                    <div key={index} className="w-full">
                      <TVCard
                        data={item}
                        video=""
                        type={type ? "vertical" : "horizontal"}
                        youTube={item.youTube}
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
