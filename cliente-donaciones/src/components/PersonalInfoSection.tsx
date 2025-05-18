import React from 'react';
import InputField from './InputField';
import InputTelefono from './InputTelefono';

interface PersonalInfoSectionProps {
  email: string;
  nombre: string;
  telefono?: string;
  onTelefonoChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNombreChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  email,
  nombre,
  onEmailChange,
  onNombreChange,
  onBlur

}) => {
  return (
    <div className="p-8 space-y-6 bg-white transition-all duration-300 ease-in-out animate-fadeIn">
      <InputField
        id="email"
        label="Email"
        value={email}
        onChange={onEmailChange}
        type="email"
        onBlur={onBlur}
        placeholder="tu@email.com"
        required
      />

      <InputField
        id="nombre"
        label="Nombre"
        value={nombre}
        onBlur={onBlur}
        onChange={onNombreChange}
        placeholder="Tu nombre"
        isOptional
      />

      <div>
        <label htmlFor="phone" className="block text-lg font-medium text-gray-700 mb-2 text-left">
          Teléfono <span className="text-gray-500 text-sm">(opcional)</span>
        </label>
        <div className="mt-1">
          <InputTelefono />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
