"use client";

import { CircleAlert, CircleCheck, CircleX } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { OpenConsultButton } from "@/components/ui/OpenConsultButton";
import { ResultsGate } from "@/components/ui/ResultsGate";
import type { QuizQuestion, QuizResult, ResultLevel } from "@/lib/resources";
import { cn } from "@/lib/utils";

interface ResourceQuizProps {
  resourceTitle: string;
  questions: QuizQuestion[];
  results: QuizResult[];
  // Producto a preseleccionar si la persona agenda una consulta desde aquí.
  productId?: string;
}

type Answer = "si" | "no";

const levelStyles: Record<ResultLevel, { bg: string; text: string; icon: typeof CircleCheck }> = {
  good: { bg: "bg-result-good-tint", text: "text-result-good", icon: CircleCheck },
  mid: { bg: "bg-result-mid-tint", text: "text-result-mid", icon: CircleAlert },
  bad: { bg: "bg-result-bad-tint", text: "text-result-bad", icon: CircleX },
};

export function ResourceQuiz({ resourceTitle, questions, results, productId }: ResourceQuizProps) {
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [showResult, setShowResult] = useState(false);

  const answered = Object.keys(answers).length;
  const noCount = Object.values(answers).filter((a) => a === "no").length;
  const result = results.find((r) => noCount <= r.maxNo) ?? results[results.length - 1];
  const style = levelStyles[result.level];
  const LevelIcon = style.icon;

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <fieldset key={q.question} className="rounded-2xl border border-unity-navy/10 bg-white p-5">
          <legend className="sr-only">Pregunta {i + 1}</legend>
          <p className="font-semibold text-unity-navy">
            <span className="mr-2 text-unity-teal">{i + 1}.</span>
            {q.question}
          </p>
          <div className="mt-3 flex gap-2">
            {(["si", "no"] as Answer[]).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, [i]: opt }));
                  setShowResult(false);
                }}
                aria-pressed={answers[i] === opt}
                className={cn(
                  "rounded-full border-2 px-5 py-1.5 font-heading text-sm font-bold uppercase tracking-wide transition-colors",
                  answers[i] === opt
                    ? "border-unity-teal bg-unity-teal text-white"
                    : "border-unity-line text-unity-navy hover:border-unity-teal",
                )}
              >
                {opt === "si" ? "Sí" : "No"}
              </button>
            ))}
          </div>
          {answers[i] === "no" && (
            <p className="mt-3 text-sm text-unity-gray-mid">{q.why}</p>
          )}
        </fieldset>
      ))}

      {showResult ? (
        <ResultsGate resourceTitle={resourceTitle}>
          <div className={cn("rounded-2xl p-6", style.bg)}>
            <div className="flex items-center gap-2">
              <LevelIcon className={cn("h-6 w-6", style.text)} strokeWidth={1.75} aria-hidden />
              <p className={cn("font-heading text-[13px] font-bold uppercase tracking-[0.15em]", style.text)}>
                {noCount} de {questions.length} sin cubrir
              </p>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-unity-navy">{result.title}</h2>
            <p className="mt-2 text-unity-gray-mid">{result.text}</p>
            <div className="mt-5">
              <OpenConsultButton productId={productId}>
                Agenda tu consulta y orientación
              </OpenConsultButton>
            </div>
          </div>
        </ResultsGate>
      ) : (
        <Button
          variant="navy"
          className="w-full"
          disabled={answered < questions.length}
          onClick={() => setShowResult(true)}
        >
          {answered < questions.length
            ? `Contesta las ${questions.length} preguntas`
            : "Ver mi resultado"}
        </Button>
      )}
    </div>
  );
}
