import { Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { PageBasicProps } from "../../AppMain";
import BreadCrumb from "../../Components/BreadCrumb";
import NewReleaseCard from "../../Components/Card/NewReleaseCard";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import Layout from "../../Components/Layout";
import PaginationBar from "../../Components/PaginationBar";
import "../mainPageStyle.css";

interface Product {
  id: string;
  title: string;
  img: string;
  category: string;
  date: string;
  link: string;
  location: string;
  artist: string;
  star: number;
}

// interface inputProducts {
//   _id: string;
//   title: string;
//   img: string;
//   category: string;
//   date: string | Date;
//   link: string;
//   location: string;
//   artist: string;
//   star: number;
// }
const AlbumsMainPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const albumsPerPage = 5;
  const [album, setAlbum] = useState<Product[]>([]);
  const [loading,] = useState<boolean>(false);
  const [pages, setPages] = useState<number>(0);

  const fetcher = () => fetch(`http://localhost:8000/api/album`).then((res) => res.json());
  const { data, error } = useSWR(`http://localhost:8000/api/album`, fetcher);

  useEffect(() => {
    if (data) {
      setAlbum(data);
    }
  }, [data]);
  // Filtering albums based on search text
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredAlbums = album.filter((album) => (album.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastAlbum = selectedPage * albumsPerPage;
  const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
  const currentAlbums = filteredAlbums.slice(indexOfFirstAlbum, indexOfLastAlbum);

  // Update total pages whenever filteredAlbums changes
  useEffect(() => {
    setPages(Math.ceil(filteredAlbums.length / albumsPerPage));
  }, [filteredAlbums]);

  if (error) return <div>Error loading data.</div>;
  if (!album.length) return <div>Loading...</div>;

  return (
    <Layout themeMode={themeMode} type={type}>
      <div className="flex justify-center">
        <div className="container">
          {!type && (
            <div className="md:mt-12 mt-8">
              <BreadCrumb />
            </div>
          )}
          <div className="md:mt-7 mt-10">
            <ContentTitle titleType="NEW RELEASES" title="New Releases" />
          </div>
          <div className="md:mt-6 mt-4">
            <FilterInput type={type} filterText={searchQuery} setFilterText={setSearchQuery} setFilters={function (value: any): void {
              throw new Error("Function not implemented.");
            }} filters={undefined} />
          </div>

          <div>
            {loading ? (
              <div
                className="w-full flex justify-center items-center"
                style={{ minHeight: type ? "816px" : "1147px" }}
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
              <div className={`grid md:grid-cols-4 grid-cols-1 gap-5 mt-10 mb-10`}>
                {currentAlbums.length > 0 ? (
                  currentAlbums.map((categoryItem, index) => (
                    <NewReleaseCard
                      key={index}
                      data={categoryItem}
                      youTube="https://www.youtube.com/embed/6JYIGclVQdw"
                      title={categoryItem.title}
                      nickname="nickname"
                      date="12/12/2003"
                      link={categoryItem.title}
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-500">No results found</div>
                )}
              </div>
            )}
          </div>
          <div className={`flex ${type ? "justify-center" : "justify-end"}`}>
            <PaginationBar
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              pages={pages}
              entriesPerPage={albumsPerPage}
              setEntriesPerPage={() => { }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AlbumsMainPage;
