import React, {useState, useEffect, useMemo, MouseEvent, useId} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../reducers';
import './style.css';
import {Avatar, Button, Spinner} from '@chakra-ui/react';
import Input from '../TextField/Input';
import {Link, useParams} from 'react-router-dom';
import {
	PostModels,
	addCommentRequest,
	getPaginatedCommentsRequest,
	getTopCommentsRequest,
} from '../../Constant/api-requests';
import {useForm} from 'react-hook-form';
import usePromiseBasedToast from '../Toast/Toast';
import useSWR from 'swr';
import {mutate} from 'swr';
import {
	ArticleToDisplay,
	Comment as CommentWithReplies,
	CommentsSection,
} from '../../Pages/Home/NewsContent/Carousel';
import {get, max, rest, set, throttle} from 'lodash';
import {m} from 'framer-motion';

// type CommentSection = {
// 	commentData: {id: string; img: string; comment: string}[];
// 	postModel: string;
// };

type CommentsSectionRemapped = {
	embeddedComments: (CommentWithReplies & {shouldReverse?: boolean})[];
	commentsIds: string[];
};

interface CommentSectionProps {
	commentData: CommentsSectionRemapped | null;
	postModel: PostModels;
}

const queue: Array<() => void> = [];
let isProcessing = false;

const processQueue = async () => {
	if (isProcessing || queue.length === 0) return;
	isProcessing = true;
	const next = queue.shift();
	if (next) await next();
	isProcessing = false;
	if (queue.length > 0) throttledProcessQueue();
};
const throttledProcessQueue = throttle(processQueue, 1000); // Throttle to one call per 1 second

const throttledFetcher = (
	postModel: PostModels,
	id: string,
	pageNum: number
): Promise<{comments: CommentWithReplies[]; totalPages: number}> => {
	return new Promise((resolve, reject) => {
		queue.push(async () => {
			try {
				const {comments, totalPages} = await fetcher(
					true,
					postModel,
					id,
					pageNum
				);
				resolve({comments, totalPages});
			} catch (error) {
				reject(error);
			}
		});
		throttledProcessQueue();
	});
};

const numberToArray = (num: number) => {
	if (num < 1) {
		throw new Error('Number should be greater than or equal to 1');
	}
	return Array.from({length: num}, (_, i) => i + 1);
};

const fetcher = async (
	fetchPages: boolean,
	postModel: PostModels,
	id: string,
	page: number,
	noComments?: boolean,
	parentCommentId?: string | null
) => {
	if (noComments) {
		return {comments: [], totalPages: 0};
	}
	if (fetchPages) {
		if (parentCommentId) {
			return await getPaginatedCommentsRequest({
				entityModel: postModel,
				postId: `${id}`,
				page: page === 0 ? 1 : page,
				pageSize: 10,
				parentCommentId,
			});
		} else {
			return await getPaginatedCommentsRequest({
				entityModel: postModel,
				postId: `${id}`,
				page: page === 0 ? 1 : page,
				pageSize: 10,
			});
		}
	} else {
		if (parentCommentId) {
			return await getTopCommentsRequest({
				entityModel: postModel,
				postId: `${id}`,
				parentCommentId,
			});
		} else {
			return await getTopCommentsRequest({
				entityModel: postModel,
				postId: `${id}`,
			});
		}
	}
};
// noComments ||
// (fetchPages
// 	? await getPaginatedCommentsRequest({
// 			entityModel: postModel,
// 			postId: `${id}`,
// 			page: page === 0 ? 1 : page,
// 			pageSize: 10,
// 			parentCommentId,
// 		})
// 	: await getTopCommentsRequest({
// 			entityModel: postModel,
// 			postId: `${id}`,
// 			parentCommentId
// 		}));

const getKeys = (
	fetchPages: boolean,
	postModel: PostModels,
	id: string,
	page: number,
	parentId?: string
) =>
	`comment/${postModel}/${id}${fetchPages ? `?page=${page}` : ''}${parentId ? `&parentId=${page}` : ''}`;

const scrollToCommentsStart = () =>
	document
		.getElementById('comments-title')
		?.scrollIntoView({block: 'center', behavior: 'smooth'});

