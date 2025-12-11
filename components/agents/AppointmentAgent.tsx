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
    // Simulation Logic
    const isConflict = form.time === '10:00'; // Hardcoded conflict simulation
    
    if (isConflict) {
        alert("Konflik Jadwal: Slot jam 10:00 sudah terisi penuh. Mohon pilih waktu lain.");
        return;
    }

    setResult({
        id: `APT-${Math.floor(Math.random() * 9000) + 1000}`,
        room: 'R. Periksa 101',
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
                <h3 className="text-xl font-bold text-hospital-900">Janji Temu Terkonfirmasi</h3>
                <p className="text-hospital-600 font-mono text-sm mt-1">ID: {result.id}</p>
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
                 <div className="flex justify-between pt-1">
                     <span className="text-slate-500 text-sm">Alokasi Resource</span>
                     <span className="font-bold text-purple-600">{result.room}</span>
                 </div>
             </div>

             <div className="bg-slate-900 text-white p-4 rounded-xl shadow-lg mt-auto">
                 <div className="flex items-center gap-2 mb-2">
                     <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                     <span className="text-xs font-bold uppercase tracking-wider">Operational KPI</span>
                 </div>
                 <div className="flex justify-between items-end">
                     <span className="text-slate-400 text-sm">Est. Charge Capture Lag</span>
                     <span className="text-2xl font-bold text-green-400">{result.lagTime} Jam</span>
                 </div>
                 <div className="text-[10px] text-slate-500 mt-1">
                     *Dioptimalkan melalui sistem ERP terintegrasi
                 </div>
             </div>
             
             <button onClick={() => setResult(null)} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-semibold">
                Buat Jadwal Baru
             </button>
        </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
       <div className="mb-4 pb-2 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800">Manajemen Jadwal & Resources</h3>
        <p className="text-xs text-slate-500">Optimalisasi slot waktu untuk efisiensi operasional.</p>
      </div>

      <div className="space-y-4">
        <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Cari Pasien (Lookup)</label>
            <input 
                type="text" 
                className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-hospital-500 outline-none"
                placeholder="Nama Pasien / No RM"
                value={form.patient}
                onChange={(e) => setForm({...form, patient: e.target.value})}
            />
        </div>
        
        <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Dokter / Spesialis</label>
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

        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100 flex gap-2">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <p className="text-xs text-yellow-700">Sistem akan otomatis mengecek ketersediaan Ruang Periksa untuk menghindari konflik alokasi.</p>
        </div>

        <button 
          onClick={handleSchedule}
          className="w-full py-2 bg-hospital-600 text-white rounded-lg font-semibold shadow-md hover:bg-hospital-700 transition-all"
        >
          Jadwalkan & Alokasikan Resource
        </button>
      </div>
    </div>
  );
};
