export function FaqSection() {
  const faqs = [
    {
      question: "¿Hay algún costo para usarlo?",
      answer: "No. La creación y el envío de los presupuestos es gratis. No te pedimos tarjeta para empezar ni encontrarás sorpresas ocultas.",
    },
    {
      question: "¿Necesito conocimientos técnicos?",
      answer: "Para nada. Si sabes enviar un audio o una foto por tu celular, sabes usar esta herramienta. Fue pensada para usarse en la calle, no en oficinas.",
    },
    {
      question: "¿No es más rápido mi cuaderno?",
      answer: "El cuaderno no proyecta profesionalismo. Aquí utilizas plantillas automáticas; tardas segundos, se ve increíble y no se te pierde la hoja.",
    },
  ];

  return (
    <section className="px-6 py-12 md:py-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Heading */}
        <div className="lg:col-span-4 lg:sticky lg:top-32">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-lg text-on-surface-variant font-medium">
            Todo lo que necesitás saber antes de crear tu primer presupuesto.
          </p>
        </div>

        {/* Right Column: FAQ Items */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-surface rounded-2xl p-6 md:p-8 border border-outline-variant/20 hover:border-outline-variant/40 transition-colors">
              <h3 className="text-lg md:text-xl font-bold text-on-surface mb-3">
                {faq.question}
              </h3>
              <p className="text-on-surface-variant text-base leading-relaxed font-medium">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
