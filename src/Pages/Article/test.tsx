// import React, {useState, useEffect, useMemo} from 'react';
// import BreadCrumb from '../../Components/BreadCrumb';
// import ContentTitle from '../../Components/ContentTitle';
// import Layout from '../../Components/Layout';
// import CommentForm from '../../Components/Comment';
// import {Link, useLocation, useParams} from 'react-router-dom';
// import {Image, Spinner} from '@chakra-ui/react';
// import {useDispatch, useSelector} from 'react-redux';
// import {RootState} from '../../reducers';
// import '../mainPageStyle.css';
// import {PageBasicProps} from '../../AppMain';
// import {ArticleToDisplay} from '../Home/NewsContent/Carousel';
// import {
// 	addLastVisited,
// 	get5RandomNewsByTags,
// 	getLastVisitedId,
// 	getTargetNews,
// } from '../../reducers/NewsReducer';

// import TipTap from '../../Components/TipTap/TipTap';
// import DelayedComponent from '../../Components/_utility/DelayedComponent';
// import SocialShare from '../../Components/SocialShare/SocialShare';
// import { PostModels } from '../../Constant/api-requests';



// interface CommentForm {
// 	id: string;
// 	img: string;
// 	comment: string;
// }

// const ArticleDetailPage: React.FC<PageBasicProps> = ({themeMode, type}) => {
// 	const {id} = useParams<{id: string}>();
// 	const targetNewsSelected = useSelector((state: RootState) =>
// 		getTargetNews(state, id)
// 	);
// 	const url = useLocation().pathname;
// 	const lastVisitedId = useSelector((state: RootState) =>
// 		getLastVisitedId(state)
// 	);
// 	const dispatch = useDispatch();
// 	const [pageData, setPageData] = useState<ArticleToDisplay>();
// 	const [, ...tagsToRemap] = targetNewsSelected?.tags?.split('#') || [];
// 	const tags = tagsToRemap;
// 	const pageDataTags = useMemo(() => pageData?.tags || [], [pageData?.tags]);
// 	const relatedData: ArticleToDisplay[] = useSelector((state: RootState) =>
// 		get5RandomNewsByTags(state, pageDataTags || [])
// 	);
// 	const filteredRelatedData = useMemo(() => {
// 		return relatedData.filter((news) => news._id !== id);
// 	}, [relatedData, id]);

// 	useEffect(() => {
// 		setPageData(targetNewsSelected);
// 	}, [targetNewsSelected]);

// 	useEffect(() => {
// 		if (!lastVisitedId || lastVisitedId !== id) {
// 			dispatch(addLastVisited(`${id}`));
// 		}
// 	}, []);

// 	return (
// 		<Layout themeMode={themeMode} type={type}>
// 			<div className='flex justify-center'>
// 				<div className='container'>
// 					{type ? (
// 						''
// 					) : (
// 						<div className='md:mt-12 mt-8'>
// 							<BreadCrumb />
// 						</div>
// 					)}
// 					{!targetNewsSelected ? (
// 						<div className='w-full h-full flex justify-center items-center'>
// 							<Spinner
// 								thickness='4px'
// 								speed='0.65s'
// 								emptyColor='gray.200'
// 								color='blue.500'
// 								size='lg'
// 							/>
// 						</div>
// 					) : (
// 						<div className='flex md:flex-row flex-col gap-8'>
// 							<div className='md:w-4/6 w-full'>
// 								<div className='md:mt-7 mt-10'>
// 									<ContentTitle
// 										titleType='NEWS'
// 										title={
// 											pageData?.title || 'News Page Title'
// 										}
// 									/>
// 								</div>
// 								<p
// 									className={`py-5 text-left ${!themeMode ? 'text-[#BBBCC0]' : 'text-[#6D6E76]'}`}
// 								>
// 									<b>{pageData?.intro}</b>
// 								</p>
// 								<Image
// 									className={` rounded-2xl mx-auto border-solid border ${!themeMode && 'border-white'}`}
// 									src={`${process.env.REACT_APP_FILES_URL}${pageData?.files[0].url}`}
// 									alt='img'
// 								></Image>
// 								<DelayedComponent delay={200}>
// 									{targetNewsSelected && pageData?.content ? (
// 										<TipTap
// 											themeMode={themeMode}
// 											content={pageData?.content}
// 											editable={false}
// 										/>
// 									) : (
// 										<div className='w-full h-full flex justify-center items-center'>
// 											<Spinner
// 												thickness='4px'
// 												speed='0.65s'
// 												emptyColor='gray.200'
// 												color='blue.500'
// 												size='lg'
// 											/>
// 										</div>
// 									)}
// 									<CommentForm
// 									postModel={PostModels.news}
// 									commentData={
// 										pageData?.commentsSection ?? null

