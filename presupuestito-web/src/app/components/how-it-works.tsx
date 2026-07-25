import { FilePlus2, Calculator, Send } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      title: "Elegí una plantilla",
      description: "Olvidate de configuraciones. Seleccioná tu oficio y empezá a cotizar al instante.",
      icon: <FilePlus2 className="w-6 h-6 text-primary" strokeWidth={2} />,
    },
    {
      title: "Agregá tus precios",
      description: "Cargá rápidamente mano de obra, materiales y agregá tu logotipo para personalizar.",
      icon: <Calculator className="w-6 h-6 text-primary" strokeWidth={2} />,
    },
    {
      title: "Enviá el PDF",
      description: "Con un clic, mandás el documento final directo al WhatsApp de tu cliente.",
      icon: <Send className="w-6 h-6 text-primary" strokeWidth={2} />,
    },
  ];

  return (
    <section className="px-6 py-12 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-4">
            Flujo sin fricciones.
          </h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto font-medium">
            Tres pasos simples que toman menos tiempo que mandar un audio de WhatsApp.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 md:gap-8 relative">
          {/* Línea conectora (Timeline) - Solo en desktop */}
          <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-px bg-outline-variant/40" />

          {steps.map((step, i) => (
            <div key={i} className="flex-1 flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 bg-surface rounded-2xl shadow-sm border border-outline-variant/20 flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-on-surface mb-3">{step.title}</h3>
              <p className="text-on-surface-variant font-medium leading-relaxed max-w-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
