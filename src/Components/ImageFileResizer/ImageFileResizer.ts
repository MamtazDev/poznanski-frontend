import Resizer from 'react-image-file-resizer';

const fileValidation = (file: File) => {
	const type = file.type;
	const size = file.size;
	if (type !== 'image/jpeg' && type !== 'image/png' && type !== 'image/gif') {
		alert('Zły format pliku');
		return false;
	}
	if (size > 1000000) {
		alert('Plik jest za duży');
		return false;
	}
	return true;
};

export const FileResizer = (file: File): Promise<Blob> | null => {
	return fileValidation(file)
		? new Promise<Blob>((resolve) => {
				return Resizer.imageFileResizer(
					file,
					300,
					300,
					`${file.type.split('/')[1]}`,
					100,
					0,
					(uri) => {
						resolve(uri as Blob);
					},
					`${file.type.split('/')[1]}`,
					494,
					870
				);
			}).then((uri) => uri)
		: null;
};
