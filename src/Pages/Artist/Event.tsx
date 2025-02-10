import type React from "react"
import {  useState, useEffect, useMemo } from "react"
import DetailButton from "../../Components/Buttons/DetailButton"
import Layout from "../../Components/Layout"
import { fileUrl } from "../../Constant/config"
import { Image } from "@chakra-ui/react"
import "../mainPageStyle.css"
import type { PageBasicProps } from "../../AppMain"
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/pagination"
import { Pagination } from "swiper/modules"
import { Link } from "react-router-dom"

interface Product {
  id: string
  name: string
  img: string
  category: string
  month: string
  date: string
  timeframe: string
  link: string
  location: string
  description: string
}
interface inputProducts {
  _id: string
  name: string
  img: string
  category: string
  timeframe: {
    start: string | Date
    end: string | Date
  }
  link: string
  location: string
  description: string
  isFeatured: boolean
}

const Event: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const [selectedPage, setSelectedPage] = useState<number>(1)
  const [pages, setPages] = useState<number>(0)
  const [filterText, setFilterText] = useState<string>("")
  const [cardData, setCardData] = useState<Product[]>([])
  const [cardNum, setCardNum] = useState<number>(4)
  const [lineNum, setLineNum] = useState<number>(3)
  const [loading, setLoading] = useState<boolean>(false)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [nonFeaturedProducts, setNonFeaturedProducts] = useState<Product[]>([])
  const [entriesPerPage, setEntriesPerPage] = useState<number>(5)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState({
    sort: "A to Z",
    limit: 7,
    startDate: "",
    endDate: "",
    order:"desc"
  });

  const handleData = (response: any) => {
    const newProducts: Product[] = []
    const totalPages = Math.ceil(response.all / 6)
    setPages(totalPages)

    const featured: Product[] = []
    const nonFeatured: Product[] = []

    response.products.forEach((item: inputProducts) => {
      const inputDate1: Date = new Date(item.timeframe.start)
      const inputDate2: Date = new Date(item.timeframe.end)
      const formattedTimeframe =
        inputDate1.getUTCHours() +
        ":" +
        (inputDate1.getUTCMinutes() < 10 ? "0" : "") +
        inputDate1.getUTCMinutes() +
        "-" +
        inputDate2.getUTCHours() +
        ":" +
        (inputDate2.getUTCMinutes() < 10 ? "0" : "") +
        inputDate2.getUTCMinutes()
      const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(inputDate1)

      const temp: Product = {
        id: item._id,
        name: item.name,
        img: fileUrl + item.img,
        category: item.category,
        month: `${month}`,
        date: `${inputDate1.getDate()}`,
        timeframe: formattedTimeframe,
        link: item.link,
        location: item.location,
        description: item.description,
      }

      if (item.isFeatured) {
        featured.push(temp)
      } else {
        nonFeatured.push(temp)
      }
    })

    setFeaturedProducts(featured)
    setNonFeaturedProducts(nonFeatured)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1280) {
        setCardNum(4)
        setLineNum(3)
      } else {
        setLineNum(3)

        setCardNum(3)
        if (window.innerWidth < 1024) {
          setLineNum(3)
          setCardNum(2)
          if (window.innerWidth < 768) {
            setCardNum(1)
            setLineNum(8)
          }
        }
      }
    }
    handleResize()

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    setLoading(true)

    fetch("http://localhost:8000/api/concert")
      .then((res) => res.json())
      .then((data) => {
        // console.log("API Response:", data)

        if (data.success) {
          handleData(data)
        }

        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching concerts:", error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const filtered = nonFeaturedProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(filterText.toLowerCase()) ||
        product.description.toLowerCase().includes(filterText.toLowerCase()),
    )
    setFilteredProducts(filtered)
    setPages(Math.ceil(filtered.length / entriesPerPage))
  }, [nonFeaturedProducts, filterText, entriesPerPage])

  const paginatedProducts = useMemo(() => {
    const start = (selectedPage - 1) * entriesPerPage
    const end = start + entriesPerPage
    return filteredProducts.slice(start, end)
  }, [filteredProducts, selectedPage, entriesPerPage])

  return (
    <>
      <div >
        <div className="flex justify-center">
          <div className="container">
            <div className="md:mt-16">
              <Swiper
                pagination={{
                  dynamicBullets: true,
                }}
                modules={[Pagination]}
                className="mySwiper"
              >
                {featuredProducts.map((item, idx) => (
                  <SwiperSlide className="p-2 md:mb-16 mb-8">
                    <div key={`ticket-detail-${idx}`} className={`grid md:grid-cols-2 grid-cols-1 md:gap-20 gap-6`}>
                      <div className={`relative`}>
                        <Image
                          // src={item?.img || "/placeholder.svg"}
                          src={"https://i.ibb.co.com/5KchHq8/ticket-Banner.png"}
                          className="cursor-pointer object-cover h-full w-full"
                          alt={item.img}
                          borderRadius={type ? "18px" : "25px"}
                        />
                      </div>
                      <div className={`flex flex-col`}>
                        <div
                          className={`${themeMode ? "ticket-detail-tilte" : "ticket-detail-tilte-dark"}`}
                          style={{ fontSize: type ? "22px" : "48px" }}
                        >
                          {item.name}
                        </div>
                        <div className={`${themeMode ? "ticket-detail" : "ticket-detail-dark"} md:mt-6 mt-3`}>
                          {item.description}
                        </div>
                        <div className={`flex md:mt-4 mt-3 ${themeMode ? "" : ""}`}>
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M11.9999 13.4295C13.723 13.4295 15.1199 12.0326 15.1199 10.3095C15.1199 8.58633 13.723 7.18945 11.9999 7.18945C10.2768 7.18945 8.87988 8.58633 8.87988 10.3095C8.87988 12.0326 10.2768 13.4295 11.9999 13.4295Z"
                                stroke={themeMode ? "#6D6E76" : "#BBBCC0"}
                                strokeWidth="1.5"
                              />
                              <path
                                d="M3.61971 8.49C5.58971 -0.169998 18.4197 -0.159997 20.3797 8.5C21.5297 13.58 18.3697 17.88 15.5997 20.54C13.5897 22.48 10.4097 22.48 8.38971 20.54C5.62971 17.88 2.46971 13.57 3.61971 8.49Z"
                                stroke={themeMode ? "#6D6E76" : "#BBBCC0"}
                                strokeWidth="1.5"
                              />
                            </svg>
                          </div>
                          <div
                            className={`flex ml-2 items-center ${themeMode ? "ticket-detail" : "ticket-detail-dark"}`}
                          >
                            {item.location}
                          </div>
                        </div>
                        <div className={`flex mt-4 ${themeMode ? "" : ""}`}>
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z"
                                stroke={themeMode ? "#6D6E76" : "#BBBCC0"}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M15.7099 15.1798L12.6099 13.3298C12.0699 13.0098 11.6299 12.2398 11.6299 11.6098V7.50977"
                                stroke={themeMode ? "#6D6E76" : "#BBBCC0"}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div
                            className={`flex ml-2 items-center ${themeMode ? "ticket-detail" : "ticket-detail-dark"}`}
                          >
                            {item.date}
                          </div>
                        </div>
                        {!type && (
                          <div className="md:mt-10 mt-8">
                            <Link to={item.link} target="_blank">
                              {" "}
                              <DetailButton text="buy Tickets Of Concert" btnType="web" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>


          </div>
        </div>
        </div>
      </div>
    </>
  )
}

export default Event
