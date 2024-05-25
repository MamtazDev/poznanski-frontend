import React, { useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  type?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, type }) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);

  const handleClose = () => {
    setIsModalOpen(false);
    onClose && onClose();
  };

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-end m-4 ${
        isModalOpen ? "block" : "hidden"
      }`}
    >
      <div
        className="fixed inset-0"
        onClick={handleBackdropClick}
      ></div>
      <div className={`z-50 bg-whiterounded shadow-lg ${type && 'mx-auto'}`}>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
