import React, { useRef, useEffect, useState } from 'react';

interface AccordionContentProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const AccordionContent: React.FC<AccordionContentProps> = ({ isOpen, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | string>(0);
  
  useEffect(() => {
    if (isOpen) {
      const contentEl = contentRef.current;
      if (contentEl) {
        // Establecer altura a auto brevemente para medir el contenido
        setHeight("auto");
        const contentHeight = contentEl.scrollHeight;
        // Establecer altura específica para la animación
        setHeight(0);
        // Forzar un reflow
        contentEl.offsetHeight;
        // Iniciar la transición a la altura completa
        setHeight(contentHeight);
      }
    } else {
      setHeight(0);
    }
  }, [isOpen]);
  
  return (
    <div 
      ref={contentRef}
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};

export default AccordionContent;