const scrollToCommentsForm = () =>
	document
		.getElementById('comments-form')
		?.scrollIntoView({block: 'center', behavior: 'smooth'});

const useComments = (
	id: string,
	postModel: PostModels,
	fetchPages: boolean,
	hideFetchedPages = false,
	noComments = false,
	parentCommentId?: string
) => {
	console.log(parentCommentId);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [commentsState, setCommentsState] = useState<CommentWithReplies[]>(
		[]
	);

	const {
		data,
		isLoading,
		mutate: localMutate,
	} = useSWR(
		getKeys(fetchPages, postModel, id, page, parentCommentId),
		() =>
			fetcher(
				fetchPages,
				postModel,
				id,
				page,
				noComments,
				parentCommentId
			),
		{revalidateOnFocus: false, dedupingInterval: 60000}
	);
	const fetchedData: CommentWithReplies[] = fetchPages
		? data?.comments
		: data?.embeddedComments;

	useEffect(() => {
		if (fetchedData) {
			setCommentsState((prevComments) => {
				const newComments = fetchedData.filter(
					(comment) =>
						!prevComments.some(
							(prevComment) => prevComment._id === comment._id
						)
				);
				return page === 1
					? fetchedData
					: [...prevComments, ...newComments];
			});
		}
	}, [data]);

	const fetchMoreComments = () => {
		setPage((prev) => prev + 1);
	};

	const revalidateAllFetchedPages = async () => {
		if (page > 1) {
			const pages = Array.from(
				{length: Math.ceil(commentsState.length / 10)},
				(_, i) => i + 1
			);
			let maxPage: number = 1;
			const revalidatePromises = pages.map(async (pageNum) => {
				const response =
					(await mutate(
						getKeys(true, postModel, id, pageNum),
						async () => {
							const response = await throttledFetcher(
								postModel,
								id,
								pageNum
							);
							maxPage = response?.totalPages ?? 1;
							return response?.comments ?? [];
						},
						false
					)) ?? [];
				return response;
			});

			const allComments = (await Promise.all(revalidatePromises)).flat();

			setCommentsState(allComments);
			setTotalPages(maxPage);
		} else {
			await localMutate();
		}
	};

	const optimisticUpdateWithRevalidation = (
		newComment: CommentWithReplies
	) => {
		setCommentsState((prev) => [newComment, ...prev]);
		if (parentCommentId) {
		} else {
			scrollToCommentsStart();
		}
		revalidateAllFetchedPages();
	};

	return {
		data:
			hideFetchedPages && commentsState.length > 3
				? [commentsState[0], commentsState[1], commentsState[2]]
				: commentsState,
		isLoading,
		fetchMoreComments,
		maxPages: Number(data?.totalPages ?? totalPages),
		fetchedComments: Number(commentsState.length),
		revalidateComments: revalidateAllFetchedPages,
		optimisticUpdate: optimisticUpdateWithRevalidation,
	};
};

