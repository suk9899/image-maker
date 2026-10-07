import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Shared Gemini AI Instance
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Idea Auto-Expansion Endpoint
app.post('/api/ai/expand-idea', async (req, res) => {
  try {
    const { prompt, mode, hasImages } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        success: true,
        expandedPrompt: prompt
          ? `[여권사진/편집 디렉팅] ${prompt} - 정면 포즈, 단정한 정장, 단색 흰색 배경, 여권 규격 비율 및 균일한 스튜디오 조명`
          : '정면 포즈 및 단정한 정장 스타일링의 고화질 규격 여권사진 연출',
        suggestions: ['흰색 단색 배경', '정면 정장 착용', '수평 스튜디오 조명', '여권 규격 비율']
      });
    }

    const modeLabels: Record<string, string> = {
      composite: '이미지 합성 및 개체 자연스러운 결합',
      restore: '오래된 사진 복원 및 업스케일, 컬러화',
      bg_remove: '배경 제거 및 정밀 피사체 분리',
      text_poster: '스타일리시 텍스트 렌더링 포스터 제작',
      passport: '여권사진 규격 및 정장 스타일 변환',
      studio: '프리미엄 프로필 스튜디오 화보 조명',
      skin_retouch: '피부 매끄러운 보정 및 케어',
      style_transfer: '스타일 변환 및 스케치 채색',
      life_album: '인생앨범 연령대 나이 변화 (Age Transformation)',
    };

    const systemPrompt = `당신은 AI 사진 작가이자 이미지 디렉터입니다.
사용자가 선택한 모드(${modeLabels[mode] || mode || '여권사진 제작'})와 입력한 아이디어("${prompt || '기본 아이디어'}")를 바탕으로,
원본 인물의 얼굴 형태와 이목구비 일관성을 유지하며 규격 여권사진 또는 편집을 수행하도록 표준 프롬프트를 작성해 주세요.

응답은 반드시 JSON 형식으로 작성해 주세요:
{
  "expandedPrompt": "최종 구체적 프롬프트 (한국어 및 영문 디렉팅 키워드)",
  "suggestions": ["추천 키워드 1", "추천 키워드 2", "추천 키워드 3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt || `규격 여권사진 변환 디렉팅`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const resultText = response.text || '';
    let parsedJson: any = {};
    try {
      parsedJson = JSON.parse(resultText);
    } catch (e) {
      parsedJson = {
        expandedPrompt: resultText || prompt,
        suggestions: ['규격 여권사진', '흰색 단색 배경', '단정한 정장']
      };
    }

    res.json({
      success: true,
      expandedPrompt: parsedJson.expandedPrompt || prompt,
      suggestions: parsedJson.suggestions || []
    });

  } catch (err: any) {
    console.error('Expand Idea Error:', err);
    res.status(500).json({
      success: false,
      error: err.message || '아이디어 생성 중 오류가 발생했습니다.',
      expandedPrompt: req.body.prompt || '고화질 규격 여권사진 변환',
      suggestions: []
    });
  }
});

// 2. Main Image Processing Endpoint (Nano Banana / Gemini Flash Image)
app.post('/api/ai/process-image', async (req, res) => {
  try {
    const { images = [], ideaPrompt = '', mode = 'composite', options = {} } = req.body;
    const { aspectRatio = '1:1', count = 1, extraSettings = {} } = options;

    const ai = getGenAI();
    if (!ai) {
      return res.status(400).json({
        success: false,
        error: 'GEMINI_API_KEY가 설정되지 않았습니다. Secrets 설정에서 API Key를 등록해 주세요.',
      });
    }

    let systemInstruction = `You are Nano Banana Studio, an AI image editing tool that creates professional standard portraits, passport photos, and creative style transformations. Always maintain respectful, neutral, photorealistic, and natural portrait quality.`;

    let userPromptText = '';
    const hasInputImages = images.length > 0;

    switch (mode) {
      case 'passport':
        const clothingStyle = extraSettings?.clothing || 'Dark Formal Suit with White Shirt and Tie';
        if (hasInputImages) {
          userPromptText = `Convert the person in this photo into an official standard passport portrait.
