import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PptxGenJS from "pptxgenjs";

const initialItems = [
  { id: 1, title: "Begrüßung & Zielbild", duration: 15 },
  { id: 2, title: "Ist-Analyse", duration: 45 },
  { id: 3, title: "Anforderungen", duration: 60 },
  { id: 4, title: "Zielbild / Lösung", duration: 60 },
  { id: 5, title: "Wrap-up", duration: 20 },
];

export default function WorkshopPlanner() {
  const [items, setItems] = useState(initialItems);
  const [startTime, setStartTime] = useState("09:00");

  const toMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const toTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const calculateSchedule = () => {
    let current = toMinutes(startTime);
    return items.map((item) => {
      const start = current;
      const end = current + item.duration;
      current = end;
      return { ...item, start: toTime(start), end: toTime(end) };
    });
  };

  const schedule = calculateSchedule();

  const moveItem = (index, direction) => {
    const newItems = [...items];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    [newItems[index], newItems[targetIndex]] = [
      newItems[targetIndex],
      newItems[index],
    ];
    setItems(newItems);
  };

  const updateDuration = (index, value) => {
    const newItems = [...items];
    newItems[index].duration = Number(value);
    setItems(newItems);
  };

  const exportToPPT = () => {
    const pptx = new PptxGenJS();
    pptx.defineLayout({ name: "DATAGROUP", width: 10, height: 5.625 });
    pptx.layout = "DATAGROUP";

    // Slide 1: Title
    const titleSlide = pptx.addSlide();
    titleSlide.addText("Workshop Agenda", {
      x: 0.5,
      y: 1.5,
      w: 9,
      fontSize: 28,
      bold: true,
      align: "center",
    });
    titleSlide.addText("DATAGROUP", {
      x: 8,
      y: 0.3,
      fontSize: 12,
      bold: true,
      color: "000000",
    });

    // Slide 2: Agenda Table
    const agendaSlide = pptx.addSlide();
    agendaSlide.addText("Agenda", {
      x: 0.5,
      y: 0.3,
      fontSize: 20,
      bold: true,
      color: "000000",
    });
    agendaSlide.addText("DATAGROUP", {
      x: 8,
      y: 0.3,
      fontSize: 12,
      bold: true,
    });

    const tableData = [
      [
        { text: "Zeit", options: { bold: true } },
        { text: "Inhalt", options: { bold: true } },
      ],
    ];
    schedule.forEach((item) => {
      tableData.push([`${item.start} - ${item.end}`, item.title]);
    });

    agendaSlide.addTable(tableData, {
      x: 0.5,
      y: 1,
      w: 9,
      colW: [2.5, 6.5],
      border: { pt: 1, color: "CCCCCC" },
    });

    pptx.writeFile({ fileName: "DATAGROUP_Workshop_Agenda.pptx" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto grid gap-4">
        <Card className="p-4">
          <CardContent>
            <h1 className="text-xl font-bold mb-2">Workshop Planner</h1>
            <div className="flex gap-2 items-center mb-3">
              <label className="text-sm font-medium">Startzeit:</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border p-1 rounded text-sm"
              />
            </div>
            <Button onClick={exportToPPT}>
              Export DATAGROUP PowerPoint
            </Button>
          </CardContent>
        </Card>

        {schedule.map((item, index) => (
          <Card key={item.id} className="p-3">
            <CardContent className="grid gap-2">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">{item.title}</h2>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => moveItem(index, -1)}>↑</Button>
                  <Button size="sm" onClick={() => moveItem(index, 1)}>↓</Button>
                </div>
              </div>
              <div className="flex gap-4 items-center text-sm">
                <span>⏱ {item.start} – {item.end}</span>
                <input
                  type="number"
                  value={item.duration}
                  onChange={(e) => updateDuration(index, e.target.value)}
                  className="w-20 border p-1 rounded"
                />
                <span>Min</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
