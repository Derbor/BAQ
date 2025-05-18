import React from 'react'
import { useDonacionStore } from '../store/donacionStore';


export async function obtenerIP() {
  try {
// export async function obtenerIP() {
//   try {
//     const res = await fetch('https://api64.ipify.org?format=json');
//     const data = await res.json();
//     console.log('IP del cliente:', data.ip);
//     return data.ip;
//   } catch (error) {
//     console.error('No se pudo obtener la IP:', error);
//     return '';
//   }
// }

// export async function enviarDonacion(data: any) {
//   try {
//     const ip = await obtenerIP();
//     const response = await fetch(import.meta.env.VITE_SERVER_HOST + '/donate', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         email: data.email,
//         amount: parseFloat(data.monto),
//         last_card_digits: '1234', // puedes obtenerlo luego del pago real
//         device_footprint: navigator.userAgent,
//         transaction_ip: ip // puedes dejarlo vacío o agregarlo si lo capturas
//       }),
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       return;
//     }

//     console.log('Respuesta:', result);
//   } catch (err) {
//     console.error(err);
//   }
// }

// export async function obtenerIP() {
//   try {
//     const res = await fetch('https://api64.ipify.org?format=json');
//     const data = await res.json();
//     console.log('IP del cliente:', data.ip);
//     return data.ip;
//   } catch (error) {
//     console.error('No se pudo obtener la IP:', error);
//     return '';
//   }
// }

// export async function enviarDonacion(data: any) {
//   try {
//     const ip = await obtenerIP();
//     const response = await fetch(import.meta.env.VITE_SERVER_HOST + '/donate', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         email: data.email,
//         amount: parseFloat(data.monto),
//         last_card_digits: '1234', // puedes obtenerlo luego del pago real
//         device_footprint: navigator.userAgent,
//         transaction_ip: ip // puedes dejarlo vacío o agregarlo si lo capturas
//       }),
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       return;
//     }

//     console.log('Respuesta:', result);
//   } catch (err) {
//     console.error(err);
//   }
// }

    const res = await fetch('https://api64.ipify.org?format=json');
    const data = await res.json();
    console.log('IP del cliente:', data.ip);
    return data.ip;
  } catch (error) {
    console.error('No se pudo obtener la IP:', error);
    return '';
  }
}

export async function enviarDonacion(data: any) {
  try {
    const ip = await obtenerIP();
    const response = await fetch(import.meta.env.VITE_SERVER_HOST + '/donate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        amount: parseFloat(data.monto),
        last_card_digits: '1234', // puedes obtenerlo luego del pago real
        device_footprint: navigator.userAgent,
        transaction_ip: ip // puedes dejarlo vacío o agregarlo si lo capturas
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return;
    }

    console.log('Respuesta:', result);
  } catch (err) {
    console.error(err);
  }
}


export default function Pagado() {
    // zustand
    const { monto, email, nombre } = useDonacionStore();

    enviarDonacion({
        email,
        monto,
        nombre
    });
  return (
    <div>Pagado</div>
  )
}
