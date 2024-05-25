import React, {useRef} from 'react';
import Image from '@tiptap/extension-image';
import {AnyExtension, EditorContent, useEditor} from '@tiptap/react';
import styles from './TipTap.module.css';
import {Box} from '@chakra-ui/react';
import {FileResizer} from '../ImageFileResizer/ImageFileResizer';
import {MenuBar} from './MenuBar';
import {
	customFileHandler,
	customYouTube,
	customYouTubeArticle,
} from './Extensions';
import {getFileData, getFilesIncludedInHTML} from './helpers';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

export interface TipTapProps {
	onVideoAdd?: (videoUrl: string) => void;
	type: boolean;
	setFiles: React.Dispatch<React.SetStateAction<FileFromEditor[] | null>>;
	setArticle: React.Dispatch<React.SetStateAction<string>>;
	onSubmit?: () => void;
	themeMode: boolean;
}

type imageFromEditor = {
	[key: string]: File;
};

export type FileFromEditor = {
	name: string;
	size: number;
	file: Blob;
	url: string;
};

const content = ``;

export const getExtensionsData = (
	setFiles: TipTapProps['setFiles']
): AnyExtension[] => [
	StarterKit,
	Image.configure({
		HTMLAttributes: {
			class: 'editor-image',
		},
	}),
	TextAlign,
	customYouTubeArticle,
	customFileHandler(setFiles),
	Link.configure({
		validate: (href) => /^https?:\/\//.test(href),
		autolink: true,
		HTMLAttributes: {
			class: 'editor-link',
			style: 'text-decoration: underline; cursor: pointer;',
		},
	}),
];

const TipTap: React.FC<TipTapProps> = ({
	onVideoAdd,
	type,
	setArticle,
	setFiles,
	onSubmit,
	themeMode,
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const onEditorUpdate = (htmlString: string) => {
		setArticle(htmlString);
		setFiles((prev) => {
			if (!prev) {
				return null;
			}
			return getFilesIncludedInHTML(htmlString, prev);
		});
	};

	const editor = useEditor({
		extensions: getExtensionsData(setFiles),
		content,
		onUpdate: ({editor}) => {
			const html = editor.getHTML();
			return onEditorUpdate(html);
		},
	});

	const handleVideoAdd = () => {
		const videoUrl = prompt('Enter YouTube video URL:');
		if (videoUrl) {
			onVideoAdd?.(videoUrl);
			editor?.chain().focus().setYoutubeVideo({src: videoUrl}).run();
			editor?.commands.newlineInCode();
		}
	};

	const handleImgAdd = async (file: File) => {
		const compressedFile = await FileResizer(file);
		if (compressedFile) {
			const fileToAdd = getFileData(file, compressedFile);
			editor
				?.chain()
				.focus()
				.setImage({src: fileToAdd.url, alt: fileToAdd.name})
				.run();
			setFiles((prev) => {
				URL.revokeObjectURL(fileToAdd.url);
				if (!prev) {
					return [fileToAdd];
				}
				return [...prev, fileToAdd];
			});
			editor?.commands.newlineInCode();
		}
	};

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (file) {
			await handleImgAdd(file);
		}
	};

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const additionalButtons = [
		<button className={styles.editorButton} onClick={handleVideoAdd}>
			YouTube
		</button>,
		<button className={styles.editorButton} onClick={handleClick}>
			zdjęcie
		</button>,
	];

	return (
		<>
			<div className={styles.tiptap}>
				<div
					className={`block mb-2 text-left ${themeMode ? 'text-gray-900' : 'text-white'} `}
					style={{fontSize: type ? '14px' : '18px'}}
				>
					<p className='label-text'>Treść Twojego newsa</p>
					{editor && (
						<MenuBar
							editor={editor}
							additionalButtons={additionalButtons}
						/>
					)}
				</div>

				<Box
					sx={{
						'&& .ProseMirror': {
							height: '600px',
							overflowY: 'auto',
							border: `1px solid ${themeMode ? '' : '#e5e7eb86'}`,
							backgroundColor: `${themeMode ? '#E9E9EB' : 'rgb(36, 37, 38)'}`,
							color: `${themeMode ? '#000' : '#fff'}`,
							borderRadius: '7px',
						},
					}}
				>
					<EditorContent
						className={styles.editorContent}
						editor={editor}
					/>
				</Box>
				<input
					type='file'
					accept='image/png'
					onChange={handleFileChange}
					ref={fileInputRef}
					style={{display: 'none'}}
				/>
			</div>
		</>
	);
};

export default TipTap;
