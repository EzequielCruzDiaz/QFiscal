export type Plan = "basico" | "pro" | "enterprise";
export type RolUsuario = "admin" | "contador" | "usuario";
export type EstadoFactura = "pendiente" | "registrado" | "error";

export interface Empresa {
  id: string;
  nombre: string;
  rnc?: string;
  plan: Plan;
  facturas_limite: number;
  created_at: string;
}

export interface Profile {
  id: string;
  empresa_id: string;
  nombre: string;
  rol: RolUsuario;
  created_at: string;
}

export interface Factura {
  id: string;
  empresa_id: string;
  usuario_id: string;
  proveedor?: string;
  rnc_proveedor?: string;
  ncf?: string;
  tipo_ncf?: string;
  fecha_factura?: string;
  subtotal?: number;
  itbis?: number;
  total?: number;
  retencion_itbis?: number;
  retencion_isr?: number;
  estado: EstadoFactura;
  error_mensaje?: string;
  archivo_url?: string;
  asiento_contable?: string;
  created_at: string;
}

export interface ChatMensaje {
  id: string;
  rol: "user" | "assistant";
  contenido: string;
  created_at: string;
}

// Alias para compatibilidad con componentes de chat
export type Message = {
  role: "user" | "assistant";
  content: string;
};
