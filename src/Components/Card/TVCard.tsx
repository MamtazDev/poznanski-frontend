import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { openPlayer } from "../../reducers/PlayerReducer";
import { useNavigate } from "react-router-dom";
import novideo from "../../assets/png/novideo.png";

interface News {
  type?: string;
  video?: string;
  title?: string;
  feature?: string;
  youTube?: string;
  data: any;
  id?: any;
  _id?: any;
  link: string;
  name?: string;
}

const TVCard: React.FC<News> = ({ type, video, title, feature, link, youTube, data, id,_id,name }) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("data", data)

  const handlePlay = () => {
    if (youTube) {
      const videoId = youTube.split("v=")[1]?.split("&")[0] || '';
      if (videoId) {
        dispatch(openPlayer(videoId));
      }
    }
  };

  const handleClick = (id: string) => {
    navigate(`/radio/${data?._id}`);
  };

  // const YouTubeEmbed = ({ video, title }: { video: string; title: string }) => (
  //   <div className="relative w-full h-full" style={{ paddingBottom: "56.25%" }}>
  //     <iframe
  //       src={`${video.replace("watch?v=", "embed/")}`}
  //       title={title}
  //       className="absolute top-0 left-0 w-full h-full"
  //       frameBorder="0"
  //       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  //       allowFullScreen
  //     ></iframe>
  //   </div>
  // )
  const getYouTubeID = (url: string) => {
    let videoId = "";
    if (url.includes("youtube.com/watch")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    }
    return videoId;
  };
  return (
    <>
      <div
        className="transition-all duration-300 ease-out w-full h-full cursor-pointer"
        onClick={() => handleClick(id)}
      >
        <div
          className={`flex md:flex-col gap-5 md:justify-between w-full h-full p-5 rounded-2xl shadow-md cursor-pointer
      ${themeMode ? "border border-white" : "border border-[#242526] bg-[#242526]"}
      ${!themeMode ? "hover:shadow-[0px_0px_11.4px_4px_rgba(59,214,198,0.10)] hover:cursor-zoom-in" : "hover:shadow-[0px_0px_11.457px_0px_rgba(138,138,138,0.24)]"}
      `}
         style={{
          backgroundColor: themeMode ? "" : "#242526",
          border: themeMode ? "1px solid white" : "1px solid #242526",
          borderRadius: "2xl",
          }}
        >
          {/* YouTube Thumbnail */}
          <div
            className={`relative lg:bg-gray-100 cursor-pointer lg:h-48 rounded-md flex-shrink-0 overflow-hidden ${!themeMode && "dark-bg-color"}`}
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
          >
            <img
              src={youTube ? `https://img.youtube.com/vi/${getYouTubeID(youTube)}/hqdefault.jpg` : "default-thumbnail.jpg"}
              className="md:w-full w-[69px] h-full  object-cover"
              alt="YouTube Thumbnail"
            />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              {themeMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="58" height="57" viewBox="0 0 58 57" fill="none" className="w-[20px] md:w-[58px]">
                  <circle cx="29" cy="28.5" r="28" fill="#5A1073" />
                  <path d="M22.6 17.3L41.8 28.8L22.2 39.6L22.6 17.3Z" fill="white" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 55 55" fill="none" className="w-[20px] md:w-[58px]">
                  <circle cx="27.5" cy="27.5" r="27.5" fill="#2FC4B2" />
                  <path d="M20.8 16L39.3 27.1L20.5 37.5L20.8 16Z" fill="#111217" />
                </svg>
              )}
            </div>
          </div>

          <div>

            {/* paly btn btn  */}
            <div
              className={`lg:hidden md:hidden relative lg:bg-gray-100 cursor-pointer md:h-48 rounded-md overflow-hidden ${!themeMode && "dark-bg-color"}`}
              onClick={(e) => {
                e.stopPropagation();
                handlePlay();
              }}
            >
              {/* Styled Button */}
              <button
                className="flex items-center gap-2 px-2 py-1 text-[8px] rounded-full text-[#5A1073] font-medium"
                style={{
                  backgroundColor: themeMode ? "#E8E9FC" : "#2FC4B2",
                }}
              >
                Play
                {themeMode ? (

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 58 57"
                    fill="none"
                    className="w-[10px] lg:w-[58px]"
                  >
                    <circle cx="29" cy="28.5" r="28" fill="#5A1073" />
                    <path d="M22.6 17.3L41.8 28.8L22.2 39.6L22.6 17.3Z" fill="white" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 58 57"
                    fill="none"
                    className="w-[10px] lg:w-[58px]"
                  >
                    <circle cx="29" cy="28.5" r="28" fill="#5A1073" />
                    <path d="M22.6 17.3L41.8 28.8L22.2 39.6L22.6 17.3Z" fill="white" />
                  </svg>
                )}
              </button>
            </div>
            <div className={`md:text-xl font-semibold mt-2 md:mt-3 line-clamp-1 cursor-pointer ${!themeMode && "title-dark-color"}`}>
              {feature}
            </div>
            <div className={`md:mt-2 mt-1 font-medium text-xs md:text-sm cursor-pointer`} style={{ color: themeMode ? "#BBBCC0" : "#BBBCC0" }} >
              {title}
            </div>
          </div>

        </div>
      </div>
    </>

  );
};

export default TVCard;