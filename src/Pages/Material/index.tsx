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

interface Product {
  id: string;
  title: string;
  description: string;
  youTube: string;
  tags: string;
  date: string;
}

const MaterialMainPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5); 
  const [filterText, setFilterText] = useState<string>("");
  const [cardData, setCardData] = useState<Product[]>([]);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  
  const [sortBy, setSortBy] = useState<string>("");
  const [order, setOrder] = useState<string>("desc");
  const [startDate, setStartDate] = useState<string>("2025-01-01");
  const [limit, setLimit] = useState<number>(6);
  const [endDate, setEndDate] = useState<string>("2025-01-01");


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
    setPages(Math.ceil(formattedProducts.length / rowsPerPage));
    setFilteredData(formattedProducts.slice(0, rowsPerPage));
  };

  useEffect(() => {
    setLoading(true);
    // apiGetReq(`http://localhost:8000/api/materials?order=${order}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`, {})
    apiGetReq(`http://localhost:8000/api/materials?sortBy=title&order=${order}&limit=${limit}&startDate=${startDate}&page=1`, {})
      .then((res) => {
        handleData(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = filterText
      ? cardData.filter(
          (item) =>
            item.title.toLowerCase().includes(filterText.toLowerCase()) ||
            item.description.toLowerCase().includes(filterText.toLowerCase())
        )
      : cardData;

    setPages(Math.ceil(filtered.length / rowsPerPage));
    setFilteredData(
      filtered.slice((selectedPage - 1) * rowsPerPage, selectedPage * rowsPerPage)
    );
  }, [filterText, cardData, selectedPage, rowsPerPage]);

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
            <FilterInput type={type} filterText={filterText} setFilterText={setFilterText} />
          </div>
          <div className="md:mt-12 mt-8" style={{ minHeight: "908px", width: "100%" }}>
            {loading ? (
              <div className="w-full flex justify-center items-center" style={{ minHeight: "908px" }}>
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="lg" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-5">
                {filteredData.map((item, index) => (
                  <div key={`main-video-card-${index}`} className="w-full">
                    <MaterialCard
                      type={type ? "vertical" : "horizontal"}
                      video={item.youTube}
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
          <div className="flex justify-center mt-5">
            <PaginationBar
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              pages={pages}
              entriesPerPage={rowsPerPage}
              setEntriesPerPage={setRowsPerPage}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MaterialMainPage;