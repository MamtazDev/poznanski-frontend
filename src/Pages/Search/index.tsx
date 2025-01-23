import BreadCrumb from "../../Components/BreadCrumb";
import MaterialCard from "../../Components/Card/MaterialCard";
import ProductCard1 from "../../Components/Card/ProductCard1";
import Layout from "../../Components/Layout";

const SearchMainPage = ({ themeMode, type }: any) => {
  const cardData = [
    {
      id: 1,
      img: "https://via.placeholder.com/150",
      feature: "Feature 1",
      title: "Card Title 1",
      date: "2025-01-01",
      link: "/link1",
      location: "Location 1",
    },
    {
      id: 2,
      img: "https://via.placeholder.com/150",
      feature: "Feature 2",
      title: "Card Title 2",
      date: "2025-01-02",
      link: "/link2",
      location: "Location 2",
    },
    {
      id: 3,
      img: "https://via.placeholder.com/150",
      feature: "Feature 3",
      title: "Card Title 3",
      date: "2025-01-03",
      link: "/link3",
      location: "Location 3",
    },
    {
      id: 4,
      img: "https://via.placeholder.com/150",
      feature: "Feature 4",
      title: "Card Title 4",
      date: "2025-01-04",
      link: "/link4",
      location: "Location 4",
    },
    {
      id: 5,
      img: "https://via.placeholder.com/150",
      feature: "Feature 5",
      title: "Card Title 5",
      date: "2025-01-05",
      link: "/link5",
      location: "Location 5",
    },
  ];

  return (
    <Layout themeMode={themeMode} type={type}>
      <div className="flex justify-center">
        <div className="container">
          {type ? (
            ""
          ) : (
            <div className="md:mt-12 mt-8">
              <BreadCrumb />
            </div>
          )}
          <div>
            <h1 className="text-[#252733] font-bold text-5xl text-start mt-5 mb-16">
              You searched for “Lorum Ipsum”
            </h1>
          </div>

          <div>
            <h1 className="text-[#252733] text-2xl font-semibold text-start mb-6">
              News
            </h1>

            {cardData.map(
                    (item, index) =>
                      item && (
                        <div
                          key={`main-video-card-${index}`}
                          className="w-full"
                        >
                        <ProductCard1
                              type={type ? "vertical" : "horizontal"}
                              img={item.img}
                              tags={`${item.tags}`}
                              title={item.title}
                              date={`${item.date}`.split("T")[0]}
                              _id={item.id}
                            />
                        </div>
                      )
                  )}
            
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchMainPage;
