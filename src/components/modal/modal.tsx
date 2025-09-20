import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import ModalOverlay from '@components/modal/modal-overlay/modal-overlay';

import styles from './modal.module.css';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
  labelledById?: string;
  closeOnOverlay?: boolean;
  title?: string;
};
const Modal = ({
  title,
  isOpen,
  onClose,
  children,
  ariaLabel,
  labelledById,
  closeOnOverlay = true,
}: ModalProps): React.JSX.Element | null => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return (): void => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Блокируем скролл body
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return (): void => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;
  return createPortal(
    <ModalOverlay onClose={onClose} closeOnOverlay={closeOnOverlay}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledById}
        aria-label={ariaLabel}
        className={`${styles.modal} p-10`}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={`${styles.modal_header} text text_type_main-large pt-3 pb-3`}>
          {title}
          <CloseIcon
            className={styles.modal_icon_close}
            onClick={onClose}
            type="primary"
          />
        </div>
        {children}
      </div>
    </ModalOverlay>,
    document.body
  );
};

export default Modal;
