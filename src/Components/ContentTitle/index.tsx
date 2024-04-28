import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "./style.css";
interface TitleProps {
  titleType: string;
  title: string;
}

const ContentTitle: React.FC<TitleProps> = ({ titleType, title }) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  return (
    <div>
      <div>
        <div className="flex md:mb-6 mb-2">
          <div className="flex items-center">
            <div
              className={`line ${!themeMode && "btn-dark-bg-color"} md:w-8 w-5 md:h-0.5 h-px`}
            />
          </div>
          <div
            className={`title-type ${!themeMode && "text-dark-color"} md:mx-2.5 mx-2 md:text-sm text-xs`}
          >
            {titleType}
          </div>
          <div className="flex items-center">
            <div
              className={`line ${!themeMode && "btn-dark-bg-color"} md:w-8 w-5 md:h-0.5 h-px`}
            />
          </div>
        </div>
        <div
          className={`title ${!themeMode ? "title-dark-color" : ""} md:text-5xl text-2xl text-left`}
        >
          {title}
        </div>
      </div>
    </div>
  );
};

export default ContentTitle;
