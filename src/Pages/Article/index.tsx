import React, {useState, useEffect, ChangeEvent} from 'react';
import BreadCrumb from '../../Components/BreadCrumb';
import ContentTitle from '../../Components/ContentTitle';
import FilterInput from '../../Components/FilterInput';
import PaginationBar from '../../Components/PaginationBar';
import {apiGetReq} from '../../Constant/api-functions';
import Layout from '../../Components/Layout';
import {fileUrl} from '../../Constant/config';
import ProductCard1 from '../../Components/Card/ProductCard1';
import {Button, Spinner} from '@chakra-ui/react';
import '../mainPageStyle.css';
import {usePaginatedNews} from '../../hooks/usePaginatedNews';
import {set} from 'react-hook-form';
import {useSelector} from 'react-redux';
import {RootState} from '../../reducers';
import {getLastPageNumber} from '../../reducers/NewsReducer';
import { isInViewport } from '../../Constant/helpers';

interface Content {
	subHead: string;
	img: string;
	description: string;
}

interface News {
	id: string;
	title: string;
	feature: string;
	date: string;
	content: Content[];
	link: string;
	_id: string;
}

interface inputNews {
	_id: string;
	title: string;
	tag: string;
	date: string;
	content: Content[];
	link: string;
}

export const getFirstTag = (tags: string) => {
	return tags.split('#')[1];
};