1. Preserve the facial identity, features, and hair texture of the subject.
2. Set a clean, solid, pure white background.
3. Dress the subject in a neat ${clothingStyle}.
4. Position in a straight frontal headshot posture with clear lighting.
${ideaPrompt ? `Note: ${ideaPrompt}` : ''}`;
        } else {
          userPromptText = `A professional official passport photo of a person wearing a ${clothingStyle}. Straight frontal posture, facing forward, solid pure white background, soft studio lighting. ${ideaPrompt}`;
        }
        break;

      case 'composite':
        userPromptText = `Merge elements from the reference photo into the main photo naturally. Keep the person's face identity, skin tone, and lighting consistent. ${ideaPrompt}`;
        break;

      case 'restore':
        const colorizeText = extraSettings?.colorize ? 'Apply natural historical colorization to the black and white photo.' : '';
        userPromptText = `Restore this old photo. Remove dust, scratches, and noise. Sharpen eyes and details while preserving the authentic facial character. ${colorizeText} ${ideaPrompt}`;
        break;

      case 'bg_remove':
        userPromptText = `Isolate the primary subject cleanly and set a solid background. ${ideaPrompt}`;
        break;

      case 'text_poster':
        const posterText = extraSettings?.posterText || 'NANO BANANA';
        const textStyle = extraSettings?.textStyle || 'Modern Bold Neon Gold';
        userPromptText = `Add stylish typography with text "${posterText}" in style "${textStyle}" while maintaining subject visibility. ${ideaPrompt}`;
        break;

      case 'studio':
        const studioTheme = extraSettings?.studioTheme || 'Dark Gray Gradient Rim Light Portrait';
        userPromptText = `Convert into a high-end photography studio headshot. Theme: ${studioTheme}. Soft bokeh background, professional lighting, natural depth. ${ideaPrompt}`;
        break;

      case 'skin_retouch':
        userPromptText = `Smooth and polish the skin complexion naturally while retaining natural skin pore textures and facial details. ${ideaPrompt}`;
        break;

      case 'style_transfer':
        const targetStyle = extraSettings?.targetStyle || 'Anime Fine Line Art';
        userPromptText = `Render the photo in style "${targetStyle}". Retain the subject's key facial features. ${ideaPrompt}`;
        break;

      case 'life_album':
        const targetAge = extraSettings?.targetAge || '25세';
        userPromptText = `Age transformation to target age: "${targetAge}". Modify facial age characteristics appropriately while preserving recognizable facial structure and eyes. ${ideaPrompt}`;
        break;

      default:
        userPromptText = `Process and edit the image according to: ${ideaPrompt}`;
        break;

    }

    const parts: any[] = [];

    images.forEach((imgObj: { data: string; mimeType: string; label?: string }) => {
      if (imgObj && imgObj.data) {
        let cleanBase64 = imgObj.data;
        let mime = imgObj.mimeType || 'image/png';

        if (cleanBase64.includes('base64,')) {
          const split = cleanBase64.split('base64,');
          cleanBase64 = split[1];
          if (split[0].includes(':') && split[0].includes(';')) {
            mime = split[0].split(':')[1].split(';')[0];
          }
        }

        parts.push({
          inlineData: {
            data: cleanBase64,
            mimeType: mime,
          },
        });
      }
    });

    parts.push({
      text: userPromptText,
    });

    // Try gemini-3.1-flash-image first, fallback to gemini-3.1-flash-lite-image if quota error
    const candidateModels = ['gemini-3.1-flash-image', 'gemini-3.1-flash-lite-image'];
    const generatedResults: string[] = [];
    const runs = Math.min(Math.max(1, Number(count) || 1), 4);
    let quotaErrorOccurred = false;

    for (let i = 0; i < runs; i++) {
      let runSuccess = false;

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: {
              parts: parts,
            },
            config: {
              systemInstruction: systemInstruction,
              imageConfig: {
                aspectRatio: (mode === 'passport' && aspectRatio === '1:1') ? '3:4' : (aspectRatio as any),
              },
            },
          });

          const candidates = response.candidates || [];
          if (candidates[0]?.content?.parts) {
            for (const part of candidates[0].content.parts) {
              if (part.inlineData && part.inlineData.data) {
                const mimeType = part.inlineData.mimeType || 'image/png';
                generatedResults.push(`data:${mimeType};base64,${part.inlineData.data}`);
                runSuccess = true;
                break;
              }
            }
          }

          if (runSuccess) break;
        } catch (genError: any) {
          const errMsg = genError?.message || String(genError);
          if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota')) {
            quotaErrorOccurred = true;
          }
          console.error(`Gemini Generation ${modelName} Run ${i} Error:`, errMsg);
        }
      }
    }

    if (generatedResults.length === 0) {
      if (quotaErrorOccurred) {
        return res.status(429).json({
          success: false,
          isQuotaExhausted: true,
          error: 'Gemini 무료 티어 사용량이 모두 소모되었습니다. AI Studio 유료 결제 계정이 설정된 API Key를 연결하거나 캔버스 그래픽 모드로 자동 전환됩니다.',
        });
      }

      return res.status(422).json({
        success: false,
        error: '이미지 생성 결과가 반환되지 않았습니다. 원본 인물 사진을 확인해 주세요.',
      });
    }

    return res.json({
      success: true,
      images: generatedResults,
      count: generatedResults.length,
      mode: mode,
    });

  } catch (err: any) {
    console.error('Process Image Error:', err);
    res.status(500).json({
      success: false,
      error: err.message || '이미지 처리 중 오류가 발생했습니다.',
    });
  }
});

// Vite Development Integration or Static Serving
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`나노 바나나 AI 스튜디오 Server running on port ${PORT}`);
});
