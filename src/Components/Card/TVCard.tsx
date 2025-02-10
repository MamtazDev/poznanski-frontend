import { Card } from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { openPlayer } from "../../reducers/PlayerReducer";
import { useNavigate } from "react-router-dom";

interface News {
  type: string;
  video?: string;
  title?: string;
  feature?: string;
  youTube?: string;
  data: any;
  id?: any;
  link: string;
  name?: string;
}

const TVCard: React.FC<News> = ({ type, video, title, feature, link, youTube, data, id, name }) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handlePlay = () => {
    if (youTube) {
      const videoId = youTube.split("v=")[1]?.split("&")[0];
      console.log("Extracted Video ID:", videoId);
      if (videoId) {
        dispatch(openPlayer(videoId));
      }
    }
  };
  const handleClick = (id: string) => {
    navigate(`/radio/${id}`);
  };
  const YouTubeEmbed = ({ video, title }: { video: string; title: string }) => (
    <div className="relative w-full h-full" style={{ paddingBottom: "56.25%" }}>
      <iframe
        src={`${video.replace("watch?v=", "embed/")}`}
        title={title}
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  )
  return (
    <div className="product-card1 flex w-full">
  <div
    className="transition-all duration-300 ease-out w-full h-pull"
    onClick={() => handleClick(id)}
  >
    <div
      className={`flex flex-col justify-between w-full h-full p-5 rounded-2xl
      ${themeMode ? "border border-white" : "border border-[#242526] bg-[#242526]"}
      ${!themeMode ? "hover:shadow-[0px_0px_11.4px_4px_rgba(59,214,198,0.10)]" : "hover:shadow-[0px_0px_11.457px_0px_rgba(138,138,138,0.24)]"}
      `}
      style={{
        boxShadow: themeMode
          ? "0px 0px 11.457px 0px rgba(138, 138, 138, 0.24)"
          : "0px 0px 11.4px 4px rgba(59, 214, 198, 0.10)",
        backgroundColor: themeMode ? "" : "#242526",
        border: themeMode ? "1px solid white" : "1px solid #242526",
        borderRadius: "2xl",
      }}
    >


      {/* YouTube Thumbnail */}
      <div
        className={`relative bg-gray-100 cursor-pointer h-48 rounded-md overflow-hidden ${!themeMode && "dark-bg-color"}`}
        onClick={(e) => {
          e.stopPropagation();
          handlePlay();
        }}
      >
        <img
          src={
            youTube
              ? `https://img.youtube.com/vi/${youTube.split("v=")[1]}/hqdefault.jpg`
              : "default-thumbnail.jpg" // Fallback for undefined youTube
          }
          className="w-full h-full object-cover"
          alt="YouTube Thumbnail"
        />

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          {themeMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="58" height="57" viewBox="0 0 58 57" fill="none">
              <circle cx="29" cy="28.5" r="28" fill="#5A1073" />
              <path d="M22.6 17.3L41.8 28.8L22.2 39.6L22.6 17.3Z" fill="white" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 55 55" fill="none">
              <circle cx="27.5" cy="27.5" r="27.5" fill="#2FC4B2" />
              <path d="M20.8 16L39.3 27.1L20.5 37.5L20.8 16Z" fill="#111217" />
            </svg>
          )}
        </div>
      </div>
  {/* Feature Text - Moved Above the Video */}
  <div className="flex justify-start mb-3">
        <div className={`px-5 py-1 rounded ${!themeMode && "btn-dark-bg-color"}`}>
          {feature}
        </div>
      </div>
      {/* Title */}
      <div className={`mt-3 font-semibold text-lg ${!themeMode && "title-dark-color"}`}>
        {title}
      </div>

      {/* Artist Name */}
      <h2 className="text-sm text-gray-400 mt-1">{name}</h2>
    </div>
  </div>
</div>

  );
};

export default TVCard;