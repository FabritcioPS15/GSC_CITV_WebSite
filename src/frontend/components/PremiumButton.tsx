import React from 'react';
import { Link } from 'react-router-dom';

interface PremiumButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  plain?: boolean;
}

const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  to,
  href,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  plain = false,
}) => {
  const baseClasses = `btn-premium-reveal ${plain ? 'btn-premium-reveal-plain' : ''} inline-flex items-center justify-center px-8 py-4 rounded-full font-bold shadow-xl shadow-orange-500/10 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClasses} onClick={onClick}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={baseClasses} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={baseClasses} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default PremiumButton;
