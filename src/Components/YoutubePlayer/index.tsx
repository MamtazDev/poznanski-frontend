import {Box} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import YouTube from 'react-youtube';

interface PlayerProps {
	videoId: string;
}

const YoutubePlayer: React.FC<PlayerProps> = ({videoId}) => {
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

	return (
		<YouTube
			videoId={videoId}
			opts={opts}
			onReady={onLoad}
			iframeClassName='rounded-lg'
		/>
	);
};

export default YoutubePlayer;
