import React, {useState, useEffect, useMemo} from 'react';
import BreadCrumb from '../../Components/BreadCrumb';
import ContentTitle from '../../Components/ContentTitle';
import FilterInput from '../../Components/FilterInput';
import Layout from '../../Components/Layout';
import Comment from '../../Components/Comment';
import {Link, useParams} from 'react-router-dom';
import {Image, Spinner} from '@chakra-ui/react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../reducers';
import '../mainPageStyle.css';
import {apiGetReq} from '../../Constant/api-functions';
import {fileUrl} from '../../Constant/config';
import {changeData1} from '../../Constant/helpers';
import {PageBasicProps} from '../../AppMain';
import {ArticleToDisplay} from '../Home/NewsContent/Carousel';
import {addLastVisited, get5RandomNewsByTags, getLastVisitedId, getTargetNews} from '../../reducers/NewsReducer';
import {stat} from 'fs';
import TipTap from '../../Components/TipTap/TipTap';
import DelayedComponent from '../../Components/_utility/DelayedComponent';

interface TagData {
	_id: string;
	name: string;
}

interface PageDataProps extends PageBasicProps {
	tagData: {
		_id: string;
		name: string;
	}[];
}

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
}

interface inputNews {
	_id: string;
	title: string;
	tag: string;
	date: string;
	content: Content[];
	link: string;
}

interface inputComment {
	_id: string;
	entityId: string;
	commentId: string;
	name: string;
	email: string;
	website: string;
	comment: string;
}

interface Comment {
	id: string;
	img: string;
	comment: string;
}

