import React from "react";
import { Card, Image } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { openPlayer } from "../../reducers/PlayerReducer";
import "./style.css";
import { useDispatch } from "react-redux";

interface News {
  type: string;
  img: string;
  title: string;
  feature: string;
  date: string;
  link: string;
}

const NewReleaseCard: React.FC<News> = ({
  type,
  img,
  title,
  feature,
  date,
  link,
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const dispatch = useDispatch();

  const handlePlay = () => {
    dispatch(openPlayer(link));
  };

  return (
    <div className="product-card1 flex w-full">
      <Card
        padding={type === "horizontal" ? "20px" : "10px"}
        borderRadius="2xl"
        border={themeMode ? "1px solid white" : "1px solid #242526"}
        backgroundColor={themeMode ? "" : "#242526"}
        height={type === "horizontal" ? "358.598px" : "83px"}
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
        {/* <CardBody> */}
        {type === "horizontal" ? (
          <div className="flex flex-col justify-between w-full h-full">
            <div>
              <div
                className={`release-card-image bg-gray-100 hover:opacity-75 object-cover cursor-pointer h-48 relative ${!themeMode && "dark-bg-color"}`}
              >
                <Image
                  src={img}
                  className="cursor-pointer object-cover h-full w-full"
                  alt={img}
                  borderRadius="lg"
                />
                <div
                  className="absolute w-10 h-10 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 cursor-pointer z-100"
                  onClick={handlePlay}
                >
                  {themeMode ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                    >
                      <circle
                        cx="20.027"
                        cy="20.317"
                        r="19.5289"
                        fill="#5A1073"
                      />
                      <path
                        d="M15.5738 12.3581L28.9246 20.3801L15.3019 27.9312L15.5738 12.3581Z"
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
                        cx="27.5862"
                        cy="27.9204"
                        r="27.0083"
                        fill="#2FC4B2"
                      />
                      <path
                        d="M21.4275 16.914L39.8916 28.0083L21.0516 38.4515L21.4275 16.914Z"
                        fill="#111217"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex justify-start mt-4">
                <div
                  className={`release-feature-text py-1 ${!themeMode && "title-dark-color"} overflow-hidden text-nowrap text-ellipsis`}
                >
                  {feature}
                </div>
              </div>
              <div className="release-title-text flex mt-3">{title}</div>
              <div className="flex justify-start mt-2 newRelease-card-date">
                {date}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full">
            <div className="h-full w-24 relative overflow-hidden">
              <Image
                src={img}
                className="cursor-pointer w-full h-full object-cover"
                alt={img}
                borderRadius="md"
              />
              <div
                className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2"
                onClick={handlePlay}
              >
                {themeMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <circle cx="10" cy="10" r="10" fill="#5A1073" />
                    <path
                      d="M7.71963 5.92482L14.5561 10.0326L7.58044 13.8992L7.71963 5.92482Z"
                      fill="white"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <circle cx="10" cy="10" r="10" fill="#2FC4B2" />
                    <path
                      d="M7.71963 5.92579L14.5561 10.0335L7.58044 13.9002L7.71963 5.92579Z"
                      fill="#111217"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div className="w-full ml-3">
              <div>
                <div className="flex justify-start mb-2">
                  <div
                    className={`release-feature-text-2  ${!themeMode && "title-dark-color"}`}
                  >
                    {feature}
                  </div>
                </div>
                <div className={`release-title-text-2 flex`}>{title}</div>
              </div>
              <div className="flex justify-start mt-2 newRelease-card-date-2">
                {date}
              </div>
            </div>
          </div>
        )}
        {/* </CardBody> */}
      </Card>
    </div>
  );
};

export default NewReleaseCard;
