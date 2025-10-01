import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string;
          email: string;
          nombre: string;
          telefono: string | null;
          rol: 'administrador' | 'residente' | 'visitante';
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          nombre: string;
          telefono?: string | null;
          rol: 'administrador' | 'residente' | 'visitante';
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          nombre?: string;
          telefono?: string | null;
          rol?: 'administrador' | 'residente' | 'visitante';
          activo?: boolean;
          updated_at?: string;
        };
      };
      residentes: {
        Row: {
          id: string;
          usuario_id: string;
          unidad: string;
          piso: string | null;
          torre: string | null;
          fecha_ingreso: string | null;
          es_propietario: boolean;
          created_at: string;
        };
      };
      vehiculos: {
        Row: {
          id: string;
          residente_id: string;
          placa: string;
          tipo: 'auto' | 'moto' | 'bicicleta' | 'otro';
          marca: string | null;
          modelo: string | null;
          color: string | null;
          activo: boolean;
          created_at: string;
        };
      };
      areas_comunes: {
        Row: {
          id: string;
          nombre: string;
          descripcion: string | null;
          capacidad_maxima: number | null;
          costo_reserva: number;
          requiere_aprobacion: boolean;
          activa: boolean;
          horario_apertura: string | null;
          horario_cierre: string | null;
          created_at: string;
        };
      };
      reservas_area: {
        Row: {
          id: string;
          area_id: string;
          residente_id: string;
          fecha_reserva: string;
          hora_inicio: string;
          hora_fin: string;
          estado: 'pendiente' | 'aprobada' | 'rechazada' | 'cancelada' | 'completada';
          motivo: string | null;
          numero_personas: number | null;
          observaciones: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      transacciones: {
        Row: {
          id: string;
          residente_id: string;
          tipo: 'pago' | 'cargo' | 'multa' | 'ajuste';
          concepto: string;
          monto: number;
          fecha: string;
          estado: 'pendiente' | 'completada' | 'cancelada';
          metodo_pago: 'efectivo' | 'transferencia' | 'tarjeta' | 'cheque' | null;
          referencia: string | null;
          created_at: string;
        };
      };
      facturas: {
        Row: {
          id: string;
          residente_id: string;
          numero_factura: string;
          fecha_emision: string;
          fecha_vencimiento: string;
          subtotal: number;
          impuestos: number;
          total: number;
          estado: 'pendiente' | 'pagada' | 'vencida' | 'cancelada';
          created_at: string;
        };
      };
      detalle_factura: {
        Row: {
          id: string;
          factura_id: string;
          concepto: string;
          cantidad: number;
          precio_unitario: number;
          subtotal: number;
          created_at: string;
        };
      };
      incidentes: {
        Row: {
          id: string;
          residente_id: string;
          titulo: string;
          descripcion: string;
          categoria: 'mantenimiento' | 'seguridad' | 'limpieza' | 'ruido' | 'otro';
          prioridad: 'baja' | 'media' | 'alta' | 'urgente';
          estado: 'abierto' | 'en_proceso' | 'resuelto' | 'cerrado';
          ubicacion: string | null;
          fecha_reporte: string;
          fecha_resolucion: string | null;
          respuesta_admin: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};
