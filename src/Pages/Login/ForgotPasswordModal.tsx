import React from 'react';
import { forgetPasswordReq } from '../../Constant/api-requests';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: boolean;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose, themeMode }) => {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<boolean>(false);

  const handleSubmit = async () => {
    if (!email) {
      setError('Please enter a valid email.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await forgetPasswordReq(email);
      setSuccess(true);
      setEmail('');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div
        className={`w-[400px] p-6 rounded-lg shadow-lg ${themeMode ? 'bg-gray-100 text-black' : 'bg-[#51525C] text-white'}`}
      >
        <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className={`w-full p-2 border rounded mb-4 focus:outline-none ${themeMode ? 'border border-gray-100 bg-gray-200 text-black' : 'border-gray-400 bg-[#51525C]'}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">A reset link has been sent to your email.</p>}
        <div className="flex justify-end space-x-3">
          <button
            className={`px-4 py-2 p-3 text-lg font-medium rounded ${themeMode ? 'bg-gray-200 text-black' : 'bg-[#3d3d45]'}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Submit'}
          </button>
          <button
            className={`px-4 py-2 p-3 text-lg font-medium rounded ${themeMode ? 'bg-[#3d3d45] text-white' : 'bg-gray-200 text-black'}`}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
