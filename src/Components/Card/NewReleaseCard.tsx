import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { openPlayer } from "../../reducers/PlayerReducer";

interface News {
  title: string;
  description?: string;
  youTube: string;
  img?: string;
  feature?: string;
  date?: string;
  nickname?: string;
  link: string;
  data: any
}

const NewReleaseCard: React.FC<News> = ({
  title,
  description,
  date,
  nickname,
  youTube,
  link,
  data
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const dispatch = useDispatch();
  const handlePlay = () => {
    if (data.songs[0]?.youTube) {
      const videoId = data.songs[0]?.youTube.split("v=")[1]?.split("&")[0];
      if (videoId) {
        dispatch(openPlayer(videoId));
      }
    }
  };

  return (
    <div
      style={{
        backgroundColor: themeMode ? "#FFFFFF" : "#1F2937",
        color: themeMode ? "#FFFFFF" : "#000000",
      }}
      className="rounded-lg shadow-lg p-4 transition-all duration-300"
    >
      <div
        className="relative w-full h-40 cursor-pointer rounded-md overflow-hidden"
        onClick={handlePlay}
      >
        <img
          src={`https://img.youtube.com/vi/${data.songs[0]?.youTube.split("v=")[1]}/hqdefault.jpg`}
          className="w-full h-full object-cover"
          alt="YouTube Thumbnail"
        />
      </div>

      <h3 className="mt-2 text-md font-semibold " style={{
        color: themeMode ? "#000000" : "#FFFFFF",
      }}>{title}</h3>
      <h3 className="mt-2  " style={{
        color: themeMode ? "#BBBCC0" : "#9B9CA1",
      }}>{data.artists[0]?.nickname}</h3>
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
  );
};

export default NewReleaseCard;
