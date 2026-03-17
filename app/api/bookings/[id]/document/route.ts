import { NextResponse } from 'next/server';
import { BOOKING_STATUS } from '@/lib/booking-flow';
import {
  getBookingPrintData,
  renderBookingPrintError,
  renderBookingPrintHtml,
} from '@/lib/booking-print';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await getBookingPrintData(id);

    if (!booking) {
      return new NextResponse(
        renderBookingPrintError('Booking not found', 'ไม่พบข้อมูลใบขอใช้รถ'),
        {
          status: 404,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
          },
        }
      );
    }

    if (booking.status_code !== BOOKING_STATUS.assigned) {
      return new NextResponse(
        renderBookingPrintError(
          'Booking not ready',
          'เอกสารสามารถพิมพ์ได้หลังจากจัดรถและพนักงานขับรถแล้วเท่านั้น'
        ),
        {
          status: 400,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
          },
        }
      );
    }

    return new NextResponse(renderBookingPrintHtml(booking), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error rendering booking document:', error);
    return new NextResponse(
      renderBookingPrintError('Render failed', 'ไม่สามารถสร้างเอกสารสำหรับพิมพ์ได้'),
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      }
    );
  }
}
