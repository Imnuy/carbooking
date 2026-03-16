"use client";

import { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval 
} from 'date-fns';
import { th } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Booking {
  id: number;
  fullname: string;
  brand: string;
  model: string;
  start_time: string;
  end_time: string;
  destination: string;
  status: string;
}

export default function BookingCalendar({ bookings }: { bookings: Booking[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const bookingsOnSelectedDate = bookings.filter(b => 
    isSameDay(new Date(b.start_time), selectedDate)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
      {/* Calendar Grid */}
      <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <CalendarIcon className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 capitalize">
                {format(currentMonth, 'MMMM yyyy', { locale: th })}
              </h3>
              <p className="text-slate-400 text-sm font-bold">ปฏิทินการใช้รถยนต์ในเดือนนี้</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button onClick={prevMonth} className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-100">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextMonth} className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-100">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-7 mb-4">
            {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((day) => (
              <div key={day} className="text-center text-[11px] font-black uppercase tracking-widest text-slate-400 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              const hasBookings = bookings.some(b => isSameDay(new Date(b.start_time), day));
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, monthStart);
              
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "relative h-24 p-3 border border-slate-50 rounded-2xl transition-all group flex flex-col items-end justify-start",
                    !isCurrentMonth && "opacity-20",
                    isSelected ? "bg-indigo-600 ring-4 ring-indigo-50 border-indigo-600" : "hover:bg-slate-50",
                    isCurrentMonth && "bg-white"
                  )}
                >
                  <span className={cn(
                    "text-sm font-black",
                    isSelected ? "text-white" : "text-slate-900 group-hover:text-indigo-600"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {hasBookings && (
                    <div className="mt-auto flex space-x-1">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        isSelected ? "bg-white/40" : "bg-indigo-500"
                      )}></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Booking Details Sidebar */}
      <div className="space-y-6">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 min-h-[400px]">
          <h4 className="text-xl font-black text-slate-900 mb-6 flex items-center justify-between">
            <span>รายการวันที่ {format(selectedDate, 'd MMM', { locale: th })}</span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {bookingsOnSelectedDate.length} รายการ
            </span>
          </h4>

          {bookingsOnSelectedDate.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center opacity-40">
              <CalendarIcon className="w-16 h-16 mb-4 text-slate-200" />
              <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">ไม่มีการจองในวันนี้</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookingsOnSelectedDate.map((b) => (
                <div key={b.id} className="p-5 bg-slate-50 rounded-3xl border border-transparent hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{b.brand} {b.model}</span>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      b.status === 'pending' ? 'bg-amber-400' : 'bg-emerald-400'
                    )}></div>
                  </div>
                  <h5 className="font-black text-slate-900 mb-2 truncate">{b.fullname}</h5>
                  <div className="space-y-2">
                    <div className="flex items-center text-xs font-bold text-slate-500">
                      <MapPin className="w-3.5 h-3.5 mr-2 text-rose-500" />
                      <span className="truncate">{b.destination}</span>
                    </div>
                    <div className="flex items-center text-xs font-bold text-slate-500">
                      <Clock className="w-3.5 h-3.5 mr-2 text-indigo-500" />
                      {format(new Date(b.start_time), 'HH:mm')} - {format(new Date(b.end_time), 'HH:mm')} น.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full translate-x-8 -translate-y-8"></div>
          <h4 className="text-lg font-black mb-1">ต้องการใช้รถ?</h4>
          <p className="text-slate-400 text-xs font-bold mb-6 italic opacity-80">หากต้องการจองรถในวันที่ยังว่างอยู่...</p>
          <button className="bg-white text-slate-900 w-full py-4 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-transform flex items-center justify-center">
            <Plus className="w-5 h-5 mr-2" />
            ทำใบจองทันที
          </button>
        </div>
      </div>
    </div>
  );
}
