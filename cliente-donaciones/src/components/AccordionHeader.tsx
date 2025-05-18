import React from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface AccordionHeaderProps {
  title: string;
  isOpen: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  extra?: string;
  isFirstSection?: boolean;
}

const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  title,
  isOpen,
  onClick,
  onKeyDown,
  extra,
  isFirstSection,
}) => {
  return (
    <div
      className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-opacity-50"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-expanded={isOpen}
    >
      <div
        className={`bg-orange-500 p-5 
          ${isFirstSection ? 'rounded-t-xl' : 'border-t border-orange-400'}
          ${isOpen ? 'rounded-b-none' : 'rounded-b-xl'}
          transition-all duration-300 ease-in-out
          hover:bg-orange-600 hover:shadow-md`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            {extra && (
              <span className="ml-3 px-3 py-1 bg-orange-400 rounded-full text-white font-bold transition-all duration-300 ease-in-out hover:bg-orange-300">
                {extra}
              </span>
            )}
          </div>
          <div 
            className={`bg-orange-400 rounded-full p-1 transition-all duration-300 ease-in-out
              ${isOpen ? 'transform rotate-180' : 'transform rotate-0'}
              hover:bg-orange-300`}
          >
            <FaChevronDown 
              size={16} 
              className={`text-white transform transition-transform duration-300 ease-in-out`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccordionHeader;
