import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollToBottomResult {
    containerRef: React.RefObject<HTMLDivElement>;
    isAtBottom: boolean;
    ScrollButton: JSX.Element | null;
}

const useScrollToBottom = (modalIsOpen?: boolean): UseScrollToBottomResult => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isAtBottom, setIsAtBottom] = useState(false);

    const handleScrollToBottom = () => {
        const container = containerRef.current;
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth',
            });
        }
    };

    const checkIfAtBottom = useCallback(() => {
        const container = containerRef.current;
        if (container) {
            const isBottom =
                Math.abs(
                    container.scrollHeight -
                    container.scrollTop -
                    container.clientHeight
                ) < 1;
            setIsAtBottom(isBottom);
            console.log(isBottom);
        }
    }, []);

    useEffect(() => {
        if (modalIsOpen) {
            const timeoutId = setTimeout(() => {
                const container = containerRef.current;
                if (container) {
                    const handleScroll = () => checkIfAtBottom();
                    container.addEventListener('scroll', handleScroll, { passive: true });

                    // Ensure check runs immediately
                    checkIfAtBottom();

                    return () => {
                        container.removeEventListener('scroll', handleScroll);
                    };
                }
            }, 100); // Adjust timeout as necessary

            return () => clearTimeout(timeoutId);
        }
    }, [modalIsOpen, checkIfAtBottom]);

    useEffect(() => {
        if (modalIsOpen) {
            checkIfAtBottom();
        }
    }, [modalIsOpen, checkIfAtBottom]);

    const ScrollButton = !isAtBottom || containerRef.current?.scrollHeight === 0 ? (
        <button style={{ zIndex: 17000, position: 'fixed', top: 20 }} type='button' onClick={handleScrollToBottom}>
            <div className='flex cursor-pointer animate-bounce hover:animate-none w-fit justify-end mx-auto'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='29'
                    height='28'
                    viewBox='0 0 29 28'
                    fill='none'
                >
                    <path
                        d='M22.6668 14L14.5002 22.1667L6.3335 14'
                        stroke='#F1F4F9'
                        strokeWidth='3.29412'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </svg>
            </div>
        </button>
    ) : null;

    return { containerRef, isAtBottom, ScrollButton };
};

export default useScrollToBottom;