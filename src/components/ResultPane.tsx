import React, { useState } from 'react';
import {
  RefreshCw,
  Download,
  Copy,
  Maximize2,
  Share2,
  RotateCcw,
  Sparkles,
  Check,
  Eye,
  History,
  Image as ImageIcon,
  Zap,
  Layers
} from 'lucide-react';
import { GeneratedResult } from '../types';
import { ImageComparisonSlider } from './ImageComparisonSlider';

interface ResultPaneProps {
  results: GeneratedResult[];
  activeResult: GeneratedResult | null;
  setActiveResult: (res: GeneratedResult) => void;
  onRefreshResult: () => void;
  onUseAsInput: (imageUrl: string) => void;
  originalImage?: string;
  isProcessing: boolean;
  history: GeneratedResult[];
}

export const ResultPane: React.FC<ResultPaneProps> = ({
  results,
  activeResult,
  setActiveResult,
  onRefreshResult,
  onUseAsInput,
  originalImage,
  isProcessing,
  history,
}) => {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'slider' | 'side' | 'grid'>('slider');

  const handleCopy = async () => {
    if (!activeResult) return;
    try {
      await navigator.clipboard.writeText(activeResult.imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  const handleDownload = () => {
    if (!activeResult) return;
    const link = document.createElement('a');
    link.href = activeResult.imageUrl;
    link.download = `nano-banana-${activeResult.mode}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
      {/* Pane Header with Requirement: Top-Right Refresh Button ("새로고침: 맨우측 상단에 배치") */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
            3
          </div>
          <h2 className="text-base font-bold text-white tracking-wide">생성물 결과 (Result)</h2>
        </div>

        {/* TOP RIGHT REFRESH BUTTON */}
        <button
          onClick={onRefreshResult}
          disabled={isProcessing}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-amber-400 border border-slate-700 hover:border-amber-500/50 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
          title="결과 새로고침 및 재생성"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isProcessing ? 'animate-spin' : ''}`} />
          <span>새로고침</span>
        </button>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 flex flex-col min-h-0 space-y-3">
        {/* View Mode Toggle Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-semibold">
            <button
              onClick={() => setActiveTab('slider')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === 'slider'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              슬라이더 비교
            </button>
            <button
              onClick={() => setActiveTab('side')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === 'side'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              나란히 비교
            </button>
            {results.length > 1 && (
              <button
                onClick={() => setActiveTab('grid')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeTab === 'grid'
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                다중 변형 ({results.length})
              </button>
            )}
          </div>

          {activeResult && (
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="최고화질 크게보기"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Display Canvas Area */}
        <div className="flex-1 relative bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-2 min-h-[300px]">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
                <div className="absolute inset-2 rounded-full bg-slate-900 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-amber-400 animate-pulse" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-white">나노 바나나 정밀 연산 실행 중...</p>
                <p className="text-xs text-slate-400 mt-1">얼굴 이목구비 및 스타일 일관성 매칭 중</p>
              </div>
            </div>
          ) : activeResult ? (
            <>
              {activeTab === 'slider' && (
                <ImageComparisonSlider
                  beforeImage={originalImage || activeResult.originalImageUrl}
                  afterImage={activeResult.imageUrl}
                  className="w-full h-full max-h-[420px]"
                />
              )}

              {activeTab === 'side' && (
                <div className="grid grid-cols-2 gap-2 w-full h-full max-h-[420px]">
                  <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {originalImage || activeResult.originalImageUrl ? (
                      <img
                        src={originalImage || activeResult.originalImageUrl}
                        alt="Before"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-slate-500 text-xs">원본 이미지 없음</div>
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold bg-slate-950/80 text-slate-300 rounded">
                      원본 (BEFORE)
                    </span>
                  </div>

                  <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <img src={activeResult.imageUrl} alt="After" className="w-full h-full object-contain" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold bg-amber-500 text-slate-950 rounded">
                      나노 바나나 (AFTER)
                    </span>
                  </div>
                </div>
              )}

              {activeTab === 'grid' && (
                <div className="grid grid-cols-2 gap-2.5 w-full h-full overflow-y-auto max-h-[420px] p-1">
                  {results.map((res, index) => (
                    <div
                      key={res.id}
                      onClick={() => {
                        setActiveResult(res);
                        setActiveTab('slider');
                      }}
                      className={`relative group rounded-xl overflow-hidden bg-slate-900 border-2 cursor-pointer transition-all ${
                        activeResult.id === res.id ? 'border-amber-400 shadow-lg' : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <img src={res.imageUrl} alt={`Variation ${index + 1}`} className="w-full h-36 object-cover" />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[9px] font-bold bg-slate-950/90 text-amber-400 rounded">
                        #{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-300">생성된 결과물이 없습니다.</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  왼쪽 파트에서 이미지를 업로드하고 <br />
                  중간 제어 파트에서 버튼을 클릭해 주세요.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Toolbar */}
        {activeResult && !isProcessing && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleDownload}
                className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>다운로드 (PNG)</span>
              </button>

              <button
                onClick={() => onUseAsInput(activeResult.imageUrl)}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-500/40 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all active:scale-95"
                title="결과물을 입력 원본으로 등록하여 추가 정밀 편집"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>입력으로 재사용</span>
              </button>

              <button
                onClick={handleCopy}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '복사됨!' : '주소 복사'}</span>
              </button>
            </div>
          </div>
        )}

        {/* History Gallery Log */}
        {history.length > 0 && (
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-amber-400" /> 작업 내역 갤러리 ({history.length})
              </span>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-thin">
              {history.map((hItem) => (
                <button
                  key={hItem.id}
                  onClick={() => setActiveResult(hItem)}
                  className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    activeResult?.id === hItem.id ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={hItem.imageUrl} alt={hItem.modeName} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Inspection Modal */}
      {isFullscreen && activeResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md p-6 flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-between w-full max-w-5xl">
            <div className="text-white">
              <h3 className="font-bold text-base">{activeResult.modeName} 고화질 크게보기</h3>
              <p className="text-xs text-slate-400">{activeResult.prompt}</p>
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
            >
              닫기 (ESC)
            </button>
          </div>

          <div className="flex-1 w-full max-w-5xl overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2">
            <img src={activeResult.imageUrl} alt="High Res" className="max-w-full max-h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};
