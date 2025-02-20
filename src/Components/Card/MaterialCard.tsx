import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { openPlayer } from "../../reducers/PlayerReducer";
import "./style.css";
import { IoLocationOutline } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import moment from "moment";
import { useNavigate } from "react-router-dom";

interface News {
  type: string;
  id?: any;
  _id?: any;
  video: string;
  title: string;
  feature: string;
  date: string;
  location?: string;
  link: string;
  data: any;
}

const MaterialCard: React.FC<News> = ({
  type,
  video,
  title,
  feature,
  location,
  date,
  link,
  id,
  _id,
  data,
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const dateFormated = moment(date).format("MM/ DD/ YYYY");
  const handlePlay = () => {
    if (data?.youTube) {
      const videoId = data?.youTube.split("v=")[1]?.split("&")[0];
      if (videoId) {
        dispatch(openPlayer(videoId));
      }
    }
  };

  // const YouTubeEmbed = ({ video, title }: { video: string; title: string }) => (
  //   <div className="relative w-full h-full" style={{ paddingBottom: "56.25%" }}>
  //     <iframe
  //       src={`${video.replace("watch?v=", "embed/")}`}
  //       title={title}
  //       className="absolute top-0 left-0 w-full h-full"
  //       frameBorder="0"
  //       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  //       allowFullScreen></iframe>
  //   </div>
  // );

  const wordArray = feature ? feature.split(",").map((word) => word.trim()) : [];


  const handleClick = (id: any) => {
    navigate(`/materials/${id}`);
    // console.log(id, "materials")
  };

  return (
    <div className="product-card1 flex w-full">
      <div
        className={`flex md:flex-col gap-5 md:justify-between w-full h-full p-5 rounded-2xl shadow-md cursor-pointer
      ${themeMode ? "border border-white" : "border border-[#242526] bg-[#242526]"}
      ${!themeMode ? "hover:shadow-[0px_0px_11.4px_4px_rgba(59,214,198,0.10)]" : "hover:shadow-[0px_0px_11.457px_0px_rgba(138,138,138,0.24)]"}
      `}
        style={{
          backgroundColor: themeMode ? "" : "#242526",
          border: themeMode ? "1px solid white" : "1px solid #242526",
          borderRadius: "2xl",
        }}
        onClick={() => handleClick(id)}
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
                  data.youTube
                    ? `https://img.youtube.com/vi/${data.youTube.split("v=")[1]}/hqdefault.jpg`
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
                        style={{
                          backgroundColor: themeMode? "#E8ECFE":"#2FC4B2",
                          color: themeMode? "#5A1073":"#5A1073"
                        }}
                      >
                        {tag.length > 9 ? `${tag.substring(0, 5)}...` : tag}
                      </div>
                    )
                )}
              </div>
            </div>

            <div
              className={`mt-2 text-lg font-semibold line-clamp-1 ${!themeMode && "title-dark-color"}`}
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
                    <path d="M8 2V5" stroke="#9B9CA1" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 2V5" stroke="#9B9CA1" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3.5 9.08984H20.5" stroke="#9B9CA1" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#9B9CA1" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15.6947 13.6992H15.7037" stroke="#9B9CA1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15.6947 16.6992H15.7037" stroke="#9B9CA1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11.9955 13.6992H12.0045" stroke="#9B9CA1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11.9955 16.6992H12.0045" stroke="#9B9CA1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.29431 13.6992H8.30329" stroke="#9B9CA1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.29431 16.6992H8.30329" stroke="#9B9CA1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
                {dateFormated}
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
