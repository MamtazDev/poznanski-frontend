import { Card } from "@chakra-ui/react";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducers";
import { openPlayer } from "../../reducers/PlayerReducer";
import "./style.css";
import { IoLocationOutline } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";

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

  const getYouTubeID = (url: string) => {
    let videoId = "";
    if (url.includes("youtube.com/watch")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    }
    return videoId;
  };

  const handlePlay = () => {
    if (youTube) {
      const videoId = youTube.split("v=")[1]?.split("&")[0];
      if (videoId) {
        dispatch(openPlayer(videoId));
      }
    }
  };

  const wordArray = feature ? feature.split(",").map((word) => word.trim()) : [];

  return (
    // <div className="product-card1 flex w-full">
    //   <Card
    //     padding={type === "horizontal" ? "14px" : "9px"}
    //     borderRadius="2xl"
    //     border={themeMode ? "" : "1px solid #242526"}
    //     backgroundColor={themeMode ? "#FFF" : "#242526"}
    //     height={type === "horizontal" ? "264.537px" : "91.577px"}
    //     _hover={{
    //       boxShadow: themeMode
    //         ? "0px 0px 11.457px 0px rgba(138, 138, 138, 0.24)"
    //         : "0px 0px 11.4px 4px rgba(59, 214, 198, 0.10)",
    //     }}
    //     className="transition-all duration-300 ease-out w-full h-pull"
    //   >
    //     <div className="flex md:flex-col md:justify-between w-full h-full gap-5">
    //       <div className={`relative bg-gray-100 cursor-pointer md:h-48 rounded-md overflow-hidden ${!themeMode && "dark-bg-color"
    //         }`}
    //         onClick={() => handlePlay(youTube)}
    //       >
    //         {/* YouTube Thumbnail */}
    //         <img
    //           src={youTube ? `https://img.youtube.com/vi/${getYouTubeID(youTube)}/hqdefault.jpg` : "default-thumbnail.jpg"}
    //           className="md:w-full w-[90px] h-full  object-cover"
    //           alt="YouTube Thumbnail"
    //         />

    //         {/* Play Button */}
    //         <div className="absolute inset-0 flex items-center justify-center">
    //             {themeMode ? (
    //               <svg xmlns="http://www.w3.org/2000/svg" width="58" height="57" viewBox="0 0 58 57" fill="none" className="w-[20px] md:w-[58px]">
    //                 <circle cx="29" cy="28.5" r="28" fill="#5A1073" />
    //                 <path d="M22.6 17.3L41.8 28.8L22.2 39.6L22.6 17.3Z" fill="white" />
    //               </svg>
    //             ) : (
    //               <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 55 55" fill="none" className="w-[20px] md:w-[58px]">
    //                 <circle cx="27.5" cy="27.5" r="27.5" fill="#2FC4B2" />
    //                 <path d="M20.8 16L39.3 27.1L20.5 37.5L20.8 16Z" fill="#111217" />
    //               </svg>
    //             )}
    //           </div>
    //       </div>

    //       <div>
    //         {/* Feature Text */}
    //       <div className="flex justify-start mt-3">
    //         <div
    //           className={`px-5 py-1 rounded ${!themeMode && "btn-dark-bg-color"
    //             }`}
    //         >
    //           {feature}
    //         </div>
    //       </div>

    //       {/* Title */}
    //       <div
    //         className={`mt-2 font-semibold text-lg line-clamp-1 ${!themeMode && "title-dark-color"
    //           }`}
    //       >
    //         {title}
    //       </div>

    //       {/* Location and Date */}
    //       <div className="flex justify-start items-center mt-2 text-sm text-gray-600">
    //         <div className="mr-2">{location}</div>
    //         <span>•</span>
    //         <div className="ml-2">{date}</div>
    //       </div>
    //       </div>
    //     </div>
    //   </Card>
    // </div>

    <div className="product-card1 flex w-full">
      <div
        className={`flex md:flex-col gap-5 md:justify-between w-full h-full p-5 rounded-2xl
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
        <div className="flex md:flex-col  gap-5  related md:justify-between w-full h-full">

          <div
            className={`hover:opacity-75 object-cover cursor-pointer relative ${!themeMode && "dark-bg-color"}`}
          >

            {/* YouTube Thumbnail */}
            <div
              className={`relative lg:bg-gray-100 cursor-pointer md:h-48 h-[80px] rounded-md overflow-hidden ${!themeMode && "dark-bg-color"}`}
              onClick={(e) => {
                e.stopPropagation();
                handlePlay();
              }}
            >
              <img
                src={
                  youTube
                    ? `https://img.youtube.com/vi/${youTube.split("v=")[1]}/hqdefault.jpg`
                    : "default-thumbnail.jpg"
                }
                className="md:w-full w-[90px] h-full  object-cover"
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
          </div>
          <div>
            <div className="flex justify-start">
              <div className="flex md:flex-wrap gap-2 line-clamp-1">
                {wordArray.map(
                  (tag, index) =>
                    tag && (
                      <div
                        key={index}
                        className={`feature-text ${!themeMode && "btn-dark-bg-color"} px-2 py-1 rounded`}
                      >
                        {tag.trim()}
                      </div>
                    )
                )}
              </div>
            </div>

            <div
              className={`mt-2 line-clamp-1 ${!themeMode && "title-dark-color"}`}
            >
              {title}
            </div>


            <div className='flex gap-2 items-center'>
              {location &&
                <>
                  <p className='flex gap-1 items-center' style={{
                    color: themeMode ? "#9B9CA1" : "#9B9CA1"
                  }}><IoLocationOutline /> New York</p>
                  <GoDotFill style={{ color: themeMode ? "#D9D9D9" : "D9D9D9", }} />
                </>
              }

              {date && <p className='flex gap-1 items-center' style={{
                color: themeMode ? "#9B9CA1" : "#9B9CA1"
              }}>
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M8 2V5" stroke="#9B9CA1" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M16 2V5" stroke="#9B9CA1" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M3.5 9.08984H20.5" stroke="#9B9CA1" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#9B9CA1" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M15.6947 13.6992H15.7037" stroke="#9B9CA1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M15.6947 16.6992H15.7037" stroke="#9B9CA1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M11.9955 13.6992H12.0045" stroke="#9B9CA1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M11.9955 16.6992H12.0045" stroke="#9B9CA1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M8.29431 13.6992H8.30329" stroke="#9B9CA1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M8.29431 16.6992H8.30329" stroke="#9B9CA1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </>
                {date}
              </p>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;
