import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Share how you feel",
    text: "Choose how you feel now and what you want from the trip.",
    image: "/images/velari/02_How_It_Works_Share_How_You_Feel.png",
    imageAlt: "Traveler journaling by a window in a coastal retreat room.",
    imagePosition: "50% 50%",
  },
  {
    number: "02",
    title: "Tell us what matters",
    text: "Add interests, pace, setting, travel dates, and budget.",
    image: "/images/velari/03_How_It_Works_Tell_Us_What_Matters.png",
    imageAlt: "Travel planning scene with a journal, map, camera, and coffee in a sunlit coastal room.",
    imagePosition: "50% 50%",
  },
  {
    number: "03",
    title: "Explore your matches",
    text: "See destinations with a clear reason for each recommendation.",
    image: "/images/velari/04_How_It_Works_Explore_Your_Matches.png",
    imageAlt: "Traveler walking through a sunlit harbor village overlooking the water.",
    imagePosition: "50% 50%",
  },
  {
    number: "04",
    title: "Shape your itinerary",
    text: "Review suggested days and adjust what does or does not fit.",
    image: "/images/velari/05_How_It_Works_Shape_Your_Itinerary.png",
    imageAlt: "Couple enjoying dinner on a cliffside terrace at sunset overlooking the sea.",
    imagePosition: "50% 50%",
  },
];

export function ProcessSection() {
  return (
    <section className="process" id="how-it-works">
      <div className="section-heading">
        <h2>How Velari shapes your journey</h2>
      </div>
      <div className="steps">
        {steps.map(({ number, title, text, image, imageAlt, imagePosition }) => (
          <article className="step-card" key={number}>
            <div className="step-card-image">
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(max-width: 620px) calc(100vw - 40px), (max-width: 950px) calc(50vw - 30px), 590px"
                style={{ objectPosition: imagePosition }}
              />
            </div>
            <div className="step-card-content">
              <span className="step-number" aria-hidden="true">{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
