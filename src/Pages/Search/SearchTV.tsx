import { Spinner } from "@chakra-ui/react";
import { useState } from "react";
import TVCard from "../../Components/Card/TVCard";
import { usePaginatedNews } from "../../hooks/useSWRNews";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { getLastPageNumber } from "../../reducers/NewsReducer";

const SearchTV = ({themeMode}: any) => {
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
    <div className="mt-16">
      <h1 className={`text-[#252733] text-2xl font-semibold text-start mb-6 ${themeMode ? "text-[#252733]" : "text-white"}`}>
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
              video={news.img}
              title={news.title}
              feature={news.feature}
              link={news.link}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchTV;
