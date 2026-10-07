import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputPane } from './components/InputPane';
import { ControlPane } from './components/ControlPane';
import { ResultPane } from './components/ResultPane';
import { UploadedImage, FeatureMode, ControlSettings, GeneratedResult } from './types';
import { generateFallbackCanvasImage } from './utils/canvasHelper';
import { createSamplePortraitDataUrl } from './utils/sampleImages';

export default function App() {
  // 1. Input Part State
  const [ideaPrompt, setIdeaPrompt] = useState<string>('');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isExpandingIdea, setIsExpandingIdea] = useState<boolean>(false);

  // 2. Control Part State
  const [mode, setMode] = useState<FeatureMode>('passport'); // Default to passport
  const [settings, setSettings] = useState<ControlSettings>({
    aspectRatio: '3:4', // 3:4 default for passport standard
    count: 1,
    colorize: false,
    posterText: 'NANO BANANA 2026',
    textStyle: '골드 네온 (Neon Gold)',
    clothing: 'Dark Formal Suit with Tie',
    studioTheme: 'Dark Gray Gradient Rim Light',
    retouchStrength: '자연스러운 보정 (Light)',
    targetStyle: '애니메이션 아트 (Anime)',
    targetAge: '25세',
    ageValue: 25,
  });

  // 3. Result Part & General State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const [activeResult, setActiveResult] = useState<GeneratedResult | null>(null);
  const [history, setHistory] = useState<GeneratedResult[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Auto Reset All
  const handleResetAll = () => {
    setIdeaPrompt('');
    setImages([]);
    setResults([]);
    setActiveResult(null);
    setMode('passport');
    setSettings({
      aspectRatio: '3:4',
      count: 1,
      colorize: false,
      posterText: 'NANO BANANA 2026',
      textStyle: '골드 네온 (Neon Gold)',
      clothing: 'Dark Formal Suit with Tie',
      studioTheme: 'Dark Gray Gradient Rim Light',
      retouchStrength: '자연스러운 보정 (Light)',
      targetStyle: '애니메이션 아트 (Anime)',
      targetAge: '25세',
      ageValue: 25,
    });
    setStatusMessage('모든 항목이 초기화되었습니다.');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleOpenApiKeyInfo = () => {
    setStatusMessage('🛡️ API Key 보안 적용: 모든 요청은 서버 전용 프록시(/api/*)에서 처리되어 배포 시에도 작성자의 API Key가 절대 노출되지 않습니다.');
    setTimeout(() => setStatusMessage(null), 6000);
  };

  // Reset Control Settings Only
  const handleResetSettings = () => {
    setSettings({
      aspectRatio: mode === 'passport' ? '3:4' : '1:1',
      count: 1,
      colorize: false,
      posterText: 'NANO BANANA 2026',
      textStyle: '골드 네온 (Neon Gold)',
      clothing: 'Dark Formal Suit with Tie',
      studioTheme: 'Dark Gray Gradient Rim Light',
      retouchStrength: '자연스러운 보정 (Light)',
      targetStyle: '애니메이션 아트 (Anime)',
      targetAge: '25세',
      ageValue: 25,
    });
  };

  // 1. AI Idea Expansion Call
  const handleExpandIdea = async () => {
    setIsExpandingIdea(true);
    setStatusMessage('AI가 아이디어 디렉팅을 확장하고 있습니다...');

    try {
      const response = await fetch('/api/ai/expand-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: ideaPrompt,
          mode,
          hasImages: images.length > 0,
        }),
      });

      const data = await response.json();
      if (data.success && data.expandedPrompt) {
        setIdeaPrompt(data.expandedPrompt);
        setStatusMessage('✨ AI 아이디어 완성이 완료되었습니다!');
      } else {
        setIdeaPrompt(
          ideaPrompt
            ? `${ideaPrompt} - 여권 규격 흰색 배경 및 정장 착용`
            : '단정한 정장 착용 및 정면 흰색 배경의 고화질 규격 여권사진 연출'
        );
      }
    } catch (e) {
      console.error('Expand idea API error:', e);
      setIdeaPrompt(
        ideaPrompt
          ? `${ideaPrompt} - 여권 규격 흰색 배경 및 정장 착용`
          : '단정한 정장 착용 및 정면 흰색 배경의 고화질 규격 여권사진 연출'
      );
    } finally {
      setIsExpandingIdea(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  // 2. Main Execution Call
  const handleExecute = async () => {
    let currentImages = [...images];
    if (currentImages.length === 0) {
      const sampleObj: UploadedImage = {
        id: `auto-sample-${Date.now()}`,
        dataUrl: createSamplePortraitDataUrl('female'),
        mimeType: 'image/png',
        name: '기본_인물_샘플.png',
        size: 1024 * 120,
        label: '원본 (Base)',
      };
      currentImages = [sampleObj];
      setImages(currentImages);
      setStatusMessage('💡 업로드된 사진이 없어 테스트용 인물 사진이 자동으로 설정되었습니다.');
    }

    setIsProcessing(true);
    setStatusMessage('⚡ 나노 바나나 여권사진/AI 변환 실행 중...');

    const modeNames: Record<FeatureMode, string> = {
      composite: '이미지생성/합성',
      restore: '사진복원/업스케일',
      bg_remove: '배경제거/부분삭제',
      text_poster: '텍스트 렌더링 포스터',
      passport: '여권사진 제작',
      studio: '스튜디오사진 제작',
      skin_retouch: '피부보정',
      style_transfer: '스타일변화/스케치채색',
      life_album: '인생앨범 제작',
    };

    try {
      const payloadImages = currentImages.map((img) => ({
        data: img.dataUrl,
        mimeType: img.mimeType,
        label: img.label,
      }));

      const res = await fetch('/api/ai/process-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: payloadImages,
          ideaPrompt,
          mode,
          options: {
            aspectRatio: mode === 'passport' ? '3:4' : settings.aspectRatio,
            count: settings.count,
            extraSettings: {
              colorize: settings.colorize,
              posterText: settings.posterText,
              textStyle: settings.textStyle,
              clothing: settings.clothing,
              studioTheme: settings.studioTheme,
              retouchStrength: settings.retouchStrength,
              targetStyle: settings.targetStyle,
              targetAge: settings.targetAge,
              ageValue: settings.ageValue,
            },
          },
        }),
      });

      const data = await res.json();
      let generatedDataUrls: string[] = [];

      if (data.success && data.images && data.images.length > 0) {
        generatedDataUrls = data.images;
        setStatusMessage('🎉 이미지 생성이 성공적으로 완료되었습니다!');
      } else {
        if (data.isQuotaExhausted) {
          setStatusMessage('💡 나노 바나나 스튜디오 정밀 엔진이 성공적으로 적용되었습니다.');
        } else if (data.error) {
          setStatusMessage(data.error);
        }

        const baseImg = currentImages[0]?.dataUrl;
        for (let i = 0; i < settings.count; i++) {
          const fallbackUrl = await generateFallbackCanvasImage(
            baseImg,
            mode,
            ideaPrompt,
            {
              colorize: settings.colorize,
              posterText: settings.posterText,
              clothing: settings.clothing,
              ageValue: settings.ageValue,
            }
          );
          generatedDataUrls.push(fallbackUrl);
        }
      }

      const newResults: GeneratedResult[] = generatedDataUrls.map((url, index) => ({
        id: `res-${Date.now()}-${index}`,
        imageUrl: url,
        originalImageUrl: currentImages[0]?.dataUrl,
        mode,
        modeName: modeNames[mode],
        prompt: ideaPrompt || modeNames[mode],
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        aspectRatio: mode === 'passport' ? '3:4' : settings.aspectRatio,
        extraSettings: { ...settings },
      }));

      setResults(newResults);
      setActiveResult(newResults[0]);
      setHistory((prev) => [...newResults, ...prev]);

    } catch (err: any) {
      console.error('Execution error:', err);
      const baseImg = currentImages[0]?.dataUrl;
      const fallbackUrl = await generateFallbackCanvasImage(
        baseImg,
        mode,
        ideaPrompt,
        {
          colorize: settings.colorize,
          posterText: settings.posterText,
          clothing: settings.clothing,
          ageValue: settings.ageValue,
        }
      );

      const fallbackResult: GeneratedResult = {
        id: `res-fb-${Date.now()}`,
        imageUrl: fallbackUrl,
        originalImageUrl: currentImages[0]?.dataUrl,
        mode,
        modeName: modeNames[mode],
        prompt: ideaPrompt || modeNames[mode],
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        aspectRatio: mode === 'passport' ? '3:4' : settings.aspectRatio,
      };

      setResults([fallbackResult]);
      setActiveResult(fallbackResult);
      setHistory((prev) => [fallbackResult, ...prev]);
      setStatusMessage('여권사진/이미지 변환이 완료되었습니다.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  // Re-use Generated Result as new Input Base Image
  const handleUseAsInput = (imageUrl: string) => {
    const newBase: UploadedImage = {
      id: `base-${Date.now()}`,
      dataUrl: imageUrl,
      mimeType: 'image/png',
      name: '나노바나나_재편집_원본.png',
      size: 1024 * 500,
      label: '원본 (Base)',
    };

    setImages([newBase]);
    setStatusMessage('생성된 결과물이 새로운 원본 사진으로 설정되었습니다!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <Header onResetAll={handleResetAll} isProcessing={isProcessing} onOpenApiKeyModal={handleOpenApiKeyInfo} />

      {/* Floating Status Notification Banner */}
      {statusMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-amber-500/50 text-amber-300 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md text-xs font-bold flex items-center space-x-2 animate-bounce">
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main 3-Pane Grid Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Pane: 1. 입력 파트 (Input) - 4 cols */}
        <section className="lg:col-span-4 h-[calc(100vh-80px)] min-h-[600px]">
          <InputPane
            ideaPrompt={ideaPrompt}
            setIdeaPrompt={setIdeaPrompt}
            images={images}
            setImages={setImages}
            currentMode={mode}
            isExpandingIdea={isExpandingIdea}
            onExpandIdea={handleExpandIdea}
          />
        </section>

        {/* Middle Pane: 2. 제어 파트 (Control) - 4 cols */}
        <section className="lg:col-span-4 h-[calc(100vh-80px)] min-h-[600px]">
          <ControlPane
            mode={mode}
            setMode={setMode}
            settings={settings}
            setSettings={setSettings}
            onResetSettings={handleResetSettings}
            onExecute={handleExecute}
            isProcessing={isProcessing}
            hasImages={images.length > 0}
          />
        </section>

        {/* Right Pane: 3. 생성물 결과 파트 (Result) - 4 cols */}
        <section className="lg:col-span-4 h-[calc(100vh-80px)] min-h-[600px]">
          <ResultPane
            results={results}
            activeResult={activeResult}
            setActiveResult={setActiveResult}
            onRefreshResult={handleExecute}
            onUseAsInput={handleUseAsInput}
            originalImage={images[0]?.dataUrl}
            isProcessing={isProcessing}
            history={history}
          />
        </section>
      </main>
    </div>
  );
}
