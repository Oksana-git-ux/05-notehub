import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
}

const modalRoot = document.getElementById('modal-root') as HTMLElement;

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return createPortal(
        <div 
            className={css.backdrop} 
            role="dialog" 
            aria-modal="true" 
            onClick={handleBackdropClick}
        >
            <div className={css.modal}>
                {children}
            </div>
        </div>,
        modalRoot 
    );
};
export default Modal;