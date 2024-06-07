import {Box} from '@chakra-ui/react';
import { type } from '@testing-library/user-event/dist/type';
import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import YouTube from 'react-youtube';
import { RootState } from '../../reducers';
import { closePlayer, openPlayer } from '../../reducers/PlayerReducer';
import YoutubeSilverButton from '../../assets/png/silver-yt.png';

interface PlayerProps {
	videoId: string;
	isOpen: boolean;
	type: boolean;
}

const YoutubePlayer: React.FC<PlayerProps> = ({ isOpen, type }) => {
	const videoId = useSelector((state: RootState) => state.player.videoId);
	const dispatch = useDispatch();
	const opts = {
		height: 'auto',
		width: 'auto',
		playerVars: {
			// autoplay: 1,
		},
		iframeClass: 'rounded-lg',
		enablejsapi: 1,
	};

	// useEffect(() => {
	//   const handleResize = () => {
	//     if (window.innerWidth < 768) {
	//       setPlayerHeight("200px");
	//       setPlayerWidth("355px");
	//     }
	//   };

	//   handleResize();

	//   window.addEventListener("resize", handleResize);

	//   return () => {
	//     window.removeEventListener("resize", handleResize);
	//   };
	// }, []);

	const onLoad = (event: {target: {playVideo: () => void}}) => {
		setTimeout(() => {
			event.target.playVideo();
		}, 500);
	};

const onClose = () => {
	dispatch(closePlayer())
}

const onOpen = () => {
	dispatch(openPlayer(videoId))
}

	return (
		<div
				className={`fixed z-50 flex bottom-2 right-2 transform transition-transform ${
          isOpen ? 'translate-x-0' : ' translate-x-80'
        } duration-500 ease-in-out`}
			>
				{videoId && <button
					onClick={isOpen ? onClose : onOpen}

					className={`${isOpen ? 'mx-1' : 'mx-4' } my-auto z-50 items-center`}
				>
					{/* {`${!isOpen ? 'SKITRAJ' : 'POKAŻ'}`} */}
					<img className={`${type ? 'w-[60px]' : 'w-[120px]'} rounded-full shadow-2xl transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-360' :'rotate-0'}`} src={YoutubeSilverButton} />
				</button>}
				{/* <Modal isOpen={isOpen} onClose={onClose} type={type}> */}
				<YouTube
			videoId={videoId}
			opts={opts}
			onReady={onLoad}
			iframeClassName='rounded-lg'
		/>
				{/* </Modal> */}
			</div>

	);
};

export default YoutubePlayer;
