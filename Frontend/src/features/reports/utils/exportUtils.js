import jsPDF from "jspdf";
import "jspdf-autotable";

export const downloadCSV = (data, columns, filename) => {
  if (!data || !data.length) return;

  const headers = columns.map(c => c.label).join(",");
  const rows = data.map(row => {
    return columns.map(c => {
      let val = row[c.key];
      if (val === null || val === undefined) val = "";
      val = String(val).replace(/"/g, '""');
      if (val.includes(",")) val = `"${val}"`;
      return val;
    }).join(",");
  });

  const csvContent = [headers, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadPDF = (data, columns, title, filename) => {
  if (!data || !data.length) return;

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  const theme = {
    bg: [17, 17, 17],
    primary: [244, 194, 28],
    text: [248, 248, 248],
    muted: [184, 184, 184],
    border: [48, 48, 48],
    surface: [27, 27, 27],
  };

  doc.setFillColor(...theme.bg);
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, "F");

  doc.setTextColor(...theme.primary);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("ELEXOPLUS", 40, 50);

  doc.setTextColor(...theme.text);
  doc.setFontSize(14);
  doc.text(title, 40, 75);

  doc.setTextColor(...theme.muted);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 90);

  const tableHeaders = columns.map(c => c.label);
  const tableData = data.map(row => columns.map(c => {
    let val = row[c.key];
    if (val === null || val === undefined) return "—";
    if (c.key === "date" || c.key === "month" || c.key === "joiningDate") {
      if (String(val).includes("T")) {
        return new Date(val).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
      }
    }
    if (c.key === "checkIn" || c.key === "checkOut") {
      if (String(val).includes("T")) {
        return new Date(val).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
    }
    if (c.key === "target" || c.key === "achievement") return `₹${val.toLocaleString()}`;
    if (c.key === "percentage" || c.key === "teamPerformance") return `${val.toFixed(1)}%`;
    if (c.key === "workingHours") return `${Number(val).toFixed(2)}h`;
    return String(val);
  }));

  doc.autoTable({
    startY: 110,
    head: [tableHeaders],
    body: tableData,
    theme: "grid",
    styles: {
      fillColor: theme.surface,
      textColor: theme.text,
      lineColor: theme.border,
      lineWidth: 0.5,
      fontSize: 9,
      cellPadding: 8,
    },
    headStyles: {
      fillColor: theme.bg,
      textColor: theme.muted,
      fontStyle: "bold",
      halign: "left",
    },
    alternateRowStyles: {
      fillColor: [34, 34, 34],
    },
    margin: { top: 110, left: 40, right: 40, bottom: 40 },
  });

  doc.save(`${filename}.pdf`);
};
