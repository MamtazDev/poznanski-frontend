import { Spinner } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { PageBasicProps } from "../../AppMain";
import BreadCrumb from "../../Components/BreadCrumb";
import TVCard from "../../Components/Card/TVCard";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import Layout from "../../Components/Layout";
import "../mainPageStyle.css";
import { apiBaseUrl } from "../../Constant/config";

interface Product {
  artists: any;
  _id: unknown;
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

export interface filterProperties{
  sort: string,
  quantity: number,
    startDate: string,
    endDate: string,
    order: string,
    search: string | undefined
  }

const VideoMainPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const [filterText, setFilterText] = useState<string>("");
  const [cardData, setCardData] = useState<Product[]>([]);
  const [cardNum, setCardNum] = useState<number>(4);
  const [lineNum, setLineNum] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [displayedItems, setDisplayedItems] = useState<Product[]>([]);


  const [filters, setFilters] = useState<filterProperties>({
    sort: "asc",
    quantity: 5,
    startDate: "",
    endDate: "",
    order: "desc",
    search: ""
  });


  const fetchData = async (inputValue?: filterProperties) => {
    setLoading(true);
    let url = `${apiBaseUrl}/radio`; // Default URL
    // Building the query string based on available filter properties
    let searchQuery = [];

    if (inputValue?.search) {
      searchQuery.push(`search=${encodeURIComponent(inputValue.search)}`);
    }

    if (inputValue?.sort) {
      searchQuery.push(`order=${encodeURIComponent(inputValue.sort)}`);
    }

    if (inputValue?.quantity) {
      searchQuery.push(`limit=${inputValue.quantity}`);
    }

    if (inputValue?.startDate) {
      searchQuery.push(`startDate=${encodeURIComponent(inputValue.startDate)}`);
    }

    if (inputValue?.endDate) {
      searchQuery.push(`endDate=${encodeURIComponent(inputValue.endDate)}`);
    }

    // if (inputValue?.order) {
    //   searchQuery.push(`order=${encodeURIComponent(inputValue.order)}`);
    // }

    // If there are query parameters, append them to the URL
    if (searchQuery.length > 0) {
      url = `${url}?${searchQuery.join('&')}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setCardData(data.records);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };


  
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const setDisplayUpdatedName = () => {
    setDisplayedItems(cardData.slice(0, 2));
  };
  const loadMoreItems = () => {
    if (loading || visibleCount >= cardData.length) return;
    setLoading(true);

    setTimeout(() => {
      setVisibleCount((prev) => prev + 3);
      setLoading(false);
    }, 1000);
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 5) {
      loadMoreItems();
    }
  };


  useEffect(() => {
    setDisplayUpdatedName();
  }, [displayedItems, cardData, visibleCount]);


  useEffect(() => {
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


//search fucntionalities

const handleSearch = (inputValue: string) => {
  fetchData(filters)
}


useEffect(() => {
fetchData(filters)
}, [filters])


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
              <FilterInput type={type} handler={handleSearch} filterText={filterText} setFilterText={setFilterText} setFilters={setFilters} filters={filters} />
            </div>
            <div
              className={`md:mt-12 mt-8 mt-8 max-h-[800px] overflow-y-auto rounded-lg p-2 scrollbar-hide`}
              ref={scrollContainerRef}
              onScroll={handleScroll}
              // style={{ minHeight: type ? "776px" : "908px", width: "100%" }}
            >
              {loading ? (
                <div
                  className="w-full flex justify-center items-center"
                  // style={{ minHeight: type ? "776px" : "908px" }}
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
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-5 mb-16`}
                >
                  {cardData.length>0? cardData.map((item, index) => (
                    <div key={index} className="w-full">
                      <TVCard
                        data={item}
                        id={item._id}
                        video=""
                        type={type ? "vertical" : "horizontal"}
                        youTube={item.youTube}
                        feature={item.title}
                        title={item.artists?.[0]?.name || "Unknown Artist"}
                        link={item.link}
                      />
                    </div>
                  )): <p className="text-blue-500 text-5xl py-3 text-center">There is no data</p>}
                </div>
              )}

            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default VideoMainPage;
