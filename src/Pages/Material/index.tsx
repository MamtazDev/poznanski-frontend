import { Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { PageBasicProps } from "../../AppMain";
import BreadCrumb from "../../Components/BreadCrumb";
import MaterialCard from "../../Components/Card/MaterialCard";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import Layout from "../../Components/Layout";
import PaginationBar from "../../Components/PaginationBar";
import { apiGetReq } from "../../Constant/api-functions";
import "../mainPageStyle.css";
import { data } from "autoprefixer";
import { apiBaseUrl } from "../../Constant/config";

interface Product {
  id: string;
  title: string;
  description: string;
  youTube: string;
  tags: string;
  date: string;
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
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [filterText, setFilterText] = useState<string>("");
  const [cardData, setCardData] = useState<Product[]>([]);
  // const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [filters, setFilters] = useState<filterProperties>({
    sort: "A to Z",
    quantity: 5,
    startDate: "",
    endDate: "",
    order: "desc",
    search: "",
  });

  const handleData = (response: any) => {
    const materials = response.materials || [];
    const formattedProducts: Product[] = materials.map((item: any) => ({
      id: item._id,
      title: item.title,
      description: item.description,
      youTube: item.youTube,
      tags: item.tags,
      date: new Date(item.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));

    setCardData(formattedProducts);
  };

  // useEffect(() => {
  //   setLoading(true);
  //   // apiGetReq(`http://localhost:8000/api/materials?order=${order}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`, {})
  //   apiGetReq(`http://localhost:8000/api/materials?sortBy=title&order=${filters.order}&limit=${filters.limit}&startDate=${filters.startDate}&page=1`, {})
  //     .then((res) => {
  //       handleData(res);
  //       setLoading(false);
  //     })
  //     .catch(() => {
  //       setLoading(false);
  //     });
  // }, []);

  const fetchData = async (inputValue?: filterProperties) => {
    setLoading(true);
    console.log("inputValue.search", inputValue);
    let url = `${apiBaseUrl}/materials`; // Default URL
    // Building the query string based on available filter properties
    let searchQuery = [];

    if (inputValue?.search) {
      searchQuery.push(`search=${encodeURIComponent(inputValue.search)}`);
    }

    if (inputValue?.sort) {
      searchQuery.push(`order=${encodeURIComponent(inputValue.sort)}`);
    }

    if (inputValue?.quantity) {
      console.log("inputValue?.limit", inputValue?.quantity);
      searchQuery.push(`limit=${inputValue.quantity}`);
    }

    if (inputValue?.startDate) {
      searchQuery.push(`startDate=${encodeURIComponent(inputValue.startDate)}`);
    }

    if (inputValue?.endDate) {
      searchQuery.push(`endDate=${encodeURIComponent(inputValue.endDate)}`);
    }

    // if (inputValue?.order) {
    //   searchQuery.push(`order=${encodeURIComponent(inputValue.order)}`);
    // }

    // If there are query parameters, append them to the URL
    if (searchQuery.length > 0) {
      url = `${url}?${searchQuery.join("&")}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setCardData(data.materials);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (inputValue: string) => {
    console.log("Searched value: ", inputValue);
    console.log("Filters value: ", filters);
    fetchData(filters);
  };

  useEffect(() => {
    console.log("Filtered worked");
    fetchData(filters);
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
          <div
            className="md:mt-12 mt-8"
            // style={{ minHeight: "908px", width: "100%" }}
          >
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-5">
                {cardData?.map((item, index) => (
                  <div key={`main-video-card-${index}`} className="w-full">
                    <MaterialCard
                      type={type ? "vertical" : "horizontal"}
                      video={item.youTube}
                      data={item}
                      feature={item.tags}
                      title={item.title}
                      date={item.date}
                      link={item.youTube}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MaterialMainPage;
