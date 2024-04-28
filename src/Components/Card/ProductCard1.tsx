import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Image } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "./style.css";

interface CardProps {
  type: string;
  img: string;
  title: string;
  feature: string;
  date: string;
  id?: string;
}

const ProductCard1: React.FC<CardProps> = ({
  type,
  img,
  title,
  feature,
  date,
  id,
}) => {
  const navigate = useNavigate();
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const handleClick = () => {
    console.log(id);
    navigate(`${id}`);
  };

  return (
    <div className={`product-card1 flex w-full`}>
      <Card
        padding={type === "horizontal" ? "20px" : "10px"}
        borderRadius="2xl"
        height={type === "horizontal" ? "401.249px" : "101px"}
        border={themeMode ? "1px solid white" : "1px solid #242526"}
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
        className={`transition-all duration-300 ease-out w-full h-pull`}
      >
        {/* <CardBody> */}
        {type === "horizontal" ? (
          <div className="flex flex-col related justify-between w-full h-full">
            <div
              className={`date-badge absolute top-10 right-10 z-50 ${!themeMode && "btn-dark-bg-color"}`}
            >
              {date}
            </div>
            <div>
              <div
                className={`card-image bg-gray-100 hover:opacity-75 object-cover cursor-pointer ${!themeMode && "dark-bg-color"}`}
              >
                <Image
                  src={img}
                  className="cursor-pointer object-cover h-full w-full"
                  alt={img}
                  borderRadius="xl"
                />
              </div>
              <div className="flex justify-start mt-4">
                <div
                  className={`feature-text ${!themeMode && "btn-dark-bg-color"}`}
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
              <Button
                variant="ghost"
                className={`card-more-btn ${!themeMode && "text-dark-color"}`}
                onClick={handleClick}
              >
                Learn More...
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex h-full">
            <div className="h-full w-36 relative overflow-hidden">
              <div
                className={`date-badge-2 absolute top-1 right-1 z-50 ${!themeMode && "btn-dark-bg-color"}`}
              >
                {date}
              </div>
              <Image
                src={img}
                className="cursor-pointer h-full object-cover"
                alt={img}
                borderRadius="md"
              />
            </div>
            <div className="w-full ml-2">
              <div>
                <div className="flex justify-start">
                  <div
                    className={`feature-text-2 ${!themeMode && "btn-dark-bg-color"}`}
                  >
                    {feature}
                  </div>
                </div>
                <div
                  className={`title-text-2 mt-2 flex ${!themeMode && "title-dark-color"}`}
                >
                  {title}
                </div>
              </div>
              <div className="flex justify-start mt-2">
                <div
                  className={`card-more-btn-2 ${!themeMode && "text-dark-color"}`}
                  onClick={handleClick}
                >
                  Learn More...
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

export default ProductCard1;
