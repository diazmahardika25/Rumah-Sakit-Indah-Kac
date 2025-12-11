import React, { useState } from 'react';

interface AppointmentAgentProps {
  initialData?: any;
}

export const AppointmentAgent: React.FC<AppointmentAgentProps> = ({ initialData }) => {
  const [form, setForm] = useState({
    patient: initialData?.detail_permintaan || '',
    doctor: 'Dr. Andi (Sp.PD)',
    date: new Date().toISOString().split('T')[0],
    time: '09:00'
  });
  const [result, setResult] = useState<any>(null);

  const handleSchedule = () => {
    // Simulasi Logika: Validasi Ketersediaan
    const isConflict = form.time === '10:00'; 
    
    if (isConflict) {
        alert("Peringatan: Slot jam 10:00 sudah terisi. Silakan pilih waktu lain untuk optimalisasi jadwal.");
        return;
    }

    setResult({
        id: `APT-${Math.floor(Math.random() * 9000) + 1000}`,
        room: 'Ruang Pemeriksaan 1', // Resource Allocation
        lagTime: 0
    });
  };

  if (result) {
    return (
        <div className="flex flex-col h-full animate-fade-in space-y-4">
             <div className="bg-hospital-50 border border-hospital-200 p-4 rounded-xl text-center">
                <div className="inline-block p-3 bg-white rounded-full shadow-sm mb-2 text-hospital-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-hospital-900">Janji Temu Dijadwalkan</h3>
                <p className="text-hospital-600 font-mono text-sm mt-1">ID Unik: {result.id}</p>
             </div>

             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                 <div className="flex justify-between border-b border-slate-100 pb-2">
                     <span className="text-slate-500 text-sm">Pasien</span>
                     <span className="font-semibold text-slate-800">{form.patient || "Umum"}</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-100 pb-2">
                     <span className="text-slate-500 text-sm">Dokter</span>
                     <span className="font-semibold text-slate-800">{form.doctor}</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-100 pb-2">
                     <span className="text-slate-500 text-sm">Waktu</span>
                     <span className="font-semibold text-slate-800">{form.date} @ {form.time}</span>
                 </div>
                 <div className="flex justify-between pt-1 bg-purple-50 p-2 rounded">
                     <span className="text-slate-500 text-sm">Simulasi Resource Allocation</span>
                     <span className="font-bold text-purple-700">Mengalokasikan 1 (satu) {result.room}</span>
                 </div>
             </div>

             <div className="bg-slate-900 text-white p-4 rounded-xl shadow-lg mt-auto">
                 <div className="flex items-center gap-2 mb-2">
                     <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                     <span className="text-xs font-bold uppercase tracking-wider">Operational KPI</span>
                 </div>
                 <div className="border-l-2 border-green-500 pl-3">
                     <p className="text-sm font-semibold text-green-300">
                        Perkiraan Lag Time Penangkapan Biaya: 0 Jam
                     </p>
                     <p className="text-[10px] text-slate-400 mt-1">
                        (Dioptimalkan melalui sistem terintegrasi)
                     </p>
                 </div>
             </div>
             
             <button onClick={() => setResult(null)} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-semibold">
                Jadwalkan Lainnya
             </button>
        </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
       <div className="mb-4 pb-2 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800">Manajemen Janji Temu</h3>
        <p className="text-xs text-slate-500">Optimalisasi sumber daya & minimalkan Charge Capture Lag Time.</p>
      </div>

      <div className="space-y-4">
        <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Pasien (Lookup)</label>
            <input 
                type="text" 
                className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-hospital-500 outline-none"
                placeholder="Cari Nama Pasien / No RM"
                value={form.patient}
                onChange={(e) => setForm({...form, patient: e.target.value})}
            />
        </div>
        
        <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Dokter / Staf</label>
            <select 
                className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-hospital-500 outline-none"
                value={form.doctor}
                onChange={(e) => setForm({...form, doctor: e.target.value})}
            >
                <option>Dr. Andi (Sp.PD) - Internis</option>
                <option>Dr. Siti (Sp.A) - Anak</option>
                <option>Dr. Budi (Sp.B) - Bedah</option>
            </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
             <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal</label>
                <input 
                    type="date" 
                    className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-hospital-500 outline-none"
                    value={form.date}
                    onChange={(e) => setForm({...form, date: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Waktu</label>
                <input 
                    type="time" 
                    className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-hospital-500 outline-none"
                    value={form.time}
                    onChange={(e) => setForm({...form, time: e.target.value})}
                />
            </div>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex gap-2">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-xs text-blue-700">Validasi Otomatis: Sistem akan mengecek ketersediaan Ruangan Pemeriksaan saat tombol ditekan.</p>
        </div>

        <button 
          onClick={handleSchedule}
          className="w-full py-2 bg-hospital-600 text-white rounded-lg font-semibold shadow-md hover:bg-hospital-700 transition-all"
        >
          Jadwalkan
        </button>
      </div>
    </div>
  );
};