import React from 'react';
import {
  Layers,
  Wand2,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Palette,
  UserCheck,
  Camera,
  Smile,
  Type,
  Maximize2,
  Clock,
  Shirt,
  Sparkle,
  Zap,
  RotateCcw
} from 'lucide-react';
import { FeatureMode, ControlSettings, AspectRatioOption } from '../types';

interface ControlPaneProps {
  mode: FeatureMode;
  setMode: (mode: FeatureMode) => void;
  settings: ControlSettings;
  setSettings: React.Dispatch<React.SetStateAction<ControlSettings>>;
  onResetSettings: () => void;
  onExecute: () => void;
  isProcessing: boolean;
  hasImages: boolean;
}

export const ControlPane: React.FC<ControlPaneProps> = ({
  mode,
  setMode,
  settings,
  setSettings,
  onResetSettings,
  onExecute,
  isProcessing,
  hasImages,
}) => {
  const featureModes: { id: FeatureMode; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'composite',
      title: '이미지생성/합성',
      desc: '원본사진에 합성사진 개체 정밀 포함 및 일관성 유지',
      icon: <Layers className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'restore',
      title: '사진복원/업스케일',
      desc: '오래된 사진 손상 복원, 픽셀 선명화 및 컬러화',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'bg_remove',
      title: '배경제거/부분삭제',
      desc: '깔끔한 누끼 따기 및 원하지 않는 개체 지우기',
      icon: <Wand2 className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'text_poster',
      title: '텍스트 렌더링 포스터',
      desc: '스타일리시 텍스트 추가로 포스터/로고 제작',
      icon: <Type className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'passport',
      title: '여권사진 제작',
      desc: '규격 흰색 배경 및 정장 착용 여권용 증명사진',
      icon: <UserCheck className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'studio',
      title: '스튜디오사진 제작',
      desc: '프로필 스튜디오 최고급 화보 조명 및 배경',
      icon: <Camera className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'skin_retouch',
      title: '피부보정',
      desc: '여드름 및 피부 트러블 제거, 매끈한 피부 연출',
      icon: <Smile className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'style_transfer',
      title: '스타일변화/스케치채색',
      desc: '애니, 수채화, 스케치 선화 채색 아트',
      icon: <Palette className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'life_album',
      title: '인생앨범 제작',
      desc: '원하는 나이로 타임슬립 (유아~노년 나이 변환)',
      icon: <Clock className="w-4 h-4 text-amber-400" />,
    },
  ];

  const aspectRatios: AspectRatioOption[] = ['1:1', '16:9', '9:16', '4:3', '3:4'];

  return (
    <div className="flex flex-col h-full bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
      {/* Pane Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
            2
          </div>
          <h2 className="text-base font-bold text-white tracking-wide">제어 파트 (Control)</h2>
        </div>
        <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
          <Zap className="w-3 h-3 fill-amber-400" /> 나노 바나나 제어
        </span>
      </div>

      {/* Feature Selection Grid/List */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>기능 모드 선택</span>
          <span className="text-[10.5px] text-slate-400">9가지 정밀 편집 지원</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto pr-1">
          {featureModes.map((item) => {
            const isSelected = mode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setMode(item.id)}
                className={`p-2 rounded-xl text-left border transition-all duration-200 flex items-start space-x-2.5 active:scale-[0.98] ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-800'
                  }`}
                >
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-bold truncate ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature Specific Detailed Controls Sub-panel */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-amber-300 border-b border-slate-800/80 pb-2">
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {featureModes.find((m) => m.id === mode)?.title} 세부 설정
          </span>
        </div>

        {/* 1. Restore & Scale up mode: Colorize Button */}
        {mode === 'restore' && (
          <div className="space-y-2">
            <p className="text-[11.5px] text-slate-300">오래된 사진 복원 및 화질 업스케일</p>
            <button
              onClick={() => setSettings((s) => ({ ...s, colorize: !s.colorize }))}
              className={`w-full py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                settings.colorize
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-500/50'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>{settings.colorize ? '🎨 컬러화 (Colorize) 적용 중' : '🎨 흑백/빛바랜 사진 컬러화 활성화'}</span>
            </button>
          </div>
        )}

        {/* 2. Text Poster Mode */}
        {mode === 'text_poster' && (
          <div className="space-y-2.5">
            <div>
              <label className="text-[11px] text-slate-300 font-medium block mb-1">포스터/로고 렌더링 텍스트</label>
              <input
                type="text"
                value={settings.posterText}
                onChange={(e) => setSettings((s) => ({ ...s, posterText: e.target.value }))}
                placeholder="예: NANO BANANA 2026"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-300 font-medium block mb-1">텍스트 아트 스타일</label>
              <div className="grid grid-cols-2 gap-1.5">
                {['골드 네온 (Neon Gold)', '사이버 엠보싱 (Cyber)', '레트로 빈티지 (Retro)', '모던 샌스 (Modern)'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSettings((s) => ({ ...s, textStyle: st }))}
                    className={`py-1 px-2 text-[10.5px] rounded-lg border transition-all truncate ${
                      settings.textStyle === st
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. Passport Photo Mode */}
        {mode === 'passport' && (
          <div className="space-y-2">
            <label className="text-[11px] text-slate-300 font-medium block">여권사진 복장 및 스타일</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { name: '다크 수트 & 넥타이', val: 'Dark Suit with Tie' },
                { name: '블루 블레이저', val: 'Classic Blue Blazer' },
                { name: '화이트 단정 셔츠', val: 'Neat White Dress Shirt' },
                { name: '스마트 캐주얼', val: 'Smart Casual Jacket' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setSettings((s) => ({ ...s, clothing: opt.val }))}
                  className={`py-1.5 px-2 text-[10.5px] font-semibold rounded-lg border text-left flex items-center gap-1.5 ${
                    settings.clothing === opt.val
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Shirt className="w-3 h-3 text-amber-400" />
                  <span className="truncate">{opt.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. Studio Portrait Mode */}
        {mode === 'studio' && (
          <div className="space-y-2">
            <label className="text-[11px] text-slate-300 font-medium block">스튜디오 화보 컨셉</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { name: '다크 그래디언트 림라이트', val: 'Dark Gray Gradient Rim Light' },
                { name: '웜 보케 앰비언트', val: 'Warm Ambient Bokeh Studio' },
                { name: '클래식 퓨어 화이트', val: 'Classic Bright Pure White' },
                { name: '시네마틱 네온 무드', val: 'Cinematic Blue & Gold Neon Mood' },
              ].map((st) => (
                <button
                  key={st.val}
                  onClick={() => setSettings((s) => ({ ...s, studioTheme: st.val }))}
                  className={`py-1.5 px-2 text-[10.5px] rounded-lg border transition-all truncate text-left ${
                    settings.studioTheme === st.val
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. Skin Retouch Mode */}
        {mode === 'skin_retouch' && (
          <div className="space-y-2">
            <label className="text-[11px] text-slate-300 font-medium block">보정 강도 (여드름 및 피부 트러블 삭제)</label>
            <div className="flex gap-2">
              {['자연스러운 보정 (Light)', '트러블 완벽 제거 (Medium)', '광채 화보 보정 (Deep Glow)'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSettings((s) => ({ ...s, retouchStrength: lvl }))}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg border text-center transition-all ${
                    settings.retouchStrength === lvl
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {lvl.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 6. Style Transfer Mode */}
        {mode === 'style_transfer' && (
          <div className="space-y-2">
            <label className="text-[11px] text-slate-300 font-medium block">변환 타겟 아트 스타일</label>
            <div className="grid grid-cols-2 gap-1.5">
              {['애니메이션 아트 (Anime)', '스케치 선화 채색 (Sketch Color)', '수채화 (WaterColor)', '사이버펑크 (Cyberpunk)'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSettings((s) => ({ ...s, targetStyle: st }))}
                  className={`py-1.5 px-2 text-[10.5px] rounded-lg border transition-all truncate text-left ${
                    settings.targetStyle === st
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 7. Life Album Age Mode */}
        {mode === 'life_album' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] text-slate-300 font-medium">변환 원하는 나이 (Life Album Age)</label>
              <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                {settings.targetAge} ({settings.ageValue}세)
              </span>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-5 gap-1">
              {[
                { label: '5세', val: 5 },
                { label: '15세', val: 15 },
                { label: '25세', val: 25 },
                { label: '50세', val: 50 },
                { label: '70세', val: 70 },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => setSettings((s) => ({ ...s, ageValue: p.val, targetAge: p.label }))}
                  className={`py-1 text-[10.5px] font-bold rounded-lg border transition-all ${
                    settings.ageValue === p.val
                      ? 'bg-amber-500 text-slate-950 border-amber-300'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <input
              type="range"
              min="1"
              max="90"
              value={settings.ageValue}
              onChange={(e) => {
                const val = Number(e.target.value);
                setSettings((s) => ({ ...s, ageValue: val, targetAge: `${val}세` }));
              }}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        )}

        {/* General/Composite Mode default notice */}
        {mode === 'composite' && (
          <p className="text-[11px] text-slate-400 leading-relaxed">
            업로드된 원본사진에 참조사진의 사람, 복장, 동물, 악세서리 등 오브젝트를 자연스럽게 포함합니다.
          </p>
        )}
        {mode === 'bg_remove' && (
          <p className="text-[11px] text-slate-400 leading-relaxed">
            피사체의 섬세한 헤어 라인까지 유지하며 배경을 제거하고 정밀 누끼 및 특정 요소 인페인팅 삭제를 수행합니다.
          </p>
        )}
      </div>

      {/* Global Image Options: Aspect Ratio, Count, Reset */}
      <div className="space-y-3 pt-1 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">이미지 생성 옵션</label>
          <button
            onClick={onResetSettings}
            className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 hover:underline"
            title="옵션 초기화"
          >
            <RotateCcw className="w-3 h-3" />
            <span>초기화</span>
          </button>
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-1">
          <span className="text-[10.5px] text-slate-400">비율 (Aspect Ratio)</span>
          <div className="grid grid-cols-5 gap-1">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio}
                onClick={() => setSettings((s) => ({ ...s, aspectRatio: ratio }))}
                className={`py-1 text-[10.5px] font-bold rounded-lg border transition-all ${
                  settings.aspectRatio === ratio
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        {/* Generation Count */}
        <div className="space-y-1">
          <span className="text-[10.5px] text-slate-400">생성할 장수</span>
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map((cnt) => (
              <button
                key={cnt}
                onClick={() => setSettings((s) => ({ ...s, count: cnt }))}
                className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  settings.count === cnt
                    ? 'bg-amber-500 text-slate-950 border-amber-300'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {cnt}장
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2 mt-auto">
        <button
          onClick={onExecute}
          disabled={isProcessing}
          className={`w-full py-3 px-4 rounded-xl font-extrabold text-sm tracking-wide flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg active:scale-[0.98] ${
            isProcessing
              ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 hover:from-amber-400 hover:to-yellow-300 shadow-amber-500/25 border border-amber-300'
          }`}
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
              <span>나노 바나나 AI 변환 및 생성 중...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>⚡ 나노 바나나 AI 생성/합성 실행</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
