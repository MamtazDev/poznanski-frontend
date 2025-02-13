import React from "react";
import ModeSwitch from "../Switch/ModeSwitch";
import WujoLogo from "../../assets/png/wujo.png";
import TopBackSvg from "../../assets/svg/TopBackSvg";
import "./style.css";

interface MainBackProps {
  scrollToBottom: () => void;
  themeMode: boolean;
  type: boolean;
}

const MainBack: React.FC<MainBackProps> = ({
  scrollToBottom,
  themeMode,
  type,
}) => {
  return (
    <div
      className={`flex w-full relative overflow-hidden ${themeMode ? "background" : "background-dark"} `}>
      <div
        className={`flex flex-col justify-between items-center w-full md:py-5 py-1 mt-${type ? "48" : "80"}`}>
        <div className="z-20 mt-4 md:mt-5">
          <div className="flex justify-center">
            <ModeSwitch />
          </div>
          <div className="my-3 md:my-7">
            <h1
              className={`text-xl md:text-5xl ${!themeMode && "text-dark-color"} font-semibold main-board-text md:mb-4 mb-1 text-center`}>
              poznanskirap.com:
            </h1>
            <h1 className="text-xl md:text-5xl font-normal main-board-text text-white">
              Największy regionalny portal rapowy
            </h1>
          </div>
          <div className="flex justify-center">
            <img className="wujo-logo" src={WujoLogo} alt="wujo-Logo" />
          </div>
        </div>
        <div className="flex justify-center ">
          <div
            className="flex md:w-7 w-3 cursor-pointer animate-bounce hover:animate-none"
            onClick={scrollToBottom}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="29"
              height="28"
              viewBox="0 0 29 28"
              fill="none">
              <path
                d="M22.6668 14L14.5002 22.1667L6.3335 14"
                stroke="#F1F4F9"
                strokeWidth="3.29412"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute w-screen flex md:bottom-16 bottom-8 justify-center overflow-hidden">
        <TopBackSvg />
      </div>
    </div>
  );
};

export default MainBack;
