import { GoogleGenAI, FunctionDeclaration, Type, Tool } from "@google/genai";
import { ToolName, SimulationResult } from "../types";

// --- System Instruction from the Prompt ---
const SYSTEM_INSTRUCTION = `
PERAN PUSAT: Anda adalah Manajer Operasional Rumah Sakit yang ahli, bertindak sebagai Intelligent Data Router di atas arsitektur microservices ERP Rumah Sakit.

MISI UTAMA: Menganalisis niat (intent) permintaan pengguna/staf dalam bahasa alami dan mendelegasikannya secara eksklusif dan akurat kepada Subagen spesialis yang relevan (Fungsi/Tools) melalui Function Calling. Anda harus memastikan bahwa routing tugas mencerminkan pemahaman terhadap sensitivitas data kesehatan (ePHI) dan dampak operasional terhadap akuntabilitas finansial Rumah Sakit (RCM).

ASUMSI ARSITEKTUR KRITIS: Asumsikan setiap Subagen yang dipanggil adalah Microservice yang terintegrasi dengan sistem ERP Rumah Sakit dan beroperasi di bawah protokol HIPAA dan standar interoperabilitas FHIR.

ATURAN PENGARAHAN DAN VALIDASI:
1. Prioritas Keluaran: Anda HANYA boleh menghasilkan satu pemanggilan fungsi dari 4 Subagen yang didefinisikan.
2. Kejelasan: Pemanggilan harus jelas dan tidak ambigu.
3. Keterbatasan Konteks: Jika permintaan tidak terkait langsung dengan salah satu dari 4 fungsi operasional inti ini, abaikan function call dan jawab sebagai pertanyaan umum (atau gunakan search jika tersedia).
4. Akurasi Logis: Klasifikasi harus didasarkan pada analisis mendalam.
`;

// --- Tool Definitions ---

const pendaftaranPasienTool: FunctionDeclaration = {
  name: ToolName.Pendaftaran_Pasien,
  description: "Menangani tugas pendaftaran pasien baru, pembaruan data demografis, dan verifikasi kelayakan asuransi. Titik awal RCM, menentukan akurasi penagihan dan kepatuhan HIPAA.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      detail_permintaan: {
        type: Type.STRING,
        description: "Detail lengkap permintaan terkait pendaftaran atau data demografis.",
      },
    },
    required: ["detail_permintaan"],
  },
};

const manajemenJanjiTemuTool: FunctionDeclaration = {
  name: ToolName.Manajemen_Janji_Temu,
  description: "Mengelola penjadwalan, modifikasi, atau pembatalan janji temu pasien. Memengaruhi efisiensi operasional dan KPI Charge Capture.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      detail_permintaan: {
        type: Type.STRING,
        description: "Detail permintaan jadwal, nama dokter, waktu, atau pembatalan.",
      },
    },
    required: ["detail_permintaan"],
  },
};

const rekamMedisAksesTool: FunctionDeclaration = {
  name: ToolName.Rekam_Medis_Akses,
  description: "Menangani permintaan untuk pengambilan, pembaruan, dan peringkasan riwayat medis pasien. Akses ketat patuh pada standar FHIR dan audit trail HIPAA.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      detail_permintaan: {
        type: Type.STRING,
        description: "Detail data klinis yang diminta atau perlu diakses.",
      },
    },
    required: ["detail_permintaan"],
  },
};

const layananFarmasiLogistikTool: FunctionDeclaration = {
  name: ToolName.Layanan_Farmasi_Logistik,
  description: "Mengelola permintaan terkait resep, informasi obat, stok, dan penyaluran obat. Berdampak pada Supply Chain Management.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      detail_permintaan: {
        type: Type.STRING,
        description: "Nama obat, dosis, atau pertanyaan stok/logistik.",
      },
    },
    required: ["detail_permintaan"],
  },
};

const tools: Tool[] = [{
  functionDeclarations: [
    pendaftaranPasienTool,
    manajemenJanjiTemuTool,
    rekamMedisAksesTool,
    layananFarmasiLogistikTool
  ]
}];

// --- Service Implementation ---

export const routeHospitalRequest = async (userInput: string): Promise<SimulationResult | null> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please provide a valid Gemini API Key.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using Flash for speed/efficiency in this demo
      contents: userInput,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: tools,
        temperature: 0.1, // Low temperature for deterministic routing
      },
    });

    const candidate = response.candidates?.[0];
    
    // Check for Function Calls
    if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
            if (part.functionCall) {
                const fc = part.functionCall;
                const toolName = fc.name as ToolName;
                const args = fc.args as Record<string, any>;

                // Generate a simulated response based on the tool
                let confirmation = "";
                let compliance = "";

                switch(toolName) {
                    case ToolName.Pendaftaran_Pasien:
                        confirmation = `Microservice Pendaftaran diaktifkan. Memproses pembaruan data: "${args.detail_permintaan}"`;
                        compliance = "Validasi HIPAA: Data demografis dikunci dan diverifikasi.";
                        break;
                    case ToolName.Manajemen_Janji_Temu:
                        confirmation = `Microservice Penjadwalan diaktifkan. Mengelola slot waktu untuk: "${args.detail_permintaan}"`;
                        compliance = "Audit Trail: Perubahan jadwal dicatat untuk tracking KPI Charge Capture.";
                        break;
                    case ToolName.Rekam_Medis_Akses:
                        confirmation = `Gateway FHIR diaktifkan. Mengambil ringkasan: "${args.detail_permintaan}"`;
                        compliance = "Peringatan Keamanan: Akses ePHI dicatat dalam log audit kepatuhan.";
                        break;
                    case ToolName.Layanan_Farmasi_Logistik:
                        confirmation = `Sistem Logistik Farmasi diaktifkan. Query: "${args.detail_permintaan}"`;
                        compliance = "Verifikasi: Dosis dan interaksi obat dicek silang dengan database keamanan.";
                        break;
                    default:
                         confirmation = "Permintaan tidak terklasifikasi ke subagen kritis.";
                         compliance = "Routing umum.";
                }

                return {
                    toolName: toolName,
                    args: args,
                    confirmationMessage: confirmation,
                    complianceNote: compliance
                };
            }
        }
    }

    // If no function call, return null (handled as general query)
    return null;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
