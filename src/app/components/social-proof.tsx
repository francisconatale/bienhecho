import { Quote } from "lucide-react";

export function SocialProof() {
  return (
    <section className="px-6 py-12 md:py-24">
      <div className="max-w-5xl mx-auto bg-surface rounded-3xl p-10 md:p-16 lg:p-20 border border-outline-variant/20 shadow-sm flex flex-col md:flex-row gap-12 items-center">
        
        <div className="flex-1 text-left">
          <Quote className="w-12 h-12 text-primary mb-8" />
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-snug mb-8 text-on-surface">
            "Antes pasaba los precios en el aire y me olvidaba de cobrar cosas. Ahora mando el PDF de Bien Hecho y los clientes me felicitan. Gané dos obras grandes solo por la buena imagen."
          </blockquote>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-surface-container rounded-full flex items-center justify-center text-on-surface font-bold text-xl border border-outline-variant/20">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-on-surface text-lg">Marcelo</span>
              <span className="text-sm text-on-surface-variant font-medium">Electricista Independiente</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
