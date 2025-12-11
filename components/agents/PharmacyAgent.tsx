import React, { useState } from 'react';

interface PharmacyAgentProps {
  initialData?: any;
}

interface Drug {
    id: number;
    name: string;
    stock: number;
    price: number;
    expiry: string;
}

export const PharmacyAgent: React.FC<PharmacyAgentProps> = ({ initialData }) => {
  const [activeTab, setActiveTab] = useState<'prescribe' | 'inventory'>('prescribe');
  
  // Mock Inventory State
  const [inventory, setInventory] = useState<Drug[]>([
      { id: 1, name: 'Paracetamol 500mg', stock: 150, price: 5000, expiry: '2025-12' },
      { id: 2, name: 'Amoxicillin 500mg', stock: 45, price: 12000, expiry: '2024-08' },
      { id: 3, name: 'Ciprofloxacin 500mg', stock: 8, price: 15000, expiry: '2024-06' }, // Low stock simulation
      { id: 4, name: 'Metformin 500mg', stock: 200, price: 3000, expiry: '2025-01' },
  ]);

  const [prescription, setPrescription] = useState({
      patient: initialData?.detail_permintaan || '',
      drugId: 1,
      qty: 10
  });

  const [lastTx, setLastTx] = useState<string | null>(null);

  const handlePrescribe = (e: React.FormEvent) => {
      e.preventDefault();
      
      const drugIndex = inventory.findIndex(d => d.id === Number(prescription.drugId));
      if (drugIndex === -1) return;

      const drug = inventory[drugIndex];
      
      if (drug.stock < prescription.qty) {
          alert(`Stok tidak mencukupi! Tersedia: ${drug.stock}`);
          return;
      }

      // Logic: Reduce Stock
      const newInventory = [...inventory];
      newInventory[drugIndex].stock -= prescription.qty;
      setInventory(newInventory);
      
      setLastTx(`Resep diproses: ${drug.name} (${prescription.qty} unit) untuk ${prescription.patient || 'Pasien'}.`);
      setActiveTab('inventory'); // Switch to inventory to show impact
  };

  return (
    <div className="h-full flex flex-col">
       <div className="mb-4 pb-2 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800">Layanan Farmasi & Logistik</h3>
        <p className="text-xs text-slate-500">Integrasi E-Prescribing dengan Supply Chain Management.</p>
      </div>

      <div className="flex mb-4 bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('prescribe')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'prescribe' ? 'bg-white shadow text-hospital-600' : 'text-slate-500'}`}
          >
            A. E-Prescribing
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'inventory' ? 'bg-white shadow text-hospital-600' : 'text-slate-500'}`}
          >
            B. Kontrol Inventaris
          </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'prescribe' ? (
            <form onSubmit={handlePrescribe} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Pasien</label>
                    <input 
                        type="text" 
                        required
                        className="w-full p-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-hospital-500"
                        placeholder="Nama Pasien"
                        value={prescription.patient}
                        onChange={(e) => setPrescription({...prescription, patient: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Pilih Obat</label>
                    <select 
                        className="w-full p-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-hospital-500"
                        value={prescription.drugId}
                        onChange={(e) => setPrescription({...prescription, drugId: Number(e.target.value)})}
                    >
                        {inventory.map(d => (
                            <option key={d.id} value={d.id}>{d.name} (Stok: {d.stock})</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Kuantitas (Unit)</label>
                    <input 
                        type="number" 
                        min="1"
                        required
                        className="w-full p-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-hospital-500"
                        value={prescription.qty}
                        onChange={(e) => setPrescription({...prescription, qty: Number(e.target.value)})}
                    />
                </div>
                <button 
                    type="submit"
                    className="w-full py-2 bg-teal-600 text-white rounded-lg font-semibold shadow-md hover:bg-teal-700 transition-all"
                >
                    Proses Resep & Potong Stok
                </button>
            </form>
        ) : (
            <div className="space-y-4">
                {lastTx && (
                    <div className="p-2 bg-green-50 text-green-700 text-xs border border-green-200 rounded mb-2">
                        {lastTx}
                    </div>
                )}
                
                <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                        <tr>
                            <th className="p-2">Nama Obat</th>
                            <th className="p-2 text-center">Stok</th>
                            <th className="p-2 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {inventory.map(item => {
                            const isLow = item.stock < 10;
                            return (
                                <tr key={item.id} className={isLow ? 'bg-red-50' : ''}>
                                    <td className="p-2 font-medium text-slate-700">{item.name}</td>
                                    <td className="p-2 text-center font-mono">{item.stock}</td>
                                    <td className="p-2 text-right">
                                        {isLow ? (
                                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full font-bold text-[10px] animate-pulse">
                                                KRITIS: RE-ORDER
                                            </span>
                                        ) : (
                                            <span className="text-green-600 font-semibold">OK</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                
                {/* Simulated Supply Chain Logic */}
                {inventory.some(i => i.stock < 10) && (
                    <div className="mt-4 p-3 border border-red-200 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                             <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                             <span className="text-xs font-bold text-slate-800">Supply Chain Alert System</span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                            Terdeteksi stok di bawah ambang batas (10 unit). 
                            PO (Purchase Order) otomatis telah dibuat ke vendor farmasi rekanan.
                        </p>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};
