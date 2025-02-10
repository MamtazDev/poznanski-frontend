import React, { useState, useEffect } from "react";
import ContentTitle from "../../../Components/ContentTitle";
import DetailButton from "../../../Components/Buttons/DetailButton";
import CarouselComponent from "./Carousel";
import { apiBaseUrl, fileUrl } from "../../../Constant/config";
import { useNavigate } from "react-router-dom";
import "./style.css";
import TVCard from "../../../Components/Card/TVCard";

interface TVData {
  id: string;
  title: string;
  feature: string;
  img: string;
  link: string;
}

interface inputData {
  _id: string;
  title: string;
  category: string;
  img: string;
  link: string;
}

const TV: React.FC<{ filter: string }> = ({ filter }) => {
  const [cardNum, setCardNum] = useState<number>(4);
  const [cardData, setCardData] = useState<TVData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let url = `${apiBaseUrl}/radio`;
      let searchQuery = [];

      if (filter) {
        searchQuery.push(`search=${encodeURIComponent(filter)}`);
      }

      if (searchQuery.length > 0) {
        url = `${url}?${searchQuery.join("&")}`;
      }

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data || !Array.isArray(data.records)) {
          // console.error("Invalid API response: ", data);
          setLoading(false);
          return;
        }

        const newData: TVData[] = data.records.map((item: inputData) => ({
          id: item._id,
          title: item.category,
          feature: item.title,
          img: fileUrl + item.img,
          link: item.link,
        }));

        setCardData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCardNum(3);
        if (window.innerWidth < 768) setCardNum(1);
      } else {
        setCardNum(4);
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return cardData.length ? (
    <div className="flex justify-center">
      <div className="container md:mt-36 md:pt-1.5 mt-20">
        <div className="flex justify-between">
          <ContentTitle titleType="TOP HITS" title="TV/Radio" />
          <div className="flex items-end">
            <div className="md:block hidden">
              <DetailButton
                text="See All Music"
                btnType="web"
                onClick={() => navigate("/video")}
              />
            </div>
          </div>
        </div>
        {cardData?.length > 0 && (
          <div className="md:mt-16 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cardData.map((item) => (
              <TVCard
                key={item.id}
                data={item}
                video=""
                type="horizontal"
                youTube={item.img}
                feature={item.feature}
                title={item.title}
                link={item.link}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default TV;
