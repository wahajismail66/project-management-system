import React, { useEffect, useState } from 'react';

const DynamicModal = ({ isOpen, onClose, title, children, footerActions }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Liquid Backdrop Overlay */}
      <div 
        className={`absolute inset-0 bg-black/20 backdrop-blur-xl transition-opacity duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Modal Body */}
      <div className={`
        relative w-full max-w-lg transform transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${animate ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-12 opacity-0'}
        bg-white/40 dark:bg-black/30 
        backdrop-blur-2xl
        rounded-[32px] 
        shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]
        border border-white/40 dark:border-white/10
        ring-1 ring-white/20
        overflow-hidden
      `}>
        
        {/* Subtle Liquid Shine Effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />

        <div className="relative p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
              {title}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-gray-800 dark:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Content */}
          <div className="text-gray-700 dark:text-gray-200 leading-relaxed">
            {children}
          </div>

          {/* Footer Actions */}
          {footerActions && (
            <div className="mt-8 flex gap-3 justify-end">
              {footerActions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicModal;