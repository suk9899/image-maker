import React from 'react';
import { Banana, Zap, ShieldCheck, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onResetAll: () => void;
  isProcessing: boolean;
  onOpenApiKeyModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onResetAll, isProcessing, onOpenApiKeyModal }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-0.5 shadow-md shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Banana className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                나노 바나나 <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">AI 스튜디오</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Zap className="w-3 h-3 fill-amber-400" /> GEMINI 3.1
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              변경전후 일관성 유지 합성 · 오래된 사진 복원 및 업스케일 · 여권 & 스튜디오 화보 · 피부 보정 · 인생앨범
            </p>
          </div>
        </div>

        {/* Global Controls & Server Security Badge */}
        <div className="flex items-center space-x-2.5">
          {/* Server-side Security Info Badge */}
          <button
            onClick={onOpenApiKeyModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-400 rounded-xl transition-all shadow-sm active:scale-95"
            title="API Key 서버 전용 보안 가이드"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">서버 프록시 API Key 보안 적용됨</span>
            <span className="sm:hidden">보안 적용</span>
          </button>

          <button
            onClick={onResetAll}
            disabled={isProcessing}
            title="전체 초기화 (입력, 제어, 결과 리셋)"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-500/40 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">전체 초기화</span>
          </button>
        </div>
      </div>
    </header>
  );
};
