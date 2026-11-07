export interface Trade {
  id: string;
  label: string;
  template: string;
  suggestions: string[];
}

export const TRADES: Trade[] = [
  { 
    id: 'construccion', 
    label: 'Construcción', 
    template: 'Obra en {clienteProject}',
    suggestions: ['Mano de obra albañilería', 'Bolsa de cemento 50kg', 'Arena por m3', 'Ladrillo hueco 12x18x33', 'Hierro del 8']
  },
  { 
    id: 'electricidad', 
    label: 'Electricidad', 
    template: 'Instalación eléctrica en {clienteProject}',
    suggestions: ['Instalación de luminaria', 'Cable unipolar 2.5mm', 'Térmica bipolar 20A', 'Caja rectangular exterior', 'Buscapolo digital']
  },
  { 
    id: 'plomeria', 
    label: 'Plomería', 
    template: 'Sistema de plomería en {clienteProject}',
    suggestions: ['Reparación de pérdida', 'Tubo termofusión 20mm', 'Canilla monocomando', 'Válvula de seguridad', 'Sifón de cocina']
  },
  { 
    id: 'pintura', 
    label: 'Pintura', 
    template: 'Pintura para {clienteProject}',
    suggestions: ['Pintura látex interior 20L', 'Rodillo de lana', 'Enduido plástico', 'Lija madera grano 120', 'Fijador sellador']
  },
  { 
    id: 'carpinteria', 
    label: 'Carpintería', 
    template: 'Carpintería en {clienteProject}',
    suggestions: ['Placa melamina 18mm', 'Bisagra tipo cangrejo', 'Tornillo madera 3.5x40', 'Pegamento contacto', 'Corte de madera a medida']
  },
  { 
    id: 'herreria', 
    label: 'Herrería', 
    template: 'Trabajo de herrería en {clienteProject}',
    suggestions: ['Electrodos 2.5mm', 'Caño estructural 20x20', 'Disco de corte 4 1/2', 'Pintura antióxido', 'Soldadura punto a punto']
  },
  { 
    id: 'mamposteria', 
    label: 'Mampostería', 
    template: 'Mampostería en {clienteProject}',
    suggestions: ['Mezcla fina preparada', 'Revoque grueso', 'Capa aisladora', 'Colocación de cerámicos', 'Zócalos']
  },
  { 
    id: 'cerrajeria', 
    label: 'Cerrajería', 
    template: 'Cerrajería para {clienteProject}',
    suggestions: ['Cerradura de seguridad', 'Cilindro europerfil', 'Copia de llave', 'Lubricante grafito', 'Picaporte aluminio']
  },
  { 
    id: 'aluminios', 
    label: 'Aluminios', 
    template: 'Estructura de aluminio en {clienteProject}',
    suggestions: ['Ventana línea Módena', 'Burlete de caucho', 'Sellador silicona', 'Rueda para corrediza', 'Paño fijo 4mm']
  },
  { 
    id: 'revestimientos', 
    label: 'Revestimientos', 
    template: 'Revestimiento en {clienteProject}',
    suggestions: ['Porcelanato 60x60', 'Pastina color gris', 'Pegamento para cerámico', 'Niveladores de piso', 'Revestimiento plástico exterior']
  },
  { 
    id: 'climatizacion', 
    label: 'Climatización', 
    template: 'Sistema de climatización en {clienteProject}',
    suggestions: ['Instalación split 3000', 'Carga de gas R410', 'Ménsulas reforzadas', 'Limpieza de filtros', 'Termostato digital']
  },
  { 
    id: 'jardineria', 
    label: 'Jardinería', 
    template: 'Diseño de jardín en {clienteProject}',
    suggestions: ['Tierra negra abonada', 'Pasto en panes grama', 'Planta ornamental', 'Sistema de riego', 'Fertilizante triple 15']
  },
  { 
    id: 'limpieza', 
    label: 'Limpieza', 
    template: 'Limpieza profunda en {clienteProject}',
    suggestions: ['Limpieza fin de obra', 'Desinfectante industrial', 'Lavado de alfombras', 'Pulido de pisos', 'Insumos de limpieza']
  },
  { 
    id: 'electrodomesticos', 
    label: 'Electrodomésticos', 
    template: 'Reparación de electrodoméstico en {clienteProject}',
    suggestions: ['Cambio de resistencia', 'Plaqueta universal', 'Reparación de motor', 'Carga de gas heladera', 'Manguera de desagote']
  },
  { 
    id: 'mantenimiento', 
    label: 'Mantenimiento', 
    template: 'Mantenimiento general en {clienteProject}',
    suggestions: ['Ajuste general de aberturas', 'Cambio de luminarias', 'Revisión de instalaciones', 'Pintura de mantenimiento', 'Lubricación de herrajes']
  },
  { 
    id: 'telecomunicaciones', 
    label: 'Telecomunicaciones', 
    template: 'Instalación de servicios en {clienteProject}',
    suggestions: ['Cable UTP Cat6', 'Conector RJ45', 'Instalación de router', 'Cableado de red', 'Rack de pared']
  },
  { 
    id: 'mecanica', 
    label: 'Mecánica', 
    template: 'Reparación vehicular en {clienteProject}',
    suggestions: ['Cambio de aceite y filtro', 'Pastillas de freno', 'Kit de distribución', 'Alineación y balanceo', 'Escaneo computarizado']
  },
  { 
    id: 'reformas', 
    label: 'Reformas Integrales', 
    template: 'Reforma integral en {clienteProject}',
    suggestions: ['Demolición de tabique', 'Instalación termo-acústica', 'Cambio de pisos', 'Nueva iluminación led', 'Mobiliario a medida']
  },
  { 
    id: 'tapiceria', 
    label: 'Tapicería', 
    template: 'Tapizado en {clienteProject}',
    suggestions: ['Tela Jackard', 'Goma espuma alta densidad', 'Cinchas elásticas', 'Tachas decorativas', 'Retapizado de silla']
  },
  { 
    id: 'poda', 
    label: 'Poda', 
    template: 'Poda y mantenimiento en {clienteProject}',
    suggestions: ['Poda de altura', 'Retiro de ramas', 'Desmonte de terreno', 'Tala selectiva', 'Curado de plantas']
  },
  { 
    id: 'diseño', 
    label: 'Diseño', 
    template: 'Proyecto de diseño para {clienteProject}',
    suggestions: ['Diseño de logotipo', 'Identidad visual', 'Flyer para redes', 'Maquetado web', 'Asesoría de imagen']
  },
];
