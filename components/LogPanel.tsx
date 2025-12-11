import React, { useEffect, useRef } from 'react';
import { ProcessingLog } from '../types';

interface LogPanelProps {
  logs: ProcessingLog[];
}

export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-green-400 shadow-inner h-64 overflow-y-auto scrollbar-hide border border-slate-700">
      <div className="flex items-center justify-between mb-2 sticky top-0 bg-slate-900 pb-2 border-b border-slate-800">
        <span className="uppercase tracking-widest text-slate-500 font-bold">AIS System Logs & Audit Trail</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div className="space-y-1.5">
        {logs.length === 0 && (
          <div className="text-slate-600 italic">System ready. Waiting for input...</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2 opacity-90 hover:opacity-100 transition-opacity">
            <span className="text-slate-500">[{log.timestamp}]</span>
            <span className={`font-bold ${
              log.stage === 'ROUTING' ? 'text-blue-400' :
              log.stage === 'EXECUTION' ? 'text-purple-400' :
              'text-yellow-400'
            }`}>
              {log.stage}:
            </span>
            <span className="text-slate-300">{log.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
