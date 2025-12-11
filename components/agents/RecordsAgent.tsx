import React, { useState } from 'react';

interface RecordsAgentProps {
  initialData?: any;
}

export const RecordsAgent: React.FC<RecordsAgentProps> = ({ initialData }) => {
  const [searchId, setSearchId] = useState('');
  const [record, setRecord] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;

    // Simulasi Logika: Data Klinis FHIR
    setRecord({
        patientId: searchId,
        name: "Pasien Simulasi",
        diagnosis: [
            { code: "I25.1", name: "Penyakit Jantung Koroner", date: "2023-10-12" },
            { code: "E11.9", name: "Diabetes Melitus Tipe 2", date: "2023-01-15" }
        ],
        lastAccess: new Date().toLocaleString('id-ID'),
        auditor: "AIS_SYSTEM_ADMIN"
    });
  };

  return (
    <div className="h-full flex flex-col">
       <div className="mb-4 pb-2 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800">Akses Rekam Medis (EHR)</h3>
        <p className="text-xs text-slate-500">Pusat Data Klinis (ePHI/EHR) dengan kepatuhan FHIR.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input 
            type="text" 
            placeholder="Masukkan ID Pasien (e.g., RM-123)"
            className="flex-1 p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-hospital-500 outline-none"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
        />
        <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700">
            Cari
        </button>
      </form>

      {record ? (
        <div className="flex-1 overflow-y-auto animate-fade-in">
            {/* Audit Log Warning */}
            <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
                <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <div>
                        <h4 className="text-xs font-bold text-red-700 uppercase">Audit Trail HIPAA</h4>
                        <p className="text-[10px] text-red-600 mt-1">
                            User: {record.auditor} | Time: {record.lastAccess}
                        </p>
                    </div>
                </div>
            </div>

            {/* FHIR Data Simulation */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-4">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                    <span className="font-semibold text-slate-700 text-sm">Tinjauan Rekam Medis & Riwayat Diagnosa</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded font-mono">Format: FHIR</span>
                </div>
                <div className="p-4 space-y-4">
                    <div>
                        <span className="text-xs text-slate-400 uppercase font-bold">Diagnosa (ICD-10 Code Simulation)</span>
                        <div className="mt-2 space-y-2">
                            {record.diagnosis.map((d: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100">
                                    <span className="text-sm font-medium text-slate-700">{d.name}</span>
                                    <span className="font-mono text-xs bg-slate-200 px-2 py-1 rounded text-slate-600 font-bold">{d.code}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Final Status */}
            <div className="p-3 bg-green-50 rounded border border-green-200 text-center">
                <p className="text-xs font-bold text-green-700">
                    Data Klinis Terakhir Diperbarui. Akses Diverifikasi dengan RBAC (Role-Based Access Control) HIPAA.
                </p>
            </div>

            <div className="mt-4 text-center">
                <button onClick={() => setRecord(null)} className="text-xs text-slate-500 hover:text-red-500 underline">
                    Tutup Akses (Logout)
                </button>
            </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <p className="text-sm">Silakan Masukkan ID Pasien</p>
        </div>
      )}
    </div>
  );
};