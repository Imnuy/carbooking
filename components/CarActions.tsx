'use client';

import { useState } from 'react';
import { Eye, Edit3, Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import EditCarModal from './EditCarModal';

interface CarActionsProps {
  car: any;
}

export default function CarActions({ car }: CarActionsProps) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`คุณต้องการลบรถ ${car.brand} ${car.model} (${car.license_plate}) ใช่หรือไม่?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/cars/${car.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-600 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg transition-all shadow-sm">
        <Eye className="w-4 h-4" />
      </button>
      <button 
        onClick={() => setIsEditModalOpen(true)}
        className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-600 hover:text-amber-500 hover:border-amber-100 hover:shadow-lg transition-all shadow-sm"
      >
        <Edit3 className="w-4 h-4" />
      </button>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-600 hover:text-rose-500 hover:border-rose-100 hover:shadow-lg transition-all shadow-sm disabled:opacity-50"
      >
        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>

      <EditCarModal 
        car={car} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </div>
  );
}
