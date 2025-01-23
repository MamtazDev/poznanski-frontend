import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Image } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "./style.css";
import { getFirstTag } from "../../Pages/Article";
import artists1 from "../../assets/svg/artists1.svg";
export interface News {
  type: string;
  img: string | undefined;
  title: string;
  tags: string;
  date: string;
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
                  {tags.split("#").map(
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
        ) : (
          <div className="flex h-full">
            <div className="h-full rounded-md w-36 bg-slate-900 relative overflow-hidden">
              <div
                className={`date-badge-2 absolute top-1 right-1 z-50 ${!themeMode && "btn-dark-bg-color"}`}
              >
                {date.split("T")[0]}
              </div>
              <Image
                src={imageSrc}
                alt="news image"
                className="cursor-pointer object-cover h-full w-full"
                borderRadius="xl"
              />
            </div>
            <div className="w-full ml-2">
              <div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.split("#").map(
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
                  className={`title-text-2 mt-2 flex overflow-hidden ${!themeMode && "title-dark-color"}`}
                >
                  {title}
                </div>
              </div>
              <div className="flex justify-start mr-2">
                <div
                  className={`card-more-btn-2 ${!themeMode && "text-dark-color"}`}
                  onClick={handleClick}
                >
                  Czytaj dalej...
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
