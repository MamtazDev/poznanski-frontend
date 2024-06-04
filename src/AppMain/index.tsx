import React, {Suspense, lazy, useEffect, useState} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {apiGetReq} from '../Constant/api-functions';
import {Spinner} from '@chakra-ui/react';
import {useSelector} from 'react-redux';
import {RootState} from '../reducers';
import {closePlayer} from '../reducers/PlayerReducer';
import * as common from '../Constant/constants';
import ScrollToTopOnPageChange from '../Components/ScrollToTop';
import YoutubePlayer from '../Components/YoutubePlayer';
import Modal from '../Components/Modals';
import {useDispatch} from 'react-redux';

const Home = lazy(() => import('../Pages/Home'));
const SubmitPage = lazy(() => import('../Pages/Submit'));
const VideoMainPage = lazy(() => import('../Pages/Video'));
const ConcertMainPage = lazy(() => import('../Pages/Concert'));
const ArticleMainPage = lazy(() => import('../Pages/Article'));
const ArtistMainPage = lazy(() => import('../Pages/Artist'));
const MaterialMainPage = lazy(() => import('../Pages/Material'));
const AlbumsMainPage = lazy(() => import('../Pages/Albums/index'));
const ArticleDetailPage = lazy(
	() => import('../Pages/Article/articleDetailPage')
);

interface Tag {
	_id: string;
	name: string;
}

export interface PageBasicProps {
	themeMode: boolean;
	type: boolean;
}

const AppMain: React.FC = () => {
	const [tags, setTags] = useState<Tag[]>([]);
	const themeMode = useSelector((state: RootState) => state.themeMode.mode);
	const playerOpen = useSelector((state: RootState) => state.player.isOpen);
	const videoId = useSelector((state: RootState) => state.player.videoId);
	const dispatch = useDispatch();
	const [isOpen, setIsOpen] = useState<boolean>(playerOpen);
	const [type, setType] = useState<boolean>(false);

	useEffect(() => {
		setIsOpen(playerOpen);
	}, [playerOpen]);

	useEffect(() => {
		apiGetReq('/tag', {}).then((res) => {
			setTags(res.tags);
		});
	}, []);

	const onClose = () => {
		// setIsOpen(false);
		dispatch(closePlayer());
	};

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 768) {
				setType(true);
			} else {
				setType(false);
			}
		};
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div className={` ${!themeMode && 'back-dark'}`}>
			<Suspense
				fallback={
					<div className='w-screen h-screen flex justify-center items-center'>
						<Spinner
							thickness='4px'
							speed='0.65s'
							emptyColor='gray.200'
							color='blue.500'
							size='lg'
						/>
					</div>
				}
			>
				<ScrollToTopOnPageChange />
				<Routes>
					<Route
						path='/'
						element={<Home themeMode={themeMode} type={type} />}
					/>
					<Route path={common.NEWS_PATH}>
						<Route
							path=''
							element={<ArticleMainPage themeMode={themeMode} type={type} />}
						/>
						<Route
							path=':id'
							element={
								<ArticleDetailPage
									tagData={tags}
									themeMode={themeMode}
									type={type}
								/>
							}
						/>
					</Route>
					<Route
						path={common.TV_RADIO_PATH}
						element={
							<VideoMainPage themeMode={themeMode} type={type} />
						}
					/>
					<Route
						path={common.MATERIAL_PATH}
						element={
							<MaterialMainPage
								themeMode={themeMode}
								type={type}
							/>
						}
					/>
					<Route
						path={common.CONCERT_PATH}
						element={
							<ConcertMainPage
								themeMode={themeMode}
								type={type}
							/>
						}
					/>
					<Route
						path={common.NEWRELEASE_PATH}
						element={
							<AlbumsMainPage themeMode={themeMode} type={type} />
						}
					/>
					<Route
						path={common.ARTISTS_PATH}
						element={
							<ArtistMainPage themeMode={themeMode} type={type} />
						}
					/>
					<Route
						path={common.CREATE_NEWS}
						element={
							<SubmitPage themeMode={themeMode} type={type} />
						}
					/>
				</Routes>
			</Suspense>
			<Modal isOpen={isOpen} onClose={onClose} type={type}>
				<YoutubePlayer videoId={videoId} />
			</Modal>
		</div>
	);
};

export default AppMain;
