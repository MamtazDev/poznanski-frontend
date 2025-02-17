import { Spinner } from "@chakra-ui/react";
import DelayedComponent from "../../Components/_utility/DelayedComponent";
import BreadCrumb from "../../Components/BreadCrumb";
import ProductCard1 from "../../Components/Card/ProductCard1";
import Layout from "../../Components/Layout";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import useSWR from "swr";
import { Link } from "react-router-dom";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SearchMainPage = ({ themeMode, type }: any) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const searchText = queryParams.get("query") || "Nothing";

  const { data, error } = useSWR(
    `http://localhost:8000/api/search/search?query=${searchText}`,
    fetcher
  );

  if (error) return <div>Error loading results.</div>;

  const {
    artists = [],
    products = [],
    newsData = [],
    Concert = [],
  } = data?.data || {};

  return (
    <Layout themeMode={themeMode} type={type}>
      <div className="flex justify-center">
        <div className="container mx-auto px-4">
          {!type && (
            <div className="md:mt-12 mt-8">
              <BreadCrumb />
            </div>
          )}
          <h1
            className={`font-bold text-3xl sm:text-4xl md:text-5xl mt-5 mb-8 sm:mb-12 ${themeMode ? "text-[#252733]" : "text-white"}`}>
            You searched for “{searchText}”
          </h1>

          <DelayedComponent delay={200}>
            {loading ? (
              <div
                className="w-full flex justify-center items-center"
                style={{ minHeight: type ? "776px" : "908px" }}>
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="lg"
                />
              </div>
            ) : (
              <>
                {/* News Section */}
                {newsData.length > 0 ? (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">News</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-5">
                      {newsData.map((item: any) => (
                        <ProductCard1
                          key={item._id}
                          type="vertical"
                          img={item?.files?.[0]}
                          tags={item.tags}
                          title={item.title}
                          date={item.date.split("T")[0]}
                          _id={item._id}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-5">
                    <h2 className="text-xl font-semibold mb-4">News</h2>
                    <p>No data found</p>
                  </div>
                )}

                {/* Artists Section */}
                {artists.length > 0 ? (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Artists</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-5">
                      {artists.map((artist: any) => (
                        <Link
                          to={`/artist/${artist._id}`}
                          key={artist._id}
                          target="_blank"
                          className="bg-white p-4 rounded shadow block">
                          <img
                            src={artist.profileImg}
                            alt={artist.name}
                            className="w-full h-40 object-cover rounded"
                          />
                          <h3 className="mt-2 text-lg font-semibold">
                            {artist.name}
                          </h3>
                          <p>{artist.description}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-5">
                    <h2 className="text-xl font-semibold mb-4">Artists</h2>
                    <p>No data found</p>
                  </div>
                )}

                {/* Products Section */}
                {products.length > 0 ? (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-5">
                      {products.map((product: any) => (
                        <div
                          key={product._id}
                          className="bg-white p-4 rounded shadow">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-40 object-cover rounded"
                          />
                          <h3 className="mt-2 text-lg font-semibold">
                            {product.name}
                          </h3>
                          <p className="text-gray-500">{product.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-5">
                    <h2 className="text-xl font-semibold mb-4">Products</h2>
                    <p>No data found</p>
                  </div>
                )}

                {/* Concerts Section */}
                {Concert.length > 0 ? (
                  <div>
                    <h2 className="text-xl font-semibold">Concerts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-5">
                      {Concert.map((concert: any) => (
                        <div
                          key={concert._id}
                          className="bg-white p-4 rounded shadow">
                          <img
                            src={concert.img}
                            alt={concert.name}
                            className="w-full h-40 object-cover rounded"
                          />
                          <Link
                            to={`/concert/${concert._id}`}
                            className="mt-2 text-lg font-semibold">
                            {concert.name}
                          </Link>
                          <h3 className="mt-2 text-lg font-semibold">
                            {concert.description}
                          </h3>
                          <p className="text-gray-500">{concert.location}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-5">
                    <h2 className="text-xl font-semibold mb-4">Concerts</h2>
                    <p>No data found</p>
                  </div>
                )}
              </>
            )}
          </DelayedComponent>
        </div>
      </div>
    </Layout>
  );
};

export default SearchMainPage;
