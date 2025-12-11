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
      { id: 3, name: 'Ciprofloxacin 500mg', stock: 5, price: 15000, expiry: '2024-06' }, // Low stock simulation
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
      
      setLastTx(`Transaksi Berhasil: ${drug.name} (${prescription.qty} unit) untuk ${prescription.patient || 'Pasien'}.`);
      setActiveTab('inventory'); // Switch to inventory to show impact
  };

  return (
    <div className="h-full flex flex-col">
       <div className="mb-4 pb-2 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800">Layanan Farmasi & Logistik</h3>
        <p className="text-xs text-slate-500">Manajemen Aset Inventaris Tinggi & E-Prescribing.</p>
      </div>

      <div className="flex mb-4 bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('prescribe')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'prescribe' ? 'bg-white shadow text-hospital-600' : 'text-slate-500'}`}
          >
            (A) E-Prescribing
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'inventory' ? 'bg-white shadow text-hospital-600' : 'text-slate-500'}`}
          >
            (B) Kontrol Inventaris
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
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Obat</label>
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
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Kuantitas</label>
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
                    Proses Resep & Perbarui Stok
                </button>
            </form>
        ) : (
            <div className="space-y-4">
                {lastTx && (
                    <div className="p-2 bg-green-50 text-green-700 text-xs border border-green-200 rounded mb-2">
                        Log Transaksi Terakhir: {lastTx}
                    </div>
                )}
                
                <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                        <tr>
                            <th className="p-2">Nama Obat</th>
                            <th className="p-2 text-center">Stok Tersedia</th>
                            <th className="p-2 text-center">Harga Unit</th>
                            <th className="p-2 text-right">Kadaluarsa</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {inventory.map(item => {
                            const isLow = item.stock < 10;
                            return (
                                <tr key={item.id} className={isLow ? 'bg-red-50' : ''}>
                                    <td className="p-2 font-medium text-slate-700">{item.name}</td>
                                    <td className="p-2 text-center font-mono">{item.stock}</td>
                                    <td className="p-2 text-center text-slate-500">Rp {item.price.toLocaleString()}</td>
                                    <td className="p-2 text-right text-slate-500">{item.expiry}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                
                {/* Supply Chain Control Logic */}
                {inventory.map(item => {
                    if (item.stock < 10) {
                        return (
                            <div key={item.id} className="mt-2 p-3 border border-red-200 bg-red-50 rounded-lg shadow-sm animate-pulse">
                                <div className="flex items-center gap-2 mb-1 text-red-700">
                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                     <span className="text-xs font-bold">Supply Chain Control Alert</span>
                                </div>
                                <p className="text-xs text-red-600 font-semibold">
                                    Stok {item.name} Kritis: {item.stock} Unit. Pesanan Pembelian Otomatis Dibuat.
                                </p>
                            </div>
                        )
                    }
                    return null;
                })}
            </div>
        )}
      </div>
    </div>
  );
};