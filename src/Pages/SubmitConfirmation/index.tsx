import {FC, useEffect, useState} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';
import {verifyNewsAuthorRequest} from '../../Constant/api-requests';
import {Spinner} from '@chakra-ui/react';
import {usePromiseToast} from '../../Components/Toast/Toast';
import Layout from '../../Components/Layout';

type VerificationType = 'email' | 'author';

const getVerificationText = (verify: string) => {
	switch (verify) {
		case 'email':
			return {
				verificationText: 'Witaj na pokładzie',
				verificationSubtext:
					'Gratulacje, właśnie zostałeś pełnoprawnym członkiem naszej społeczności i możesz brać udział w dyskusjach.',
				loadingText: 'Trwa weryfikacja Twojego adresu email',
			};
		case 'author':
			return {
				verificationText: 'Dziękujemy za przesłanie artykułu',
				verificationSubtext:
					'Twój artykuł zostanie sprawdzony przez naszą redakcję',
				loadingText: 'Potwierdzamy autora',
			};
		default:
			return {
				verificationText: '',
				verificationSubtext: '',
				loadingText: '',
			};
	}
};

const SubmitConfirmation: FC = () => {
	const [params] = useSearchParams();
	const [isVerified, setIsVerified] = useState(false);
	const {showPromiseToast} = usePromiseToast({
		onError: () => setIsVerified(false),
		onSuccess: () => setIsVerified(true),
	});
	// const handleauthorRequest = async (newsId: string) => {
	// 	try {
	// 		if (author && !isVerified) {
	// 			await verifyNewsAuthorRequest(newsId);
	// 			setIsVerified(true);
	// 		}
	// 	} catch (e) {
	// 	}
	// };
	const author = params.get('author');
	const email = params.get('email');
	// const handleAuthorVerification = async () => {

	// 		try {
	// 			await verifyNewsAuthorRequest(author);
	// 			setIsVerified(true);
	// 		} catch (e) {
	// 			setIsVerified(false);
	// 		}
	// 	}
	// };

	const handleEmailVerification = () => {
		if (author) {
			showPromiseToast(
				async () => await verifyNewsAuthorRequest(author),

				{
					success: {
						title: 'Weryfikacja adresu email zakonczona sukcesem',
						description: 'Twój adres email został zweryfikowany',
					},
					error: {
						title: 'Weryfikacje adresu email nie powiodła się',
						description: 'Invalid token',
					},
					loading: {
						title: 'Weryfikacja w toku!',
						description: 'Proszę czekać...',
					},
				}
			);
		}
	};

	const {verificationText, verificationSubtext, loadingText} =
		getVerificationText(author ? 'author' : email ? 'email' : '');

	useEffect(() => {
		handleEmailVerification();
	}, []);
	return (
		<Layout>
			<div className='flex flex-col h-full py-10 justify-center items-center'>
				<div className='flex flex-col items-center'>
					{isVerified ? (
						<>
							<div className='text-3xl font-bold'>
								{verificationText}
							</div>
							<div className='text-xl mt-5'>
								{verificationSubtext}
							</div>
						</>
					) : (
						<div className='text-3xl py-10 font-bold'>
							<Spinner />
							{loadingText}
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default SubmitConfirmation;
