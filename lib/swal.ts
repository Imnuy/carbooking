import Swal from 'sweetalert2';

export const swalBase = {
  confirmButtonColor: '#23b35b',
  cancelButtonColor: '#e2e8f0',
  reverseButtons: true,
  customClass: {
    popup: 'rounded-[2rem]',
    confirmButton: 'rounded-xl font-bold',
    cancelButton: 'rounded-xl font-bold text-slate-700',
  },
};

export async function confirmDelete(title: string, text: string) {
  const result = await Swal.fire({
    ...swalBase,
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'ลบข้อมูล',
    cancelButtonText: 'ยกเลิก',
  });

  return result.isConfirmed;
}

export async function showError(message: string) {
  await Swal.fire({
    ...swalBase,
    icon: 'error',
    title: 'เกิดข้อผิดพลาด',
    text: message,
    confirmButtonText: 'ตกลง',
  });
}

export async function showSuccess(message: string) {
  await Swal.fire({
    ...swalBase,
    icon: 'success',
    title: 'สำเร็จ',
    text: message,
    confirmButtonText: 'ตกลง',
  });
}
