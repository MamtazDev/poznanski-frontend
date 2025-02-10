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

  const newsData = data?.data?.newsData || [];

  return (
    <Layout themeMode={themeMode} type={type}>
      <div className="flex justify-center">
        <div className="container mx-auto px-4">
          {type ? (
            ""
          ) : (
            <div className="md:mt-12 mt-8">
              <BreadCrumb />
            </div>
          )}
          <div>
            <h1
              className={`font-bold text-3xl sm:text-4xl md:text-5xl text-start mt-5 mb-8 sm:mb-12 ${themeMode ? "text-[#252733]" : "text-white"}`}
            >
              You searched for “{searchText}”
            </h1>
          </div>

          <div>
            <h1
              className={`text-[#252733] text-xl sm:text-2xl font-semibold text-start mb-4 sm:mb-6 ${themeMode ? "text-[#252733]" : "text-white"}`}
            >
              News
            </h1>

            <div style={{ width: "100%" }}>
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
                    className={`grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-4 py-5`}
                  >
                    {newsData.map((item: any) => (
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
                      </div>
                    ))}
                  </div>
                )}
              </DelayedComponent>
            </div>
          </div>
          <SearchTV themeMode={themeMode} />
          <SearchArtist themeMode={themeMode} />
        </div>
      </div>
    </Layout>
  );
};

export default SearchMainPage;
