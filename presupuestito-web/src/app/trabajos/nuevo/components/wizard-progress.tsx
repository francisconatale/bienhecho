import { questions } from "../hooks/use-nuevo-trabajo";

interface Props {
  currentQ: number;
}

export function WizardProgress({ currentQ }: Props) {
  return (
    <div className="flex items-center gap-1.5 mb-5">
      {questions.map((q, i) => (
        <div
          key={q.id}
          className={`h-1 flex-1 rounded-full transition-all duration-500 ${
            i <= currentQ ? "bg-primary" : "bg-on-surface/10"
          }`}
        />
      ))}
    </div>
  );
}
