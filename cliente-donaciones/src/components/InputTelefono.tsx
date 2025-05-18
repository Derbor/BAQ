import { useEffect, useRef } from "react";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";

const IPINFO_TOKEN = import.meta.env.VITE_IPINFO_TOKEN;

interface InputTelefonoProps {
  id?: string;
  label?: string;
  onChange?: (value: string, isValid: boolean) => void;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  isOptional?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function InputTelefono({ 
  id = "phone", 
  label = "", 
  onChange, 
  onBlur,
  placeholder = "Número de teléfono",
  required = false,
  autoFocus = false,
  isOptional = false
}: InputTelefonoProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const itiRef = useRef<any>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    
    // Función para determinar el país basado en IP
    const geoIpLookup = (callback: (countryCode: string) => void) => {
      const cachedCountry = localStorage.getItem("countryCode");
      
      if (cachedCountry) {
        callback(cachedCountry);
        return;
      }

      fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`)
        .then(response => {
          if (!response.ok) throw new Error('Error en la respuesta de IP Info');
          return response.json();
        })
        .then(data => {
          if (data && data.country) {
            localStorage.setItem("countryCode", data.country);
            callback(data.country);
          } else {
            throw new Error('Datos de país no disponibles');
          }
        })
        .catch(error => {
          console.error('Error al obtener información del país:', error);
          callback("ec"); // Default a Ecuador como fallback
        });
    };

    // Cargar el script de utilidades primero
    const loadUtils = () => {
      return new Promise<void>((resolve) => {
        //@ts-ignore
        if (window.intlTelInputUtils) {
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => {
          console.error("Error al cargar utils.js");
          resolve();
        };
        document.body.appendChild(script);
      });
    };

    // Inicializar el componente después de cargar las utilidades
    loadUtils().then(() => {
      if (!inputRef.current) return;
      
      try {
        const iti = intlTelInput(inputRef.current, {
          initialCountry: "auto",
          autoPlaceholder: "aggressive",
          placeholderNumberType: "MOBILE",
          preferredCountries: ["ec", "co", "pe"],
          separateDialCode: true,
          dropdownContainer: document.body,
          geoIpLookup,
        } as any);

        itiRef.current = iti;

        // Agregar manejador de eventos para notificar cambios
        const handleChange = () => {
          if (onChange && iti) {
            try {
              const value = iti.getNumber();
              const isValid = iti.isValidNumber();
              onChange(value, isValid || false);
            } catch (error) {
              console.error("Error al obtener el número:", error);
            }
          }
        };

        inputRef.current.addEventListener('input', handleChange);
        inputRef.current.addEventListener('blur', handleChange);
      } catch (error) {
        console.error("Error al inicializar intl-tel-input:", error);
      }
    });

    // Cleanup al desmontar el componente
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener('input', () => {});
        inputRef.current.removeEventListener('blur', () => {});
      }
      
      if (itiRef.current) {
        try {
          itiRef.current.destroy();
        } catch (error) {
          console.error("Error al destruir intl-tel-input:", error);
        }
      }
    };
  }, [onChange]);

  // Aplicar estilos adicionales después de la renderización
  useEffect(() => {
    if (!inputRef.current) return;
    
    const applyStyles = () => {
      const container = inputRef.current?.parentElement?.querySelector('.iti');
      if (container) {
        // Establecer el ancho completo
        container.classList.add("w-full");
        (container as HTMLElement).style.width = "100%";
        
        // Ajustar el contenedor de la bandera
        const flagContainer = container.querySelector('.iti__flag-container');
        if (flagContainer) {
          (flagContainer as HTMLElement).style.zIndex = "50"; // Aumentar z-index para asegurar visibilidad
          (flagContainer as HTMLElement).style.height = "100%";
          
          const selectedFlag = flagContainer.querySelector('.iti__selected-flag');
          if (selectedFlag) {
            (selectedFlag as HTMLElement).style.height = "100%";
            (selectedFlag as HTMLElement).style.display = "flex";
            (selectedFlag as HTMLElement).style.alignItems = "center";
            (selectedFlag as HTMLElement).style.paddingLeft = "20px"; // Aumentar padding
            (selectedFlag as HTMLElement).style.borderRadius = "0.5rem 0 0 0.5rem";
            (selectedFlag as HTMLElement).style.backgroundColor = "#f9fafb"; // bg-gray-50
            (selectedFlag as HTMLElement).style.cursor = "pointer"; // Indicar que es clickeable
          }
        }
        
        // Ajustar el input para hacerlo más grande
        if (inputRef.current) {
          inputRef.current.style.paddingLeft = "95px"; 
          inputRef.current.style.fontSize = "1.25rem"; // Aumentar tamaño de fuente
          inputRef.current.style.height = "3.5rem"; // Altura más grande
        }
        
        // Mejorar la visualización del dropdown de países
        const dropdown = document.querySelector('.iti__country-list');
        if (dropdown) {
          (dropdown as HTMLElement).style.fontSize = "1.25rem"; // Texto más grande
          (dropdown as HTMLElement).style.maxHeight = "300px"; // Hacer más alto el dropdown
          (dropdown as HTMLElement).style.width = "360px"; // Hacer más ancho el dropdown
          (dropdown as HTMLElement).style.overflowY = "auto"; // Asegurar scroll
          (dropdown as HTMLElement).style.zIndex = "9999"; // Mayor z-index para que aparezca por encima
          (dropdown as HTMLElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)"; // Sombra más notoria
          
          // Añadir estilos a los elementos dentro del dropdown
          const countries = dropdown.querySelectorAll('.iti__country');
          countries.forEach(country => {
            (country as HTMLElement).style.padding = "10px 15px"; // Más espacio para cada país
          });
        }
      }
    };
    
    // Intentar aplicar los estilos varias veces para asegurar que se apliquen
    setTimeout(applyStyles, 100);
    
    const styleInterval = setInterval(applyStyles, 300);
    setTimeout(() => clearInterval(styleInterval), 3000); // Mayor tiempo para aplicar estilos
    
    return () => clearInterval(styleInterval);
  }, []);

  // Añadir este CSS global al componente
  useEffect(() => {
    // Crear un elemento de estilo y añadirlo al head
    const style = document.createElement('style');
    style.innerHTML = `
      .iti__country-list {
        max-height: 300px !important;
        width: 360px !important;
        overflow-y: auto !important;
        font-size: 1.25rem !important;
        z-index: 9999 !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
      }
      /* Mostrar la lista encima del input */
      .iti--dropdown-open .iti__country-list {
        top: auto !important;
        bottom: 100% !important;
        margin-bottom: 8px !important;
      }
      .iti__country {
        padding: 10px 15px !important;
      }
      .iti__country:hover {
        background-color: #f3f4f6 !important;
      }
      .iti__selected-flag {
        cursor: pointer !important;
      }
      .iti__flag-container {
        z-index: 50 !important;
      }
    `;
    document.head.appendChild(style);
    
    // Eliminar el estilo al desmontar
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-xl font-medium text-gray-700 mb-3 text-left">
          {label}
          {required && <span className="text-orange-500">*</span>}
          {isOptional && <span className="text-gray-500 text-sm ml-1">(opcional)</span>}
        </label>
      )}
      <div className="w-full relative">
        <input 
          ref={inputRef}
          id={id}
          name={id}
          type="tel" 
          onBlur={onBlur}
          maxLength={10}
          minLength={9}
          placeholder={placeholder}
          required={required}
          autoFocus={autoFocus}
          className="mt-1 block w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm text-xl focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          style={{height: "3.5rem"}} // Asegurar que sea más alto
        />
      </div>
    </div>
  );
}