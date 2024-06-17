import * as React from 'react';
import {
	useAutocomplete,
	AutocompleteGetTagProps,
} from '@mui/base/useAutocomplete';
// import CheckIcon from '@mui/icons-material/Check';
// import CloseIcon from '@mui/icons-material/Close';
import {SlTrash} from 'react-icons/sl';
import {SlCheck} from 'react-icons/sl';
import {SlClose} from 'react-icons/sl';

import {styled} from '@mui/material/styles';
import {
	autocompleteClasses,
	createFilterOptions,
} from '@mui/material/Autocomplete';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {AlertIcon, CheckboxIcon} from '@chakra-ui/react';

const celadon = '#3BD6C6';
const deepPurple = '#5A1073';
const dark = '#141414';
const light = '#fff';
const darkText = 'rgba(255, 255, 255)';
const lightText = 'rgba(0, 0, 0)';
const darkSecondary = 'rgba(0, 0, 0, 0.65)';
const lightSecondary = 'rgba(0, 0, 0, 0.85)';
const darkBackground = '#242526';
const lightBackground = '#fafafa';
const darkPaper = '#303030';
const lightPaper = '#fff';


const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#1890ff',
		},
		background: {
			default: '#fff',
			paper: '#fafafa',
		},
		text: {
			primary: 'rgba(0, 0, 0, 0.85)',
			secondary: 'rgba(0, 0, 0, 0.65)',
		},
	},
});

const lightTheme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#1890ff',
		},
		background: {
			default: '#141414',
			paper: '#303030',
		},
		text: {
			primary: 'rgba(255, 255, 255)',
			secondary: 'rgba(255, 255, 255)',
		},
	},
});

const Root = styled('div')(
	({theme}) => `
  color: ${
		theme.palette.mode === 'dark'
			? 'rgba(255,255,255,0.65)'
			: 'rgba(0,0,0,.85)'
  };
  font-size: 14px;
`
);

const Label = styled('label')`
	padding: 0 0 4px;
	line-height: 1.5;
	display: block;
`;

const InputWrapper = styled('div')(
	({theme}) => `
  width: auto;
  border: 1px solid ${theme.palette.mode === 'dark' ? 'rgb(226, 232, 240)' : '#d9d9d9'};
  background-color: ${theme.palette.mode === 'dark' ? '#242526' : '#E9E9EB'};
  opacity: 0.6;
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;
  border-radius: 8px;
transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  max-height: 250px;
  overflow: auto;
  &:hover {
    border-color: ${theme.palette.mode === 'dark' ? celadon : '#000'};
	opacity: 0.75;
  }

  &.focused {
    border-color: ${theme.palette.mode === 'dark' ? celadon : '#000'};
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
	opacity: 1;
  }

  & input {
    background-color: ${theme.palette.mode === 'dark' ? '#242526' : '#E9E9EB'};
    color: ${
		theme.palette.mode === 'dark'
			? '#fff'
			: '#000'
	};
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`
);

interface TagProps extends ReturnType<AutocompleteGetTagProps> {
	label: string;
}

function Tag(props: TagProps) {
	const {label, onDelete, ...other} = props;
	return (
		<div {...other}>
			<span>
				<b>{label}</b>
			</span>
			{/* <CheckboxIcon onClick={onDelete} /> */}
			<SlClose
				style={{width: '20px', height: 'auto'}}
				onClick={onDelete}
				className='w-[20px] text-xl'
				width={20}
			/>
		</div>
	);
}

const StyledTag = styled(Tag)<TagProps>(
	({theme}) => `
  display: flex;
  align-items: center;
  height: 24px;
  margin: 6px;
  line-height: 22px;
  background-color: ${
		theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#fafafa'
  };
  border: 1px solid ${theme.palette.mode === 'dark' ? '#fff' : '#000'};
  border-radius: 8px;
  box-sizing: content-box;
  padding: 4px 4px 4px 8px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
    background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
	padding: 4px 4px 4px 8px;
}

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 2px;
  }

  & svg {
    font-size: 14px;
    cursor: pointer;
    padding: 2px;
  }
`
);

const Listbox = styled('ul')(
	({theme}) => `
  display: ruby;
  max-height: 250px;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  transition: 0.2s;
  background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? celadon : deepPurple};
  overflow: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    margin: 2px;
    padding: 5px 12px;
    display: flex;
    transition: 0.2s;
    border-radius: 6px;
    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
      margin-left: 8px;
    }
  }

  & li[aria-selected='true'] {
    background-color: ${theme.palette.mode === 'dark' ? '#2b2b2b' : '#fafafa'};
    font-weight: 600;
    border: 1px solid ${theme.palette.mode === 'dark' ? celadon : deepPurple};

    & svg {
      color: ${celadon};
    }


  }

  & li.${autocompleteClasses.focused} {
	color: ${theme.palette.mode === 'dark' ? '#000' : '#fff'};
    background-color: ${theme.palette.mode === 'dark' ? celadon : deepPurple};
    cursor: pointer;
	opacity: 0.5;
    & svg {
      color: currentColor;
    }
  }
`
);

const filter = createFilterOptions<string>();

export const ThemeProviderMUI: React.FC<{themeMode?: boolean, children: React.ReactElement}> = ({themeMode, children}) => {
	return (
		<ThemeProvider theme={themeMode ? lightTheme : darkTheme}>
			{children}
		</ThemeProvider>
	);
}

