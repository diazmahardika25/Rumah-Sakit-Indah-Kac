import React, { useState, useCallback } from 'react';
import { ToolName, ProcessingLog, ChatMessage } from './types';
import { routeHospitalRequest } from './services/geminiService';
import { AgentCard } from './components/AgentCard';
import { LogPanel } from './components/LogPanel';
// Import new Agent Components
import { RegistrationAgent } from './components/agents/RegistrationAgent';
import { AppointmentAgent } from './components/agents/AppointmentAgent';
import { RecordsAgent } from './components/agents/RecordsAgent';
import { PharmacyAgent } from './components/agents/PharmacyAgent';

// Icons
const Icons = {
  Registration: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Calendar: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
  ),
  Records: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 13h4"/><path d="M10 17h4"/><path d="M10 9h1"/></svg>
  ),
  Pharmacy: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
  ),
  Send: (
     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
  ),
  Hospital: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hospital-600"><path d="M12 6V2H8"/><path d="m8 18-4 4H2l4-4"/><path d="m16 18 4 4h2l-4-4"/><path d="M12 18v6"/><path d="M17 2h-5v4"/><rect x="4" y="2" width="16" height="20" rx="2"/></svg>
  )
};

const SUGGESTIONS = [
  "Pasien Sinta ingin membatalkan semua janji dengan Dokter Andi bulan ini.",
  "Perbarui data asuransi untuk pasien Bima, dia pindah ke BPJS.",
  "Cek stok obat Ciprofloxacin 500mg di gudang farmasi.",
  "Saya butuh ringkasan rekam medis pasien ID-998 dari poli jantung."
];