const CommentForm: React.FC<CommentSectionProps> = ({
	commentData,
	postModel,
}) => {
	const {type, mode: themeMode} = useSelector(
		(state: RootState) => state.themeMode
	);

	const {isLoggedIn, user} = useSelector((state: RootState) => state.user);
	const {id} = useParams<{id: string}>();
	const {
		register,
		handleSubmit,
		formState: {errors},
		reset,
	} = useForm<{comment: string}>({
		defaultValues: {
			comment: '',
		},
		mode: 'all',
	});
	const [commentReply, setCommentReply] = useState<CommentWithReplies | null>(null);
	const [paginatedComments, setPaginatedComments] = useState<boolean>(false);
	const [hideComments, setHideComments] = useState<boolean>(false);
	const noComments = commentData === null && !paginatedComments;

	// handles comments
	const {
		data,
		isLoading,
		fetchMoreComments,
		maxPages,
		fetchedComments,
		optimisticUpdate,
	} = useComments(
		`${id}`,
		postModel,
		paginatedComments,
		hideComments,
		noComments
	);

	const shouldDisplayFetchButton = maxPages > Math.ceil(fetchedComments / 10);

	const handleFetchingMoreComments = () => {
		if (shouldDisplayFetchButton) {
			fetchMoreComments();
		}
	};

	const handleHidingComments = () => {
		setHideComments((prev) => !prev);
		if (!hideComments) {
			scrollToCommentsStart();
		}
	};

	const gen_Id = useId();
	// handles replies
	// const commentReply = useMemo(() => {
	// 	if (commentIdToReply) {
	// 		return data?.find((comment) => comment._id === commentIdToReply);
	// 	}
	// }, [commentIdToReply]);

	// const {

	// 	optimisticUpdate: optimisticUpdateComments,
	// } = useComments(
	// 	`${commentReply?._id}`,
	// 	PostModels.comment,
	// 	false,
	// 	true,
	// 	true
	// );

	const handleComment = async (commentData: {comment: string}) => {
		const requestsData = {
			entityModel: postModel,
			postId: `${id}`,
			content: commentData.comment,
		};
		if (commentReply) {
			const replyRequestsData = {
				...requestsData,
				postId: `${id}`,
				parentCommentId: commentReply?._id,
			};
			await addCommentRequest(replyRequestsData);
			// optimisticUpdateComments({
			// 	...replyRequestsData,
			// 	_id: gen_Id,
			// 	entityId: `${id}`,
			// 	authorId: {
			// 		nickname: 'Ty',
			// 		_id: gen_Id,
			// 		profilePicture: `${user?.avatar}`,
			// 	},

			// });
		} else {
			await addCommentRequest(requestsData);

			optimisticUpdate({
				...requestsData,
				_id: gen_Id,
				entityId: `${id}`,
				authorId: {
					nickname: 'Ty',
					_id: gen_Id,
					profilePicture: `${user?.avatar}`,
				},
			});
		}
		reset();
		if (shouldDisplayFetchButton) {
			setPaginatedComments(true);
		}
	};

	// const handleReply = (parentId: string) => {
	// 	setCommentIdToReply(parentId);
	// };

	const {wrappedSubmit} = usePromiseBasedToast({
		handleSubmit,
		onSubmit: handleComment,
		toastMessages: {
			success: {title: 'Sukces', description: 'Komentarz dodany!'},
			error: {
				title: 'Błąd',
				description: 'Nie udało się dodać komentarza!',
			},
			loading: {title: 'Wysyłanie', description: 'Poczekaj chwilę...'},
		},
	});

	const remapEmbeddedComments = useMemo(
		() => (comments: CommentsSection['embeddedComments']) => {
			if (!commentData && !paginatedComments && data) {
				setPaginatedComments(true);

				return;
			}
			let shouldReverse = false;
			return comments?.flatMap((comment, idx) => {
				const prevHasDifferentAuthor =
					idx > 0 &&
					comments[idx - 1]?.authorId._id !== comment.authorId._id;

				if (prevHasDifferentAuthor) {
					shouldReverse = true;
				}

				const authorNickname =
					comment.authorId._id === `${user?._id}`
						? 'Ty'
						: comment.authorId.nickname;

				return {
					...comment,
					shouldReverse,
					authorId: {
						...comment.authorId,
						nickname: authorNickname,
					},
				};
			});
		},

		[data]
	);

	const dataToRender =
		(paginatedComments && data.length <= 10
			? data
			: remapEmbeddedComments(data!)) ?? commentData?.embeddedComments;

	return (
		<>
			<div className={`w-full h-auto mt-10`}>
				<div
					className={`${themeMode ? '' : ''} flex justify-between mb-6`}
				>
					<div
						id='comments-title'
						className={`${themeMode ? 'comment-title' : 'comment-title-dark'} text-left`}
						style={{fontSize: type ? '18px' : '20px'}}
					>
						Komentarze
					</div>
				</div>
				<div className='mb-12 flex flex-col'>
					{dataToRender?.map((item, idx) => {
						return (
							<Comment
								key={item._id}
								comment={item}
								setCommentReply={setCommentReply}
								viewOnly={!item._id}
							/>
						);
					})}
				</div>
				{isLoading ? (
					<Spinner />
				) : (
					<>
						{shouldDisplayFetchButton && !hideComments && (
							<Button
								variant={'outline'}
								onClick={handleFetchingMoreComments}
								className={`${themeMode ? 'view-all-btn' : 'view-all-btn-dark'} text-right`}
								style={{fontSize: type ? '14px' : '16px'}}
							>
								Wczytaj starsze komentarze
							</Button>
						)}
						{Number(dataToRender?.length) === 0 ? (
							<p className={`${themeMode || 'text-white'}`}>
								Zostań pierwszą osobą komentującą!
							</p>
						) : (
							paginatedComments &&
							maxPages > 3 && (
								<Button
									variant={'ghost'}
									onClick={handleHidingComments}
									className={`${themeMode ? 'view-all-btn' : 'view-all-btn-dark'} text-right`}
									style={{fontSize: type ? '14px' : '16px'}}
								>
									{hideComments
										? 'Pokaż starsze komentarze'
										: 'Ukryj starsze komentarze'}
								</Button>
							)
						)}
					</>
				)}
				<div className='mt-4'>
					<form id='comments-form' onSubmit={wrappedSubmit}>
						{commentReply && (
							<Comment
								comment={commentReply}
								setCommentReply={setCommentReply}
								viewOnly
							/>
						)}
						<Input
							register={register}
							label={
								commentReply
									? `Odpowiadasz ${commentReply?.authorId.nickname === user?.nickname ? 'sobie' : commentReply?.authorId.nickname}`
									: 'Dodaj swój komentarz'
							}
							placeholder={
								isLoggedIn
									? 'Napisz coś od siebie...'
									: 'Zaloguj się aby dodać komentarz'
							}
							name='comment'
							disabled={!isLoggedIn}
							height={isLoggedIn ? '150px' : ''}
							error={errors.comment?.message}
						/>

						{isLoggedIn ? (
							<>
								<Button
									type='submit'
									className='float-right ml-2'
									colorScheme={
										themeMode ? 'blackAlpha' : 'whiteAlpha'
									}
								>
									{commentReply
										? 'Odpowiedz'
										: 'Dodaj komentarz'}
								</Button>
								{commentReply && (
									<Button
										onClick={() => setCommentReply(null)}
										type='button'
										className='float-right mr-2'
										colorScheme={
											themeMode
												? 'blackAlpha'
												: 'whiteAlpha'
										}
									>
										Dodaj swój komentarz
									</Button>
								)}
							</>
						) : (
							<Link state={window.location.pathname} to='/login'>
								<Button
									type='button'
									colorScheme={
										themeMode ? 'blackAlpha' : 'whiteAlpha'
									}
									variant='ghost'
								>
									Zaloguj się lub załóż konto
								</Button>
							</Link>
						)}
					</form>
				</div>
			</div>
		</>
	);
};

