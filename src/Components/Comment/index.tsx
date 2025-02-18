import React, {
  useState,
  useEffect,
  useMemo,
  MouseEvent,
  useId,
  ReactNode,
  SetStateAction,
  useCallback,
  useRef,
} from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "./style.css";
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Portal,
  Spinner,
} from "@chakra-ui/react";
import Input from "../TextField/Input";
import { Link, useParams } from "react-router-dom";
import {
  PostModels,
  addCommentRequest,
  getPaginatedCommentsRequest,
  getTopCommentsRequest,
} from "../../Constant/api-requests";
import { useForm } from "react-hook-form";
import usePromiseBasedToast from "../Toast/Toast";
import useSWR from "swr";
import { mutate } from "swr";
import {
  ArticleToDisplay,
  Comment as CommentWithReplies,
  CommentsSection,
} from "../../Pages/Home/NewsContent/Carousel";
import { get, max, rest, set, throttle } from "lodash";
import { m } from "framer-motion";
import { JsxElement } from "typescript";
import DelayedComponent from "../_utility/DelayedComponent";
import { ActionButton } from "../Button";
import { DelayedLink } from "../_utility/DelayedLink";
// import useScrollToBottom from '../../hooks/useScrollToBottom';
import { comment } from "postcss";

// type CommentSection = {
// 	commentData: {id: string; img: string; comment: string}[];
// 	postModel: string;
// };

