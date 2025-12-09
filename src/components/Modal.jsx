// src/components/Modal.jsx
import './Modal.css';

function Modal({ isOpen, onClose, title, children, size = 'medium' }) {
  if (!isOpen) return null;

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClass = {
    small: 'modal-small',
    medium: 'modal-medium',
    large: 'modal-large',
    extraLarge: 'modal-extra-large'   // 🔥 Новый большой размер
  }[size];

  return (
    <div className="modal-background" onClick={handleBackgroundClick}>
      <div className={`modal-window ${sizeClass}`}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button 
            className="modal-close" 
            onClick={onClose} 
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
