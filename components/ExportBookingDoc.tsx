'use client';

import { useMemo, useState } from 'react';
import { ExternalLink, FileText, X } from 'lucide-react';

interface BookingData {
  id: number;
}

export default function ExportBookingDoc({ booking }: { booking: BookingData }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const previewUrl = useMemo(() => `/api/bookings/${booking.id}/document`, [booking.id]);

  const openInNewTab = () => {
    const popup = window.open(previewUrl, '_blank', 'noopener,noreferrer');
    if (!popup) {
      window.location.href = previewUrl;
    }
  };

  return (
    <>
      <button
        onClick={() => setIsPreviewOpen(true)}
        title="ดูตัวอย่างเอกสาร"
        className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
      >
        <FileText className="h-4 w-4" />
      </button>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setIsPreviewOpen(false)}
          />

          <div className="relative flex h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">ตัวอย่างเอกสารใบขอใช้รถ</h3>
                <p className="text-sm text-slate-500">ใบขอใช้รถ #{booking.id}</p>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-white hover:text-slate-900"
                title="ปิด"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 bg-slate-100 p-4">
              <iframe
                src={previewUrl}
                title={`ตัวอย่างเอกสารใบขอใช้รถ ${booking.id}`}
                className="h-full w-full rounded-2xl border border-slate-200 bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-6 py-4">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                ปิด
              </button>
              <button
                type="button"
                onClick={openInNewTab}
                className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                เปิดในแท็บใหม่
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
