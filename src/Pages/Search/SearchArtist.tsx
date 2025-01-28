import { Avatar } from "@chakra-ui/react";
import { useState } from "react";
import ArtistsCarousel from "../Home/Artists/Carousel";
interface ArtistsData {
  id: string;
  name: string;
  img: string;
  description: string;
}

interface Products {
  id: string;
  title: string;
  img: string;
  date: string;
  category: string;
  location: string;
}
const SearchArtist = ({ themeMode, type }: any) => {
  const [cardData, setCardData] = useState<Products[]>([]);
  const [artist, setArtist] = useState<ArtistsData>({
    id: "",
    name: "",
    img: "",
    description: "",
  });
  return (
    <div className="mt-16">
      <h1 className={`text-[#252733] text-2xl font-semibold text-start ${themeMode ? "text-[#252733]" : "text-white"}`}>
        Artists
      </h1>

      <div
        className={`w-full mt-6 `}
      >
        {artist && (
          <div className="flex items-start w-full">
            <Avatar
              size={window.innerWidth < 768 ? "lg" : "2xl"}
              src={artist.img}
            />
            <div className="flex flex-col md:ml-4 ml-2 gap-1 md:gap-3">
              <div
                className={`artist-name md:text-2xl text-start font-semibold text-[#252733] text-md ${themeMode ? "text-[#252733]" : "text-white"}`}
              >
                {/* {artist.name} */}
                konika 
              </div>
              <div
                className="artist-description text-[#6D6E76]"
                style={{ fontSize: !type ? "16px" : "12px" }}
              >
                {/* {artist.description} */}
                 Lorem ipsum dolor sit amet, consectetur
                adipisicing elit. Officia asperiores ipsam maxime quod eius
                officiis alias fugit suscipit laborum, tempora explicabo
                architecto iusto vel a quibusdam ut quae? Laborum, nemo!
              </div>
            </div>
          </div>
        )}
        {/* <div className="md:pr-16">
                  {cardData.length > 0 && <ArtistsCarousel cardNum={cardNum} cardData={cardData} />}
                </div> */}
      </div>
    </div>
  );
};

export default SearchArtist;
