export enum ToolName {
  Pendaftaran_Pasien = 'Pendaftaran_Pasien',
  Manajemen_Janji_Temu = 'Manajemen_Janji_Temu',
  Rekam_Medis_Akses = 'Rekam_Medis_Akses',
  Layanan_Farmasi_Logistik = 'Layanan_Farmasi_Logistik',
  Google_Search = 'googleSearch', // Fallback internal mapping
  Unknown = 'Unknown'
}

export interface ProcessingLog {
  id: string;
  timestamp: string;
  stage: 'INPUT' | 'ANALYSIS' | 'ROUTING' | 'EXECUTION' | 'COMPLETION';
  message: string;
  detail?: string;
  status: 'pending' | 'success' | 'error';
}

export interface SimulationResult {
  toolName: ToolName;
  args: Record<string, any>;
  confirmationMessage: string;
  complianceNote: string; // HIPAA/AIS note
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  relatedTool?: ToolName;
}
