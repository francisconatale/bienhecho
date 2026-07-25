import { NotebookPen, MessageCircleWarning, Receipt } from "lucide-react";

export function ProblemAgitation() {
  const problems = [
    {
      icon: <NotebookPen className="w-5 h-5 text-on-surface" strokeWidth={2} />,
      title: "Papeles que se pierden",
      description: "Anotás todo en el cuaderno y luego desaparece en la guantera de la camioneta. Un caos.",
    },
    {
      icon: <MessageCircleWarning className="w-5 h-5 text-on-surface" strokeWidth={2} />,
      title: "Mensajes poco serios",
      description: "Mandar precios sueltos por WhatsApp daña tu imagen. Los clientes buscan profesionales.",
    },
    {
      icon: <Receipt className="w-5 h-5 text-on-surface" strokeWidth={2} />,
      title: "Cálculos en el aire",
      description: "Te olvidás de sumar un material y terminás pagándolo de tu propio bolsillo al comprar.",
    },
  ];

  return (
    <section className="px-6 py-12 md:py-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        
        {/* Left: Heading (Takes 4 cols on desktop) */}
        <div className="lg:col-span-4 flex flex-col items-start text-left lg:sticky lg:top-32">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-6 leading-tight">
            El desorden de la calle te cuesta trabajos.
          </h2>
          <p className="text-lg text-on-surface-variant font-medium">
            No podés seguir perdiendo plata por olvidarte materiales o dar una imagen poco profesional por WhatsApp.
          </p>
        </div>

        {/* Right: Problem Cards (Takes 8 cols on desktop) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {problems.map((problem, i) => (
            <div
              key={i}
              className={`bg-surface p-8 rounded-2xl border border-outline-variant/20 flex flex-col items-start text-left hover:border-primary/30 transition-colors ${i === 2 ? 'md:col-span-2' : ''}`}
            >
              <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center mb-6">
                {problem.icon}
              </div>
              <h3 className="text-xl font-semibold text-on-surface mb-3">{problem.title}</h3>
              <p className="text-on-surface-variant font-medium leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
