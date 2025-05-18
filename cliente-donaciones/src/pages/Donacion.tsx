import React, { useEffect } from 'react'
import PpxButton from '../components/PpxButton'
import { useLocation } from 'wouter';
import { useDonacionStore } from '../store/donacionStore';

export default function Donacion() {
    const [location, params] = useLocation();
    
    // Obtener datos del store en lugar de history.state
    const { email, nombre, telefono, purchaseAmount, description, monto } = useDonacionStore();
    
    console.log('monto', monto);
    console.log('email', email);
    
    useEffect(() => {
        console.log('location', monto);
        // Agregamos un pequeño retraso para asegurar que el DOM esté listo
        const handleModal = () => {
            const modal = document.getElementById('paybox_modal');
            if (modal) {
                console.log('Elemento paybox_modal encontrado:', modal);
                modal.style.cssText = `
                    display: block !important;
                    visibility: visible !important;
                    overflow-y: auto !important;
                    -webkit-overflow-scrolling: touch !important;
                `;
            } else {
                console.error('No se encontró el elemento paybox_modal');
            }
        };
        document.getElementById('pay')?.click();

        // Intentar inmediatamente
        handleModal();

        // Y también después de un pequeño retraso
        const timer = setTimeout(handleModal, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Preparar datos para PpxButton
    const buttonData = {
        purchaseAmount: purchaseAmount || monto,
        description: description || 'Donación para el Banco de Alimentos',
        email: email,
        nombre: nombre,
        telefono: telefono
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center py-12 px-4">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                Resumen de tu <span className="text-orange-500">Donación</span>
            </h1>

            <div className="w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                <div className="p-6">
                    <div className="space-y-6">
                        {/* Monto */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-700">
                                Monto a donar
                            </h2>
                            <p className="text-3xl font-bold text-orange-500 mt-1">
                                ${purchaseAmount || monto}
                            </p>
                        </div>

                        {/* Descripción */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-700">
                                Descripción
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {description || 'Donación para el Banco de Alimentos'}
                            </p>
                        </div>

                        {/* Información adicional si la hay */}
                        {email && (
                            <div>
                                <h2 className="text-lg font-medium text-gray-700">
                                    Correo electrónico
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    {email}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <div id="modalPaybox"></div>
                    <div className="flex justify-center">
                        {/* <PpxButton 
                            data={buttonData} 
                            fnValidacion={() => true}
                        /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
