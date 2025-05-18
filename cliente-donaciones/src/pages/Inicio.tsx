import React, { useEffect, useState } from 'react'
import { Link } from 'wouter'
import { FaCreditCard, FaUniversity } from 'react-icons/fa'

// Token para ipinfo.io
const IPINFO_TOKEN = import.meta.env.VITE_IPINFO_TOKEN;

function Inicio() {
  const [isEcuador, setIsEcuador] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Intentamos usar valor cacheado para no golpear la API en cada recarga
    // const cachedCountry = localStorage.getItem("countryCode");
    const cachedCountry = false;
    
    if (cachedCountry) {
      // setIsEcuador(cachedCountry.toUpperCase() === "EC");
      setLoading(false);
    } else {
      fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`)
        .then((response) => response.json())
        .then((data) => {
          const country = data.country;
          // localStorage.setItem("countryCode", country);
          setIsEcuador(country.toUpperCase() === "EC");
          setLoading(false);
        })
        .catch(() => {
          // En caso de error, mostramos todas las opciones por defecto
          setIsEcuador(true);
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Dona al <span className="text-orange-500">Banco de Alimentos</span> de Quito
      </h1>
      
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">
          Opciones de pago
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <Link href='/tarjeta'>
              <a className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer">
                <FaCreditCard className="mr-3 text-xl" />
                Tarjeta de crédito
              </a>
            </Link>
            
            {isEcuador && (
              <>
                <br />
                <Link href='/debito'>
                  <a className="w-full flex justify-center items-center py-3 px-6 border border-gray-300 rounded-lg shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer">
                    <FaUniversity className="mr-3 text-xl" />
                    Débito bancario automático
                  </a>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Inicio