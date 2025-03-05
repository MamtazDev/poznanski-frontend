import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import BreadCrumb from '../../Components/BreadCrumb';
import { ActionButton } from '../../Components/Button';
import ContentTitle from '../../Components/ContentTitle';
import CrudBtn from '../../Components/CrudBtn';
import { FileResizer } from '../../Components/ImageFileResizer/ImageFileResizer';
import Layout from '../../Components/Layout';
import Input from '../../Components/TextField/Input';
import useTags from '../../Components/TextField/Select';
import TipTap, { FileFromEditor } from '../../Components/TipTap/TipTap';
import usePromiseBasedToast from '../../Components/Toast/Toast';
import {
  createArticleByUserRequest
} from '../../Constant/api-requests';
import FolderIcon from '../../assets/png/folder_icon.png';
import { RootState } from '../../reducers';
import './style.css';

export type SubmitArticleForm = {
	email: string;
	title: string;
	intro: string;
	nickname: string;
};

type MainImgData = {
	url: string;
	file: File;
};

interface SubmitPageProps {
	themeMode: boolean;
	type: boolean;
}

const SubmitPage: React.FC<SubmitPageProps> = ({themeMode, type}) => {
	const [files, setFiles] = useState<FileFromEditor[] | null>(null);
	const [article, setArticle] = useState<string>('');
	const [imgData, setImgData] = useState<MainImgData | null>(null);
	const [tags, setTags] = useState<string[]>([]);
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const AddTags = useTags('Dodaj tagi', setTags, tags, themeMode, type);
	const {isLoggedIn} = useSelector((state: RootState) => state.user);
	const { register, handleSubmit, formState: {errors}, reset } = useForm<SubmitArticleForm>({ defaultValues: {email: '', title: '', intro: ''}, mode: 'all', });

	const resetArticle = () => {
		reset({
			email: '',
			title: '',
			intro: '',
			nickname: '',
		});
		setArticle('');
		setImgData(null);
		setFiles(null);
	}

	const description =	'Dodaj swojego newsa lub pomysł na niego, zostań częścią poznańskiego rapu!';

	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	// const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	const file = e.target.files?.[0];
	// 	if (file) {
	// 		setImgData({url: URL.createObjectURL(file), file: file});
	// 	}
	// };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('image', file);

      try {
        // Upload the image to the API
        const response = await fetch('http://localhost:8000/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Image upload failed');
        }

        const data = await response.json();
        const uploadedImageUrl = data.fileUrl;

        setImgData({ url: uploadedImageUrl, file });

      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

	const handleDelete = () => {
		setImgData((prev) => {
			if (!prev) {
				return null;
			}
			if (prev.file) {
				setImgData(null);
				return null;
			} else {
				return prev;
			}
		});
	};

  const handleSubmitRequest = async (data: SubmitArticleForm) => {
    try {
      const payload = {
        ...data,
        content: article,
        tags: tags.join(","),
        images: files ? files.map(file => file.url) : [],
      };

      await createArticleByUserRequest(payload);
      resetArticle();
    } catch (error) {
      console.error(error);
    }
  };

	// const onSubmit = async (data: SubmitArticleForm) => {

	// 	if (!imgData) {
	// 		throw Error('Dodaj zdjęcie');
	// 	}
	// 	if (article.length < 200) {
	// 		throw Error('Artykuł jest zbyt krótki');
	// 	} else if (article.length > 20000) {
	// 		throw Error('Artykuł jest zbyt długi');
	// 	}
	// 	if (imgData) {
	// 		const {file} = imgData;
	// 		const {name} = file;
	// 		const compressedFile = await FileResizer(file);
	// 		const form = new FormData();
	// 		if (compressedFile) {
	// 			const mainImg = {
	// 				name,
	// 				size: compressedFile?.size,
	// 				url: '',
	// 				file: new Blob([compressedFile], {
	// 					type: compressedFile.type,
	// 				}),
	// 			};
	// 			const stringOfTags = '#' + tags.join('#');
	// 			const images = files ? [mainImg, ...files] : [mainImg];

	// 			images.forEach((image, i) => {
	// 				const {file, ...fileDetails} = image;
	// 				form.append(
	// 					`files`,
	// 					file,
	// 					`${data.email} ${fileDetails.name}`
	// 				);
	// 			});
	// 			const articleData = {
	// 				// ...data,
  //         title: "ashiqur rahman",
	// 				// content: article,
	// 				content: "article",
	// 				tags: stringOfTags,
	// 			};
	// 			Object.entries(articleData).forEach(([key, value]) => {
	// 				form.append(key, value);
	// 			});
	// 			await handleSubmitRequest(form);
	// 		} else {
	// 			throw Error('Nie udało się skompresować głównego zdjęcia');
	// 		}
	// 	}
	// };

  const onSubmit = async (data: SubmitArticleForm) => {
    if (!imgData) {
      throw Error('Dodaj zdjęcie');
    }
    if (article.length < 200) {
        throw Error('Artykuł jest zbyt krótki');
    } else if (article.length > 20000) {
        throw Error('Artykuł jest zbyt długi');
    }

    if (imgData) {
        const { file } = imgData;
        const compressedFile = await FileResizer(file);

        if (compressedFile) {
            const payload = {
                email: "rafa.opediatech@gmail.com",
                title: data.title,
                intro: data.intro,
                nickname: data.nickname,
                content: article,
                tags: tags,
                files: [imgData.url],
            };

            await handleSubmitRequest(payload);
        } else {
            throw Error('Nie udało się skompresować głównego zdjęcia');
        }
    }
};

	const {wrappedSubmit} = usePromiseBasedToast({
		handleSubmit,
		onSubmit,
		toastMessages: {
			success: {
				title: `Twój news został wysłany!`,
				description: `Teraz ${isLoggedIn ? 'zajmie się nim' : 'go potwierdź, aby mogła zająć się nim'} nasza redakcja`,
			},
			error: {
				title: 'Wysłanie newsa nie powiodło się',
			},
			loading: {title: 'Wysyłanie newsa', description: 'Proszę czekać...'},
		},
	});

	return (
		<div>
			<Layout themeMode={themeMode} type={type}>
				<div className='flex justify-center'>
					<div className='container'>
						<div className='md:mt-12 mt-8'>
							<BreadCrumb />
						</div>

						<div className='md:mt-7 mt-10'>
							<ContentTitle
								titleType='NEWS'
								title='Dodaj swój content'
							/>
						</div>

						<div className={`md:mt-4 mt-2 ${themeMode ? 'submit-description-text' : 'submit-description-text-dark'}`}>
							{description}
						</div>

						<form onSubmit={handleSubmit(() => wrappedSubmit())}>
							<div className='flex flex-col md:flex-row md:mt-12 mt-6 gap-4'>
								<div className='flex flex-col md:w-8/12 lg:w-9/12 w-full mb-2'>
									<div className='flex flex-col md:flex-row md:gap-6'>
										<div className='flex w-full justify-start'>
											<Input
												label='Tytuł'
												name='title'
												type={type}
												register={register}
												error={errors.title?.message}
											/>
										</div>
									</div>

									<div className='flex w-full justify-start'>
										<Input
											height='120px'
											label='Wstęp'
											name='intro'
											type={type}
											register={register}
											error={errors.intro?.message}
										/>
									</div>

									<div>
										<TipTap
											themeMode={themeMode}
											type={type}
											setArticle={setArticle}
											setFiles={setFiles}
										/>
									</div>
								</div>
								<div className='flex flex-col gap-2 md:w-4/12 lg:w-3/12 w-full h-auto'>
									<div>
										<label
											className={`block label-text text-left ${themeMode ? 'text-gray-900' : 'text-white'} `}
											style={{
												fontSize: type
													? '14px'
													: '18px',
											}}
										>
											Dodaj okładkę artykułu
										</label>
									</div>

									<div
										className={`overflow-hidden ${themeMode ? 'image-upload-field-light' : 'image-upload-field-dark'}  w-full h-full`}
										style={{
											height: type ? '151px' : '420px',
										}}
									>
										{!imgData ? (
											<div className='flex items-center justify-center h-full'>
												<div className='flex flex-col gap-2'>
													<div className='flex justify-center'>
														<img
															src={FolderIcon}
															alt='no data'
														/>
													</div>
													<div
														className={`${themeMode ? 'image-put-text-light' : 'image-put-text-dark'} lowercase`}
													>
														Upuść zdjęcie tutaj lub
														kliknij, aby wybrać
													</div>
													<div>
														<input
															type='file'
															accept='image/*'
															onChange={
																handleImageChange
															}
															ref={fileInputRef}
															style={{
																display: 'none',
															}}
														/>
														<button
															type='button'
															className={`img-select-btn ${themeMode ? 'img-btn-light' : 'img-btn-dark'} cursor-pointer`}
															onClick={
																handleButtonClick
															}
														>
															+ Dodaj zdjęcie
														</button>
													</div>
												</div>
											</div>
										) : (
											<div className='flex justify-center items-center w-full h-full relative'>
												<img
													src={imgData.url}
													onLoad={() =>
														URL.revokeObjectURL(
															imgData.url
														)
													}
													alt=''
													className='h-full w-full object-cover'
												/>
												<div
													className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}>
													<input
														type='file'
														accept='image/JPEG, image/PNG, image/GIF'
														onChange={
															handleImageChange
														}
														ref={fileInputRef}
														style={{
															display: 'none',
														}}
													/>
													<div
														className={`rounded-lg opacity-70 ${themeMode ? 'image-upload-light-back' : 'image-upload-dark-back'}`}
													>
														<CrudBtn
															value=''
															onClickDelete={
																handleDelete
															}
															onClickEdit={
																handleButtonClick
															}
														/>
													</div>
												</div>
											</div>
										)}
									</div>

									<div className={`h-full flex flex-col space-y-3 mt-5`}>
										{AddTags}
										{/* <Select
											label='Dodaj tagi'
											data={hashtagsMockUp}
											type={type}
										/> */}

										<div
											className={`flex flex-col ${!type ? 'mt-6' : 'mb-4  w-full'}`}
										>
											{isLoggedIn || <><Input
												label='Twój email'
												name='email'
												type={type}
												register={register}
												error={errors.email?.message}
											/>

											<Input
												label='Twoja ksywa'
												name='nickname'
												type={type}
												register={register}
												error={errors.nickname?.message}
											/></>}
											<div>
												<ActionButton
													className={`submit-btn submit-btn-${themeMode ? 'light' : 'dark'} my-2`}
													type='submit'
												>
													Wyślij newsa
												</ActionButton>
											</div>
										</div>
									</div>

								</div>
							</div>
						</form>
					</div>
				</div>
			</Layout>
		</div>
	);
};

export default SubmitPage;
