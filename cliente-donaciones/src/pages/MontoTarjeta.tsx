import React, { useEffect, useState } from 'react';
import AccordionHeader from '../components/AccordionHeader';
import MontoSection from '../components/MontoSection';
import PersonalInfoSection from '../components/PersonalInfoSection';
import { useAccordion } from '../hooks/useAccordion';
import AccordionContent from '../components/AccordionContent';
import { useLocation } from "wouter";
import { toast } from 'react-hot-toast';
import PpxButton from '../components/PpxButton';
import { iniciarDatos } from '../configuration/ppx.index';
import { data } from '../configuration/ppx.data';
import { useDonacionStore } from '../store/donacionStore';
let data2 = {}

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

function validarEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export default function MontoTarjeta() {
  const { monto, handleMontoChange, handleMontoPreset } = useMontoSection();
  const { email, nombre, telefono, handleEmailChange, handleNombreChange, handleTelefonoChange } = useInfoSection();
  const { seccionAbierta, toggleSeccion, handleKeyDown } = useAccordion('cuanto');
  const { setDonacionData } = useDonacionStore();
  const [puedePagar, setPuedePagar] = useState(false);
  const [suscripcion, setSuscripcion] = useState(false);
  const [data3, setData3] = useState({...data});

  const [_, navigate] = useLocation()

  const validar = () => {
    if(seccionAbierta === 'cuanto') {
      toggleSeccion('de');
      document.getElementById('email')?.focus();
      return false;
    }

    if(!monto || monto === '' || monto === '0') {
      toast.error('Por favor completa el monto');
      toggleSeccion('cuanto');
      document.getElementById('monto')?.focus();
      return false;
    }

    if(!email || email === '' ) {
      toast.error('Por favor completa el correo electrónico');
      // toggleSeccion('de');
      document.getElementById('email')?.focus();
      return false;
    }

    if(!validarEmail(email)) {
      toast.error('El correo electrónico no es válido');
      document.getElementById('email')?.focus();
      return false;
    }

    if(telefono.length > 0 && telefono.length < 9) {
      toast.error('El número de teléfono debe tener al menos 9 dígitos');
      document.getElementById('telefono')?.focus();
      return false;
    }

    return true;
  }

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

    if(!email || email === '' ) {
      toast.error('Por favor completa el correo electrónico');
      // toggleSeccion('de');
      document.getElementById('email')?.focus();
      return false;
    }

    if(!validarEmail(email)) {
      toast.error('El correo electrónico no es válido');
      document.getElementById('email')?.focus();
      return false;
    }

    if(telefono.length > 0 && telefono.length < 9) {
      toast.error('El número de teléfono debe tener al menos 9 dígitos');
      document.getElementById('telefono')?.focus();
      return false;
    }

    setDonacionData({
      monto: parseFloat(monto),
      email,
      nombre,
      telefono,
      description: 'Donación para el Banco de Alimentos',
      purchaseAmount: parseFloat(monto)
    });

    navigate('/pagar', {
      state: {
        monto,
        email,
        nombre,
        telefono
      }
    });
  }

  const handleBlur = () => {
    console.log('blur');
    if(!monto || monto === '' || monto === '0') {
          setPuedePagar(false);
    }

    if(!email || email === '' ) {
      setPuedePagar(false);
    }

    if(!validarEmail(email)) {
      setPuedePagar(false);
    }

    if(telefono.length > 0 && telefono.length < 9) {
      setPuedePagar(false);
    }

    if(monto && email && validarEmail(email) && (telefono.length === 0 || telefono.length >= 9)) {
      setPuedePagar(true);
    } else {
      setPuedePagar(false);
    }

    const tempdata = { };
    tempdata.PaySendname = "";
    if(monto) {
      // @ts-ignore
      tempdata.PayboxBase0 = monto;
      tempdata.PayboxBase12 = 0;
      // data2.PayboxAmount = monto;
    }
    if(email) {
      // @ts-ignore
      tempdata.PayboxClientEmail = email;
      // setData3({ ...data3, PayboxSendmail: email });
      // data2.PayboxClientEmail = email;
    }
    if(nombre.length > 0) {
      // @ts-ignore
      console.log('nombre', nombre);
      tempdata.PayboxSendname = nombre;
      // setData3({ ...data3, PayboxSendname: nombre });
      // data2.PayboxClientName = nombre;
    }
    if(telefono) {
      // @ts-ignore
      tempdata.PayboxClientPhone = telefono;
      // setData3({ ...data3, PayBoxClientPhone: telefono });
      // data2.PayboxClientPhone = telefono;
      // data2.PayboxClientPhone = telefono;
    }
    if(suscripcion) {
      // @ts-ignore
      tempdata.PayboxRecurrent = true;
      // setData3({ ...data3, PayboxRecurrent: true });
    } else {
      // @ts-ignore
      tempdata.PayboxRecurrent = false;
      // setData3({ ...data3, PayboxRecurrent: false });
    }

    tempdata.PayBoxRemail = "abautista@pagoplux.com";
    tempdata.PayboxDescription = 'Donación para el Banco de Alimentos';


    // setData3({ ...data3, PayboxRemail: "abautista@pagoplux.com" });
    setData3({ ...data3, ...tempdata });
  }

  useEffect(() => {
    console.log('data3', data3);
  }, [data3])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Dona al <span className="text-orange-500">Banco de Alimentos</span> de Quito
      </h1>
      <div id="modalPaybox"></div>
      
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
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
            onBlur={handleBlur}
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
            onBlur={handleBlur}
          />
        </AccordionContent>
        
        <div className="p-8 bg-gray-50 border-t border-gray-100">
         
          {
            puedePagar ? (<PpxButton data={data3}/>) : (<button
            type="submit"
            onClick={handleSubmit}
            className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
          >
            {seccionAbierta === 'cuanto' ? 'Continuar' : 'Pagar'}
          </button>)
          }
        </div>
      </div>
       
    </div>
  );
}