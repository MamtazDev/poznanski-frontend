import React, { Fragment, useEffect, useRef, useState } from "react";
import NavBar from "../../Components/Layout/NavBar";
import MainBack from "../../Components/MainBack";
import NewsContent from "./NewsContent";
import TV from "./TV";
import Book from "./Book";
import MaterialContent from "./MaterialContent";
import NewReleases from "./NewReleases";
import Artists from "./Artists";
import Subscription from "../../Components/Subscription";
import MarkCarousel from "../../Components/MarkCarousel";
import Logo_2 from "../../assets/png/wujo-2.png";
import "./style.css";
import Footer from "../../Components/Layout/Footer";
import { PageBasicProps } from "../../AppMain";
import axios from "axios";

const Home: React.FC<PageBasicProps> = ({type, themeMode}) => {
  const pageBottomRef = useRef<HTMLDivElement>(null);
  const [filterText, setFilterText] = useState<string>("");
  const scrollToBottom = () => {
    if (pageBottomRef.current) {
      pageBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Fragment>
      <div className={`${!themeMode && "back-dark"} overflow-hidden`}>
        <div>
          <MainBack type={type} themeMode={themeMode} scrollToBottom={scrollToBottom} />
        </div>
        <div ref={pageBottomRef} />
        <NewsContent filterText={filterText} />
        <Material/>
        <TV filter={filterText} />
        <div className="middle-back md:mt-28 mt-12 flex justify-center items-center">
          <div className="md:h-40 h-20">
            <img src={Logo_2} className="h-full w-full" alt="logo-2" />
          </div>
        </div>
        <Book filter={filterText} />
        <MaterialContent filter={filterText} />
        <NewReleases filter={filterText} />
        <Artists filter={filterText} />
        <Subscription />
        <MarkCarousel />
        <Footer />
      </div>
    </Fragment>
  );
};

export default Home;


function Material() {

  const API_KEY = 'AIzaSyBmYFEkoJIVhA4vD7hqWU3M7bf7djo-9rA'; // Wstaw tutaj swój klucz API
	const CHANNEL_USERNAME = 'poznanskirapcom'; // Nazwa użytkownika kanału
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAllChannelVideos = async () => {
			try {
				// Krok 1: Pobierz ID kanału na podstawie nazwy użytkownika
				const channelResponse = await axios.get(
					"https://www.googleapis.com/youtube/v3/channels",
					{
						params: {
							part: 'contentDetails',
							forUsername: CHANNEL_USERNAME,
							key: API_KEY,
						},
					}
				);
        console.log(channelResponse)
				const channelId = channelResponse.data.items[0]?.id;

				if (!channelId) {
					console.error('Nie znaleziono kanału');
					setLoading(false);
					return;
				}

				// Krok 2: Pobierz ID playlisty przesłanych filmów (uploads)
				const uploadsPlaylistId =
					channelResponse.data.items[0].contentDetails
						.relatedPlaylists.uploads;

				let allVideos: any = [];
				let nextPageToken = '';

				// Krok 3: Pobierz wszystkie filmy z playlisty uploads
				do {
					const uploadsResponse = await axios.get(
						"https://www.googleapis.com/youtube/v3/playlistItems",
						{
							params: {
								part: 'snippet',
								playlistId: uploadsPlaylistId,
								maxResults: 50, // Maksymalna liczba filmów na stronę
								pageToken: nextPageToken,
								key: API_KEY,
							},
						}
					);

					const videosBatch = uploadsResponse.data.items.map(
						(item:any) => ({
							title: item.snippet.title,
							description: item.snippet.description,
							videoId: item.snippet.resourceId.videoId,
							thumbnail: item.snippet.thumbnails.medium.url,
						})
					);

					allVideos = [...allVideos, ...videosBatch];
					nextPageToken = uploadsResponse.data.nextPageToken;
				} while (nextPageToken);

				setVideos(allVideos);
				setLoading(false);
			} catch (error) {
				console.error('Błąd przy pobieraniu filmów z kanału:', error);
				setLoading(false);
			}
		};

		fetchAllChannelVideos();
    console.log("fetchAllChannelVideos", videos)
	}, []);
  return (
    <div>material</div>
  )
}

