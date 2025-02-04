import { Avatar } from "@chakra-ui/react"
import img from '../../assets/png/profileImg1.png'


const TestArtist = () => {
  return (
    <div className="flex justify-center mx-auto">
      <div className={`bg-[#E8ECFE] w-full p-6 md:p-12 md:mt-20 mt-6 items-center flex flex-col`}>
        <div className="flex items-start w-full">
          <Avatar size={window.innerWidth < 768 ? "lg" : "2xl"} src={img} />
          <div className="flex flex-col md:ml-4 ml-2 gap-1 md:gap-3">
            <div className={`artist-name md:text-xl text-md `}>
              name
            </div>
            <div className="artist-description" style={{ fontSize: "16px" }}>
              description
            </div>
          </div>

        </div>
        <div>
          <div className="product-card1 flex w-full">
            <div
              className="transition-all duration-300 ease-out w-full h-pull"
            >

              <div className="flex flex-col related justify-between w-full h-full">
                <div>
                  <div
                    className={`material-card-image bg-gray-100 hover:opacity-75 object-cover cursor-pointer h-48 relative`}
                  >
                    {/* <video  controls>
           <source src={video} type="video/mp4" />
           Your browser does not support the video tag.
         </video> */}
                    {/* <YouTubeEmbed video={video} title={title} /> */}

                    <div
                      className="relative w-full h-40 cursor-pointer rounded-md overflow-hidden"
                    //  onClick={handlePlay}
                    >
                      <img
                        //  src={`https://img.youtube.com/vi/${data.youTube.split("v=")[1]}/hqdefault.jpg`}
                        src={img}
                        className="w-full h-full object-cover"
                        alt="YouTube Thumbnail"
                      />
                    </div>

                  </div>
                  <div className="flex justify-start mt-4">
                    <div
                      className={`feature-text px-5 py-1 `}
                    >
                      feature
                    </div>
                  </div>
                  <div
                    className={`title-text flex mt-2 `}
                  >
                    title
                  </div>
                </div>
                <div className="flex justify-start mt-2">
                  <div className="flex items-center">

                    <div className="mx-1 location">date</div>
                  </div>
                </div>
              </div>

              <div className="flex h-full">
                <div className="h-full w-36 relative overflow-hidden">

                  {/* <YouTubeEmbed video={video} title={title} /> */}


                </div>
                <div className="w-full ml-2">
                  <div>
                    <div className="flex justify-start mb-2">
                      <div
                        className={`feature-text-2 `}
                      >
                        feature
                      </div>
                    </div>
                    <div
                      className={`title-text-2 flex`}
                    >
                      title
                    </div>
                  </div>
                  <div className="flex justify-start mt-2">
                    <div className="flex items-center">
                      <div className="mx-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                        >
                          <path
                            d="M8.15001 9.12081C9.3203 9.12081 10.269 8.1721 10.269 7.00181C10.269 5.83152 9.3203 4.88281 8.15001 4.88281C6.97971 4.88281 6.03101 5.83152 6.03101 7.00181C6.03101 8.1721 6.97971 9.12081 8.15001 9.12081Z"
                            stroke="#BBBCC0"
                            strokeWidth="1.26892"
                          />
                          <path
                            d="M2.45857 5.76619C3.79653 -0.115392 12.5102 -0.1086 13.8414 5.77298C14.6224 9.22315 12.4763 12.1436 10.595 13.9501C9.22986 15.2677 7.07011 15.2677 5.6982 13.9501C3.8237 12.1436 1.67753 9.21636 2.45857 5.76619Z"
                            stroke="#BBBCC0"
                            strokeWidth="1.26892"
                          />
                        </svg>
                      </div>
                      <div className="mx-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="6"
                          height="6"
                          viewBox="0 0 6 6"
                          fill="none"
                        >
                          <circle
                            cx="2.61889"
                            cy="2.53784"
                            r="2.53784"
                            fill="#D9D9D9"
                          />
                        </svg>
                      </div>
                      <div className="mx-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                        >
                          <path
                            d="M5.5144 1.3584V3.3959"
                            stroke="#BBBCC0"
                            strokeWidth="1.26892"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10.9478 1.3584V3.3959"
                            stroke="#BBBCC0"
                            strokeWidth="1.26892"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2.45813 6.17383H14.004"
                            stroke="#BBBCC0"
                            strokeWidth="1.26892"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.3435 5.77279V11.5457C14.3435 13.5832 13.3248 14.9415 10.9477 14.9415H5.51436C3.13728 14.9415 2.11853 13.5832 2.11853 11.5457V5.77279C2.11853 3.73529 3.13728 2.37695 5.51436 2.37695H10.9477C13.3248 2.37695 14.3435 3.73529 14.3435 5.77279Z"
                            stroke="#BBBCC0"
                            strokeWidth="1.26892"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10.7404 9.30443H10.7465"
                            stroke="#BBBCC0"
                            strokeWidth="1.26892"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10.7404 11.3425H10.7465"
                            stroke="#BBBCC0"
                            strokeWidth="1.26892"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8.22794 9.30443H8.23404"
                            stroke="#BBBCC0"
                            strokeWidth="1.26892"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8.22794 11.3425H8.23404"
                            stroke="#BBBCC0"
                            strokeWidth="1.26892"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5.71427 9.30443H5.72037"
                            stroke="#BBBCC0"
                            strokeWidth="1.26892"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5.71427 11.3425H5.72037"
                            stroke="#BBBCC0"
                            strokeWidth="1.26892"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="mx-1 location2">date</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="md:pr-16">
          {/* <ArtistsCarousel cardNum='4' cardData='data' /> */}
        </div>
      </div>
    </div >
  )
}

export default TestArtist