type CommentsSectionRemapped = {
  embeddedComments: (CommentWithReplies & { shouldReverse?: boolean })[];
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
const throttledProcessQueue = throttle(processQueue, 500); // Throttle to one call per 1 second

const throttledFetcher = (
  postModel: PostModels,
  id: string,
  pageNum: number,
  noComments?: boolean,
  parentCommentId?: string | null
): Promise<{ comments: CommentWithReplies[]; totalPages: number }> => {
  return new Promise((resolve, reject) => {
    queue.push(async () => {
      try {
        const { comments, totalPages } = await fetcher(
          true,
          postModel,
          id,
          pageNum,
          noComments,
          parentCommentId
        );
        resolve({ comments, totalPages });
      } catch (error) {
        reject(error);
      }
    });
    throttledProcessQueue();
  });
};

const numberToArray = (num: number) => {
  if (num < 1) {
    throw new Error("Number should be greater than or equal to 1");
  }
  return Array.from({ length: num }, (_, i) => i + 1);
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
    return { comments: [], totalPages: 0 };
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
  `comment/${postModel}/${id}${fetchPages ? `?page=${page}` : ""}${parentId ? `&parentId=${page}` : ""}`;

const scrollToCommentsStart = () =>
  document
    .getElementById("comments-title")
    ?.scrollIntoView({ block: "center", behavior: "smooth" });

const scrollToCommentsForm = () =>
  document
    .getElementById("comments-form")
    ?.scrollIntoView({ block: "center", behavior: "smooth" });

const useComments = (
  id: string,
  postModel: PostModels,
  fetchPages: boolean,
  hideFetchedPages = false,
  noComments = false,
  parentCommentId?: string
) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [commentsState, setCommentsState] = useState<CommentWithReplies[]>([]);

  const {
    data,
    isLoading,
    mutate: localMutate,
  } = useSWR(
    getKeys(fetchPages, postModel, id, page, parentCommentId),
    () => fetcher(fetchPages, postModel, id, page, noComments, parentCommentId),
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );
  const fetchedData: CommentWithReplies[] = fetchPages
    ? data?.comments
    : data?.embeddedComments;

  useEffect(() => {
    if (fetchedData) {
      setCommentsState((prevComments) => {
        const newComments = fetchedData.filter(
          (comment) =>
            !prevComments.some((prevComment) => prevComment._id === comment._id)
        );
        return page === 1 ? fetchedData : [...prevComments, ...newComments];
      });
    }
  }, [data]);

  const fetchMoreComments = () => {
    setPage((prev) => prev + 1);
  };

  const revalidateAllFetchedPages = async () => {
    if (page > 1) {
      const pages = Array.from(
        { length: Math.ceil(commentsState.length / 10) },
        (_, i) => i + 1
      );
      let maxPage: number = 1;
      const revalidatePromises = pages.map(async (pageNum) => {
        const response =
          (await mutate(
            getKeys(true, postModel, id, pageNum),
            async () => {
              const response = await throttledFetcher(postModel, id, pageNum);
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

  const optimisticUpdateWithRevalidation = (newComment: CommentWithReplies) => {
    setCommentsState((prev) => [...prev, newComment]);
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
  const { type, mode: themeMode } = useSelector(
    (state: RootState) => state.themeMode
  );

  const { isLoggedIn, user } = useSelector((state: RootState) => state.user);
  const { id } = useParams<{ id: string }>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ comment: string }>({
    defaultValues: {
      comment: "",
    },
    mode: "onChange",
  });
  const [commentRepliesHistory, setCommentRepliesHistory] = useState<
    CommentWithReplies[]
  >([]);
  const [replies, setReplies] = useState<CommentWithReplies[] | null>([]);
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
    revalidateComments,
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
  // const commentRepliesHistory = useMemo(() => {
  // 	if (commentIdToReply) {
  // 		return data?.find((comment) => comment._id === commentIdToReply);
  // 	}
  // }, [commentIdToReply]);

  // const {

  // 	optimisticUpdate: optimisticUpdateComments,
  // } = useComments(
  // 	`${commentRepliesHistory?._id}`,
  // 	PostModels.comment,
  // 	false,
  // 	true,
  // 	true
  // );
  const commentToReply =
    commentRepliesHistory?.[commentRepliesHistory.length - 1];
  const refreshAllPagesOfRelies = async () => {
    const repliesPages = Math.ceil(Number(replies?.length) / 10);

    const pages = Array.from({ length: repliesPages }, (_, i) => i + 1);
    let maxPage: number = 1;
    const revalidatePromises = pages.map(async (pageNum) => {
      const response =
        (await mutate(
          `comment/replies/${commentToReply?._id}?page=${pageNum}`,
          async () => {
            const response = await throttledFetcher(
              postModel,
              `${id}`,
              pageNum,
              false,
              commentToReply?._id
            );
            maxPage = response?.totalPages ?? 1;
            return response?.comments ?? [];
          },
          false
        )) ?? [];

      return response;
    });
    const allComments = (await Promise.all(revalidatePromises)).flat();
    setReplies(allComments);
  };

  const handleComment = async (commentData: { comment: string }) => {
    const requestsData = {
      entityModel: postModel,
      postId: `${id}`,
      content: commentData.comment,
    };
    const optimisticData = {
      _id: gen_Id,
      entityId: `${id}`,
      authorId: {
        nickname: "Ty",
        _id: gen_Id,
        profilePicture: user?.avatar ?? "",
      },
    };
    if (commentToReply) {
      const replyRequestsData = {
        ...requestsData,
        postId: `${id}`,
        parentCommentId: commentToReply?._id,
      };
      const replyOptimisticData = {
        ...replyRequestsData,
        ...optimisticData,
      };
      await addCommentRequest(replyRequestsData);
      if (commentRepliesHistory.length === 1) {
        revalidateComments();
      }
      setReplies((prev) => {
        if (!prev) {
          return [replyOptimisticData];
        }
        const repliesPages = Math.ceil(Number(prev?.length + 1) / 10);
        if (repliesPages === 1) {
          mutate(`comment/replies/${commentToReply?._id}?page=1`);
        } else {
          refreshAllPagesOfRelies();
        }
        return [...prev, replyOptimisticData];
      });
      // const repliesPages = Math.ceil(Number(replies?.length) / 10);
      // if (repliesPages === 1) {
      // 	mutate(`comment/replies/${commentToReply?._id}?page=1`);
      // } else {
      // 	refreshAllPagesOfRelies();
      // }
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
          nickname: "Ty",
          _id: gen_Id,
          profilePicture: user?.avatar ?? "",
        },
      });
    }
    reset();
    if (shouldDisplayFetchButton) {
      setPaginatedComments(true);
    }
    revalidateComments();
  };

  // const handleReply = (parentId: string) => {
  // 	setCommentIdToReply(parentId);
  // };

  const { wrappedSubmit } = usePromiseBasedToast({
    handleSubmit,
    onSubmit: handleComment,
    toastMessages: {
      success: { title: "Sukces", description: "Komentarz dodany!" },
      error: {
        title: "musisz się najpierw zalogować",
        description: "Nie udało się dodać komentarza!",
      },
      loading: { title: "Wysyłanie", description: "Poczekaj chwilę..." },
    },
  });

  const remapEmbeddedComments = useMemo(
    () => (comments: CommentsSection["embeddedComments"]) => {
      if (!commentData && !paginatedComments && data) {
        setPaginatedComments(true);

        return;
      }

      return comments?.flatMap((comment, idx) => {
        const authorNickname =
          comment.authorId._id === `${user?._id}`
            ? "Ty"
            : comment.authorId.nickname;

        return {
          ...comment,

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
    paginatedComments && data.length <= 10
      ? data
      : remapEmbeddedComments(data) ?? commentData?.embeddedComments;

  return (
    <>
      <div className={`w-full h-auto mt-10`} >
        <div className="flex justify-between items-center mb-8 mt-6">
          <h2
            className="text-2xl font-bold"
            style={{ color: themeMode ? "black" : "#fff" }}>
            Comments
          </h2>
          <button
            className="font-semibold"
            style={{ color: themeMode ? "#5A1073" : "#3BD6C6" }}>
            View All Comments
          </button>
        </div>
        <div className="mb-12 flex flex-col">
          {dataToRender?.map((item, idx) => {
            return (
              <Comment
                key={item._id}
                comment={item}
                setCommentRepliesHistory={setCommentRepliesHistory}
                inModal={!item._id}
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
                variant={"outline"}
                onClick={handleFetchingMoreComments}
                className={`${themeMode ? "view-all-btn" : "view-all-btn-dark"} text-right`}
                style={{ fontSize: type ? "14px" : "16px" }}>
                Wczytaj starsze komentarze
              </Button>
            )}
            {Number(dataToRender?.length) === 0 ? (
              <p className={`${themeMode || "text-white"}`}>
                Zostań pierwszą osobą komentującą!
              </p>
            ) : (
              paginatedComments &&
              maxPages > 3 && (
                <Button
                  variant={"ghost"}
                  onClick={handleHidingComments}
                  className={`${themeMode ? "view-all-btn" : "view-all-btn-dark"} text-right`}
                  style={{ fontSize: type ? "14px" : "16px" }}>
                  {hideComments
                    ? "Pokaż starsze komentarze"
                    : "Ukryj starsze komentarze"}
                </Button>
              )
            )}
          </>
        )}
        <div className="mt-4">
          <ReplyCommentModal
            isOpen={Boolean(commentToReply)}
            onClose={() =>
              setCommentRepliesHistory((prev) => {
                const newComments = prev?.filter(
                  (comment) => comment._id !== commentToReply?._id
                );
                return newComments;
              })
            }
            type={type}
            setCommentRepliesHistory={setCommentRepliesHistory}
            commentToReply={commentToReply}>
            {commentToReply && (
              <Comment
                comment={commentToReply}
                setCommentRepliesHistory={setCommentRepliesHistory}
                replies={replies}
                setReplies={setReplies}
                inModal
              />
            )}

            {/* rafa Dodaj swój komentarz */}
            {Boolean(commentToReply) && (
              <form onSubmit={wrappedSubmit}>
                <div
                  className={`overflow-hidden  px-5 pb-5  bottom-0 ${type ? "w-full" : "w-[360px]"}`}>
                  <Input
                    register={register}
                    label={
                      commentToReply
                        ? `Odpowiadasz ${commentToReply?.authorId.nickname === user?.nickname ? "sobie" : commentToReply?.authorId.nickname}`
                        : "Comment"
                    }
                    placeholder={
                      isLoggedIn
                        ? "Napisz coś od siebie..."
                        : "Zaloguj się aby dodać komentarz"
                    }
                    name="comment"
                    disabled={!isLoggedIn}
                    height={isLoggedIn ? "150px" : ""}
                    error={errors.comment?.message}
                  />
                  <div className="flex flex-row-reverse justify-between">
                    {isLoggedIn ? (
                      <ActionButton type="submit">
                        {commentRepliesHistory
                          ? "Odpowiedz"
                          : "Dodaj komentarz"}
                      </ActionButton>
                    ) : (
                      <Link state={window.location.pathname} to="/login">
                        <ActionButton type="button">
                          Zaloguj się lub załóż konto
                        </ActionButton>
                      </Link>
                    )}
                    {commentToReply && (
                      <ActionButton
                        reverted
                        onClick={() =>
                          setTimeout(() => {
                            setCommentRepliesHistory((prev) => {
                              const newComments = prev?.filter(
                                (comment) => comment._id !== commentToReply?._id
                              );
                              return newComments;
                            });
                          }, 300)
                        }
                        type="button">
                        {commentRepliesHistory.length > 1 || !isLoggedIn
                          ? "Cofnij"
                          : "Dodaj swój komentarz"}
                      </ActionButton>
                    )}
                  </div>
                </div>
              </form>
            )}
          </ReplyCommentModal>
          <>
            {commentRepliesHistory.length > 0 || (
              <form onSubmit={wrappedSubmit}>
                <div className="mt-12">
                  <h3
                    className="text-lg font-semibold mb-4"
                    style={{ color: themeMode ? "black" : "#fff" }}>
                    Add Comment
                  </h3>
                  {/* Input Fields */}
                  <div className="space-y-4">
                    <div className="lg:flex gap-6">
                      <div className="w-full space-y-3">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium"
                          style={{ color: themeMode ? "black" : "#fff" }}>
                          Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your name"
                          className="w-full p-3 rounded-md text-sm focus:outline-none"
                          style={{
                            backgroundColor: themeMode ? "#F5F5F5" : "#242526",
                            color: themeMode ? "#333" : "#FFF",
                          }}
                        />
                        <label
                          htmlFor="website"
                          className="block text-sm font-medium"
                          style={{ color: themeMode ? "black" : "#fff" }}>
                          Website
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your website"
                          className="w-full p-3 rounded-md text-sm focus:outline-none"
                          style={{
                            backgroundColor: themeMode ? "#F5F5F5" : "#242526",
                            color: themeMode ? "#333" : "#FFF",
                          }}
                        />
                        <label
                          htmlFor="Email"
                          className="block text-sm font-medium"
                          style={{ color: themeMode ? "black" : "#fff" }}>
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="w-full p-3 rounded-md text-sm focus:outline-none"
                          style={{
                            backgroundColor: themeMode ? "#F5F5F5" : "#242526",
                            color: themeMode ? "#333" : "#FFF",
                          }}
                        />
                      </div>
                      <div className="w-full">
                        <Input
                          register={register}
                          label={
                            commentToReply
                              ? `Odpowiadasz ${commentToReply?.authorId.nickname === user?.nickname ? "sobie" : commentToReply?.authorId.nickname}`
                              : "Comment"
                          }
                          placeholder={
                            isLoggedIn
                              ? "Napisz coś od siebie..."
                              : "Zaloguj się aby dodać komentarz"
                          }
                          name="comment"
                          disabled={!isLoggedIn}
                          height={isLoggedIn ? "213px" : ""}
                          error={errors.comment?.message}
                        />
                      </div>
                    </div>
                    {isLoggedIn ? (
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-md font-medium text-sm"
                        style={{
                          backgroundColor: themeMode ? "#5A1073" : "#3BD6C6",
                          color: "#FFF",
                        }}>
                        Post Comment
                      </button>
                    ) : (
                      <div className="w-full flex justify-end">
                        <DelayedLink
                          state={`${window.location.pathname}/${commentToReply?._id}`}
                          to="/login">
                          <ActionButton type="button">
                            Zaloguj się lub załóż konto
                          </ActionButton>
                        </DelayedLink>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            )}
          </>
        </div>
      </div>
    </>
  );
};

const useReplies = (
  commentModel: PostModels,
  commentId: string,
  parentId: string,
  replyPage: number
) => {
  const [replies, setReplies] = useState<CommentWithReplies[]>([]);
  const [paginatedComments, setPaginatedComments] = useState<boolean>(false);
  const [hideReplies, setHideReplies] = useState<boolean>(false);
  const [numberOfReplies, setNumberOfReplies] = useState<number>(0);
  const [repliesPage, setRepliesPage] = useState(1);

  const { data } = useSWR(
    `comment/replies/${parentId}?page=${replyPage}`,
    async () =>
      await getPaginatedCommentsRequest({
        entityModel: commentModel,
        postId: commentId,
        page: repliesPage,
        pageSize: 10,
      }),
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  useEffect(() => {
    if (data) {
      setReplies((prev) => {
        if (prev?.length === 0) {
          return [...data.comments];
        }
        if (prev?.[prev.length - 1]._id === data.comments[0]._id) {
          return prev;
        }
        return [...prev, ...data.comments];
      });
      setNumberOfReplies(data.totalComments);
    }
  }, [data]);

  const fetchMoreReplies = () => {
    setRepliesPage((prev) => prev + 1);
  };

  const handleHidingReplies = () => {
    setHideReplies((prev) => !prev);
  };

  return {
    replies,
    numberOfReplies,
    handleHidingReplies,
    fetchMoreReplies,
  };
};

const Comment: React.FC<{
  comment: CommentWithReplies;
  setCommentRepliesHistory: React.Dispatch<
    React.SetStateAction<CommentWithReplies[]>
  >;
  replies?: CommentWithReplies[] | null;
  setReplies?: React.Dispatch<SetStateAction<CommentWithReplies[] | null>>;
  inModal?: boolean;
}> = ({ comment, setCommentRepliesHistory, replies, setReplies, inModal }) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [showReplies, setShowReplies] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);

  const [paginatedComments, setPaginatedComments] = useState<boolean>(false);
  const [hideReplies, setHideReplies] = useState<boolean>(false);
  const [numberOfReplies, setNumberOfReplies] = useState<number>(0);
  const noReplies =
    comment.repliesIds?.length === 0 ||
    replies?.length === 0 ||
    comment.authorId.nickname === "Ty";
  const [repliesPage, setRepliesPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);

  const { data, isLoading } = useSWR(
    `comment/replies/${comment._id}?page=${repliesPage}`,
    noReplies
      ? null
      : async () =>
          await getPaginatedCommentsRequest({
            entityModel: comment.entityModel,
            postId: comment.entityId,
            page: repliesPage,
            pageSize: 10,
            parentCommentId: comment._id,
          }),
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  useEffect(() => {
    if (data?.comments) {
      if (data.currentPage > 1 && data.comments.length === 0) {
        setRepliesPage(1);
      }
      // handles case if user falls back to previous comment
      // if (
      // 	replies?.[0]?.parentCommentId !==
      // 	data.comments?.[0]?.parentCommentId
      // ) {
      // 	setRepliesPage(1);
      // }

      setReplies?.((prevReplies) => {
        if (!prevReplies) {
          return data.comments;
        }

        const newComments = data?.comments?.filter(
          (comment: CommentWithReplies) =>
            !prevReplies?.some((prevReply) => prevReply._id === comment._id)
        );
        return repliesPage === 1
          ? data.comments
          : [...prevReplies, ...newComments];
      });

      setNumberOfReplies(data.totalComments);
      setMaxPages((prev) => {
        if (data.totalPages > prev) {
          return data.totalPages;
        }
        return prev;
      });
    } else {
      if (comment.repliesIds?.length === 0) setReplies?.(null);
    }
  }, [data, comment._id]);

  const fetchMoreReplies = () => {
    if (repliesPage < maxPages) {
      setRepliesPage((prev) => prev + 1);
    }
  };

  const remapEmbeddedComments = useMemo(
    () => (comments: CommentsSection["embeddedComments"]) => {
      if (!comment && !paginatedComments && data) {
        setPaginatedComments(true);

        return;
      }
      let shouldReverse = false;
      return comments?.flatMap((comment, idx) => {
        const prevHasDifferentAuthor =
          idx > 0 && comments[idx - 1]?.authorId._id !== comment.authorId._id;

        if (prevHasDifferentAuthor) {
          shouldReverse = true;
        }

        const authorNickname =
          comment.authorId._id === `${user?._id}`
            ? "Ty"
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

  return comment ? (
    <div
      key={comment._id}
      className={`flex gap-x-1 ${inModal ? "" : "mt-3"} ${comment.shouldReverse ? "flex-row-reverse" : ""} md:gap-3 ${comment.shouldReverse && "justify-start"} ${inModal ? "px-4 pb-4" : ""}`}>
      {comment.authorId.profilePicture ? (
        <Avatar src={comment.authorId.profilePicture} />
      ) : (
        <Avatar
          backgroundColor="transparent"
          color={themeMode ? "black" : "white"}
          border={`solid ${themeMode ? "black" : "white"} 1px`}
          name={comment.authorId.nickname[0]}
          className=" flex flex-col-reverse"
          size="sm"></Avatar>
      )}
      <div
        className={`flex flex-col gap-2 ${comment.shouldReverse ? "text-right" : "text-left"}`}>
        <p className={`${themeMode || "text-white"} text-sm font-bold`}>
          {comment.authorId.nickname}
        </p>
        <div
          className="p-4 rounded-lg w-full"
          style={{
            backgroundColor: themeMode ? "#F5F5F5" : "#242526",
            color: themeMode ? "#333" : "#FFF",
          }}>
          <p className="text-lg">{comment.content || "No Comment"}</p>
        </div>

        {/* <div
					className={`${themeMode ? `comment-content${comment.shouldReverse ? '-reverse' : ''}` : `comment-content-dark${comment.shouldReverse ? '-reverse' : ''}`} text-left w-fit
					 ${comment.shouldReverse ? '' : ''}`}
				>
					{comment.content || 'No Comment'}
				</div> */}

        {comment.authorId.nickname === "Ty" || (
          <div
            className={`flex flex-row gap-2 md:mt-1.5 mt-2 ${comment.shouldReverse ? "justify-end" : ""}`}>
            {/* <div
						className={`${themeMode ? 'comment-reply-btn' : 'comment-reply-btn-dark'}`}
					>
						Polub
					</div> */}
            <button
              className="font-medium"
              style={{
                color: themeMode ? "#5A1073" : "#3BD6C6",
              }}>
              Like
            </button>
            <div>
              <button
                onClick={() => {
                  setReplies?.([]);
                  setCommentRepliesHistory((prev) => {
                    if (prev?.length === 0) {
                      return [comment];
                    }
                    if (prev?.[prev.length - 1]._id === comment._id) {
                      return prev;
                    }
                    return [...prev, comment];
                  });

                  scrollToCommentsForm();
                }}
                className="font-medium"
                style={{
                  color: themeMode ? "#5A1073" : "#3BD6C6",
                }}>
                Reply
              </button>
            </div>
          </div>
        )}

        {!inModal &&
          (dataToRender.length || Number(comment.repliesIds?.length)) > 0 && (
            <p
              className={`text-xs mt-2 ${themeMode ? "" : "text-white"} select-none`}>
              {(dataToRender.length || Number(comment?.repliesIds?.length)) > 1
                ? `${Number(comment?.repliesIds?.length ?? numberOfReplies)} odpowiedzi`
                : "1 odpowiedź"}
            </p>
          )}
        {/* <p className={themeMode ? '' : 'text-white'}>{dataToRender.length > 1 ? `${dataToRender.length} odpowiedzi` : '1 odpowiedź'}</p> */}
        {inModal && dataToRender.length > 0 && (
          <div className="flex-col -ml-1">
            {dataToRender?.map((reply: CommentWithReplies) => {
              return (
                reply._id !== comment._id && (
                  <Comment
                    key={reply._id}
                    comment={reply}
                    setCommentRepliesHistory={setCommentRepliesHistory}
                  />
                )
              );
            })}
          </div>
        )}
        {isLoading ? (
          <Spinner />
        ) : (
          maxPages > repliesPage &&
          inModal && (
            <div className="flex w-[320px] justify-end mt-2 pr-9">
              <ActionButton
                reverted
                onClick={() => {
                  setTimeout(() => {
                    fetchMoreReplies();
                  }, 300);
                }}>
                Wczytaj więcej
              </ActionButton>
            </div>
          )
        )}
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

const ReplyCommentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  commentToReply?: CommentWithReplies;
  setCommentRepliesHistory: React.Dispatch<
    React.SetStateAction<CommentWithReplies[]>
  >;
  type?: boolean;
}> = ({
  isOpen,
  onClose,
  children,
  commentToReply,
  setCommentRepliesHistory,
  type,
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  // const commentToReply = commentRepliesHistory?.[commentRepliesHistory.length - 1];
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScrollToBottom = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const checkIfAtBottom = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      // bc max height of container is 55% of window height
      const scrollable = container.scrollHeight > window.innerHeight - 320;

      if (!scrollable) {
        setIsAtBottom(true);
      } else {
        const isBottom =
          Math.abs(
            container.scrollHeight -
              container.scrollTop -
              container.clientHeight
          ) < 1;
        setIsAtBottom(isBottom);
      }
    }
  }, [children]);

  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        const container = containerRef.current;
        if (container) {
          const handleScroll = () => checkIfAtBottom();
          container.addEventListener("scroll", handleScroll, {
            passive: true,
          });

          // Ensure check runs immediately
          checkIfAtBottom();

          return () => {
            container.removeEventListener("scroll", handleScroll);
          };
        }
      }, 100); // Adjust timeout as necessary

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, children]);

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay bgColor={themeMode ? "white" : "#111217"} />
      <ModalContent
        marginTop={"90px"}
        fontFamily="Urbanist"
        backgroundColor={"transparent"}>
        <ModalBody
          ref={containerRef}
          style={{
            overflowY: "scroll",
            padding: "0",
            maxHeight: type ? "calc(100% - 320px)" : "calc(100% - 380px)",
          }}
          className={`fixed block w-full overflow-y-scroll h-full ${type ? "" : "mt-16"} scrollbar`}>
          {!isAtBottom ? (
            <button
              style={{
                zIndex: 17000,
                position: "fixed",
                bottom: 200,
                marginLeft: "320px",
                height: "50px",
                width: "50px",
              }}
              type="button"
              onClick={handleScrollToBottom}>
              <div className="flex cursor-pointer animate-bounce hover:animate-none w-fit justify-end mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  fill="none">
                  <path
                    d="M22.6668 14L14.5002 22.1667L6.3335 14"
                    stroke="#F1F4F9"
                    strokeWidth="3.29412"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
          ) : null}
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CommentForm;