const ArticleDetailPage: React.FC<PageDataProps> = ({
	tagData,
	themeMode,
	type,
}) => {
	const {id} = useParams<{id: string}>();
	const targetNewsSelected = useSelector((state: RootState) =>
		getTargetNews(state, id)
	);
  const lastVisitedId = useSelector((state: RootState) => getLastVisitedId(state))
  const dispatch = useDispatch();
	const [pageData, setPageData] = useState<ArticleToDisplay>();
	const [, ...tagsToRemap] = targetNewsSelected?.tags?.split('#') || [];
	const tags = tagsToRemap
  const pageDataTags = useMemo(() => pageData?.tags || [], [pageData?.tags]);
  const relatedData: ArticleToDisplay[] = useSelector((state: RootState) => get5RandomNewsByTags(state, pageDataTags || []));
  const filteredRelatedData = useMemo(() => {
    return relatedData.filter((news) => news._id !== id);
  }, [relatedData, id]);

  useEffect(() => {
		setPageData(targetNewsSelected);
	}, [targetNewsSelected]);

  useEffect(() => {
    if(!lastVisitedId || lastVisitedId !== id) {
      dispatch(addLastVisited(`${id}`));
    }

  }, [])

	// useEffect(() => {
	//   setLoading(true);
	//   apiGetReq("/news/id", { id }).then((res) => {
	//     setLoading(false);
	//     let newsContent: Content[] = [];
	//     res.news[0].content.map((item: Content) => {
	//       newsContent.push({
	//         subHead: item.subHead,
	//         img: fileUrl + item.img,
	//         description: item.description,
	//       });
	//     });
	//     const formattedDate1 = changeData1(res.news[0].date);
	//     setPageData({
	//       id: res.news[0]._id,
	//       title: res.news[0].title,
	//       feature: res.news[0].tag,
	//       date: formattedDate1,
	//       content: newsContent,
	//       link: res.news[0].link,
	//     });
	//     let relatedNews: News[] = [];
	//     res.relatedNews.map((item: inputNews) => {
	//       const formattedDate2 = changeData1(item.date);
	//       let newRelatedContent: Content[] = [];
	//       item.content.map((contentData) => {
	//         newRelatedContent.push({
	//           subHead: contentData.subHead,
	//           img: fileUrl + contentData.img,
	//           description: contentData.description,
	//         });
	//       });
	//       const temp: News = {
	//         id: item._id,
	//         title: item.title,
	//         feature: item.tag,
	//         content: newRelatedContent,
	//         date: formattedDate2,
	//         link: item.link,
	//       };
	//       relatedNews.push(temp);
	//     });
	//     setRelatedData(relatedNews);
	//   });
	// }, [id]);

	return (
		<Layout themeMode={themeMode} type={type}>
			<div className='flex justify-center'>
				<div className='container'>
					{type ? (
						''
					) : (
						<div className='md:mt-12 mt-8'>
							<BreadCrumb />
						</div>
					)}
					{!targetNewsSelected ? (
						<div className='w-full h-full flex justify-center items-center'>
							<Spinner
								thickness='4px'
								speed='0.65s'
								emptyColor='gray.200'
								color='blue.500'
								size='lg'
							/>
						</div>
					) : (
						<div className='flex md:flex-row flex-col gap-8'>
							<div className='md:w-4/6 w-full'>
								<div className='md:mt-7 mt-10'>
									<ContentTitle
										titleType='NEWS'
										title={
											pageData?.title || 'News Page Title'
										}
									/>
								</div>
								<p
									className={`py-5 text-left ${!themeMode ? 'text-[#BBBCC0]' : 'text-[#6D6E76]'}`}
								>
									<b>{pageData?.intro}</b>
								</p>
								<img
									className={` rounded-2xl mx-auto border-solid border ${!themeMode && 'border-white'}`}
									src={`${process.env.REACT_APP_FILES_URL}${pageData?.files[0].url}`}
								></img>
								<DelayedComponent delay={200}>
									{targetNewsSelected && pageData?.content ? (
										<TipTap
											themeMode={themeMode}
											content={pageData?.content}
											editable={false}
										/>
									) : (
										<div className='w-full h-full flex justify-center items-center'>
											<Spinner
												thickness='4px'
												speed='0.65s'
												emptyColor='gray.200'
												color='blue.500'
												size='lg'
											/>
										</div>
									)}
								</DelayedComponent>
								{/* <div className="md:mt-6 mt-4">
                <FilterInput type={type} />
              </div> */}
								<div className={`md:mt-16 mt-8`}>
									<div className={`flex flex-col w-full`}>
										{/* {pageData?.content.map((item, idx) => (
                      <div className="flex flex-col w-full md:mb-12 mb-6">
                        <Image
                          src={item.img}
                          className="cursor-pointer object-cover w-full"
                          height={type ? "257px" : "494px"}
                          alt={item.img}
                          borderRadius={type ? "16px" : "25px"}
                        />
                        <div
                          className={`${themeMode ? "sub-head" : "sub-head-dark"} text-left md:mt-12 mt-6`}
                          style={{ fontSize: type ? "18px" : "20px" }}
                        >
                          {item.subHead}
                        </div>
                        <div
                          className={`${themeMode ? "description" : "description-dark"} md:mt-6 mt-4 text-left`}
                          style={{ lineHeight: type ? "26.5px" : "24px" }}
                        >
                          {item.description}
                        </div>
                      </div>
                    ))} */}
									</div>
								</div>
							</div>
							<div
								className={`md:w-2/6 w-full`}
								style={{marginTop: type ? '0px' : '300px'}}
							>
								<div
									className={`${!type ? (themeMode ? 'right-card' : 'right-card-dark') : ''} mb-6 w-full py-4 px-3`}
								>
									<div
										className={`${themeMode ? `tag-card-title` : `tag-card-title-dark`} text-left md:mb-3 mb-4`}
									>
										Tagi
									</div>
									<div className={`flex flex-wrap gap-3`}>
										{tags ? (
											tags.map((tag, i) => (
												<div
													key={`article-key-tag-${tag + i}`}
													className={`${themeMode ? 'category-tag' : `category-tag-dark`}`}
												>
													{tag}
												</div>
											))
										) : (
											<div className='w-full h-full flex justify-center items-center'>
												<Spinner
													thickness='4px'
													speed='0.65s'
													emptyColor='gray.200'
													color='blue.500'
													size='lg'
												/>
											</div>
										)}
									</div>
								</div>
							{filteredRelatedData.length > 0 &&	<div
									className={`${themeMode ? 'right-card' : 'right-card-dark'} px-3 py-4`}
								>
									<div
										className={`${themeMode ? `tag-card-title` : `tag-card-title-dark`} text-left`}
									>
										Zobacz również
									</div>
									<div
										className={`flex flex-col gap-3 md:mt-3 mt-4`}
									>
										{filteredRelatedData &&
											filteredRelatedData.map((item) => (
												<Link replace to={`/news/${item._id}`}><div className={`flex gap-3`}>
													<Image
														src={
															`${process.env.REACT_APP_FILES_URL + item.files[0].url}`
														}
														className='cursor-pointer object-cover'
														height={
															type
																? '54px'
																: '62px'
														}
														width={
															type
																? '54px'
																: '62px'
														}
														alt={
															item.files[0].name
														}
														borderRadius={
															type
																? '8px'
																: '10px'
														}
													/>
													<div
														className={`flex flex-col justify-center overflow-hidden`}
													>
														<div
															className={`${themeMode ? 'tag-title' : 'tag-title-dark'} w-full text-left`}
															style={{
																fontSize: type
																	? '14px'
																	: '12px',
															}}
														>
															{item.title}
														</div>
														<p
															className={`mt-1 ${themeMode ? 'text-stone-500' : ' text-stone-300'} w-full text-left text-xs`}
														>
															{
																item.intro.slice(0, type ? 100 : 50) + '...'
															}
														</p>
													</div>
												</div></Link>
											))}
									</div>
								</div>}
							</div>
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default ArticleDetailPage;
