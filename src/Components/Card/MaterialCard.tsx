import React from "react";
import { Card, Image } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { openPlayer } from "../../reducers/PlayerReducer";
import "./style.css";
import { useDispatch } from "react-redux";

interface CardProps {
  type: string;
  img: string;
  title: string;
  feature: string;
  date: string;
  location: string;
  link: string;
}

const MaterialCard: React.FC<CardProps> = ({
  type,
  img,
  title,
  feature,
  date,
  location,
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
        height={type === "horizontal" ? "408.908px" : "101px"}
        backgroundColor={themeMode ? "" : "#242526"}
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
          <div className="flex flex-col related justify-between w-full h-full">
            <div>
              <div
                className={`material-card-image bg-gray-100 hover:opacity-75 object-cover cursor-pointer h-48 relative ${!themeMode && "dark-bg-color"}`}
              >
                <Image
                  src={img}
                  className="cursor-pointer object-cover h-full w-full"
                  alt={img}
                  borderRadius="lg"
                />
                <div
                  className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2"
                  onClick={handlePlay}
                >
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
              <div className="flex justify-start mt-4">
                <div
                  className={`feature-text px-5 py-1 ${!themeMode && "btn-dark-bg-color"}`}
                >
                  {feature}
                </div>
              </div>
              <div
                className={`title-text flex mt-2 ${!themeMode && "title-dark-color"}`}
              >
                {title}
              </div>
            </div>
            <div className="flex justify-start mt-2">
              <div className="flex items-center">
                <div className="mx-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M11.9999 13.4304C13.723 13.4304 15.1199 12.0336 15.1199 10.3104C15.1199 8.5873 13.723 7.19043 11.9999 7.19043C10.2768 7.19043 8.87988 8.5873 8.87988 10.3104C8.87988 12.0336 10.2768 13.4304 11.9999 13.4304Z"
                      stroke="#BBBCC0"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3.61995 8.49C5.58995 -0.169998 18.42 -0.159997 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.38995 20.54C5.62995 17.88 2.46995 13.57 3.61995 8.49Z"
                      stroke="#BBBCC0"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <div className="mx-1 location">{location}</div>
                <div className="mx-1">
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
                <div className="mx-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="26"
                    viewBox="0 0 25 26"
                    fill="none"
                  >
                    <path
                      d="M8.37292 2.85938V5.97289"
                      stroke="#BBBCC0"
                      strokeWidth="1.55676"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.6755 2.85938V5.97289"
                      stroke="#BBBCC0"
                      strokeWidth="1.55676"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.70264 10.2178H21.3459"
                      stroke="#BBBCC0"
                      strokeWidth="1.55676"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21.8648 9.60618V18.4278C21.8648 21.5413 20.308 23.617 16.6756 23.617H8.37291C4.74047 23.617 3.18372 21.5413 3.18372 18.4278V9.60618C3.18372 6.49267 4.74047 4.41699 8.37291 4.41699H16.6756C20.308 4.41699 21.8648 6.49267 21.8648 9.60618Z"
                      stroke="#BBBCC0"
                      strokeWidth="1.55676"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.3588 15.0023H16.3681"
                      stroke="#BBBCC0"
                      strokeWidth="1.55676"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.3588 18.1166H16.3681"
                      stroke="#BBBCC0"
                      strokeWidth="1.55676"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.5196 15.0023H12.5289"
                      stroke="#BBBCC0"
                      strokeWidth="1.55676"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.5196 18.1166H12.5289"
                      stroke="#BBBCC0"
                      strokeWidth="1.55676"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.67838 15.0023H8.6877"
                      stroke="#BBBCC0"
                      strokeWidth="1.55676"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.67838 18.1166H8.6877"
                      stroke="#BBBCC0"
                      strokeWidth="1.55676"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="mx-1 location">{date}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full">
            <div className="h-full w-36 relative overflow-hidden">
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
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                  >
                    <circle cx="10.17" cy="10.17" r="10.17" fill="#5A1073" />
                    <path
                      d="M7.85096 6.02554L14.8036 10.2031L7.7094 14.1355L7.85096 6.02554Z"
                      fill="white"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                  >
                    <circle cx="10.17" cy="10.17" r="10.17" fill="#2FC4B2" />
                    <path
                      d="M7.85096 6.02652L14.8036 10.2041L7.7094 14.1365L7.85096 6.02652Z"
                      fill="#111217"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div className="w-full ml-2">
              <div>
                <div className="flex justify-start mb-2">
                  <div
                    className={`feature-text-2 ${!themeMode && "btn-dark-bg-color"}`}
                  >
                    {feature}
                  </div>
                </div>
                <div
                  className={`title-text-2 flex ${!themeMode && "title-dark-color"}`}
                >
                  {title}
                </div>
              </div>
              <div className="flex justify-start mt-2">
                <div className="flex items-center">
                  <div className="mx-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                    >
                      <path
                        d="M8.15001 9.12081C9.3203 9.12081 10.269 8.1721 10.269 7.00181C10.269 5.83152 9.3203 4.88281 8.15001 4.88281C6.97971 4.88281 6.03101 5.83152 6.03101 7.00181C6.03101 8.1721 6.97971 9.12081 8.15001 9.12081Z"
                        stroke="#BBBCC0"
                        strokeWidth="1.26892"
                      />
                      <path
                        d="M2.45857 5.76619C3.79653 -0.115392 12.5102 -0.1086 13.8414 5.77298C14.6224 9.22315 12.4763 12.1436 10.595 13.9501C9.22986 15.2677 7.07011 15.2677 5.6982 13.9501C3.8237 12.1436 1.67753 9.21636 2.45857 5.76619Z"
                        stroke="#BBBCC0"
                        strokeWidth="1.26892"
                      />
                    </svg>
                  </div>
                  <div className="mx-1 location2">{location}</div>
                  <div className="mx-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="6"
                      height="6"
                      viewBox="0 0 6 6"
                      fill="none"
                    >
                      <circle
                        cx="2.61889"
                        cy="2.53784"
                        r="2.53784"
                        fill="#D9D9D9"
                      />
                    </svg>
                  </div>
                  <div className="mx-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                    >
                      <path
                        d="M5.5144 1.3584V3.3959"
                        stroke="#BBBCC0"
                        strokeWidth="1.26892"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.9478 1.3584V3.3959"
                        stroke="#BBBCC0"
                        strokeWidth="1.26892"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.45813 6.17383H14.004"
                        stroke="#BBBCC0"
                        strokeWidth="1.26892"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.3435 5.77279V11.5457C14.3435 13.5832 13.3248 14.9415 10.9477 14.9415H5.51436C3.13728 14.9415 2.11853 13.5832 2.11853 11.5457V5.77279C2.11853 3.73529 3.13728 2.37695 5.51436 2.37695H10.9477C13.3248 2.37695 14.3435 3.73529 14.3435 5.77279Z"
                        stroke="#BBBCC0"
                        strokeWidth="1.26892"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.7404 9.30443H10.7465"
                        stroke="#BBBCC0"
                        strokeWidth="1.26892"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.7404 11.3425H10.7465"
                        stroke="#BBBCC0"
                        strokeWidth="1.26892"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.22794 9.30443H8.23404"
                        stroke="#BBBCC0"
                        strokeWidth="1.26892"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.22794 11.3425H8.23404"
                        stroke="#BBBCC0"
                        strokeWidth="1.26892"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.71427 9.30443H5.72037"
                        stroke="#BBBCC0"
                        strokeWidth="1.26892"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.71427 11.3425H5.72037"
                        stroke="#BBBCC0"
                        strokeWidth="1.26892"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="mx-1 location2">{date}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* </CardBody> */}
      </Card>
    </div>
  );
};

export default MaterialCard;
