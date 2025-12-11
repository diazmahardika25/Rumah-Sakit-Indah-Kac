import React, { useState, useEffect } from 'react';

interface RegistrationAgentProps {
  initialData?: any;
}

export const RegistrationAgent: React.FC<RegistrationAgentProps> = ({ initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    address: '',
    insurance: 'BPJS Kesehatan', // Default
  });
  const [status, setStatus] = useState<'idle' | 'processing' | 'complete'>('idle');

  // Pre-fill form if AI extracted data
  useEffect(() => {
    if (initialData?.detail_permintaan) {
      // Simple heuristic to extract potential names for demo purposes
      const text = initialData.detail_permintaan;
      if (text.includes('pasien')) {
         // This is a simulation; in a real app, the AI would extract specific fields
      }
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    setTimeout(() => {
      setStatus('complete');
    }, 1500);
  };

  if (status === 'complete') {
    return (
      <div className="p-6 bg-green-50 rounded-xl border border-green-200 animate-fade-in">
        <div className="flex items-center gap-2 mb-4 text-green-800 font-bold text-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Registrasi Berhasil & Terverifikasi
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm">
            <div className="text-xs text-slate-500 uppercase font-bold">Status HIPAA</div>
            <div className="flex items-center gap-1 text-green-600 font-semibold mt-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Data Terenkripsi (AES-256)
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm">
             <div className="text-xs text-slate-500 uppercase font-bold">Validasi Asuransi (RCM)</div>
             <div className="text-hospital-600 font-semibold mt-1">Status: Eligible / Aktif</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-2">Ringkasan Pasien Baru</h4>
          <ul className="text-sm space-y-1 text-slate-600">
            <li><span className="font-medium">Nama:</span> {formData.name}</li>
            <li><span className="font-medium">Tgl Lahir:</span> {formData.dob}</li>
            <li><span className="font-medium">Asuransi:</span> {formData.insurance}</li>
          </ul>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
             <span className="text-xs text-slate-400">ID: REG-{Math.floor(Math.random() * 10000)}</span>
             <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Siap Billing Awal</span>
          </div>
        </div>
        
        <button onClick={() => setStatus('idle')} className="mt-4 text-sm text-slate-500 hover:text-slate-700 underline">
          Input Pasien Baru Lainnya
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 pb-2 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800">Modul Pendaftaran Pasien (RCM Entry)</h3>
        <p className="text-xs text-slate-500">Pastikan data sesuai dengan kartu identitas untuk menghindari klaim ditolak.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap Pasien</label>
          <input 
            required
            type="text" 
            className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-hospital-500 outline-none"
            placeholder="Contoh: Bima Sakti"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Lahir</label>
            <input 
                required
                type="date" 
                className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-hospital-500 outline-none"
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
            />
            </div>
            <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Payer / Asuransi</label>
            <select 
                className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-hospital-500 outline-none"
                value={formData.insurance}
                onChange={(e) => setFormData({...formData, insurance: e.target.value})}
            >
                <option value="BPJS Kesehatan">BPJS Kesehatan</option>
                <option value="Asuransi Swasta (Admedika)">Asuransi Swasta (Admedika)</option>
                <option value="Mandiri / Tunai">Mandiri / Tunai</option>
            </select>
            </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Alamat Domisili</label>
          <textarea 
            className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-hospital-500 outline-none"
            rows={2}
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
        </div>

        <button 
          type="submit" 
          disabled={status === 'processing'}
          className="w-full py-2 bg-hospital-600 text-white rounded-lg font-semibold shadow-md hover:bg-hospital-700 transition-all flex justify-center items-center gap-2"
        >
          {status === 'processing' ? (
             <>
               <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
               Memverifikasi Data...
             </>
          ) : 'Daftarkan & Verifikasi RCM'}
        </button>
      </form>
    </div>
  );
};
