import { Card, Image } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "./style.css";

interface News {
  type: string;
  img: string;
  title: string;
  feature: string;
  date: string;
  location: string;
}

const MaterialCard: React.FC<News> = ({
  type,
  img,
  title,
  feature,
  date,
  location,
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

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
        {/* <CardBody> */}
        {type === "horizontal" ? (
          <div className="flex flex-col related justify-between w-full h-full">
            <div>
              <div
                className={`artist-card-image bg-gray-100 hover:opacity-75 object-cover cursor-pointer h-48 relative ${!themeMode && "dark-bg-color"}`}
              >
                <Image
                  src={img}
                  className="cursor-pointer object-cover h-full w-full"
                  alt={img}
                  borderRadius="lg"
                />
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
        ) : (
          <div className="flex h-full">
            <div className="h-full w-28 relative overflow-hidden">
              <Image
                src={img}
                className="cursor-pointer w-full h-full object-cover"
                alt={img}
                borderRadius="md"
              />
              <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
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
                    className={`artist-feature-text-2 ${!themeMode && "btn-dark-bg-color"}`}
                  >
                    {feature}
                  </div>
                </div>
                <div
                  className={`artist-title-text-2 flex ${!themeMode && "title-dark-color"}`}
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
