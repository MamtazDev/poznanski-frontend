import { Button, Card, Image } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import artists1 from "../../assets/svg/artists1.svg";
import { RootState } from "../../reducers";
import moment from "moment";
import "./style.css";
import novideo from "../../assets/png/noimage.png"
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

  const imageSrc = img ? `${process.env.REACT_APP_FILES_URL}${img}` : novideo;

  const wordArray = tags ? tags.split(",").map((word) => word.trim()) : [];
  const dateFormatted = moment(date).format("MMMM DD, YYYY");

  return (
    <>
      <Card
        borderRadius="2xl"
        border={themeMode ? "1px solid white" : "1px solid #242526"}
        backgroundColor={themeMode ? "" : "#242526"}
        _hover={
          !themeMode
            ? {
              boxShadow: "0px 0px 11.4px 4px rgba(59, 214, 198, 0.10)",
              transform: "scale(1.017)",
              transition: "transform 0.5s ease-in-out",
            }
            : {
              boxShadow: "0px 0px 11.457px 0px rgba(138, 138, 138, 0.24)",
              transform: "scale(1.017)",
              transition: "transform 0.3s ease-in-out",
            }
        }
        className="transition-all duration-300 ease-out w-full h-full p-5 cursor-pointer">
        <div className="flex md:flex-col flex-row md:items-start gap-5">
          <div className="relative md:w-full w-[130px] h-[81px] md:h-[235px] flex-shrink-0 overflow-hidden ">
            <div
              className={`rounded-md text-center absolute opacity-50 font-semibold top-2 md:right-5
                right-[12px] z-50 py-2 px-2 text-[8px] md:text-sm w-[90px] md:w-[130px] ${!themeMode && "btn-dark-bg-color"
                }`}
              style={{
                backgroundColor: themeMode ? "#E8ECFE" : "#58ADAC",
              }}>
              {dateFormatted}
            </div>
            {/* {img ? (
              <img
                alt="img nai"
                src={img || novideo}  // Ensures fallback if img is empty or null
                className="object-cover rounded-lg size-full"
              />
            ) : (
              <img
                alt="no img"
                src={novideo}
                className="md:w-[342px] w-[230px] h-[88px] md:h-[235px] object-cover rounded-lg"
              />
            )} */}
            <img
              src={img ?? novideo}
              className="object-cover rounded-lg size-full"
              alt="img"
            />

          </div>

          <div className="flex flex-col md:w-full space-y-2">
            {tags ? (
              <div className="flex  gap-2 mt-2 md:mt-0">
                {wordArray.slice(0, 3).map(
                  (tag, index) =>
                    tag && (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded-full md:text-sm text-[10px] font-semibold ${!themeMode && "btn-dark-bg-color"
                          }`}
                        style={{
                          backgroundColor: themeMode ? "#E8ECFE" : "#2FC4B2",
                          color: themeMode ? "#5A1073" : "#5A1073",
                        }}>
                        {tag.length > 10 ? `${tag.substring(0, 7)}...` : tag}
                      </span>
                    )
                )}
              </div>
            ) :
              <p className={`px-2 py-1 rounded-full text-center md:text-sm text-[10px] font-semibold`}
                style={{
                  backgroundColor: themeMode ? "#E8ECFE" : "#2FC4B2",
                  color: themeMode ? "#5A1073" : "#5A1073",
                }}>
                no tags added
              </p>
            }

            {title && (
              <h2
                className={`md:mt-2 mt-1 md:text-lg text-xs font-semibold line-clamp-1 ${!themeMode && "title-dark-color"
                  } uppercase`} style={{ color: themeMode ? "black" : "white" }}>
                {title}
              </h2>
            )}

            <div className="flex justify-start md:mt-4">
              <button
                className={` text-sm font-bold ${!themeMode && "text-dark-color"
                  }`}
                onClick={handleClick}
                style={{ color: themeMode ? "#5A1073" : "#2FC4B2" }}>
                Learn More...
              </button>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ProductCard1;
