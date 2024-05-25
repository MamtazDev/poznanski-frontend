import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../reducers';
import {Modal, ModalContent, ModalFooter, ModalBody} from '@chakra-ui/react';
import {Button} from '@chakra-ui/react';
import Input from './Input';
import './style.css';

interface SelectProps {
	onChange?: (value: string) => void;
	label: string;
	data: {name: string}[];
	value?: string;
	handleOk?: (value: string) => void;
	type?: boolean;
}
const Select: React.FC<SelectProps> = ({
	label,
	data,
	value,
	onChange,
	handleOk,
	type,
}) => {
	const themeMode = useSelector((state: RootState) => state.themeMode.mode);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const [tag, setTag] = useState<string>('');

	const handleAddTag = () => {
		setIsOpen(true);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTag(e.target.value);
	};

	const onClose = () => {
		setIsOpen(false);
		setTag('');
	};

	const handleClickOk = () => {
		if (!tag) {
		} else {
			if (handleOk) {
				handleOk(tag);
			}
			setIsOpen(false);
			setTag('');
		}
	};
	return (
		<div className='w-full'>
			<label
				className={`block mb-2 label-text text-left ${themeMode ? 'text-gray-900' : 'text-white'} `}
				style={{fontSize: type ? '14px' : '18px'}}
			>
				{label}
			</label>
			<div className='relative'>
				<select
					id='tags'
					value={value}
					className={`border appearance-none text-sm block w-full ${themeMode ? 'input-light' : 'input-dark'} `}
					style={{height: type ? '32px' : '36.825px'}}
					onChange={onChange && ((e) => onChange(e.target.value))}
				>
					{data?.length &&
						data.map((item, idx) => (
							<option key={`tag-select-${idx}`} value={item.name}>
								{item.name}
							</option>
						))}
				</select>
				<div
					className={`add-btn ${themeMode ? 'add-btn-light' : 'add-btn-dark'} ${type ? 'add-btn-mobile' : 'add-btn-web '}`}
					onClick={handleAddTag}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 448 512'
						width={type ? '10' : '12'}
						height={type ? '10' : '12'}
					>
						<path d='M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z' />
					</svg>
				</div>
			</div>

			<Modal isOpen={isOpen} onClose={onClose}>
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
						{/* <Button colorScheme="red" color={themeMode ? "black" : "black"} mr={3} onClick={onClose}>
              Anuluj
            </Button> */}
						<Button
							colorScheme='blue'
							color={themeMode ? 'black' : 'white'}
							onClick={handleClickOk}
						>
							Dodaj
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
};

export default Select;
