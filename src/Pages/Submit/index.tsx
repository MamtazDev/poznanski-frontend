import React, {useEffect, useMemo, useState} from 'react';
import BreadCrumb from '../../Components/BreadCrumb';
import ContentTitle from '../../Components/ContentTitle';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../reducers';
import {SlTrash} from 'react-icons/sl';
import Input from '../../Components/TextField/Input';
import Select from '../../Components/TextField/Select';
import Textarea from '../../Components/TextField/Textarea';
import CrudBtn from '../../Components/CrudBtn';
import FolderIcon from '../../assets/png/folder_icon.png';
import './style.css';
import TipTap, {FileFromEditor} from '../../Components/TipTap/TipTap';
import Layout from '../../Components/Layout';
import {FieldErrors, set, useForm} from 'react-hook-form';
import {create} from 'domain';
import {
	createArticleByUserRequest,
	createArticleRequest,
} from '../../Constant/api-requests';
import {error} from 'console';
import {FileResizer} from '../../Components/ImageFileResizer/ImageFileResizer';
import {openPlayer} from '../../reducers/PlayerReducer';
import CustomizedHook from '../../Components/TextField/Select';
import useTags from '../../Components/TextField/Select';
import usePromiseBasedToast from '../../Components/Toast/Toast';
import { ActionButton } from '../../Components/Button';

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
interface ArticleData {
	content: string;
	tags: string;
	email: string;
	title: string;
	intro: string;
	nickname: string;
	files: FileFromEditor[];
}

type FileDetail = {
	name: string;
	size: number;
	url: string;
};
interface FormDataEntries extends Omit<ArticleData, 'files'> {
	gerson: string;
	files: File[];
	fileDetails: FileDetail[];
}

const objectToArrayOfProperties = (obj: any): Array<any> => {
	return Object.entries(obj).map(([key, value]) => {
		return {key: key, value: value};
	});
};

const appendFormData = (articleData: FormData, data: any) => {
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			const value = data[key as keyof FormDataEntries];
			if (Array.isArray(value)) {
				value.forEach((item) => articleData.append(key, item));
			} else {
				articleData.append(key, value as any);
			}
		}
	}
};

const hashtagsMockUp = [
	'peja',
	'slumsattack',
	'RPS',
	'kali',
	'donGuralesko',
	'shellerini',
	'ksywa',
	'jeżyce',
	'staremiasto',
	'winogrady',
	'grunwald',
	'wilda',
	'nowemiasto',
	'piatkowo',
	'naramowice',
	'strzeszyn',
	'sołacz',
	'szczepankowospozewo',
	'umultowo',
	'krzyżowniki',
	'kobylepole',
	'antoninek',
	'kopernik',
	'dębiec',
	'łazarz',
	'górczyn',
	'plewiska',
	'golęcin',
	'ogrody',
	'podolany',
	'smochowice',
	'światowid',
	'krzesiny',
	'fabianowo',
	'garaszewo',
	'wiara',
	'tej',
	'ziomki',
	'ekipa',
	'ziomal',
	'pozdro',
];

const SubmitPage: React.FC<SubmitPageProps> = ({themeMode, type}) => {
	const [files, setFiles] = useState<FileFromEditor[] | null>(null);
	const [article, setArticle] = useState<string>('');
	const [imgData, setImgData] = useState<MainImgData | null>(null);
	const [tags, setTags] = useState<string[]>([]);
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const AddTags = useTags('Dodaj tagi', setTags, tags, themeMode, type);
	const {isLoggedIn} = useSelector((state: RootState) => state.user);
	const {
		register,
		handleSubmit,
		formState: {errors},
		reset,
	} = useForm<SubmitArticleForm>({
		defaultValues: {email: '', title: '', intro: ''},
		mode: 'all',
	});

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

	const description =
		'Dodaj swojego newsa lub pomysł na niego, zostań częścią poznańskiego rapu!';

	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click(); // Trigger the file selection dialog
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImgData({url: URL.createObjectURL(file), file: file});
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

	const handleSubmitRequest = async (form: FormData) => {
		try {
			isLoggedIn
				? await createArticleByUserRequest(form)
				: await createArticleRequest(form);
				resetArticle();
			} catch (e) {
				console.error(e);
			}
	};

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
			const {file} = imgData;
			const {name} = file;
			const compressedFile = await FileResizer(file);
			const form = new FormData();
			if (compressedFile) {
				const mainImg = {
					name,
					size: compressedFile?.size,
					url: '',
					file: new Blob([compressedFile], {
						type: compressedFile.type,
					}),
				};
				const stringOfTags = '#' + tags.join('#');
				const images = files ? [mainImg, ...files] : [mainImg];

				images.forEach((image, i) => {
					const {file, ...fileDetails} = image;
					form.append(
						`files`,
						file,
						`${data.email} ${fileDetails.name}`
					);
				});
				const articleData = {
					...data,
					content: article,
					tags: stringOfTags,
				};
				Object.entries(articleData).forEach(([key, value]) => {
					form.append(key, value);
				});
				await handleSubmitRequest(form);
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
						<div
							className={`md:mt-4 mt-2 ${themeMode ? 'submit-description-text' : 'submit-description-text-dark'}`}
						>
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
											height: type ? '151px' : '458px',
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
												/>
												<div
													className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 `}
												>
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
									<div
										className={`h-full flex flex-${!type ? 'col' : 'col-reverse'} justify-between mt-4`}
									>
										{AddTags}
										{/* <Select
											label='Dodaj tagi'
											data={hashtagsMockUp}
											type={type}
										/> */}

										<div
											className={`flex flex-col ${!type ? 'mt-6' : 'mb-4 ml-5 min-w-36'}`}
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
