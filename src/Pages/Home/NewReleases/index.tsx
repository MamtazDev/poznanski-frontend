import React, { useState, useEffect } from "react";
import ContentTitle from "../../../Components/ContentTitle";
import DetailButton from "../../../Components/Buttons/DetailButton";
import ReleaseCarousel from "./Carousel";
import { apiGetReq } from "../../../Constant/api-functions";
import { fileUrl } from "../../../Constant/config";
import { useNavigate } from "react-router-dom";
import "./style.css";

interface NewReleaseData {
  id: string;
  title: string;
  feature: string;
  img: string;
  date: string;
  link: string;
}

interface inputData {
  _id: string;
  title: string;
  artist: string;
  img: string;
  date: Date;
  link: string;
}

const NewReleases: React.FC<{ filter: string }> = ({ filter }) => {
  const [cardNum, setCardNum] = useState<number>(4);
  const [cardData, setCardData] = useState<NewReleaseData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiGetReq("/product/new", { filter }).then((res) => {
      let newData: NewReleaseData[] = [];
      res.newProducts.map((item: inputData) => {
        const inputDate: Date = new Date(item.date);
        const formattedDate =
          inputDate.getDate() +
          "/" +
          (inputDate.getMonth() + 1) +
          "/" +
          inputDate.getFullYear();
        const temp: NewReleaseData = {
          id: item._id,
          title: item.artist,
          feature: item.title,
          img: fileUrl + item.img,
          date: formattedDate,
          link: item.link,
        };
        newData.push(temp);
      });
      setCardData(newData);
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
  return cardData?.length ? (
    <div className="flex justify-center">
      <div className="container md:mt-36 md:pt-1.5 mt-20">
        <div className="flex justify-between">
          <ContentTitle titleType="NEW RELEASE" title="New Releases For You" />
          <div className="flex items-end">
            <div className="md:block hidden">
              <DetailButton
                text="See All Release"
                btnType="web"
                onClick={() => navigate("/releases")}
              />
            </div>
          </div>
        </div>
        <ReleaseCarousel cardNum={cardNum} cardData={cardData} />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default NewReleases;
