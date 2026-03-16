"use client";

import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { FileText } from 'lucide-react';

interface BookingData {
  id: number;
  fullname: string;
  brand: string;
  model: string;
  license_plate: string;
  destination: string;
  start_time: string;
  end_time: string;
  reason: string;
}

export default function ExportBookingDoc({ booking }: { booking: BookingData }) {
  const generateDoc = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "ใบขออนุญาตใช้รถยนต์ส่วนกลาง",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `เลขที่ใบจอง: CB-${booking.id.toString().padStart(5, '0')}`, bold: true }),
            ],
            alignment: AlignmentType.RIGHT,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `ผู้ขอใช้รถ: `, bold: true }),
              new TextRun(booking.fullname),
            ],
            spacing: { before: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `จุดประสงค์: `, bold: true }),
              new TextRun(booking.reason || "ไม่ระบุ"),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `สถานที่ไป: `, bold: true }),
              new TextRun(booking.destination),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `รถยนต์: `, bold: true }),
              new TextRun(`${booking.brand} ${booking.model} (ทะเบียน ${booking.license_plate})`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `ตั้งแต่วันที่: `, bold: true }),
              new TextRun(new Date(booking.start_time).toLocaleString('th-TH')),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `ถึงวันที่: `, bold: true }),
              new TextRun(new Date(booking.end_time).toLocaleString('th-TH')),
            ],
          }),
          new Paragraph({
            text: "\n\nลงชื่อ......................................................ผู้ขอใช้รถ",
            alignment: AlignmentType.RIGHT,
            spacing: { before: 800 },
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `booking_request_${booking.id}.docx`);
  };

  return (
    <button 
      onClick={generateDoc}
      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors title='พิมพ์ใบจอง'"
    >
      <FileText className="w-4 h-4" />
    </button>
  );
}
