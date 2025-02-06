import { Card } from "@chakra-ui/react";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducers";
import { openPlayer } from "../../reducers/PlayerReducer";
import "./style.css";

interface News {
  type: string;
  title: string;
  feature: string;
  date: string;
  location: string;
  youTube: string;
}

const MaterialCard: React.FC<News> = ({
  type,
  title,
  feature,
  date,
  location,
  youTube,
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const dispatch = useDispatch();

  const handlePlay = () => {
    if (youTube) {
      const videoId = youTube.split("v=")[1]?.split("&")[0];
      if (videoId) {
        dispatch(openPlayer(videoId));
      }
    }
  };

  return (
    <div className="product-card1 flex w-full">
      <Card
        padding={type === "horizontal" ? "14px" : "9px"}
        borderRadius="2xl"
        border={themeMode ? "" : "1px solid #242526"}
        backgroundColor={themeMode ? "#FFF" : "#242526"}
        height={type === "horizontal" ? "264.537px" : "91.577px"}
        _hover={{
          boxShadow: themeMode
            ? "0px 0px 11.457px 0px rgba(138, 138, 138, 0.24)"
            : "0px 0px 11.4px 4px rgba(59, 214, 198, 0.10)",
        }}
        className="transition-all duration-300 ease-out w-full h-pull"
      >
        <div className="flex flex-col justify-between w-full h-full">
          <div
            className={`relative bg-gray-100 cursor-pointer h-48 rounded-md overflow-hidden ${
              !themeMode && "dark-bg-color"
            }`}
            onClick={handlePlay}
          >
            {/* YouTube Thumbnail */}
            <img
              src={
                youTube
                  ? `https://img.youtube.com/vi/${youTube.split("v=")[1]?.split("&")[0]}/hqdefault.jpg`
                  : "default-thumbnail.jpg"
              }
              className="w-full h-full object-cover"
              alt="YouTube Thumbnail"
            />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              {themeMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="58"
                  height="57"
                  viewBox="0 0 58 57"
                  fill="none"
                >
                  <circle cx="29" cy="28.5" r="28" fill="#5A1073" />
                  <path
                    d="M22.6 17.3L41.8 28.8L22.2 39.6L22.6 17.3Z"
                    fill="white"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="55"
                  height="55"
                  viewBox="0 0 55 55"
                  fill="none"
                >
                  <circle cx="27.5" cy="27.5" r="27.5" fill="#2FC4B2" />
                  <path
                    d="M20.8 16L39.3 27.1L20.5 37.5L20.8 16Z"
                    fill="#111217"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Feature Text */}
          <div className="flex justify-start mt-3">
            <div
              className={`px-5 py-1 rounded ${
                !themeMode && "btn-dark-bg-color"
              }`}
            >
              {feature}
            </div>
          </div>

          {/* Title */}
          <div
            className={`mt-2 font-semibold text-lg ${
              !themeMode && "title-dark-color"
            }`}
          >
            {title}
          </div>

          {/* Location and Date */}
          <div className="flex justify-start items-center mt-2 text-sm text-gray-600">
            <div className="mr-2">{location}</div>
            <span>•</span>
            <div className="ml-2">{date}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MaterialCard;
