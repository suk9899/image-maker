import React, { useRef, useState } from 'react';
import { Upload, Sparkles, Image as ImageIcon, Trash2, Wand2, UserCheck, AlertCircle, Plus } from 'lucide-react';
import { UploadedImage, FeatureMode } from '../types';
import { fileToBase64, formatBytes } from '../utils/canvasHelper';
import { createSamplePortraitDataUrl } from '../utils/sampleImages';

interface InputPaneProps {
  ideaPrompt: string;
  setIdeaPrompt: (val: string) => void;
  images: UploadedImage[];
  setImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  currentMode: FeatureMode;
  isExpandingIdea: boolean;
  onExpandIdea: () => void;
}

export const InputPane: React.FC<InputPaneProps> = ({
  ideaPrompt,
  setIdeaPrompt,
  images,
  setImages,
  currentMode,
  isExpandingIdea,
  onExpandIdea,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);

  const maxImages = 3;

  // Sample portrait images for 1-click test with zero CORS issues
  const getSamplePortraits = () => [
    {
      title: '여권/인물 샘플',
      dataUrl: createSamplePortraitDataUrl('female'),
      name: '샘플_인물사진.png',
    },
    {
      title: '오래된사진 샘플',
      dataUrl: createSamplePortraitDataUrl('vintage'),
      name: '샘플_흑백사진.png',
    },
    {
      title: '합성참조 샘플',
      dataUrl: createSamplePortraitDataUrl('male'),
      name: '샘플_참조사진.png',
    },
  ];

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setDragError(null);

    const availableSlots = maxImages - images.length;
    if (availableSlots <= 0) {
      setDragError(`최대 ${maxImages}장까지만 업로드 가능합니다.`);
      return;
    }

    const filesArray = Array.from(files).slice(0, availableSlots);
    const newUploaded: UploadedImage[] = [];

    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];
      if (!file.type.startsWith('image/')) {
        continue;
      }

      try {
        const dataUrl = await fileToBase64(file);
        const index = images.length + newUploaded.length;
        let label: UploadedImage['label'] = '원본 (Base)';
        if (index === 1) label = '참조 1 (Ref 1)';
        if (index === 2) label = '참조 2 (Ref 2)';

        newUploaded.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          dataUrl,
          mimeType: file.type,
          name: file.name,
          size: file.size,
          label,
        });
      } catch (err) {
        console.error('File read error:', err);
      }
    }

    if (newUploaded.length > 0) {
      setImages((prev) => {
        const combined = [...prev, ...newUploaded];
        return combined.map((item, idx) => ({
          ...item,
          label: idx === 0 ? '원본 (Base)' : idx === 1 ? '참조 1 (Ref 1)' : '참조 2 (Ref 2)',
        }));
      });
    }
  };

  const handleAddSample = (sample: { title: string; dataUrl: string; name: string }) => {
    if (images.length >= maxImages) {
      setDragError(`최대 ${maxImages}장까지만 등록 가능합니다.`);
      return;
    }

    const index = images.length;
    let label: UploadedImage['label'] = '원본 (Base)';
    if (index === 1) label = '참조 1 (Ref 1)';
    if (index === 2) label = '참조 2 (Ref 2)';

    const sampleObj: UploadedImage = {
      id: `sample-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      dataUrl: sample.dataUrl,
      mimeType: 'image/png',
      name: sample.name,
      size: 1024 * 120,
      label,
    };

    setImages((prev) => {
      const updated = [...prev, sampleObj];
      return updated.map((item, idx) => ({
        ...item,
        label: idx === 0 ? '원본 (Base)' : idx === 1 ? '참조 1 (Ref 1)' : '참조 2 (Ref 2)',
      }));
    });
    setDragError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      return filtered.map((item, idx) => ({
        ...item,
        label: idx === 0 ? '원본 (Base)' : idx === 1 ? '참조 1 (Ref 1)' : '참조 2 (Ref 2)',
      }));
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
      {/* Pane Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
            1
          </div>
          <h2 className="text-base font-bold text-white tracking-wide">입력 파트 (Input)</h2>
        </div>
        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-md">
          이미지 {images.length} / {maxImages}장
        </span>
      </div>

      {/* Mode Specific Advice Banner */}
      {currentMode === 'passport' && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-300 flex items-start gap-2">
          <UserCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">여권사진 제작 팁</p>
            <p className="text-[11px] text-slate-300 mt-0.5">
              얼굴이 또렷한 정면 사진을 업로드해 주세요. AI가 표준 흰색 배경 및 정장/넥타이 스타일로 완벽 변환합니다.
            </p>
          </div>
        </div>
      )}

      {/* 1. Idea Input Box & AI Auto Generate Button */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            아이디어 및 변환 디렉팅 입력
          </label>
          <span className="text-[11px] text-slate-400">자연어 서술</span>
        </div>

        <div className="relative">
          <textarea
            value={ideaPrompt}
            onChange={(e) => setIdeaPrompt(e.target.value)}
            placeholder={
              currentMode === 'passport'
                ? '예: 여권사진으로 깔끔하게 변환하고 다크 네이비 수트와 넥타이를 입혀줘. 배경은 깨끗한 순백색으로 연출해줘.'
                : '예: 원본 인물에 참조1의 수트를 입혀줘 / 피부 여드름을 제거하고 깨끗하게 해줘 / 1980년대 빛 바랜 스튜디오 레트로 감성으로 복원해줘...'
            }
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all resize-none shadow-inner"
          />
        </div>

        {/* AI Auto Generate Idea Button */}
        <button
          onClick={onExpandIdea}
          disabled={isExpandingIdea}
          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 hover:from-amber-500/30 hover:to-amber-500/30 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-amber-500/10 active:scale-[0.99] disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 text-amber-400 ${isExpandingIdea ? 'animate-spin' : 'animate-bounce'}`} />
          <span>{isExpandingIdea ? 'AI가 아이디어 디렉팅 생성 중...' : '✨ AI 아이디어 자동 생성 (프롬프트 확장)'}</span>
        </button>
      </div>

      {/* 2. Image Upload Area (Max 3 Images, Drag & Drop) */}
      <div className="space-y-2 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
            이미지 업로드 (선택, 최대 3장)
          </label>
          <span className="text-[11px] text-amber-400/90 font-medium">드래그&드롭 또는 선택</span>
        </div>

        {/* Dropzone */}
        {images.length < maxImages && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-1.5 bg-slate-950/60 ${
              isDragging
                ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                : 'border-slate-800 hover:border-amber-500/50 hover:bg-slate-900'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e.target.files)}
              accept="image/*"
              multiple
              className="hidden"
            />
            <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-200">
                사진을 끌어다 놓거나 <span className="text-amber-400 underline underline-offset-2">클릭하여 선택</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                PNG, JPG, WEBP 지원 · {images.length === 0 ? '첫 번째 사진은 원본사진이 됩니다.' : '추가 참조 사진'}
              </p>
            </div>
          </div>
        )}

        {/* Sample Photo Quick Loader */}
        {images.length < maxImages && (
          <div className="space-y-1">
            <span className="text-[10.5px] text-slate-400 block font-medium">💡 빠른 테스트용 샘플 사진 불러오기:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {getSamplePortraits().map((sample) => (
                <button
                  key={sample.title}
                  onClick={() => handleAddSample(sample)}
                  className="px-2 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-lg text-[10px] text-slate-300 hover:text-amber-300 font-semibold truncate transition-all text-center flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3 text-amber-400" />
                  <span className="truncate">{sample.title.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {dragError && (
          <div className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg p-2 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{dragError}</span>
          </div>
        )}

        {/* Uploaded Images List Grid */}
        <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="group relative bg-slate-950 border border-slate-800 rounded-xl p-2 flex items-center space-x-3 transition-all hover:border-slate-700 shadow-sm"
            >
              {/* Thumbnail */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0">
                <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[8.5px] text-center font-bold text-amber-400 py-0.5 border-t border-slate-800">
                  #{index + 1}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span
                    className={`px-1.5 py-0.5 text-[9.5px] font-bold rounded ${
                      index === 0
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    }`}
                  >
                    {img.label}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-200 truncate mt-0.5">{img.name}</p>
                <p className="text-[9.5px] text-slate-400">{formatBytes(img.size)}</p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemoveImage(img.id)}
                className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="삭제"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {images.length === 0 && (
            <div className="text-center py-4 border border-slate-800/80 rounded-xl bg-slate-950/30 text-slate-500 text-xs">
              업로드된 이미지가 없습니다. 위 샘플을 클릭하여 즉시 테스트해보세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
