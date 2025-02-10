import { Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { PageBasicProps } from "../../AppMain";
import BreadCrumb from "../../Components/BreadCrumb";
import NewReleaseCard from "../../Components/Card/NewReleaseCard";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import PaginationBar from "../../Components/PaginationBar";
import "../mainPageStyle.css";
import Layout from './../../Components/Layout/index';

interface Product {
  artists: any;
  _id: any;
  id: string;
  title: string;
  img: string;
  category: string;
  date: string; // Ensure date is a valid ISO string
  link: string;
  location: string;
  artist: string;
  star: number;
}
const AlbumsMainPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [album, setAlbum] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetcher = () =>
    fetch(`http://localhost:8000/api/album`).then((res) => res.json());

  const { data, error } = useSWR(`http://localhost:8000/api/album`, fetcher);

  useEffect(() => {
    if (data) {
      // Sort albums by date (latest first) and select the latest 3
      const sortedAlbums = data.albums
        .sort((a: Product, b: Product) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4);
      setAlbum(sortedAlbums);
      setLoading(false);
    }
  }, [data]);

  if (error) return <div>Error loading data.</div>;
  if (loading) return <div>Loading...</div>;

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
            <FilterInput
              type={type}
              filterText={searchQuery}
              setFilterText={setSearchQuery}
              setFilters={function (value: any): void {
                throw new Error("Function not implemented.");
              }}
              filters={undefined}
            />
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
                {album.length > 0 ? (
                  album.map((categoryItem) => (
                    <NewReleaseCard
                      id={categoryItem._id}
                      key={categoryItem._id}
                      data={categoryItem}
                      youTube="https://www.youtube.com/embed/6JYIGclVQdw"
                      title={categoryItem.title}
                      nickname={categoryItem.artists[0]?.name}

                      date={categoryItem.date}
                      link={categoryItem.link}
                      btn="See Details"
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
              pages={1} // Pagination not required for 3 items
              entriesPerPage={3}
              setEntriesPerPage={() => {}}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AlbumsMainPage;
