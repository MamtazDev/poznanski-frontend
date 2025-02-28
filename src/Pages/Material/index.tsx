import { Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { PageBasicProps } from "../../AppMain";
import BreadCrumb from "../../Components/BreadCrumb";
import MaterialCard from "../../Components/Card/MaterialCard";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import Layout from "../../Components/Layout";
import "../mainPageStyle.css";
import { apiBaseUrl } from "../../Constant/config";
import { useToast } from "@chakra-ui/react";

interface Product {
  _id: unknown;
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  youTube: string;
  tags: string;
  date: string;
  videoId: string;
  channelId: string;
  channelTitle: string;
  playlistId: string;
}

interface filterProperties {
  sort: string;
  quantity: number;
  startDate: string;
  endDate: string;
  order: string;
  search: string | undefined;
}

const MaterialMainPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const [filterText, setFilterText] = useState<string>("");
  const [cardData, setCardData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const toast = useToast();

  const [filters, setFilters] = useState<filterProperties>({
    sort: "A to Z",
    quantity: 50,
    startDate: "",
    endDate: "",
    order: "desc",
    search: "",
  });

  const fetchPlaylists = async (page: number) => {
    setLoading(true);
    try {
      const result = await fetch(`${apiBaseUrl}/playlist?page=${page}&limit=10`);
      const data = await result.json();
      const mappedData = data.data.map((item: any) => ({
        id: item._id,
        title: item.title,
        description: item.description,
        thumbnail: item.thumbnail,
        videoId: item.videoId,
        channelId: item.channelId,
        youTube: item.youTube,
        channelTitle: item.channelTitle,
        playlistId: item.playlistId,
        tags: item.tags || "",
        date: new Date(item.publishedAt).toISOString().split("T")[0],
      }));
      setCardData(mappedData);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
    } catch (error: any) {
      toast({
        title: "Error fetching playlists",
        description: error.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists(currentPage);
  }, [currentPage]);

  const handleSearch = (inputValue: string) => {
    if (!inputValue) return fetchPlaylists(1);
    const filtered = cardData.filter((item) =>
      item.title.toLowerCase().includes(inputValue.toLowerCase())
    );
    setCardData(filtered);
  };

  useEffect(() => {
    fetchPlaylists(currentPage);
  }, [filters]);

  return (
    <Layout themeMode={themeMode}>
      <div className="flex justify-center">
        <div className="container">
          {!type && (
            <div className="md:mt-12 mt-8">
              <BreadCrumb />
            </div>
          )}
          <div className="md:mt-7 mt-10">
            <ContentTitle titleType="VIDEOS" title="Materials" />
          </div>
          <div className="md:mt-6 mt-4">
            <FilterInput
              type={type}
              handler={handleSearch}
              filterText={filterText}
              setFilterText={setFilterText}
              setFilters={setFilters}
              filters={filters}
            />
          </div>
          <div className="md:mt-12 mt-8">
            {loading ? (
              <div
                className="w-full flex justify-center items-center"
                style={{ minHeight: "908px" }}
              >
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="lg"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-5">
                {cardData.length > 0 ? (
                  cardData.map((item, index) => (
                    <div key={`main-video-card-${index}`} className="w-full">
                      <MaterialCard
                        type={type ? "vertical" : "horizontal"}
                        video={item.videoId}
                        data={item}
                        id={item.id}
                        thumbnail={item.thumbnail}
                        feature={item.tags}
                        title={item.title}
                        date={item.date}
                        link={item.youTube}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-blue-500 text-5xl py-3 text-center">
                    There is no data
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-center mt-5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="mx-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MaterialMainPage;