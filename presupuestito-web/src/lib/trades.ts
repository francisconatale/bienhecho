export interface Trade {
  id: string;
  label: string;
  template: string;
}

export const TRADES: Trade[] = [
  { id: 'construccion', label: 'Construcción', template: 'Obra en {clienteProject}' },
  { id: 'electricidad', label: 'Electricidad', template: 'Instalación eléctrica en {clienteProject}' },
  { id: 'plomeria', label: 'Plomería', template: 'Sistema de plomería en {clienteProject}' },
  { id: 'pintura', label: 'Pintura', template: 'Pintura para {clienteProject}' },
  { id: 'carpinteria', label: 'Carpintería', template: 'Carpintería en {clienteProject}' },
  { id: 'herreria', label: 'Herrería', template: 'Trabajo de herrería en {clienteProject}' },
  { id: 'mamposteria', label: 'Mampostería', template: 'Mampostería en {clienteProject}' },
  { id: 'cerrajeria', label: 'Cerrajería', template: 'Cerrajería para {clienteProject}' },
  { id: 'aluminios', label: 'Aluminios', template: 'Estructura de aluminio en {clienteProject}' },
  { id: 'revestimientos', label: 'Revestimientos', template: 'Revestimiento en {clienteProject}' },
  { id: 'climatizacion', label: 'Climatización', template: 'Sistema de climatización en {clienteProject}' },
  { id: 'jardineria', label: 'Jardinería', template: 'Diseño de jardín en {clienteProject}' },
  { id: 'limpieza', label: 'Limpieza', template: 'Limpieza profunda en {clienteProject}' },
  { id: 'electrodomesticos', label: 'Electrodomésticos', template: 'Reparación de electrodoméstico en {clienteProject}' },
  { id: 'mantenimiento', label: 'Mantenimiento', template: 'Mantenimiento general en {clienteProject}' },
  { id: 'telecomunicaciones', label: 'Telecomunicaciones', template: 'Instalación de servicios en {clienteProject}' },
  { id: 'mecanica', label: 'Mecánica', template: 'Reparación vehicular en {clienteProject}' },
  { id: 'reformas', label: 'Reformas Integrales', template: 'Reforma integral en {clienteProject}' },
  { id: 'tapiceria', label: 'Tapicería', template: 'Tapizado en {clienteProject}' },
  { id: 'poda', label: 'Poda', template: 'Poda y mantenimiento en {clienteProject}' },
  { id: 'diseño', label: 'Diseño', template: 'Proyecto de diseño para {clienteProject}' },
];
