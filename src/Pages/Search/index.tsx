import { Spinner } from "@chakra-ui/react";
import DelayedComponent from "../../Components/_utility/DelayedComponent";
import BreadCrumb from "../../Components/BreadCrumb";
import MaterialCard from "../../Components/Card/MaterialCard";
import ProductCard1 from "../../Components/Card/ProductCard1";
import Layout from "../../Components/Layout";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { getLastPageNumber } from "../../reducers/NewsReducer";
import { usePaginatedNews } from "../../hooks/useSWRNews";
import TVCard from "../../Components/Card/TVCard";

const SearchMainPage = ({ themeMode, type }: any) => {
  const currentPage = useSelector((state: RootState) =>
    getLastPageNumber(state)
  );
  const [selectedPage, setSelectedPage] = useState<number>(currentPage);
  const [cardNum, setCardNum] = useState<number>(4);

  const pageSize = 18;

  const { data, loading, forceRevalidateAll, totalPages } = usePaginatedNews(
    pageSize,
    selectedPage
  );

  console.log("data", data);

  const fakeNews = [
    {
      type: "horizontal",
      img: "https://via.placeholder.com/300x200",
      title: "Breaking News",
      feature: "Featured Article",
      link: "https://example.com/video/1",
    },
 
    {
      type: "horizontal",
      img: "https://via.placeholder.com/300x200",
      title: "Sports Highlights",
      feature: "Top Sports",
      link: "https://example.com/video/3",
    },
   
  ];

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
            <h1 className="text-[#252733] font-bold text-5xl text-start mt-5 mb-16">
              You searched for “Lorum Ipsum”
            </h1>
          </div>

          <div>
            <h1 className="text-[#252733] text-2xl font-semibold text-start mb-6">
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
                    {data?.map(
                      (item) =>
                        item && (
                          <div
                            id={item._id}
                            key={`main-news-card-${item._id}`}
                            className="w-full"
                          >
                            <ProductCard1
                              type={type ? "vertical" : "horizontal"}
                              img={item.files?.[0]?.url || ""}
                              tags={`${item.tags}`}
                              title={item.title}
                              date={`${item.date}`.split("T")[0]}
                              _id={item._id}
                            />
                          </div>
                        )
                    )}
                  </div>
                )}
              </DelayedComponent>
            </div>

            <div className="mt-16">
            <h1 className="text-[#252733] text-2xl font-semibold text-start mb-6">
            TV/Radio
            </h1>

              {loading ? (
                <Spinner size="xl" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {/* Map through the fake data and render TVCard */}
                  {fakeNews.map((news, index) => (
                    <TVCard
                      key={index}
                      type={news.type}
                      img={news.img}
                      title={news.title}
                      feature={news.feature}
                      link={news.link}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchMainPage;
