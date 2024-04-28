import React, { useState, useEffect } from "react";
import ContentTitle from "../../../Components/ContentTitle";
import DetailButton from "../../../Components/Buttons/DetailButton";
import CarouselComponent from "./Carousel";
import { apiGetReq } from "../../../Constant/api-functions";
import { fileUrl } from "../../../Constant/config";
import { useNavigate } from "react-router-dom";
import "./style.css";

interface MaterialData {
  id: string;
  title: string;
  feature: string;
  img: string;
  date: string;
  location: string;
  link: string;
}

interface inputData {
  _id: string;
  title: string;
  category: string;
  img: string;
  date: Date;
  location: string;
  link: string;
}

const MaterialContent: React.FC<{ filter: string }> = ({ filter }) => {
  const [cardNum, setCardNum] = useState<number>(3);
  const [cardData, setCardData] = useState<MaterialData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    apiGetReq("/product/material", { filter }).then((res) => {
      let newsData: MaterialData[] = [];
      res.material.map((item: inputData) => {
        const inputDate: Date = new Date(item.date);
        const formattedDate =
          inputDate.getDate() +
          "/" +
          (inputDate.getMonth() + 1) +
          "/" +
          inputDate.getFullYear();
        const temp: MaterialData = {
          id: item._id,
          title: item.title,
          feature: item.category,
          img: fileUrl + item.img,
          date: formattedDate,
          location: item.location,
          link: item.link,
        };
        newsData.push(temp);
      });
      setCardData(newsData);
    });
  }, [filter]);

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
  return cardData?.length ? (
    <div className="flex justify-center">
      <div className="container md:mt-36 md:pt-1.5 mt-20">
        <div className="flex justify-between">
          <ContentTitle titleType="VIDEOS" title="Materials" />
          <div className="flex items-end">
            <div className="md:block hidden">
              <DetailButton
                text="See All Videos "
                btnType="web"
                onClick={() => navigate("/material")}
              />
            </div>
          </div>
        </div>
        <div className="md:mt-16 mt-6">
          <CarouselComponent cardNum={cardNum} cardData={cardData} />
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default MaterialContent;
