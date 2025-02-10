import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { openPlayer } from "../../reducers/PlayerReducer";
import { useNavigate } from "react-router-dom";

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

  const handlePlay = () => {
    if (data.songs[0]?.youTube) {
      const videoId = data.songs[0]?.youTube.split("v=")[1]?.split("&")[0];
      console.log("Extracted Video ID:", videoId);
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
        backgroundColor: themeMode ? "#FFFFFF" : "#1F2937",
        color: themeMode ? "#FFFFFF" : "#000000",
      }}
      className="rounded-lg shadow-lg p-4 transition-all duration-300 flex md:flex-col gap-5"
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
          className="object-cover md:w-full w-[69px] md:h-[200px] h-full rounded-md"
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
          {data.songs[0]?.date}
        </p>
      )}
      </div>

    </div>
  );
};

export default NewReleaseCard;
