import novideo from "../../assets/png/novideo.png";

const extractYouTubeId = (url: string) => {
  const match = url.match(
    /(?:youtube\.com\/(?:.*v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
};

const getVideoThumbnail = (url: string) => {
  if (url) {
    const videoId = extractYouTubeId(url);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : novideo;
  } else {
    return novideo;
  }
};

export default getVideoThumbnail;
