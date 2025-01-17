import {Spinner} from '@chakra-ui/react';
import {ReactNode, useState, useEffect} from 'react';

const DelayedComponent: React.FC<{children: ReactNode; delay: number}> = ({
	delay,
	children,
}) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, delay);

		return () => clearTimeout(timer);
	}, []);

	return (
		<>
			{isVisible ? (
				<div className={`transition-opacity delay-300 ${isVisible ? '' : 'opacity-0'}`}>{children}</div>
			) : (
				<div className='w-full h-32 flex justify-center items-center'>
					<Spinner
						thickness='4px'
						speed='0.65s'
						emptyColor='gray.200'
						color='blue.500'
						size='lg'
						backgroundColor={'transparent'}
					/>
				</div>
			)}
		</>
	);
};

export default DelayedComponent;
