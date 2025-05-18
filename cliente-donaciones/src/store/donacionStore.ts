import { create } from 'zustand';

interface DonacionState {
  monto: number | null;
  email: string | null;
  nombre: string | null;
  telefono: string | null;
  description: string | null;
  purchaseAmount: number | null;
  
  // Acciones
  setDonacionData: (data: Partial<Omit<DonacionState, 'setDonacionData' | 'resetDonacionData'>>) => void;
  resetDonacionData: () => void;
}

export const useDonacionStore = create<DonacionState>((set) => ({
  monto: null,
  email: null,
  nombre: null,
  telefono: null,
  description: null,
  purchaseAmount: null,
  
  setDonacionData: (data) => set((state) => ({ ...state, ...data })),
  resetDonacionData: () => set({ 
    monto: null, 
    email: null, 
    nombre: null, 
    telefono: null, 
    description: null,
    purchaseAmount: null
  }),
}));
