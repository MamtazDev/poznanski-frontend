import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../reducers';
import './style.css';
import {FieldErrors, RegisterOptions, UseFormRegister} from 'react-hook-form';
import {SubmitArticleForm} from '../../Pages/Submit';

interface InputProps {
	onChange?: (value: any) => void;
	name: string;
	label: string;
	value?: string | number;
	error?: string;
	errMsg?: string;
	type?: boolean;
	height?: string;
	register?: UseFormRegister<any>;
	registerOptions?: RegisterOptions;
	placeholder?: string;
	disabled?: boolean;
}

const renderRegisterOptions = (
	name: string,
	registerOptions: RegisterOptions
): RegisterOptions => {
	switch (name) {
		case 'email':
			return {
				required: 'Uzupełnij pole email',
				pattern: {
					value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
					message: 'Nieprawidłowy adres email',
				},
			};
		case 'title':
			return {
				required: 'Twój artykuł musi mieć tytuł',
				minLength: {
					value: 10,
					message: 'Tytuł musi mieć co najmniej 10 znaków',
				},
			};
		case 'intro':
			return {
				required: 'Twój artykuł musi mieć wstęp',
				minLength: {
					value: 20,
					message: 'Intro musi mieć co najmniej 20 znaków',
				},
			};
		case 'nickname':
			return {
				required: 'Podaj swoją ksywę',
				minLength: {
					value: 3,
					message: 'Ksywa musi mieć co najmniej 3 znaki',
				},
			};
		case 'password':
			return {
				required: 'Podaj hasło',
				minLength: {
					value: 6,
					message: 'Hasło musi mieć co najmniej 6 znaków',
				},
			};
		case 'passwordRepeat':
			return {
				required: 'Powtórz hasło',
				minLength: {
					value: 6,
					message: 'Hasło musi mieć co najmniej 6 znaków',
				},
			};
		case 'comment':
			return {
				required: 'Musisz coś napisać',
				minLength: {
					value: 3,
					message: 'Komentarz musi mieć co najmniej 3 znaki',
				},
				maxLength: {
					value: 255,
					message: 'Komentarz nie może mieć więcej niż 255 znaków',
				},
			};

		default:
			return registerOptions;
	}
};

const Input: React.FC<InputProps> = ({
	name,
	label,
	value,
	onChange,
	error,
	errMsg,
	height,
	register,
	registerOptions,
	placeholder,
	disabled,
}) => {
	const themeMode = useSelector((state: RootState) => state.themeMode.mode);
	const type = useSelector((state: RootState) => state.themeMode.type);
	const inputRegisterOptions = renderRegisterOptions(
		name,
		registerOptions ? registerOptions : {}
	);
	const registerProps = register
		? register?.(name, {...inputRegisterOptions})
		: null;

	return (
		<div className='w-full gap-4'>
			<label
				className={`block mb-2 text-sm label-text text-left ${themeMode ? 'text-gray-900' : 'text-white'} `}
				// style={{fontSize: type ? '14px' : '18px'}}
			>
				{label}
			</label>
			{height ? (
				<textarea
					onChange={onChange && ((e) => onChange(e))}
					{...registerProps}
					name={name}
					value={value}
					className={`input-${themeMode ? 'light' : 'dark'} shadow-sm  block w-full ${error ? 'border border-red-500 text-red-900 placeholder-red-700' : 'border'} `}
					style={{
						height: height ? height : type ? '32px' : '36.825px',
					}}
					placeholder={placeholder}
					disabled={disabled}
				/>
			) : (
				<input
					onChange={onChange && ((e) => onChange(e))}
					{...registerProps}
					type={name.includes('password') ? 'password' : 'text'}
					name={name}
					value={value}
					className={`input-${themeMode ? 'light' : 'dark'} shadow-sm  block w-full ${error ? 'border border-red-500 text-red-900 placeholder-red-700' : 'border'} `}
					style={{height: type ? '32px' : '36.825px'}}
					autoComplete='off'
					placeholder={placeholder}
					disabled={disabled}
					// ref={ref}
				/>
			)}
			<div className='text-red-400 h-6'>{error && <p>{error}</p>}</div>
		</div>
	);
};

export default Input;