const ArticleMainPage = () => {
	const [type, setType] = useState<boolean>(false);
	const currentPage = useSelector((state: RootState) =>
		getLastPageNumber(state)
	);
	const [selectedPage, setSelectedPage] = useState<number>(currentPage);
	const [cardNum, setCardNum] = useState<number>(4);
	const [loadNexPage, setLoadNextPage] = useState<boolean>(false);
	const loadNextPageElementRef = React.createRef<HTMLDivElement>();

	const pageSize = 18;
	const {data, error, loading, forceRevalidateAll, totalPages} =
		usePaginatedNews(pageSize, selectedPage);
	const loadMore = () => {
		setSelectedPage((prevPage) => {
			if (prevPage < totalPages) {
				return prevPage + 1;
			}
			return prevPage;
		});
	};
	useEffect(() => {
		const interval = setInterval(() => {
			forceRevalidateAll();
		}, 30000); // Revalidate every 30 seconds
		return () => clearInterval(interval);
	}, [forceRevalidateAll]);
	// useEffect(() => {
	//   setRowsPerPage(cardNum * lineNum);
	// }, [cardNum, lineNum]);

	// const handleData = (response: any) => {
	//   let newsData: News[] = [];
	//   const pages = Math.ceil(response.all / rowsPerPage);
	//   setPages(pages.toString());
	//   response.news.map((item: inputNews) => {
	//     const inputDate: Date = new Date(item.date);
	//     const options: object = {
	//       year: "numeric",
	//       day: "numeric",
	//       month: "long",
	//     };
	//     const formattedDate: string = inputDate.toLocaleDateString(
	//       "en-US",
	//       options
	//     );
	//     let newContent: Content[] = [];
	//     item.content.map((contentData) => {
	//       newContent.push({
	//         subHead: contentData.subHead,
	//         img: fileUrl + contentData.img,
	//         description: contentData.description,
	//       });
	//     });
	//     const temp: News = {
	//       id: item._id,
	//       title: item.title,
	//       feature: item.tag,
	//       content: newContent,
	//       date: formattedDate,
	//       link: item.link,
	//     };
	//     newsData.push(temp);
	//   });
	//   setCardData(newsData);
	// };
	const checkVisibility = () => {
		if (loadNextPageElementRef.current) {
		  setLoadNextPage(isInViewport(loadNextPageElementRef.current));
		}
	  };

	useEffect(() => {
		checkVisibility();
		const handleResize = () => {
			if (window.innerWidth > 1280) {
				setCardNum(4);
			} else {
				setCardNum(3);
				if (window.innerWidth < 1024) {
					setCardNum(2);
					if (window.innerWidth < 768) {
						setCardNum(1);
					}
				}
			}

			if (window.innerWidth < 768) {
				setType(true);
			} else {
				setType(false);
			}
		};
		handleResize();
		window.addEventListener('scroll', checkVisibility);
		window.addEventListener('resize', checkVisibility);
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('scroll', checkVisibility);
			window.removeEventListener('resize', checkVisibility);
			window.removeEventListener('resize', handleResize);
		};
	}, [checkVisibility]);

	useEffect(() => {
		if (loadNexPage) {
		  loadMore();
		}
	  }, [loadNexPage]);

	// const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
	//   setRowsPerPage(parseInt(e.target.value));
	// };

	// useEffect(() => {
	//   setLoading(true);
	//   apiGetReq("/news", {
	//     rowsPerPage: rowsPerPage,
	//     curPage: selectedPage,
	//     filter: filterText,
	//   })
	//     .then((res) => {
	//       handleData(res);
	//       setLoading(false);
	//     })
	//     .catch((err) => {
	//       setLoading(false);
	//     });
	// }, []);

	// useEffect(() => {
	//   setLoading(true);
	//   apiGetReq("/news", {
	//     rowsPerPage: rowsPerPage,
	//     curPage: selectedPage,
	//     filter: filterText,
	//   })
	//     .then((res) => {
	//       handleData(res);
	//       setLoading(false);
	//     })
	//     .catch((err) => {
	//       setLoading(false);
	//     });
	// }, [selectedPage, rowsPerPage, filterText]);

	const handleClick = (id: string) => {
		console.log(id);
		console.log('cil');
	};

	return (
		<>
			<Layout>
				<div className='flex justify-center'>
					<div className='container'>
						{type ? (
							''
						) : (
							<div className='md:mt-12 mt-8'>
								<BreadCrumb routeName={['Home', 'News']} />
							</div>
						)}
						<div className='md:mt-7 mt-10'>
							<ContentTitle
								titleType='NEWS'
								title='See Our Latest News'
							/>
						</div>
						<div className='md:mt-6 mt-4'>
							<FilterInput type={type} />
						</div>
						<div
							className={`md:mt-12 mt-8`}
							style={{
								minHeight: type ? '843px' : '1235.7px',
								width: '100%',
							}}
						>
							{loading ? (
								<div
									className='w-full flex justify-center items-center'
									style={{
										minHeight: type ? '776px' : '908px',
									}}
								>
									<Spinner
										thickness='4px'
										speed='0.65s'
										emptyColor='gray.200'
										color='blue.500'
										size='lg'
									/>
								</div>
							) : (
								<div
									className={`${type ? 'block' : 'grid'} ${cardNum === 4 && 'grid-cols-4'} ${cardNum === 3 && 'grid-cols-3'} ${cardNum === 2 && 'grid-cols-2'} gap-4 py-5`}
								>
									{data?.map(
										(item, index) =>
											item && (
												<div
													key={`main-news-card-${index}`}
													className='w-full'
												>
													<ProductCard1
														type={
															type
																? 'vertical'
																: 'horizontal'
														}
														img={item.files[0].url}
														tags={getFirstTag(
															`${item.tags}`
														)}
														title={item.title}
														date={
															`${item.date}`.split(
																'T'
															)[0]
														}
														_id={item._id}
													/>
												</div>
											)
									)}
								</div>
							)}
						</div>
						<div
							className={`flex ${type ? 'justify-center' : 'justify-end'}`}
						>
							{/* {!type && (
                <div className={`flex gap-3`}>
                  <div
                    className={`flex items-center rows-text rows-text`}
                    style={{ color: themeMode ? "#252733" : "#FFF" }}
                  >
                    Show
                  </div>
                  <Select
                    color={themeMode ? "black" : "white"}
                    backgroundColor={themeMode ? "" : "#242526"}
                    width={type ? "" : "55px"}
                    height={type ? "" : "26px"}
                    onChange={handleSelectChange}
                    fontSize={type ? "" : "14px"}
                    outline={"unset"}
                    border={"unset"}
                  >
                    <option
                      style={{
                        color: themeMode ? "black" : "white",
                        backgroundColor: themeMode ? "white" : "#242526",
                      }}
                      value="5"
                    >
                      5
                    </option>
                    <option
                      style={{
                        color: themeMode ? "black" : "white",
                        backgroundColor: themeMode ? "white" : "#242526",
                      }}
                      value="10"
                    >
                      10
                    </option>
                    <option
                      style={{
                        color: themeMode ? "black" : "white",
                        backgroundColor: themeMode ? "white" : "#242526",
                      }}
                      value="15"
                    >
                      15
                    </option>
                  </Select>
                  <div
                    className={`flex items-center gap-2 rows-text`}
                    style={{ color: themeMode ? "#252733" : "#FFF" }}
                  >
                    entries
                  </div>
                </div>
              )} */}
							{loading ? (
								<div
									className='w-full flex justify-center items-center'
									style={{
										minHeight: type ? '776px' : '908px',
									}}
								>
									<Spinner
										thickness='4px'
										speed='0.65s'
										emptyColor='gray.200'
										color='blue.500'
										size='lg'
									/>
								</div>
							) : (
								Math.ceil(data.length / pageSize) !==
									totalPages && (
									<div
										ref={loadNextPageElementRef}
										className={`rows-text ${!type && 'rows-text invisible'}`}
										onClick={() => loadMore()}
									>
										Load More
									</div>
								)
							)}
							{/* <PaginationBar
                selectedPage={currentPage}
                setSelectedPage={setCurrentPage}
                pages={totalPages}
              /> */}
						</div>
					</div>
				</div>
			</Layout>
		</>
	);
};

export default ArticleMainPage;
