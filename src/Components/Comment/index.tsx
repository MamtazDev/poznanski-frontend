import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../reducers';
import './style.css';
import {Avatar, Button} from '@chakra-ui/react';
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
import {
	ArticleToDisplay,
	CommentsSection,
} from '../../Pages/Home/NewsContent/Carousel';
import { max } from 'lodash';

// type CommentSection = {
// 	commentData: {id: string; img: string; comment: string}[];
// 	postModel: string;
// };

interface CommentSectionProps {
	commentData: CommentsSection['embeddedComments'] | null;
	postModel: PostModels;
}

const fetcher = async (
	fetchPages: boolean,
	postModel: PostModels,
	id: string,
	page: number
) =>
	fetchPages
		? await getPaginatedCommentsRequest({
				entityModel: postModel,
				postId: `${id}`,
				page,
				pageSize: 10,
			})
		: await getTopCommentsRequest({
				entityModel: postModel,
				postId: `${id}`,
			});

const getKeys = (
	fetchPages: boolean,
	postModel: PostModels,
	id: string,
	page: number
) => `comment/${postModel}/${id}${fetchPages ? `?page=${page}` : ''}`;

const useComments = (
	id: string,
	postModel: PostModels,
	fetchPages: boolean
) => {
	const [page, setPage] = useState<number>(1);
  const [allPagesFetched, setAllPagesFetched] = useState<boolean>(false);
	const {data, isLoading, mutate} = useSWR<
		Partial<
			CommentsSection & {
				comments: CommentsSection['embeddedComments'];
				page: number;
				totalPages: number;
        totalComments: number;
			}
		>
	>(getKeys(fetchPages, postModel, id, page), () =>
		fetcher(fetchPages, postModel, id, page)
	);
	const fetchMoreComments = () => {
    if(Number(data?.page) < Number(data?.totalPages)) {


		setPage((prev) => prev + 1);
    } else {
      setAllPagesFetched(true);
    }

	};

	return {data, isLoading, fetchMoreComments, maxComments: data?.totalComments};
};

const Comment: React.FC<CommentSectionProps> = ({commentData, postModel}) => {
	const themeMode = useSelector((state: RootState) => state.themeMode.mode);
	const type = useSelector((state: RootState) => state.themeMode.type);

	const {isLoggedIn} = useSelector((state: RootState) => state.user);
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
	const [paginatedComments, setPaginatedComments] = useState<boolean>(false);

	const {data, isLoading, fetchMoreComments, maxComments} = useComments(
		`${id}`,
		postModel,
		paginatedComments
	);
	const handleFetchingMoreComments = () => {
		setPaginatedComments(true);
		if (paginatedComments) {

			if (Number(data?.page) === Number(data?.totalPages)) return;
			fetchMoreComments();
		}
	};
	// const {data, isLoading, mutate} = useSWR<CommentsSection>(
	// 	`comment/${postModel}/${id}`,
	// 	async () =>
	// 		await getTopCommentsRequest({
	// 			entityModel: postModel,
	// 			postId: `${id}`,
	// 		})
	// );

	console.log(data);

	const handleComment = async (data: {comment: string}) => {
		await addCommentRequest({
			entityModel: 'News',
			postId: `${id}`,
			content: data.comment,
		});
		reset();
	};
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

	return (
		<>
			<div className={`w-full h-auto mt-10`}>
				<div className={`${themeMode ? '' : ''} flex justify-between`}>
					<div
						className={`${themeMode ? 'comment-title' : 'comment-title-dark'} text-left`}
						style={{fontSize: type ? '18px' : '20px'}}
					>
						Komentarze
					</div>
					{/* <div
						className={`${themeMode ? 'view-all-btn' : 'view-all-btn-dark'} text-left`}
						style={{fontSize: type ? '14px' : '16px'}}
					>
						View All Comments
					</div> */}
				</div>
				<div className='mb-12 flex flex-col'>
					{(
						(paginatedComments
							? data?.comments
							: data?.embeddedComments) ?? commentData
					)?.map((item, idx) => {
						const isNotEven = idx % 2 !== 0;
						return (
							<div
								className={`flex gap-2 ${isNotEven ? 'flex-row-reverse' : ''} mt-6 md:gap-3 ${isNotEven && 'justify-start'}`}
							>
								{item.authorId.profilePicture ? (
									<Avatar
										src={item.authorId.profilePicture}
									/>
								) : (
									<Avatar className=' flex flex-col-reverse'>
										{item.authorId.nickname[0]}
									</Avatar>
								)}
								<div
									className={`flex flex-col ${isNotEven ? 'text-right' : 'text-left'}`}
								>
									<p>{item.authorId.nickname}</p>
									<div
										className={`${themeMode ? `comment-content${isNotEven ? '-reverse' : ''}` : `comment-content-dark${isNotEven ? '-reverse' : ''}`} text-left w-full ${isNotEven ? '' : ''}`}
									>
										{item.content || 'No Comment'}
									</div>
									<div className='flex gap-3 md:mt-1.5 mt-2'>
										<div
											className={`${themeMode ? 'comment-reply-btn' : 'comment-reply-btn-dark'}`}
										>
											Like
										</div>
										<div
											className={`${themeMode ? 'comment-reply-btn' : 'comment-reply-btn-dark'}`}
										>
											Reply
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
				{((data?.commentsIds?.length ?? 0) > (data?.comments?.length ?? 0) ) && <Button
					onClick={handleFetchingMoreComments}
					className={`${themeMode ? 'view-all-btn' : 'view-all-btn-dark'} text-right`}
					style={{fontSize: type ? '14px' : '16px'}}
				>
					Wczytaj starsze komentarze
				</Button>}
				{/* {commentData &&
					(data?.embeddComments ?? commentData).map((item, idx) => (
						<div className={`flex md:gap-3 gap-2`}>
							<Avatar src={item.img} />
							<div className='flex flex-col'>
								<div
									className={`${themeMode ? 'comment-content' : 'comment-content-dark'} text-left w-full`}
								>
									{item.comment || 'No Comment'}
								</div>
								<div className='flex gap-3 md:mt-1.5 mt-2'>
									<div
										className={`${themeMode ? 'comment-reply-btn' : 'comment-reply-btn-dark'}`}
									>
										Like
									</div>
									<div
										className={`${themeMode ? 'comment-reply-btn' : 'comment-reply-btn-dark'}`}
									>
										Reply
									</div>
								</div>
							</div>
						</div>
					))} */}
				<div className='mt-4'>
					<form onSubmit={wrappedSubmit}>
						<Input
							register={register}
							label='Dodaj swój komentarz'
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
							<Button
								type='submit'
								className='float-right'
								colorScheme={
									themeMode ? 'blackAlpha' : 'whiteAlpha'
								}
							>
								Skomentuj
							</Button>
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

export default Comment;
