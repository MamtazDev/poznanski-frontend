import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import YouTube from 'react-youtube';
import YoutubeSilverButton from '../../assets/png/silver-yt.png';
import { RootState } from '../../reducers';
import { closePlayer, openPlayer } from '../../reducers/PlayerReducer';

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
      autoplay: 1,
    },
    iframeClass: 'rounded-lg',
    enablejsapi: 1,

  };

  // const onLoad = (event: {target: {playVideo: () => void}}) => {
  // 	setTimeout(() => {
  // 		event.target.playVideo();
  // 	}, 500);
  // };

  const onClose = () => {
    dispatch(closePlayer());
  };

  const onOpen = () => {
    dispatch(openPlayer(videoId));
  };
  const onReady = (event: { target: { getIframe: () => any, playVideo: () => void }; }) => {
    const iframe = event.target.getIframe();
    const src = iframe.src.replace('www.youtube.com', 'www.youtube-nocookie.com');
    iframe.src = src;
    setTimeout(() => {
      event.target.playVideo();
    }, 500);
    // Call the user's onReady event if provided
  };

  return (
    <div
      className={`fixed z-50 flex bottom-2 md:right-2 right-5 transform transition-transform ${isOpen ? 'translate-x-0' : ' translate-x-80'
        } duration-500 ease-in-out`}
    >
      {videoId && (
        <button
          onClick={isOpen ? onClose : onOpen}
          className={`${type ? '' : isOpen ? 'mx-2' : 'mx-4'} my-auto z-50 items-center`}
        >
          <img
            className={`md:w-[120px] w-[100px] rounded-full shadow-2xl transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-360' : 'rotate-0'}`}
            src={YoutubeSilverButton}
            alt=''
          />
        </button>
      )}
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        // onReady={onLoad}
        iframeClassName='rounded-lg'

      />
    </div>
  );
};

export default YoutubePlayer;
