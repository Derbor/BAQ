import React from 'react';

interface MontoSectionProps {
  monto: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPresetClick: (valor: string) => void;
}

const MontoSection: React.FC<MontoSectionProps> = ({ monto, onChange, onPresetClick }) => {
  return (
    <div className="p-8 space-y-6 bg-white transition-all duration-300 ease-in-out animate-fadeIn">
      <div>
        <label htmlFor="monto" className="block text-lg font-medium text-gray-700 mb-2">
          Monto a donar
        </label>
        <div className="mt-2 flex rounded-lg shadow-sm overflow-hidden">
          <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 text-gray-600 text-lg font-medium rounded-l-lg">
            USD
          </span>
          <input
            type="number"
            name="monto"
            id="monto"
            autoFocus
            value={monto}
            onChange={onChange}
            className="flex-1 min-w-0 block w-full px-4 py-3 text-lg rounded-r-lg focus:ring-orange-500 focus:border-orange-500 border-gray-300"
            placeholder="10"
          />
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          {['3', '10', '30'].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => onPresetClick(val)}
              className={`px-6 py-3 cursor-pointer border-2 rounded-lg text-lg font-medium transition-all ${
                monto === val 
                  ? 'bg-orange-100 text-orange-700 border-orange-500 shadow-md transform scale-105' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-orange-300'
              }`}
            >
              ${val}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MontoSection;
