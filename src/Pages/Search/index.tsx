
import { Spinner } from "@chakra-ui/react";
import DelayedComponent from "../../Components/_utility/DelayedComponent";
import BreadCrumb from "../../Components/BreadCrumb";
import MaterialCard from "../../Components/Card/MaterialCard";
import ProductCard1 from "../../Components/Card/ProductCard1";
import Layout from "../../Components/Layout";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { getLastPageNumber } from "../../reducers/NewsReducer";
import { usePaginatedNews } from "../../hooks/useSWRNews";
import TVCard from "../../Components/Card/TVCard";
import SearchTV from "./SearchTV";
import SearchArtist from "./SearchArtist";
import { useLocation } from "react-router-dom";
import useSWR from "swr";

const SearchMainPage = ({ themeMode, type }: any) => {
  const location = useLocation();
  const [loading, setIsloading] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const [cardNum, setCardNum] = useState<number>(4);
  const searchText = queryParams.get("query") || "Nothing";
let urlEndoint = "http://localhost:8000/api/search";
const fetcher = () =>
  fetch(`http://localhost:8000/api/search/search?query=${searchText}`).then(
    (res) => res.json()
  );
  const { data, error } = useSWR(`${urlEndoint}/query=${searchText}`, fetcher);

// const { data, error } = useSWR(
//   `${urlEndoint}/search?query=${searchText}`,
//   fetcher
// );

// Local state to store the response
const [news, setNews] = useState(null);

// When the data is fetched, set it to the local state
// useEffect(() => {
//   if (data) {
//     console.log("Fetched data:", data.data["Concert"]);
//     console.log("Fetched data:", data.data["newsData"]);

//     // Access the nested 'news' object
//     console.log("Intro:", data.news?.intro); // Logs the intro of the news
//     console.log("Title:", data.news?.title); // Logs the title of the news
//     console.log("Tags:", data.news?.tags); // Logs the tags of the news
//   }
// }, [data]);
// // Handle loading and error states
// if (error) return <div>Error loading data.</div>;
// if (!news) return <div>Loading...</div>;

const newsData = data?.data?.newsData || [];

  return (
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
          <div>
            <h1
              className={` font-bold text-5xl text-start mt-5 mb-16 ${themeMode ? "text-[#252733]" : "text-white"}`}
            >
              You searched for “{searchText}”
            </h1>
          </div>

          <div>
            <h1
              className={`text-[#252733] text-2xl font-semibold text-start mb-6 ${themeMode ? "text-[#252733]" : "text-white"}`}
            >
              News
            </h1>

            <div
              style={{
                width: "100%",
              }}
            >
              <DelayedComponent delay={200}>
                {loading ? (
                  <div
                    className="w-full flex justify-center items-center"
                    style={{
                      minHeight: type ? "776px" : "908px",
                    }}
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
                    className={`${"grid"} ${cardNum === 4 && "grid-cols-4"} ${cardNum === 3 && "grid-cols-3"} ${cardNum === 2 && "grid-cols-2"} gap-4 py-5`}
                  >
                    {/* <p>Title: {data?.data["newsData"].length}</p> */}
                    {newsData.map(
                      (item: any) =>
                          <div
                            id={item._id}
                            key={`main-news-card-${item._id}`}
                            className="w-full"
                          >
                            <ProductCard1
                              type={type ? "vertical" : "horizontal"}
                              img={item?.files?.[0]}
                              tags={`${item.tags}`}
                              title={item.title}
                              date={`${item.date}`.split("T")[0]}
                              _id={item._id}
                            />
                            {/* <p className="text-5xl text-red-500">{item.title}</p> */}
                          </div>
                    
                    )}
                  </div>
                  
                )}
              </DelayedComponent> 
            </div>
          </div>
          <SearchTV />
          <SearchArtist />
        </div>
      </div>
    </Layout>
  );
};

export default SearchMainPage;




