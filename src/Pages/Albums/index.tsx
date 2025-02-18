import { Spinner } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { PageBasicProps } from "../../AppMain";
import BreadCrumb from "../../Components/BreadCrumb";
import NewReleaseCard from "../../Components/Card/NewReleaseCard";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import PaginationBar from "../../Components/PaginationBar";
import "../mainPageStyle.css";
import Layout from './../../Components/Layout/index';
import { apiBaseUrl } from "../../Constant/config";

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
  songs: { youTube?: string }[]; // Ensure this exists

}
const AlbumsMainPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [album, setAlbum] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
    const [visibleCount, setVisibleCount] = useState(4);
    const [displayedItems, setDisplayedItems] = useState<Product[]>([]);

  const fetcher = () =>
    fetch(`${apiBaseUrl}/album`).then((res) => res.json());

  const { data, error } = useSWR(`${apiBaseUrl}/album`, fetcher);




    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    const setDisplayUpdatedName = () => {
      setDisplayedItems(album.slice(0, 2));
    };
    const loadMoreItems = () => {
      if (loading || visibleCount >= album.length) return;
      setLoading(true);

      setTimeout(() => {
        setVisibleCount((prev) => prev + 3);
        setLoading(false);
      }, 1000);
    };

    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;

      if (scrollTop + clientHeight >= scrollHeight - 5) {
        loadMoreItems();
      }
    };


    useEffect(() => {
      if(album && album.length>0 ){
      setDisplayUpdatedName();
      }
    }, [ album]);


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
  if (loading) return <div className="flex justify-center items-center h-screen w-full"
  style={{
    backgroundColor: themeMode ? "white" : "black"
  }}>
  <p className="text-xl font-semibold " style={{
    color: themeMode ? "black" : "white"
  }} >Loading...</p>
  <div className="w-6 h-6 ml-2 border-4 border-t-transparent rounded-full animate-spin"
    style={{
      borderRightColor: themeMode ? "#5A1073" : "#2FC4B2",
      borderBottomColor: themeMode ? "#5A1073" : "#2FC4B2",
      borderLeftColor: themeMode ? "#5A1073" : "#2FC4B2",
    }}>
  </div>
</div>;

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

          <div
          className="md:mt-12 mt-8 max-h-[800px] overflow-y-auto rounded-lg p-2 scrollbar-hide"
             ref={scrollContainerRef}
              onScroll={handleScroll}
            >
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
              <div className={`grid md:grid-cols-2 grid-cols-1 lg:grid-cols-4 gap-5 mt-10 mb-10`}>
                {album?.length > 0 ? (
                  album?.map((categoryItem) => (
                    <NewReleaseCard
                      id={categoryItem._id}
                      key={categoryItem._id}
                      data={{ songs: [] }} // Default value to prevent errors
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
