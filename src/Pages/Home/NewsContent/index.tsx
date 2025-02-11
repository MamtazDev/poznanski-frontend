import React, { useState, useEffect } from "react";
import ContentTitle from "../../../Components/ContentTitle";
import DetailButton from "../../../Components/Buttons/DetailButton";
import { apiBaseUrl } from "../../../Constant/config";
import { useNavigate } from "react-router-dom";
import ProductCard1 from "../../../Components/Card/ProductCard1";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";

interface Product {
  id: string;
  title: string;
  description: string;
  youTube?: string;
  tags: string;
  date: string;
  files?: string[];
}

interface CartInterface {
  news: Product[];
  totalNews: number;
  totalPages: number;
  currentPage: number;
  success: boolean;
}

const NewsContent: React.FC<{ filterText: string }> = ({ filterText }) => {
  const [cardNum, setCardNum] = useState<number>(3);
  const [cardData, setCardData] = useState<CartInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setCardData(null);

        const response = await fetch(`${apiBaseUrl}/news/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }

        const data = await response.json();
        if (data?.news?.length) {
          setCardData(data);
        } else {
          console.warn("No news available in the API response");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCardNum(2);
        if (window.innerWidth < 768) setCardNum(1);
      } else {
        setCardNum(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return cardData && cardData.news.length > 0 ? (
    <div className="flex justify-center">
      <div className="container md:mt-36 mt-20 md:pt-1.5">
        <div className="flex justify-between">
          <ContentTitle titleType="NEWS" title="Top News Of The Day" />
          <div className="flex items-end">
            <div className="md:block hidden">
              <DetailButton
                text="See All News"
                btnType="web"
                onClick={() => navigate("/news")}
              />
            </div>
          </div>
        </div>

        <div className="md:mt-16 mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {cardData?.news.map((item, index) => (
            <React.Fragment key={index}>
              <ProductCard1
                key={item.id}
                type={cardNum === 1 ? "vertical" : "horizontal"}
                img={item.files && item.files[0]}
                tags={item.tags}
                title={item.title}
                date={item.date}
                _id={item.id}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  ) : loading ? (
    <div
      className="flex justify-center items-center h-screen w-full"
      style={{ backgroundColor: themeMode ? "white" : "black" }}
    >
      <p
        className="text-xl font-semibold"
        style={{ color: themeMode ? "black" : "white" }}
      >
        Loading...
      </p>
      <div
        className="w-6 h-6 ml-2 border-4 border-t-transparent rounded-full animate-spin"
        style={{
          borderRightColor: themeMode ? "#5A1073" : "#2FC4B2",
          borderBottomColor: themeMode ? "#5A1073" : "#2FC4B2",
          borderLeftColor: themeMode ? "#5A1073" : "#2FC4B2",
        }}
      ></div>
    </div>
  ) : (
    <div>No news available</div>
  );
};

export default NewsContent;