const Comment: React.FC<{
	comment: CommentWithReplies;
	setCommentReply: (comment: CommentWithReplies | null) => void;
	viewOnly?: boolean;
}> = ({comment, setCommentReply, viewOnly}) => {
	const themeMode = useSelector((state: RootState) => state.themeMode.mode);
	const [replies, setReplies] = useState<CommentWithReplies[] | null>([]);
	const [showReplies, setShowReplies] = useState(false);
	const {user} = useSelector((state: RootState) => state.user);
	const [parentId, setParentId] = useState<string | null>(null);
	const [paginatedComments, setPaginatedComments] = useState<boolean>(false);
	const [hideReplies, setHideReplies] = useState<boolean>(false);
	const noReplies = !comment._id || viewOnly;

	const {data} = useSWR(
		`comment/replies/${comment._id}`,
		noReplies
			? null
			: () =>
					getPaginatedCommentsRequest({
						entityModel: comment.entityModel,
						postId: comment.entityId,
						page: 1,
						pageSize: 10,
						parentCommentId: comment._id,
					}),
		{revalidateOnFocus: false, dedupingInterval: 60000}
	);

	useEffect(() => {
		console.log(data);
		if (data?.totalComments > 0) {
			setReplies(data.comments);
		}
	}, [noReplies, data]);

	const remapEmbeddedComments = useMemo(
		() => (comments: CommentsSection['embeddedComments']) => {
			if (!comment && !paginatedComments && data) {
				setPaginatedComments(true);

				return;
			}
			let shouldReverse = false;
			return comments?.flatMap((comment, idx) => {
				const prevHasDifferentAuthor =
					idx > 0 &&
					comments[idx - 1]?.authorId._id !== comment.authorId._id;

				if (prevHasDifferentAuthor) {
					shouldReverse = true;
				}

				const authorNickname =
					comment.authorId._id === `${user?._id}`
						? 'Ty'
						: comment.authorId.nickname;

				return {
					...comment,
					shouldReverse,
					authorId: {
						...comment.authorId,
						nickname: authorNickname,
					},
				};
			});
		},

		[data]
	);

	// const shouldDisplayFetchButton = maxPages > Math.ceil(fetchedComments / 10);

	const dataToRender = replies ?? [];
	// console.log(data);
	return comment ? (
		<div
			key={comment._id}
			className={`flex gap-x-1 mt-3 ${comment.shouldReverse ? 'flex-row-reverse' : ''} md:gap-3 ${comment.shouldReverse && 'justify-start'} ${viewOnly ? 'p-4' : ''}`}
		>
			{comment.authorId.profilePicture ? (
				<Avatar src={comment.authorId.profilePicture} />
			) : (
				<Avatar
					backgroundColor='transparent'
					color={themeMode ? 'black' : 'white'}
					border={`solid ${themeMode ? 'black' : 'white'} 1px`}
					name={comment.authorId.nickname[0]}
					className=' flex flex-col-reverse'
					size='xs'
				></Avatar>
			)}
			<div
				className={`flex flex-col ${comment.shouldReverse ? 'text-right' : 'text-left'}`}
			>
				<p className=' text-xs font-bold'>
					{comment.authorId.nickname}
				</p>
				<div
					className={`${themeMode ? `comment-content${comment.shouldReverse ? '-reverse' : ''}` : `comment-content-dark${comment.shouldReverse ? '-reverse' : ''}`} text-left w-fit
					 ${comment.shouldReverse ? '' : ''}`}
				>
					{comment.content || 'No Comment'}
				</div>

				{viewOnly || (
					<div
						className={`flex flex-row gap-2 md:mt-1.5 mt-2 ${comment.shouldReverse ? 'justify-end' : ''}`}
					>
						<div
							className={`${themeMode ? 'comment-reply-btn' : 'comment-reply-btn-dark'}`}
						>
							Like
						</div>
						<div
							onClick={() => {
								setCommentReply(comment);
								scrollToCommentsForm();
							}}
							className={`${themeMode ? 'comment-reply-btn' : 'comment-reply-btn-dark'}`}
						>
							Reply
						</div>
					</div>
				)}
				{!viewOnly && dataToRender.length > 0 && (<p className={`text-xs mt-2 ${themeMode ? '' : 'text-white'}`}>{dataToRender.length > 1 ? `${dataToRender.length} odpowiedzi` : '1 odpowiedź'}</p>)}
				{/* <p className={themeMode ? '' : 'text-white'}>{dataToRender.length > 1 ? `${dataToRender.length} odpowiedzi` : '1 odpowiedź'}</p> */}
				{/* {dataToRender && (
					<div className='flex-col -ml-1'>
						{dataToRender?.map((reply: CommentWithReplies) => (
							<Comment
								key={reply._id}
								comment={reply}

								setCommentReply={setCommentReply}
							/>
						))}
					</div>
				)} */}
			</div>
		</div>
	) : (
		<></>
	);
	//     <button onClick={() => setShowReplies(!showReplies)}>
	//         {showReplies ? 'Hide Replies' : 'Show Replies'}
	//     </button>
	//     <button onClick={() => addReply(comment.id)}>Reply</button>
	//     {showReplies && (
	//         <div>
	//             {replies.map((reply) => (
	//                 <Comment key={reply.id} comment={reply} addReply={addReply} />
	//             ))}
	//         </div>
	//     )}
	// </div>
};

const ReplyCommentModal: React.FC<{}> = () => {
	return <></>;
}

export default CommentForm;