export default function App() {
  const [inputText, setInputText] = useState("");
  const [processingTool, setProcessingTool] = useState<ToolName | null>(null); // Visual animation only
  
  // Persistent Workspace State
  const [activeWorkspace, setActiveWorkspace] = useState<ToolName | null>(null);
  const [workspaceArgs, setWorkspaceArgs] = useState<any>(null);

  const [logs, setLogs] = useState<ProcessingLog[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const addLog = useCallback((stage: ProcessingLog['stage'], message: string) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('id-ID'),
      stage,
      message,
      status: 'success'
    }]);
  }, []);

  const handleProcess = async () => {
    if (!inputText.trim() || isProcessing) return;

    const currentInput = inputText;
    setInputText("");
    setIsProcessing(true);
    setProcessingTool(null);
    // We don't clear activeWorkspace immediately to avoid jarring transitions, 
    // we clear it only if a new tool is confirmed.

    // Add user message
    setChatHistory(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: currentInput
    }]);

    addLog('INPUT', `Menerima input pengguna: "${currentInput.substring(0, 30)}..."`);
    addLog('ANALYSIS', "Menganalisis niat & konteks AIS...");

    try {
      const result = await routeHospitalRequest(currentInput);

      if (result) {
        addLog('ROUTING', `Intent diklasifikasikan: ${result.toolName}`);
        setProcessingTool(result.toolName);
        
        // Simulate network/routing delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        addLog('EXECUTION', `Mengaktifkan Workspace Microservice ${result.toolName}`);
        
        // OPEN THE WORKSPACE
        setActiveWorkspace(result.toolName);
        setWorkspaceArgs(result.args);

        addLog('COMPLETION', result.complianceNote);

        setChatHistory(prev => [...prev, {
          id: Date.now().toString(),
          role: 'model',
          content: result.confirmationMessage,
          relatedTool: result.toolName
        }]);
      } else {
        addLog('ROUTING', "Tidak ada tool spesifik. Menggunakan General Fallback.");
        setChatHistory(prev => [...prev, {
          id: Date.now().toString(),
          role: 'model',
          content: "Maaf, permintaan ini tidak masuk dalam kategori operasional kritis RS (Pendaftaran, Janji Temu, Rekam Medis, Farmasi). Silakan hubungi bagian informasi umum.",
        }]);
      }

    } catch (error) {
      addLog('COMPLETION', "Error processing request.");
      setChatHistory(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: "Terjadi kesalahan sistem saat memproses permintaan Anda.",
      }]);
    } finally {
      setIsProcessing(false);
      // Reset processing animation after delay
      setTimeout(() => setProcessingTool(null), 3000);
    }
  };

  const renderActiveWorkspace = () => {
      switch(activeWorkspace) {
          case ToolName.Pendaftaran_Pasien:
              return <RegistrationAgent initialData={workspaceArgs} />;
          case ToolName.Manajemen_Janji_Temu:
              return <AppointmentAgent initialData={workspaceArgs} />;
          case ToolName.Rekam_Medis_Akses:
              return <RecordsAgent initialData={workspaceArgs} />;
          case ToolName.Layanan_Farmasi_Logistik:
              return <PharmacyAgent initialData={workspaceArgs} />;
          default:
              return null;
      }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <header className="w-full mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-hospital-100 rounded-lg text-hospital-800">
                {Icons.Hospital}
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-800">RS Cerdas <span className="text-hospital-500">AIS Manager</span></h1>
                <p className="text-sm text-slate-500">Sistem Operasional Rumah Sakit Terintegrasi & Compliant</p>
            </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            SYSTEM ONLINE
        </div>
      </header>

      <main className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 h-[80vh]">
        
        {/* Left Column: Agents Dashboard */}
        <section className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Microservices Grid</h2>
                {processingTool && <span className="text-xs text-hospital-600 font-bold animate-pulse">ROUTING ACTIVE</span>}
            </div>
            
            <div className="grid grid-cols-1 gap-3 flex-1 overflow-y-auto pr-1">
                <AgentCard 
                    toolName={ToolName.Pendaftaran_Pasien}
                    active={activeWorkspace === ToolName.Pendaftaran_Pasien || processingTool === ToolName.Pendaftaran_Pasien}
                    title="Pendaftaran & RCM"
                    description="Registrasi pasien, verifikasi asuransi, data demografis."
                    icon={Icons.Registration}
                />
                <AgentCard 
                    toolName={ToolName.Manajemen_Janji_Temu}
                    active={activeWorkspace === ToolName.Manajemen_Janji_Temu || processingTool === ToolName.Manajemen_Janji_Temu}
                    title="Manajemen Janji Temu"
                    description="Penjadwalan, pembatalan, dan alokasi sumber daya."
                    icon={Icons.Calendar}
                />
                <AgentCard 
                    toolName={ToolName.Rekam_Medis_Akses}
                    active={activeWorkspace === ToolName.Rekam_Medis_Akses || processingTool === ToolName.Rekam_Medis_Akses}
                    title="Akses Rekam Medis"
                    description="EHR retrieval, standar FHIR, audit log klinis."
                    icon={Icons.Records}
                />
                <AgentCard 
                    toolName={ToolName.Layanan_Farmasi_Logistik}
                    active={activeWorkspace === ToolName.Layanan_Farmasi_Logistik || processingTool === ToolName.Layanan_Farmasi_Logistik}
                    title="Farmasi & Logistik"
                    description="E-prescribing, inventory obat, supply chain."
                    icon={Icons.Pharmacy}
                />
            </div>

            {/* Logs Panel */}
            <div className="mt-auto">
                <LogPanel logs={logs} />
            </div>
        </section>

        {/* Right Column: Chat Interface OR Active Workspace */}
        <section className="lg:col-span-8 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
            
            {/* If a Workspace is active, we split the view or show it prominently. 
                For this design, we will use a split view: Top half is chat logs (small), Bottom/Main is Workspace.
                Or if no workspace, full chat.
            */}
            
            {/* Chat History Area (Compact if workspace active) */}
            <div className={`
                flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4 transition-all duration-300
                ${activeWorkspace ? 'h-1/3 border-b border-slate-200' : 'h-full'}
            `}>
                {chatHistory.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-8">
                        <div className="bg-slate-100 p-4 rounded-full mb-4">
                            {Icons.Hospital}
                        </div>
                        <h3 className="text-lg font-medium text-slate-600">Selamat Datang di Command Center</h3>
                        <p className="max-w-md mt-2 mb-8">Silakan masukkan perintah operasional. Sistem akan merutekan ke subagen yang sesuai berdasarkan protokol RCM dan HIPAA.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                            {SUGGESTIONS.map((s, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setInputText(s)}
                                    className="text-left text-xs p-3 bg-white border border-slate-200 rounded-lg hover:border-hospital-400 hover:shadow-sm transition-all text-slate-600"
                                >
                                    "{s}"
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    chatHistory.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`
                                max-w-[80%] rounded-2xl p-3 text-sm shadow-sm
                                ${msg.role === 'user' 
                                    ? 'bg-hospital-600 text-white rounded-br-none' 
                                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'}
                            `}>
                                <p className="leading-relaxed">{msg.content}</p>
                            </div>
                        </div>
                    ))
                )}
                 {isProcessing && (
                     <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-hospital-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-hospital-400 rounded-full animate-bounce delay-100"></span>
                            <span className="w-1.5 h-1.5 bg-hospital-400 rounded-full animate-bounce delay-200"></span>
                        </div>
                     </div>
                )}
            </div>

            {/* Operational Workspace Area */}
            {activeWorkspace && (
                <div className="flex-grow-[2] bg-white p-4 animate-slide-up overflow-y-auto">
                    {renderActiveWorkspace()}
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleProcess()}
                        placeholder="Masukkan perintah operasional rumah sakit..."
                        className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500 outline-none transition-all"
                        disabled={isProcessing}
                    />
                    <button
                        onClick={handleProcess}
                        disabled={!inputText.trim() || isProcessing}
                        className="absolute right-2 p-2 bg-hospital-600 text-white rounded-lg hover:bg-hospital-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {Icons.Send}
                    </button>
                </div>
                <div className="text-center mt-2 flex justify-between items-center px-2">
                    <p className="text-[10px] text-slate-400">
                        AIS Protected System. HIPAA/GDPR Compliant.
                    </p>
                    {activeWorkspace && (
                         <button onClick={() => { setActiveWorkspace(null); setWorkspaceArgs(null); }} className="text-[10px] text-red-500 hover:underline">
                            Close Workspace
                         </button>
                    )}
                </div>
            </div>

        </section>
      </main>
    </div>
  );
}