export default function useTags(
	label: string,
	setTags: React.Dispatch<React.SetStateAction<string[]>>,
  tags: string[],
	themeMode?: boolean,
	type?: boolean
) {
	const {
		getRootProps,
		getInputProps,
		getTagProps,
		getListboxProps,
		getOptionProps,
		groupedOptions,
		value,
		focused,
		setAnchorEl,
	} = useAutocomplete({
		id: 'customized-hook-demo',
    value: tags,
		multiple: true,
		options: hashtagsMockUp,
		getOptionLabel: (option) => option,
		freeSolo: true,
		onChange: (event, newValue) => {
			setTags(newValue);
		},
		filterOptions: (options, params) => {
			const filtered = filter(options, params);

			filtered.push(`${params.inputValue}`);

			return filtered;
		},
	});
  const uniqueId = React.useId()
	return (
		<ThemeProvider theme={themeMode ? lightTheme : darkTheme}>
			<Root {...getRootProps()}>
				<div className='w-full'>
					<label
						className={`block mb-2 label-text text-left ${themeMode ? 'text-gray-900' : 'text-white'} `}
						style={{fontSize: type ? '14px' : '18px'}}
					>
						{label}
					</label>
					<InputWrapper
						ref={setAnchorEl}
						className={focused ? 'focused' : ''}
					>
						{value.map((option: string, index: number) => (
							<StyledTag
								label={option}
								{...getTagProps({index})}
                key={index}
							/>
						))}
						<input style={{placeSelf: 'center'}} {...getInputProps()} />
					</InputWrapper>
				</div>
				{groupedOptions.length > 0 ? (
					<Listbox className='text-left' {...getListboxProps()}>
						{(groupedOptions as typeof hashtagsMockUp).map(
							(option, index) => (
								<li {...getOptionProps({option, index})} key={`${option}-${uniqueId}`}>
									<span>{option}</span>
									<p className='content-center'>
										<SlCheck />
									</p>
								</li>
							)
						)}
					</Listbox>
				) : null}
			</Root>
		</ThemeProvider>
	);
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
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

// import React, {useId, useState} from 'react';
// import {useSelector} from 'react-redux';
// import {RootState} from '../../reducers';
// import {Modal, ModalContent, ModalFooter, ModalBody} from '@chakra-ui/react';
// import {Button} from '@chakra-ui/react';
// import Input from './Input';
// import './style.css';

// interface SelectProps {
// 	onChange?: (value: string) => void;
// 	label: string;
// 	data: string[];
// 	value?: string;
// 	handleOk?: (value: string) => void;
// 	type?: boolean;
// }
// const Select: React.FC<SelectProps> = ({
// 	label,
// 	data,
// 	value,
// 	onChange,
// 	handleOk,
// 	type,
// }) => {
// 	const themeMode = useSelector((state: RootState) => state.themeMode.mode);
// 	const [isOpen, setIsOpen] = useState<boolean>(false);
// 	const tagsInputRef = React.useRef<HTMLInputElement>(null);

// 	const [tag, setTag] = useState<string>('');

// 	const handleAddTag = () => {
// 		setIsOpen(true);
// 	};

// 	const handleChange = (value: string, event: React.MouseEvent) => {
// 		// event.preventDefault();
// 		// event.stopPropagation();
// 		setTag((prev) => {
// 			if(!prev) {
// 				return `#${value}`;
// 			}
// 			return `${prev}#${value}`;
// 		});
// 		console.log(value)
// 	};

// 	const onClose = () => {
// 		setIsOpen(false);
// 		setTag('');
// 	};

// 	const handleClickOk = () => {
// 		if (!tag) {
// 		} else {
// 			if (handleOk) {
// 				handleOk(tag);
// 			}
// 			setIsOpen(false);
// 			setTag('');
// 		}
// 	};
// 	const uniqueId = useId();

// 	const openOrClose = () => {
// 		setIsOpen((prev)=> !prev)
// 	}
// 	return (
// 		<div className='w-full'>

// 			<div className='relative' onClick={openOrClose}>
// 				<Input
// 				label={label}
// 				name='tags'

// 					// className={`border appearance-none text-sm block w-full ${themeMode ? 'input-dark' : 'input-light'} `}
// 					// style={{height: type ? '32px' : '36.825px'}}
// 					onChange={onChange && ((e) => onChange(e.target.value))}
// 				/>
// 					<div className={`w-full`}>
// 						{isOpen && <div className={`absolute h-[200px] overflow-auto w-full ${themeMode ? 'input-dark' : 'input-light'}`} >
// 						{data?.length &&
// 						data.map((item, idx) => (
// 							<p className='py-2 my-2' onClick={(event) => handleChange(item, event)} key={`tag-select-${uniqueId}`}>
// 								{item}
// 							</p>
// 						))}</div>}
// 						</div>

// 				<div
// 					className={`add-btn ${themeMode ? 'add-btn-dark' : 'add-btn-light'} ${type ? 'add-btn-mobile' : 'add-btn-web '}`}
// 				>
// 					<svg
// 						xmlns='http://www.w3.org/2000/svg'
// 						viewBox='0 0 448 512'
// 						width={type ? '10' : '12'}
// 						height={type ? '10' : '12'}
// 					>
// 						<path d='M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z' />
// 					</svg>
// 				</div>
// 			</div>

{
	/* <Modal isOpen={isOpen} onClose={onClose}>
				<ModalContent
					maxWidth={'400px'}
					backgroundColor={themeMode ? '#E9E9EB' : '#242526'}
					padding={4}
					border={themeMode ? '1px solid #000' : '1px solid #fff'}
				>
					<ModalBody>
						<Input
							label='New Tag'
							name='tag'
							value={tag}
							onChange={handleChange}
						/>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="red" color={themeMode ? "black" : "black"} mr={3} onClick={onClose}>
              Anuluj
            </Button>
						<Button
							colorScheme='blue'
							color={themeMode ? 'black' : 'white'}
							onClick={handleClickOk}
						>
							Dodaj
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal> */
}
// 		</div>
// 	);
// };

// export default Select;
