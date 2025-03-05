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
  sortBy: string;
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
    sortBy: "title",
    quantity: 4,
    startDate: "",
    endDate: "",
    order: "desc",
    search: "",
  });

  const fetchPlaylists = async () => {
    setLoading(true);
    let url = `${apiBaseUrl}/playlist?sortBy=${filters.sortBy}&order=${filters.order}&limit=${filters.quantity}`;

    if (filters.startDate) url += `&startDate=${filters.startDate}`;
    if (filters.endDate) url += `&endDate=${filters.endDate}`;
    if (filters.search) url += `&search=${filters.search}`;

    try {
      const result = await fetch(url);
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
    fetchPlaylists();
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
              handler={(value) => setFilters({ ...filters, search: value })}
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
        </div>
      </div>
    </Layout>
  );
};

export default MaterialMainPage;
