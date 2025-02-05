import { Button, Card, Image } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import artists1 from "../../assets/svg/artists1.svg";
import { RootState } from "../../reducers";
import "./style.css";
export interface News {
  type: string;
  img: string | undefined;
  title: string;
  tags: string;
  date: any;
  _id: string;
}

const ProductCard1: React.FC<News> = ({
  type,
  img,
  title,
  tags,
  date,
  _id,
}) => {
  const navigate = useNavigate();
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const handleClick = () => {
    console.log(_id);
    navigate(`/news/${_id}`);
  };

  const imageSrc = img ? `${process.env.REACT_APP_FILES_URL}${img}` : artists1;

  const wordArray = tags ? tags.split(",").map((word) => word.trim()) : [];

  return (
    <div className={`flex w-full h-full`}>
      <Card
        borderRadius="2xl"
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
        className={`transition-all duration-300 ease-out w-full h-full p-5`}
      >
        {/* <CardBody> */}
        <div className="flex flex-col related justify-between w-full h-full">
          <div
            className={`date-badge absolute top-10 right-10 z-50 ${!themeMode && "btn-dark-bg-color"}`}
          >
            {date.split("T")[0]}
          </div>
          <div>
            <div
              className={`card-image bg-gray-100 hover:opacity-75 object-cover cursor-pointer ${!themeMode && "dark-bg-color"}`}
            >
              <Image
                src={img ?? imageSrc}
                className="cursor-pointer object-cover h-full w-full"
                alt="news image"
                borderRadius="xl"
              />
            </div>

            <div className="flex justify-start mt-4">
              <div className="flex flex-wrap gap-2 mt-2">
                {wordArray.map(
                  (tag, index) =>
                    tag && (
                      <div
                        key={index}
                        className={`feature-text ${!themeMode && "btn-dark-bg-color"} px-2 py-1 rounded`}
                      >
                        {tag.trim()}
                      </div>
                    )
                )}
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
              Czytaj więcej...
            </Button>
          </div>
        </div>
        {/* </CardBody> */}
      </Card>
    </div>
  );
};

export default ProductCard1;
