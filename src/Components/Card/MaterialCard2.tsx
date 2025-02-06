import { Card, Image } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "./style.css";
import { useDispatch } from "react-redux";
import { openPlayer } from "../../reducers/PlayerReducer";

interface News {
  type: string;
  // img: string;
  title: string;
  feature: string;
  date: string;
  location: string;
  youTube: string;
}

const MaterialCard: React.FC<News> = ({
  type,
  // img,
  title,
  feature,
  date,
  location,
  youTube
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const dispatch = useDispatch();
  const handlePlay = () => {
    if (youTube) {
      const videoId = youTube.split("v=")[1]?.split("&")[0];
      console.log("Extracted Video ID:", videoId);
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
        height={type === "horizontal" ? "264.537" : "91.577px"}
        _hover={
          !themeMode
            ? {
              boxShadow: "0px 0px 11.4px 4px rgba(59, 214, 198, 0.10)",
            }
            : {
              boxShadow: "0px 0px 11.457px 0px rgba(138, 138, 138, 0.24)",
            }
        }
        className="transition-all duration-300 ease-out w-full h-pull"
      >
          <div className="flex flex-col related justify-between w-full h-full">
            <div>
              <div
                className={`artist-card-image bg-gray-100 hover:opacity-75 object-cover cursor-pointer h-48 relative ${!themeMode && "dark-bg-color"}`}
              >

                  <div
                  className="relative w-full h-40 cursor-pointer rounded-md overflow-hidden"
                  onClick={handlePlay}
                >
                  <img
                src={
                  youTube
                    ? `https://img.youtube.com/vi/${youTube.split("v=")[1]?.split("&")[0]}/hqdefault.jpg`
                    : "default-thumbnail.jpg"
                }
                className="w-full h-full object-cover"
                alt="YouTube Thumbnail"
              />
                </div>
                <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
                  {themeMode ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="58"
                      height="57"
                      viewBox="0 0 58 57"
                      fill="none"
                    >
                      <circle
                        cx="29.0083"
                        cy="28.6963"
                        r="28.0302"
                        fill="#5A1073"
                      />
                      <path
                        d="M22.6165 17.2738L41.7791 28.7878L22.2263 39.6261L22.6165 17.2738Z"
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
                      <circle
                        cx="27.0083"
                        cy="27.0083"
                        r="27.0083"
                        fill="#2FC4B2"
                      />
                      <path
                        d="M20.8495 16.0019L39.3135 27.0962L20.4736 37.5393L20.8495 16.0019Z"
                        fill="#111217"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex justify-start mt-3">
                <div
                  className={`artist-feature-text px-5 py-1 ${!themeMode && "btn-dark-bg-color"}`}
                >
                  {feature}
                </div>
              </div>
              <div
                className={`artist-title-text flex mt-2 ${!themeMode && "title-dark-color"}`}
              >
                {title}
              </div>
            </div>
            <div className="flex justify-start mt-2">
              <div className="flex items-center">
                <div className="mr-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                  >
                    <path
                      d="M8.48531 9.89763C9.64224 9.89763 10.5801 8.95975 10.5801 7.80282C10.5801 6.64589 9.64224 5.70801 8.48531 5.70801C7.32838 5.70801 6.3905 6.64589 6.3905 7.80282C6.3905 8.95975 7.32838 9.89763 8.48531 9.89763Z"
                      stroke="#BBBCC0"
                      strokeWidth="1.00712"
                    />
                    <path
                      d="M2.85879 6.58013C4.18148 0.76569 12.7957 0.772405 14.1117 6.58685C14.8838 9.99763 12.7621 12.8847 10.9023 14.6707C9.55278 15.9732 7.41769 15.9732 6.06143 14.6707C4.20833 12.8847 2.08666 9.99091 2.85879 6.58013Z"
                      stroke="#BBBCC0"
                      strokeWidth="1.00712"
                    />
                  </svg>
                </div>
                <div className="mr-1 location2">{location}</div>
                <div className="mr-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="7"
                    height="7"
                    viewBox="0 0 7 7"
                    fill="none"
                  >
                    <circle
                      cx="3.65392"
                      cy="3.2766"
                      r="3.11351"
                      fill="#D9D9D9"
                    />
                  </svg>
                </div>
                <div className="mr-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="17"
                    viewBox="0 0 18 17"
                    fill="none"
                  >
                    <path
                      d="M6.34082 2.22266V4.2369"
                      stroke="#BBBCC0"
                      strokeWidth="1.00712"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.7122 2.22266V4.2369"
                      stroke="#BBBCC0"
                      strokeWidth="1.00712"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.31946 6.9834H14.7335"
                      stroke="#BBBCC0"
                      strokeWidth="1.00712"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.0692 6.58656V12.2936C15.0692 14.3078 14.0621 15.6506 11.7121 15.6506H6.34083C3.99088 15.6506 2.98376 14.3078 2.98376 12.2936V6.58656C2.98376 4.57232 3.99088 3.22949 6.34083 3.22949H11.7121C14.0621 3.22949 15.0692 4.57232 15.0692 6.58656Z"
                      stroke="#BBBCC0"
                      strokeWidth="1.00712"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.5071 10.0779H11.5131"
                      stroke="#BBBCC0"
                      strokeWidth="1.00712"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.5071 12.0925H11.5131"
                      stroke="#BBBCC0"
                      strokeWidth="1.00712"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.02343 10.0779H9.02946"
                      stroke="#BBBCC0"
                      strokeWidth="1.00712"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.02343 12.0925H9.02946"
                      stroke="#BBBCC0"
                      strokeWidth="1.00712"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.53844 10.0779H6.54447"
                      stroke="#BBBCC0"
                      strokeWidth="1.00712"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.53844 12.0925H6.54447"
                      stroke="#BBBCC0"
                      strokeWidth="1.00712"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="mr-1 location2">{date}</div>
              </div>
            </div>
          </div>


      </Card>
    </div>
  );
};

export default MaterialCard;
