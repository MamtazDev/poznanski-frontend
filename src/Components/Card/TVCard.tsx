import { Card } from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { openPlayer } from "../../reducers/PlayerReducer";
import { useNavigate } from "react-router-dom";

interface News {
  type: string;
  video: string;
  title: string;
  feature: string;
  youTube: string;
  data: any;
  id?: any;
  link: string;
}

const TVCard: React.FC<News> = ({ type, video, title, feature, link, youTube, data, id }) => {
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
      <Card
        className="transition-all duration-300 ease-out w-full h-pull"
      >

          <div  className={`flex flex-col justify-between w-full h-full p-5 rounded-2xl
    ${themeMode ? "border border-white" : "border border-[#242526] bg-[#242526]"}
    ${!themeMode ? "hover:shadow-[0px_0px_11.4px_4px_rgba(59,214,198,0.10)]" : "hover:shadow-[0px_0px_11.457px_0px_rgba(138,138,138,0.24)]"}
  `}
          style={{
            boxShadow: themeMode ? "0px 0px 11.4px 4px rgba(59, 214, 198, 0.10)":"0px 0px 11.457px 0px rgba(138, 138, 138, 0.24)",
            backgroundColor:themeMode ? "" : "#242526",
            border:themeMode ? "1px solid white" : "1px solid #242526",
               borderRadius:"2xl",
              //  _hover:{
              //   !themeMode
              //     ? {
              //       boxShadow: "0px 0px 11.4px 4px rgba(59, 214, 198, 0.10)",
              //     }
              //     : {
              //       boxShadow: "0px 0px 11.457px 0px rgba(138, 138, 138, 0.24)",
              //     }
              // }
          }}
          >
            <div>
              <div
                className={`tv-card-image bg-gray-100 hover:opacity-75 object-cover cursor-pointer h-36 relative z-10 ${!themeMode && "dark-bg-color"}`}
              >
                {/* <YouTubeEmbed video={video} title={title} /> */}
                <div
                  className="relative w-full h-40 cursor-pointer rounded-md overflow-hidden"
                  onClick={handlePlay}
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
                </div>
              </div>
              <div className="flex justify-start mt-4">
                <div
                  className={`tv-feature-text py-1 ${!themeMode && "title-dark-color"}`}
                >
                  {feature}
                </div>
              </div>
              <div
                className={`tv-title-text flex mt-2 ${!themeMode && "title-dark-color"}`}
              >
                {title}
              </div>
              <button
                onClick={() => handleClick(id)}
                className='mt-4 font-bold'
                style={{ color: themeMode ? "#5A1073" : "#3BD6C6" }}

              >
                view details
              </button>
            </div>
          </div>

      </Card>
    </div>
  );
};

export default TVCard;