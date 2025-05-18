import { useState } from 'react';

type SectionType = 'cuanto' | 'de' | null;

export function useAccordion(initialSection: SectionType = 'cuanto') {
  const [seccionAbierta, setSeccionAbierta] = useState<SectionType>(initialSection);
  
  const toggleSeccion = (seccion: 'cuanto' | 'de') => {
    setSeccionAbierta(prevSeccion => prevSeccion === seccion ? null : seccion);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent, seccion: 'cuanto' | 'de') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSeccion(seccion);
    }
  };
  
  return { seccionAbierta, toggleSeccion, handleKeyDown };
}
