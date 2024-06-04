import React, {useEffect, useRef, useState, ReactNode, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../reducers';

interface ToFixedIfOutProps {
	children: ReactNode;
}

// const checkIfTopElementIsInView = (element: HTMLElement | null) => {
//     if (!element) return false;
//     const rect = element.getBoundingClientRect();
//     return rect.top >= 0;
//   }

export const checkIfElementIsFullyInView = (element: HTMLElement | null) => {
	if (!element) return false;
	const rect = element.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <=
			(window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <=
			(window.innerWidth || document.documentElement.clientWidth)
	);
};

const debounce = (func: () => void, wait: number) => {
	let timeout: NodeJS.Timeout;
	return () => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(), wait);
	};
};

export const ToFixedIfOut: React.FC<ToFixedIfOutProps> = ({children}) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [isFixed, setIsFixed] = useState(false);
	const [placeholderHeight, setPlaceholderHeight] = useState(0);
	const themeMode = useSelector((state: RootState) => state.themeMode.mode);
	const handleScroll = () => {
		const container = containerRef.current;
		if (!container) return;

		const currentPosition = window.scrollY;

		if (currentPosition > placeholderHeight && !isFixed) {
			setIsFixed(true);
		} else if (currentPosition <= placeholderHeight && isFixed) {
			setIsFixed(false);
		}
	};

	const debouncedScroll = debounce(handleScroll, 10);

	useEffect(() => {
		const container = containerRef.current;
		if (container) {
			setPlaceholderHeight(container.offsetHeight);
		}

		window.addEventListener('scroll', debouncedScroll);

		return () => {
			window.removeEventListener('scroll', debouncedScroll);
		};
	}, [debouncedScroll]);

	return (
		<div
			className='w-full overflow-hidden shadow-2xl shadow-inner-2'
			ref={containerRef}
			style={{
				display: 'flex',
				position: 'fixed',
                overflowY: '-moz-hidden-unscrollable',
				// top: isFixed ? `${Number(containerRef.current?.offsetTop)}px` : `${Number(containerRef.current?.offsetTop)}px`,
				top:0,
				width: '100%',

				margin: isFixed ? '0' : ' 0 auto',
				zIndex: 100, // Ensure it stays on top
				backgroundColor: themeMode ? '#fff' : '#000', // Assuming themeMode is true for fixed
				left: 0,
				// transition: 'transform 1s ease-in-out', // Add transition for smooth animation
				// transform: isFixed ? 'translateY(0%)' : 'translateY(-100%)',
				justifyContent: 'center',
                gap: '40px',

				alignItems: 'center',
				willChange: 'top, position, transform',
			}}
		>
			{children}
		</div>
	);
};
