import React, { useState } from 'react';
import AccordionHeader from '../components/AccordionHeader';
import MontoSection from '../components/MontoSection';
import PersonalInfoSection from '../components/PersonalInfoSection';
import { useAccordion } from '../hooks/useAccordion';
import AccordionContent from '../components/AccordionContent';
import { useLocation } from "wouter";
import { toast } from 'react-hot-toast';

// Hook para manejar la sección de monto
function useMontoSection() {
  const [monto, setMonto] = useState('');
  
  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonto(e.target.value);
  };
  
  const handleMontoPreset = (valor: string) => {
    setMonto(valor);
  };
  
  return { monto, handleMontoChange, handleMontoPreset };
}

// Hook para manejar la sección de información personal
function useInfoSection() {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
  };

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefono(e.target.value);
  };

  return { email, nombre, telefono, handleEmailChange, handleNombreChange, handleTelefonoChange };
}

export default function MontoTarjeta() {
  const { monto, handleMontoChange, handleMontoPreset } = useMontoSection();
  const { email, nombre, telefono, handleEmailChange, handleNombreChange, handleTelefonoChange } = useInfoSection();
  const { seccionAbierta, toggleSeccion, handleKeyDown } = useAccordion('cuanto');

    const [_, navigate] = useLocation()


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if(seccionAbierta === 'cuanto') {
        toggleSeccion('de');
        document.getElementById('email')?.focus();
        return;
    }

    if(!monto) {
      toast.error('Por favor completa el monto');
      toggleSeccion('cuanto');
      document.getElementById('monto')?.focus();
      return;
    }

    if(!email) {
      toast.error('Por favor completa el correo electrónico');
      // toggleSeccion('de');
      document.getElementById('email')?.focus();
      return;
    }
    

    // Aquí puedes manejar el envío del formulario
    console.log('Monto:', monto);
    console.log('Email:', email);
    console.log('Nombre:', nombre);

    navigate('/pagar', {
      state: {
        monto,
        email,
        nombre,
        telefono
      }
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Dona al <span className="text-orange-500">Banco de Alimentos</span> de Quito
      </h1>
      
      <form className="w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        {/* Sección Cuanto */}
        <AccordionHeader 
          title="Cuanto"
          extra={monto ? `$${monto}` : ''}
          isOpen={seccionAbierta === 'cuanto'}
          onClick={() => {toggleSeccion('cuanto'); document.getElementById('monto')?.focus();}}
          onKeyDown={(e) => handleKeyDown(e, 'cuanto')}
          isFirstSection={true}
        />
        
            <AccordionContent isOpen={seccionAbierta === 'cuanto'}>
              <MontoSection 
                monto={monto}
                onChange={handleMontoChange}
                onPresetClick={handleMontoPreset}
              />
            </AccordionContent>
        
        <br />
        {/* Sección De */}
        <AccordionHeader 
          title="De"
          isOpen={seccionAbierta === 'de'}
          onClick={() => {toggleSeccion('de'); document.getElementById('email')?.focus();}}
          onKeyDown={(e) => handleKeyDown(e, 'de')}
        />
        
           <AccordionContent isOpen={seccionAbierta === 'de'}>
          <PersonalInfoSection 
            email={email}
            nombre={nombre}
            telefono={telefono}
            onEmailChange={handleEmailChange}
            onNombreChange={handleNombreChange}
            onTelefonoChange={handleTelefonoChange}

          />
          </AccordionContent>
        
        <div className="p-8 bg-gray-50 border-t border-gray-100">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
          >
            {seccionAbierta === 'cuanto' ? 'Continuar' : 'Confirmar donación'}
          </button>
        </div>
      </form>
    </div>
  );
}