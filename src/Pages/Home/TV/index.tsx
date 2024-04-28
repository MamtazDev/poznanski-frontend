import React, { useState, useEffect } from "react";
import ContentTitle from "../../../Components/ContentTitle";
import DetailButton from "../../../Components/Buttons/DetailButton";
import CarouselComponent from "./Carousel";
import { apiGetReq } from "../../../Constant/api-functions";
import { fileUrl } from "../../../Constant/config";
import { useNavigate } from "react-router-dom";
import "./style.css";
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
    setLoading(true);
    apiGetReq("/product/radio", { filter })
      .then((res) => {
        let newData: TVData[] = [];
        res.radio.map((item: inputData) => {
          const temp: TVData = {
            id: item._id,
            title: item.category,
            feature: item.title,
            img: fileUrl + item.img,
            link: item.link,
          };
          newData.push(temp);
        });
        setCardData(newData);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        throw err;
      });
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

export default TV;
