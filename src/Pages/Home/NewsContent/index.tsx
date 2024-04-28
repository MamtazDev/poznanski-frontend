import React, { useState, useEffect } from "react";
import ContentTitle from "../../../Components/ContentTitle";
import DetailButton from "../../../Components/Buttons/DetailButton";
import CarouselComponent from "./Carousel";
import { apiGetReq } from "../../../Constant/api-functions";
import { fileUrl } from "../../../Constant/config";
import { useNavigate } from "react-router-dom";

interface Content {
  img: string;
}
interface News {
  title: string;
  feature: string;
  date: string;
  img: string;
}
interface inputNews {
  title: string;
  tag: string;
  date: string;
  content: Content[];
}

const NewsContent: React.FC<{ filterText: string }> = ({ filterText }) => {
  const [cardNum, setCardNum] = useState<number>(3);
  const [cardData, setCardData] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    apiGetReq("/news/top", { filterText }).then((res) => {
      let newsData: News[] = [];
      res.news.map((item: inputNews) => {
        const inputDate: Date = new Date(item.date);
        const options: object = {
          year: "numeric",
          day: "numeric",
          month: "long",
        };
        const formattedDate: string = inputDate.toLocaleDateString(
          "en-US",
          options
        );
        const temp: News = {
          title: item.title,
          feature: item.tag,
          img: fileUrl + item.content[0].img,
          date: formattedDate,
        };
        newsData.push(temp);
      });
      setCardData(newsData);
    });
  }, [filterText]);

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

  return cardData.length ? (
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
        {cardData?.length && (
          <div className="md:mt-16 mt-6">
            <CarouselComponent cardNum={cardNum} cardData={cardData} />
          </div>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default NewsContent;
