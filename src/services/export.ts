import jsPDF from "jspdf";

export function exportExplanationPdf(title: string, explanation: string) {
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(explanation, 180);
  doc.setFontSize(18);
  doc.text(title || "EduArtha Explanation", 14, 18);
  doc.setFontSize(11);
  doc.text(lines, 14, 30);
  doc.save(`${(title || "eduartha-lesson").toLowerCase().replace(/\s+/g, "-")}.pdf`);
}
