import React, { useEffect } from 'react'
import PpxButton from '../components/PpxButton'
import { data } from '../configuration/ppx.data'

interface PpxButtonProps {
    data: any;
}
export default function Donacion(data: PpxButtonProps) {

    useEffect(() => {
        // has click en el botón de pagar
        setTimeout(() => {
            document.getElementById('pay')?.click();
        }, 10000)
    }, [])
  return (
     <PpxButton data={data} />
  )
}
