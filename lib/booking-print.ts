import { queryWithEncoding } from '@/lib/db';
import { isTripType, TripType } from '@/lib/booking-flow';
import { ensureTripsSchema, resolveBookingStatusColumn } from '@/lib/booking-trip';

export interface BookingPrintData {
  id: number;
  requester_name: string | null;
  requester_position: string | null;
  supervisor_name: string | null;
  supervisor_position: string | null;
  destination: string | null;
  purpose: string | null;
  fuel_reimbursement: string | null;
  distance: number | null;
  passengers: number | null;
  trip_type: TripType;
  start_time: string;
  end_time: string;
  driver_name: string | null;
  status_code: string;
  created_at: string | null;
  brand: string | null;
  model: string | null;
  license_plate: string | null;
  car_type: string | null;
}

interface BookingPrintRow extends Omit<BookingPrintData, 'trip_type'> {
  trip_type: string;
}

const THAI_DIGIT_START = 0x0e50;

function toArabicDigits(value: string) {
  return value.replace(/[\u0E50-\u0E59]/g, (digit) =>
    String(digit.charCodeAt(0) - THAI_DIGIT_START)
  );
}

function cleanValue(value: string | number | null | undefined) {
  return value === null || value === undefined ? '' : toArabicDigits(String(value).trim());
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderValue(value: string | number | null | undefined) {
  const text = cleanValue(value);
  return text ? escapeHtml(text) : '&nbsp;';
}

function dateParts(input: string | null | undefined) {
  if (!input) {
    return { day: '', month: '', year: '' };
  }

  const date = new Date(input);
  const parts = new Intl.DateTimeFormat('th-TH-u-nu-latn', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).formatToParts(date);

  return {
    day: parts.find((part) => part.type === 'day')?.value || '',
    month: parts.find((part) => part.type === 'month')?.value || '',
    year: parts.find((part) => part.type === 'year')?.value || '',
  };
}

function formatFullDate(input: string | null | undefined) {
  const value = dateParts(input);
  return [value.day, value.month, value.year].filter(Boolean).join(' ');
}

function formatTime(input: string) {
  return new Intl.DateTimeFormat('th-TH-u-nu-latn', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(input));
}

function inlineField(value: string | number | null | undefined, minWidth: string, extraClass = '') {
  const className = ['field', extraClass].filter(Boolean).join(' ');
  return `<span class="${className}" style="min-width:${minWidth}">${renderValue(value)}</span>`;
}

function lineLabel(label: string, width = '105mm') {
  return `
    <div class="line-label">
      <span class="line-fill" style="width:${width}"></span>
      <span>${escapeHtml(label)}</span>
    </div>
  `;
}

function signatureName(name: string | null) {
  const text = cleanValue(name);
  return `(${escapeHtml(text || ' ')})`;
}

function selectedVehicleType(data: BookingPrintData) {
  const source = `${cleanValue(data.car_type)} ${cleanValue(data.model)}`
    .toLowerCase()
    .replace(/\s+/g, '');

  if (source.includes('รถตู้') || source.includes('ตู้') || source.includes('van') || source.includes('commuter')) {
    return 'van';
  }

  if (
    source.includes('รถยนต์บรรทุก') ||
    source.includes('truck') ||
    source.includes('pickup') ||
    source.includes('d-max')
  ) {
    return source.includes('4ประตู') ? 'passenger' : 'truck';
  }

  return 'passenger';
}

function vehicleChoice(label: string, checked: boolean) {
  return `<div class="choice-row"><span class="choice-mark">${checked ? '☑' : '☐'}</span><span>${escapeHtml(
    label
  )}</span></div>`;
}

function documentHeader(tripType: TripType) {
  return `
    <header class="doc-header">
      <div class="doc-title">ใบขออนุญาตใช้รถยนต์ส่วนกลาง</div>
      <div class="doc-subtitle">(${tripType === 'external' ? 'ต่างจังหวัด' : 'ในจังหวัด'})</div>
      <div class="doc-office">สำนักงานสาธารณสุขจังหวัดพิษณุโลก</div>
    </header>
  `;
}

function internalTemplate(data: BookingPrintData) {
  const start = dateParts(data.start_time);
  const end = dateParts(data.end_time);
  const submittedDate = formatFullDate(data.created_at || data.start_time);

  return `
    <section class="document internal-document">
      ${documentHeader(data.trip_type)}

      <div class="form-block">
        <p class="text-row">เรียน นายแพทย์สาธารณสุขจังหวัดพิษณุโลก</p>

        <p class="text-row indent">
          ข้าพเจ้า ${inlineField(data.requester_name, '54mm')}
          ตำแหน่ง ${inlineField(data.requester_position, '84mm')}
        </p>

        <p class="text-row">
          ขออนุญาตใช้รถยนต์ไปราชการที่ ${inlineField(data.destination, '132mm')}
        </p>

        <p class="text-row">เพื่อ ${inlineField(data.purpose, '162mm')}</p>

        <p class="text-row">
          มีคนนั่ง ${inlineField(data.passengers, '16mm')} คน
          &nbsp;&nbsp;&nbsp;&nbsp;ในวันที่ ${inlineField(start.day, '12mm')}
          เดือน ${inlineField(start.month, '26mm')}
          พ.ศ. ${inlineField(start.year, '18mm')}
          เวลา ${inlineField(formatTime(data.start_time), '22mm')} น.
        </p>

        <p class="text-row">
          ถึงวันที่ ${inlineField(end.day, '12mm')}
          เดือน ${inlineField(end.month, '26mm')}
          พ.ศ. ${inlineField(end.year, '18mm')}
          เวลา ${inlineField(formatTime(data.end_time), '22mm')} น.
        </p>

        <p class="text-row">
          โดยมี ${inlineField(data.supervisor_name, '120mm')}
          เป็นผู้ควบคุมรถ
        </p>

        <p class="text-row note-row">** หมายเหตุ กำหนดการตามเอกสารแนบ</p>
      </div>

      <div class="internal-signatures">
        <div class="signature-panel">
          ${lineLabel('ผู้ขออนุญาต')}
          <div class="signature-name">${signatureName(data.requester_name)}</div>

          <div class="signature-spacer"></div>

          ${lineLabel('หัวหน้ากลุ่มงาน/งาน')}
        </div>
      </div>

      <div class="submitted-box">วันที่ส่งใบขอ ${escapeHtml(submittedDate)}</div>
    </section>
  `;
}

function externalTemplate(data: BookingPrintData) {
  const start = dateParts(data.start_time);
  const end = dateParts(data.end_time);
  const vehicleType = selectedVehicleType(data);
  const brandModel = [cleanValue(data.brand), cleanValue(data.model)].filter(Boolean).join(' ');

  return `
    <section class="document external-document">
      ${documentHeader(data.trip_type)}

      <p class="text-row right-align">วันที่ ${escapeHtml(
        formatFullDate(data.created_at || data.start_time)
      )}</p>

      <div class="form-block">
        <p class="text-row">เรียน นายแพทย์สาธารณสุขจังหวัดพิษณุโลก</p>

        <p class="text-row indent">
          ข้าพเจ้า ${inlineField(data.requester_name, '54mm')}
          ตำแหน่ง ${inlineField(data.requester_position, '84mm')}
        </p>

        <p class="text-row">
          ขออนุญาตนำรถยนต์ไปราชการที่ ${inlineField(data.destination, '129mm')}
        </p>

        <p class="text-row">
          เพื่อ ${inlineField(data.purpose, '85mm')}
          มีคนนั่ง ${inlineField(data.passengers, '14mm')} คน
        </p>

        <p class="text-row">
          ในวันที่ ${inlineField(start.day, '12mm')}
          เดือน ${inlineField(start.month, '26mm')}
          พ.ศ. ${inlineField(start.year, '18mm')}
          เวลา ${inlineField(formatTime(data.start_time), '22mm')} น.
        </p>

        <p class="text-row">
          ถึงวันที่ ${inlineField(end.day, '12mm')}
          เดือน ${inlineField(end.month, '26mm')}
          พ.ศ. ${inlineField(end.year, '18mm')}
          เวลา ${inlineField(formatTime(data.end_time), '22mm')} น.
        </p>

        <p class="text-row">
          โดยมี ${inlineField(data.supervisor_name, '110mm')}
          เป็นผู้ควบคุมรถ
        </p>

        <p class="text-row">
          หมายเหตุ เบิกงบประมาณค่าน้ำมันเชื้อเพลิงจากงาน/โครงการ
          ${inlineField(data.fuel_reimbursement, '75mm')}
        </p>
      </div>

      <div class="vehicle-choices">
        ${vehicleChoice('รถตู้บรรทุก', vehicleType === 'van')}
        ${vehicleChoice('รถยนต์บรรทุก', vehicleType === 'truck')}
        ${vehicleChoice('รถยนต์นั่งบรรทุก 4 ประตู', vehicleType === 'passenger')}
      </div>

      <div class="external-grid">
        <div class="external-left">
          <p class="text-row">เรียน นายแพทย์สาธารณสุขจังหวัดพิษณุโลก</p>
          <p class="text-row">1. การไปราชการครั้งนี้</p>
          <p class="text-row">
            ( ) เห็นสมควรอนุญาตให้นำรถยนต์ยี่ห้อ ${inlineField(brandModel, '60mm')}
          </p>
          <p class="text-row">
            หมายเลขทะเบียน ${inlineField(data.license_plate, '34mm')}
            ส่งชื่อ ${inlineField(data.driver_name, '60mm')}
          </p>
          <p class="text-row">ทำหน้าที่ พนักงานขับรถยนต์</p>
          <p class="text-row">( )</p>
          <p class="text-row">จึงเรียนมาเพื่อโปรดพิจารณาสั่งการต่อไป</p>
          <p class="text-row">ขอเป็นพระคุณ</p>
        </div>

        <div class="external-right">
          ${lineLabel('ผู้ขออนุญาตใช้รถยนต์', '88mm')}
          <div class="signature-name">${signatureName(data.requester_name)}</div>

          <div class="signature-spacer small"></div>

          ${lineLabel('หัวหน้ากลุ่มงาน/งาน', '88mm')}

          <div class="signature-spacer"></div>

          ${lineLabel('ผู้มีอำนาจสั่งใช้รถยนต์', '88mm')}
        </div>
      </div>
    </section>
  `;
}

function styles() {
  return `
    :root {
      color-scheme: light;
    }

    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
    }

    body {
      background: #edf2f7;
      color: #111827;
      font-family: "TH Sarabun New", "Sarabun", "Noto Sans Thai", Tahoma, sans-serif;
    }

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(237, 242, 247, 0.92);
      backdrop-filter: blur(8px);
    }

    .toolbar button {
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #0f172a;
      border-radius: 999px;
      padding: 8px 16px;
      font: inherit;
      cursor: pointer;
    }

    .sheet {
      width: 210mm;
      min-height: 297mm;
      margin: 12px auto 24px;
      background: #ffffff;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
      padding: 12mm 14mm 14mm;
    }

    .document {
      font-size: 18pt;
      line-height: 1.38;
    }

    .doc-header {
      text-align: center;
      margin-bottom: 10mm;
    }

    .doc-title {
      font-size: 22pt;
      font-weight: 700;
      line-height: 1.25;
    }

    .doc-subtitle {
      font-size: 20pt;
      font-weight: 700;
      line-height: 1.25;
      margin-top: 2mm;
    }

    .doc-office {
      font-size: 20pt;
      line-height: 1.25;
      margin-top: 2.5mm;
    }

    .form-block {
      margin-top: 2mm;
    }

    .text-row {
      margin: 0 0 2.6mm;
      line-height: 1.44;
    }

    .indent {
      padding-left: 9mm;
    }

    .right-align {
      text-align: right;
      margin-bottom: 4mm;
    }

    .field {
      display: inline-block;
      vertical-align: baseline;
      min-height: 7mm;
      padding: 0 1.2mm;
      border-bottom: none;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .note-row {
      margin-top: 2mm;
    }

    .internal-signatures {
      display: flex;
      justify-content: flex-end;
      margin-top: 5mm;
    }

    .signature-panel {
      width: 84mm;
    }

    .signature-spacer {
      height: 12mm;
    }

    .signature-spacer.small {
      height: 8mm;
    }

    .line-label {
      display: flex;
      align-items: center;
      gap: 2mm;
    }

    .line-fill {
      display: inline-block;
      height: 0;
      border-bottom: 0.5pt solid #111827;
      transform: translateY(1.5mm);
    }

    .signature-name {
      text-align: center;
      margin-top: 1mm;
      min-height: 8mm;
    }

    .submitted-box {
      width: fit-content;
      min-width: 56mm;
      margin: 22mm auto 0;
      border: 1pt solid #111827;
      padding: 4mm 8mm;
      text-align: center;
      font-size: 18pt;
      font-weight: 700;
    }

    .vehicle-choices {
      margin: 5mm 0 6mm;
    }

    .choice-row {
      display: flex;
      align-items: center;
      gap: 3mm;
      margin-bottom: 2mm;
    }

    .choice-mark {
      display: inline-flex;
      width: 7mm;
      justify-content: center;
    }

    .external-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 8mm;
      margin-top: 4mm;
      align-items: start;
    }

    @page {
      size: A4;
      margin: 12mm;
    }

    @media print {
      body {
        background: #ffffff;
      }

      .no-print {
        display: none !important;
      }

      .sheet {
        width: auto;
        min-height: auto;
        margin: 0;
        padding: 0;
        box-shadow: none;
      }
    }
  `;
}

function shell(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="th">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>${styles()}</style>
  </head>
  <body>
    <div class="toolbar no-print">
      <button type="button" onclick="window.print()">พิมพ์เอกสาร</button>
      <button type="button" onclick="window.close()">ปิดหน้าต่าง</button>
    </div>
    <main class="sheet">
      ${body}
    </main>
  </body>
</html>`;
}

export async function getBookingPrintData(id: string | number) {
  await ensureTripsSchema();
  const statusColumn = await resolveBookingStatusColumn();
  const rows = (await queryWithEncoding(
    `SELECT
        b.id,
        b.requester_name,
        b.requester_position,
        b.supervisor_name,
        b.supervisor_position,
        b.destination,
        b.purpose,
        b.fuel_reimbursement,
        b.distance,
        b.passengers,
        b.trip_type,
        b.start_time,
        b.end_time,
        COALESCE(d.fullname, b.driver_name) AS driver_name,
        b.${statusColumn} AS status_code,
        b.created_at,
        c.brand,
        c.model,
        c.license_plate,
        c.car_type
     FROM bookings b
     LEFT JOIN trips t ON b.trip_id = t.id
     LEFT JOIN cars c ON COALESCE(t.car_id, b.car_id) = c.id
     LEFT JOIN drivers d ON COALESCE(t.driver_id, b.driver_id) = d.id
     WHERE b.id = $1
     LIMIT 1`,
    [id]
  )) as BookingPrintRow[];

  const booking = rows[0];

  if (!booking) {
    return null;
  }

  return {
    ...booking,
    trip_type: isTripType(booking.trip_type) ? booking.trip_type : 'internal',
  } satisfies BookingPrintData;
}

export function renderBookingPrintHtml(data: BookingPrintData) {
  const title = `${cleanValue(data.requester_name) || `booking-${data.id}`} - ${
    data.trip_type === 'external' ? 'ต่างจังหวัด' : 'ในจังหวัด'
  }`;

  const body = data.trip_type === 'external' ? externalTemplate(data) : internalTemplate(data);

  return shell(title, body);
}

export function renderBookingPrintError(title: string, message: string) {
  return shell(
    title,
    `<section class="document"><p class="text-row">${escapeHtml(message)}</p></section>`
  );
}
