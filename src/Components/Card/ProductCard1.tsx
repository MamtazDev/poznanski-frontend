import { Button, Card, Image } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import artists1 from "../../assets/svg/artists1.svg";
import { RootState } from "../../reducers";
import moment from "moment";

import "./style.css";
export interface News {
  type: string;
  img: string | undefined;
  title: string;
  tags: string;
  date: any;
  _id: string;
}

const ProductCard1: React.FC<News> = ({
  type,
  img,
  title,
  tags,
  date,
  _id,
}) => {
  const navigate = useNavigate();
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  const handleClick = () => {
    navigate(`/news/${_id}`);
  };

  const imageSrc = img ? `${process.env.REACT_APP_FILES_URL}${img}` : artists1;

  const wordArray = tags ? tags.split(",").map((word) => word.trim()) : [];
  const dateFormatted = moment(date).format(" DD MMMM YYYY");

  return (
    <div className="flex w-full h-full">
      <Card
        borderRadius="2xl"
        border={themeMode ? "1px solid white" : "1px solid #242526"}
        backgroundColor={themeMode ? "" : "#242526"}
        _hover={
          !themeMode
            ? {
                boxShadow: "0px 0px 11.4px 4px rgba(59, 214, 198, 0.10)",
              }
            : {
                boxShadow: "0px 0px 11.457px 0px rgba(138, 138, 138, 0.24)",
              }
        }
        className="transition-all duration-300 ease-out w-full h-full p-5"
      >
        <div className="flex md:flex-col flex-row md:items-start gap-5">
          <div className="relative md:w-full w-[60%]">
            <div
              className={`rounded-md text-center absolute opacity-50 font-semibold top-2 right-2 z-50 py-2 px-2 text-[8px] md:text-sm w-[70px] md:w-[120px] ${
                !themeMode && "btn-dark-bg-color"
              }`}
              style={{
                backgroundColor: themeMode? "#E8ECFE":"#58ADAC"
              }}
            >
              {dateFormatted}
            </div>
            <Image
              src={img ?? imageSrc}
              className="w-full h-40 md:h-[230px] object-cover rounded-lg"
              alt="news image"
            />
          </div>

          <div className="flex flex-col md:w-full w-[40%]">
            {tags && (
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                {wordArray.map(
                  (tag, index) =>
                    tag && (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded-full md:text-sm text-[8px] font-semibold ${
                          !themeMode && "btn-dark-bg-color"
                        }`}
                        style={{
                          backgroundColor: themeMode? "#E8ECFE":"#2FC4B2",
                          color: themeMode? "#5A1073":"#5A1073"
                        }}
                      >
                        {tag}
                      </span>
                    )
                )}
              </div>
            )}

            {title && (
              <h2
                className={`mt-2 md:text-lg text-sm font-semibold line-clamp-1 ${
                  !themeMode && "title-dark-color"
                }`}
              >
                {title}
              </h2>
            )}

            <div className="flex justify-start mt-4">
              <Button
                variant="ghost"
                className={`card-more-btn text-sm ${
                  !themeMode && "text-dark-color"
                }`}
                onClick={handleClick}
              >
                Learn More...
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductCard1;
