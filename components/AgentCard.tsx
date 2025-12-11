import React from 'react';
import { ToolName } from '../types';

interface AgentCardProps {
  toolName: ToolName;
  active: boolean;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const AgentCard: React.FC<AgentCardProps> = ({ active, title, description, icon }) => {
  return (
    <div 
      className={`
        relative overflow-hidden rounded-xl border p-4 transition-all duration-500
        ${active 
          ? 'border-hospital-500 bg-white shadow-lg shadow-hospital-500/20 scale-105 z-10' 
          : 'border-slate-200 bg-slate-50 opacity-70 scale-100'}
      `}
    >
      {active && (
        <div className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hospital-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-hospital-500"></span>
        </div>
      )}
      
      <div className="flex items-start gap-3">
        <div className={`
          p-2 rounded-lg 
          ${active ? 'bg-hospital-500 text-white' : 'bg-slate-200 text-slate-500'}
        `}>
          {icon}
        </div>
        <div>
          <h3 className={`font-semibold text-sm ${active ? 'text-hospital-900' : 'text-slate-600'}`}>
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-snug">
            {description}
          </p>
        </div>
      </div>

      {active && (
        <div className="mt-3 pt-3 border-t border-hospital-100 text-xs text-hospital-800 font-medium flex items-center gap-1 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          PROCESSING REQUEST
        </div>
      )}
    </div>
  );
};