// 									}
// 								/>
// 								</DelayedComponent>

// 							</div>
// 							<div
// 								className={`md:w-2/6 w-full`}
// 								style={{marginTop: type ? '0px' : '300px'}}
// 							>
// 								<div
// 									className={`${!type ? (themeMode ? 'right-card' : 'right-card-dark') : ''} mb-6 w-full py-4 px-3`}
// 								>
// 									<div
// 										className={`${themeMode ? `tag-card-title` : `tag-card-title-dark`} text-left md:mb-3 mb-4`}
// 									>
// 										Tagi
// 									</div>
// 									<div className={`flex flex-wrap gap-3`}>
// 										{tags ? (
// 											tags.map((tag, i) => (
// 												<div
// 													key={`article-key-tag-${tag + i}`}
// 													className={`${themeMode ? 'category-tag' : `category-tag-dark`}`}
// 												>
// 													{tag}
// 												</div>
// 											))
// 										) : (
// 											<div className='w-full h-full flex justify-center items-center'>
// 												<Spinner
// 													thickness='4px'
// 													speed='0.65s'
// 													emptyColor='gray.200'
// 													color='blue.500'
// 													size='lg'
// 												/>
// 											</div>
// 										)}
// 									</div>
// 								</div>
// 								{filteredRelatedData.length > 0 && (
// 									<div
// 										className={`${themeMode ? 'right-card' : 'right-card-dark'} px-3 py-4`}
// 									>
// 										<div
// 											className={`${themeMode ? `tag-card-title` : `tag-card-title-dark`} text-left`}
// 										>
// 											Zobacz również
// 										</div>
// 										<div
// 											className={`flex flex-col gap-3 md:mt-3 mt-4`}
// 										>
// 											{filteredRelatedData &&
// 												filteredRelatedData.map(
// 													(item) => (
// 														<Link
// 															replace
// 															to={`/news/${item._id}`}
// 														>
// 															<div
// 																className={`flex gap-3`}
// 															>
// 																<Image
// 																	src={`${process.env.REACT_APP_FILES_URL + item.files[0].url}`}
// 																	className='cursor-pointer object-cover'
// 																	height={
// 																		type
// 																			? '54px'
// 																			: '62px'
// 																	}
// 																	width={
// 																		type
// 																			? '54px'
// 																			: '62px'
// 																	}
// 																	alt={
// 																		item
// 																			.files[0]
// 																			.name
// 																	}
// 																	borderRadius={
// 																		type
// 																			? '8px'
// 																			: '10px'
// 																	}
// 																/>
// 																<div
// 																	className={`flex flex-col justify-center overflow-hidden`}
// 																>
// 																	<div
// 																		className={`${themeMode ? 'tag-title' : 'tag-title-dark'} w-full text-left`}
// 																		style={{
// 																			fontSize:
// 																				type
// 																					? '14px'
// 																					: '12px',
// 																		}}
// 																	>
// 																		{
// 																			item.title
// 																		}
// 																	</div>
// 																	<p
// 																		className={`mt-1 ${themeMode ? 'text-stone-500' : ' text-stone-300'} w-full text-left text-xs`}
// 																	>
// 																		{item.intro.slice(
// 																			0,
// 																			type
// 																				? 100
// 																				: 75
// 																		) +
// 																			'...'}
// 																	</p>
// 																</div>
// 															</div>
// 														</Link>
// 													)
// 												)}
// 										</div>
// 									</div>
// 								)}

// 								<SocialShare
// 									themeMode={themeMode}
// 									url={url}
// 									title={`${pageData?.title}`}
// 								/>
// 							</div>
// 						</div>
// 					)}
// 				</div>
// 			</div>
// 		</Layout>
// 	);
// };

// export default ArticleDetailPage;


import React from 'react'

function test() {
	return (
		<div>

		</div>
	)
}

export default test
