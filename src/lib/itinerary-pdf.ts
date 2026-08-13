import type { JourneyHistory } from "@/lib/journey-api";
import { jsPDF } from "jspdf";

const olive = [94, 103, 85] as const;
const ink = [41, 40, 36] as const;
const muted = [105, 102, 97] as const;
const cream = [248, 244, 237] as const;
const gold = [181, 151, 89] as const;

function pdfText(value: unknown) {
  return String(value ?? "")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2026/g, "...");
}

function safeFilename(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "journey";
}

export async function downloadItineraryPdf(history: JourneyHistory, city: string, country?: string) {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const destination = country ? `${city}, ${country}` : city;
  const plans = history.tourPlan ?? [];
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  let y = 0;

  const addContinuationHeader = () => {
    doc.setFillColor(...cream);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    doc.setTextColor(...olive);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("VELARI", margin, 14);
    doc.setDrawColor(...gold);
    doc.line(margin, 18, pageWidth - margin, 18);
    doc.setTextColor(...muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(pdfText(destination), pageWidth - margin, 14, { align: "right" });
    y = 27;
  };

  const ensureSpace = (height: number) => {
    if (y + height <= pageHeight - 18) return;
    doc.addPage();
    addContinuationHeader();
  };

  doc.setFillColor(...cream);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  doc.setFillColor(...olive);
  doc.rect(0, 0, pageWidth, 70, "F");
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.6);
  doc.line(margin, 19, pageWidth - margin, 19);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("VELARI", margin, 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("PERSONALIZED TRAVEL ITINERARY", pageWidth - margin, 14, { align: "right" });
  doc.setFont("times", "normal");
  doc.setFontSize(27);
  doc.text(pdfText(`Your Journey to ${city}`), margin, 39);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(pdfText(`${destination}  |  ${plans.length} Days`), margin, 50);
  doc.setTextColor(225, 228, 221);
  doc.text("Curated around your emotional and travel profile", margin, 58);

  y = 85;
  doc.setTextColor(...ink);
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text("Your trip at a glance", margin, y);
  y += 10;

  const summary = [
    ["DURATION", `${plans.length} Days`],
    ["DESTINATION", destination],
    ["TRAVEL STYLE", history.userProfile?.travelStyle || "Personalized"],
    ["ZODIAC SIGN", history.userProfile?.zodiacSign || "Not provided"],
  ];
  const cardGap = 4;
  const cardWidth = (contentWidth - cardGap) / 2;
  summary.forEach(([label, value], index) => {
    const x = margin + (index % 2) * (cardWidth + cardGap);
    const cardY = y + Math.floor(index / 2) * 23;
    doc.setFillColor(235, 230, 220);
    doc.roundedRect(x, cardY, cardWidth, 19, 2, 2, "F");
    doc.setTextColor(...muted);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(label, x + 4, cardY + 6);
    doc.setTextColor(...ink);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(pdfText(value), x + 4, cardY + 13, { maxWidth: cardWidth - 8 });
  });
  y += 53;

  if (history.stay?.name) {
    doc.setTextColor(...olive);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("RECOMMENDED STAY", margin, y);
    y += 6;
    doc.setTextColor(...ink);
    doc.setFont("times", "bold");
    doc.setFontSize(15);
    doc.text(pdfText(history.stay.name), margin, y);
    y += 6;
    doc.setTextColor(...muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const stayMeta = [history.stay.address, history.stay.rating ? `Rating ${history.stay.rating}` : "", history.stay.priceLevel || ""].filter(Boolean).join("  |  ");
    doc.text(pdfText(stayMeta), margin, y, { maxWidth: contentWidth });
    y += 12;
  }

  plans.forEach((plan, planIndex) => {
    ensureSpace(28);
    doc.setTextColor(...olive);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(`DAY ${plan.day || planIndex + 1}`, margin, y);
    y += 8;
    doc.setTextColor(...ink);
    doc.setFont("times", "bold");
    doc.setFontSize(21);
    doc.text(`Day ${plan.day || planIndex + 1}`, margin, y);
    y += 6;
    doc.setTextColor(...muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text("A thoughtfully paced experience, personalized for you.", margin, y);
    y += 9;

    (plan.activities ?? []).forEach((activity) => {
      const descriptionLines = doc.splitTextToSize(pdfText(activity.activityDescription), contentWidth - 14) as string[];
      const location = activity.activityLocation || activity.activityAddress || city;
      const locationLines = doc.splitTextToSize(pdfText(location), contentWidth - 42) as string[];
      const blockHeight = Math.max(31, 25 + descriptionLines.length * 4 + locationLines.length * 3.5);
      ensureSpace(blockHeight + 5);
      doc.setFillColor(238, 233, 224);
      doc.setDrawColor(205, 201, 190);
      doc.roundedRect(margin, y, contentWidth, blockHeight, 2, 2, "FD");
      doc.setTextColor(...olive);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(pdfText(activity.activityTime || "Flexible time"), margin + 5, y + 7);
      doc.setTextColor(...ink);
      doc.setFont("times", "bold");
      doc.setFontSize(13);
      doc.text(pdfText(activity.activityName), margin + 5, y + 14, { maxWidth: contentWidth - 10 });
      doc.setTextColor(...muted);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(descriptionLines, margin + 5, y + 20);
      const metaY = y + 21 + descriptionLines.length * 4;
      doc.setFontSize(7.5);
      doc.text(locationLines, margin + 5, metaY);
      doc.setTextColor(...olive);
      doc.setFont("helvetica", "bold");
      doc.text(money.format(activity.activityCost || 0), pageWidth - margin - 5, metaY, { align: "right" });
      y += blockHeight + 5;
    });
    y += 6;
  });

  const notes = [
    ["Packing tips", history.packingTips],
    ["Travel tips", history.travelTips],
    ["Estimated activity total", history.totalCostEstimate != null ? money.format(history.totalCostEstimate) : undefined],
  ].filter((item): item is [string, string] => Boolean(item[1]));

  notes.forEach(([title, body]) => {
    const lines = doc.splitTextToSize(pdfText(body), contentWidth - 10) as string[];
    const height = 18 + lines.length * 4;
    ensureSpace(height + 5);
    doc.setFillColor(...olive);
    doc.roundedRect(margin, y, contentWidth, height, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("times", "bold");
    doc.setFontSize(13);
    doc.text(title, margin + 5, y + 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(lines, margin + 5, y + 14);
    y += height + 5;
  });

  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setTextColor(...muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(`Velari personalized journey  |  Page ${page} of ${pages}`, pageWidth / 2, pageHeight - 8, { align: "center" });
  }

  doc.save(`velari-${safeFilename(city)}-itinerary.pdf`);
}
