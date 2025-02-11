import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { openPlayer } from "../../reducers/PlayerReducer";
import { useNavigate } from "react-router-dom";
import moment from "moment";

interface News {
  title: string;
  id?: any;
  description?: string;
  youTube: string;
  img?: string;
  feature?: string;
  date?: string;
  nickname?: string;
  link: string;
  btn?: string;
  data: any
}

const NewReleaseCard: React.FC<News> = ({
  title,
  description,
  date,
  nickname,
  youTube,
  link,
  btn,
  id,
  data
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dateFormated = moment(date).format(" DD/ MM/ YYYY");
  const handlePlay = () => {
    if (data.songs[0]?.youTube) {
      const videoId = data.songs[0]?.youTube.split("v=")[1]?.split("&")[0];
      if (videoId) {
        dispatch(openPlayer(videoId));
      }
    }
  };

  const handleClick = (id: string) => {
    navigate(`/album/${id}`);
  };

  return (
    <div
      style={{
        backgroundColor: themeMode ? "#FFFFFF" : "#242526",
        color: themeMode ? "#FFFFFF" : "#000000",
      }}
      className={`flex md:flex-col gap-5 md:justify-between w-full h-full p-5 rounded-2xl shadow-md
        ${themeMode ? "border border-white" : "border border-[#242526] bg-[#242526]"}
        ${!themeMode ? "hover:shadow-[0px_0px_11.4px_4px_rgba(59,214,198,0.10)]" : "hover:shadow-[0px_0px_11.457px_0px_rgba(138,138,138,0.24)]"}
        `}
      onClick={() => handleClick(id)}
    >
      {data.songs[0]?.youTube &&
      <div
        // className="relative cursor-pointer overflow-hidden"
        onClick={(e) => {
          e.stopPropagation();
          handlePlay();
        }}
      >
        <img
          src={`https://img.youtube.com/vi/${data.songs[0]?.youTube.split("v=")[1]}/hqdefault.jpg`}
          className="object-cover w-[69px] h-[69px] md:w-full md:h-[200px] rounded-md"
          alt="YouTube Thumbnail"
        />
      </div>
      }

      <div>
      {title && <h3 className="mt-2 text-md font-semibold line-clamp-1" style={{ color: themeMode ? "#000000" : "#FFFFFF", }}>{title}</h3>}
      {nickname && <h3 className="mt-2  " style={{ color: themeMode ? "#BBBCC0" : "#9B9CA1", }}>{nickname}</h3>}

      {description && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 "
          style={{
            color: themeMode ? "#BBBCC0" : "#9B9CA1",
          }}>
          {description}
        </p>
      )}
      {date && (
        <p className="mt-2  text-gray-600 dark:text-gray-300 "
          style={{
            color: themeMode ? "#BBBCC0" : "#9B9CA1",
          }}>
          {dateFormated}
        </p>
      )}
      </div>

    </div>
  );
};

export default NewReleaseCard;
