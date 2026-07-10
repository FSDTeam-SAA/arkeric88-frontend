import Image from "next/image";

export type ProcessDetail = {
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

type ProcessDetailRowProps = { step: ProcessDetail; reverse?: boolean };

export function ProcessDetailRow({ step, reverse = false }: ProcessDetailRowProps) {
  return (
    <article className={`how-step ${reverse ? "reverse" : ""}`} data-reveal>
      <div className="how-step-copy"><span className="how-step-number">“{step.number}</span><h2>{step.title}</h2><p>{step.description}</p></div>
      <div className="how-step-image"><Image src={step.image} alt={step.imageAlt} fill sizes="(max-width: 700px) 92vw, 44vw" /></div>
    </article>
  );
}
