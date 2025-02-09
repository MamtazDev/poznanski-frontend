import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DetailButton from "../../../Components/Buttons/DetailButton";
import ContentTitle from "../../../Components/ContentTitle";
import { apiBaseUrl } from "../../../Constant/config";
import MaterialCard from "../../../Components/Card/MaterialCard";

interface MaterialData {
  id: string;
  title: string;
  description: string;
  youTube: string;
  tags: string;
  date: string;
}

interface CartInterface {
  materials: MaterialData[];
}

const MaterialContent: React.FC<{ filter: string }> = ({ filter }) => {
  const [cardNum, setCardNum] = useState<number>(3);
  const [cardData, setCardData] = useState<CartInterface | null>(null);  // Set type to CartInterface or null
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setCardData(null);  // Reset previous data

    fetch(`${apiBaseUrl}/materials`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
        setCardData(data); 
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching materials:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCardNum(2);
        if (window.innerWidth < 768) setCardNum(1);
      } else {
        setCardNum(3);
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return cardData && cardData.materials.length ? (
    <div className="flex justify-center">
      <div className="container md:mt-36 md:pt-1.5 mt-20">
        <div className="flex justify-between">
          <ContentTitle titleType="VIDEOS" title="Materials" />
          <div className="flex items-end">
            <div className="md:block hidden">
              <DetailButton
                text="See All Videos"
                btnType="web"
                onClick={() => navigate("/material")}
              />
            </div>
          </div>
        </div>
        <div className="md:mt-16 mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {cardData.materials.map((item) => (
            <MaterialCard
              key={item.id}
              type="horizontal" // Or "vertical" based on your preference
              video={item.youTube}
              data={item}
              feature={item.tags} // Joining tags if you want to display them as a string
              title={item.title}
              date={item.date}
              link={item.youTube}
            />
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div>{loading ? "Loading..." : "No data available"}</div>
  );
};

export default MaterialContent;
