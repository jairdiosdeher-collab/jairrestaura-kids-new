import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Download, Eraser, Palette, Save, Sparkles, Trash2, Undo2 } from 'lucide-react';
import { AppProgress, CharacterId, SavedArtwork } from '../types/app';
import { ASSET_IMAGES } from '../data/modulesData';
import { CHARACTER_LIST, CHARACTERS } from '../data/characters';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { audioEngine } from '../services/audioEngine';

interface CreativityModuleProps {
  progress: AppProgress;
  onSaveArtwork: (artwork: Omit<SavedArtwork, 'id' | 'createdAt'>) => void;
}

const TEMPLATES = [
  { id: 'ark', title: 'El Arca de Noé' },
  { id: 'star', title: 'La Estrella de Belén' },
  { id: 'lamb', title: 'Cordero en el Prado' },
  { id: 'castle', title: 'Castillo del Reino' },
];

const PALETTE_COLORS = [
  '#d97706',
  '#0284c7',
  '#059669',
  '#dc2626',
  '#7c3aed',
  '#facc15',
  '#fb7185',
  '#1e293b',
  '#ffffff',
];

export const CreativityModule: React.FC<CreativityModuleProps> = ({
  progress,
  onSaveArtwork,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const undoStackRef = useRef<ImageData[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [templateId, setTemplateId] = useState('ark');
  const [brushColor, setBrushColor] = useState('#d97706');
  const [brushSize, setBrushSize] = useState(10);
  const [isDrawing, setIsDrawing] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);

  // Card Creator state
  const [cardChar, setCardChar] = useState<CharacterId>('estrellita');
  const [cardMessage, setCardMessage] = useState('¡Jesús te ama mucho y camina contigo!');
  const [cardRecipient, setCardRecipient] = useState('Para mi familia');

  const drawTemplateOutline = (ctx: CanvasRenderingContext2D, tpl: string) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 560, 340);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tpl === 'ark') {
      // Water wave
      ctx.beginPath();
      ctx.moveTo(20, 260);
      ctx.quadraticCurveTo(140, 240, 280, 260);
      ctx.quadraticCurveTo(420, 280, 540, 260);
      ctx.stroke();
      // Boat hull
      ctx.beginPath();
      ctx.moveTo(120, 200);
      ctx.lineTo(440, 200);
      ctx.lineTo(400, 255);
      ctx.lineTo(160, 255);
      ctx.closePath();
      ctx.stroke();
      // Cabin & roof
      ctx.strokeRect(190, 140, 180, 60);
      ctx.beginPath();
      ctx.moveTo(175, 140);
      ctx.lineTo(280, 95);
      ctx.lineTo(385, 140);
      ctx.closePath();
      ctx.stroke();
      // Rainbow arc
      ctx.beginPath();
      ctx.arc(280, 200, 190, Math.PI, 0);
      ctx.stroke();
    } else if (tpl === 'star') {
      ctx.beginPath();
      const cx = 280;
      const cy = 165;
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? 105 : 44;
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    } else if (tpl === 'lamb') {
      // Hills
      ctx.beginPath();
      ctx.moveTo(20, 270);
      ctx.quadraticCurveTo(280, 210, 540, 270);
      ctx.stroke();
      // Fluffy body
      ctx.beginPath();
      ctx.arc(280, 185, 58, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(215, 175, 34, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Castle
      ctx.strokeRect(180, 140, 200, 140);
      ctx.strokeRect(130, 110, 50, 170);
      ctx.strokeRect(380, 110, 50, 170);
      ctx.beginPath();
      ctx.moveTo(125, 110);
      ctx.lineTo(155, 65);
      ctx.lineTo(185, 110);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(375, 110);
      ctx.lineTo(405, 65);
      ctx.lineTo(435, 110);
      ctx.closePath();
      ctx.stroke();
      ctx.strokeRect(255, 200, 50, 80);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    undoStackRef.current = [];
    setCanUndo(false);
    drawTemplateOutline(ctx, templateId);
  }, [templateId]);

  const getCoords = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((ev.clientX - rect.left) / rect.width) * canvas.width,
      y: ((ev.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handlePointerDown = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStackRef.current = [...undoStackRef.current.slice(-14), snapshot];
    setCanUndo(true);
    setIsDrawing(true);
    const { x, y } = getCoords(ev);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || undoStackRef.current.length === 0) return;
    const previous = undoStackRef.current.pop()!;
    ctx.putImageData(previous, 0, 0);
    setCanUndo(undoStackRef.current.length > 0);
  };

  const handlePointerMove = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoords(ev);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => setIsDrawing(false);

  const handleSaveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const title = TEMPLATES.find((t) => t.id === templateId)?.title || 'Mi Obra del Reino';
    onSaveArtwork({
      title,
      templateId,
      dataUrl: canvas.toDataURL('image/png'),
    });
    audioEngine.playSuccess(progress.settings.soundEnabled);
    setSavedBanner(true);
    window.setTimeout(() => setSavedBanner(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-7">
            <p className="text-xs font-semibold text-rose-700 dark:text-rose-400">
              Módulo 05 · Fábrica de Creatividad
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-stone-900 sm:text-3xl dark:text-stone-50">
              Taller de Arte Bíblico y Tarjetas con Valores
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              Colorea escenas bíblicas con tu dedo o ratón, guarda tus obras localmente y crea tarjetas
              de ánimo para tu familia. Sin cámara ni subida de archivos externos.
            </p>
          </div>
          <div className="relative min-h-[190px] lg:col-span-5">
            <img
              src={ASSET_IMAGES.creativityWorkshop}
              alt="Taller de creatividad infantil"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Coloring Canvas Studio */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setTemplateId(tpl.id)}
                  className={`min-h-[40px] rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    templateId === tpl.id
                      ? 'bg-rose-600 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-slate-800 dark:text-stone-200'
                  }`}
                >
                  {tpl.title}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!canUndo}
                onClick={handleUndo}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-40 dark:border-slate-700 dark:text-stone-200"
              >
                <Undo2 className="h-3.5 w-3.5" />
                Deshacer
              </button>
              <button
                type="button"
                onClick={() => {
                  const ctx = canvasRef.current?.getContext('2d');
                  if (ctx) {
                    undoStackRef.current = [];
                    setCanUndo(false);
                    drawTemplateOutline(ctx, templateId);
                  }
                }}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 dark:border-slate-700 dark:text-stone-200"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Limpiar lienzo
              </button>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={560}
            height={340}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-full touch-none rounded-2xl border-2 border-stone-200 bg-white cursor-crosshair dark:border-slate-700"
          />

          {/* Palette & Brush Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {PALETTE_COLORS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setBrushColor(hex)}
                  style={{ backgroundColor: hex }}
                  className={`h-9 w-9 rounded-full border-2 transition ${
                    brushColor === hex
                      ? 'border-stone-900 scale-110 dark:border-white'
                      : 'border-stone-300 dark:border-slate-600'
                  }`}
                  aria-label={`Color ${hex}`}
                />
              ))}
              <button
                type="button"
                onClick={() => setBrushColor('#ffffff')}
                className="inline-flex min-h-[36px] items-center gap-1 rounded-xl border border-stone-300 px-2.5 text-xs font-semibold dark:border-slate-700"
              >
                <Eraser className="h-3.5 w-3.5" />
                Borrador
              </button>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                Pincel: {brushSize}px
                <input
                  type="range"
                  min={4}
                  max={24}
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="ml-2 align-middle accent-rose-600"
                />
              </label>

              <button
                type="button"
                onClick={handleSaveCanvas}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
              >
                <Save className="h-4 w-4" />
                Guardar obra (+5 ★)
              </button>
            </div>
          </div>

          {savedBanner && (
            <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              ¡Obra guardada en tu galería local!
            </p>
          )}
        </div>

        {/* Card Creator */}
        <div className="space-y-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-rose-600" />
            <h3 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
              Tarjeta de Valores
            </h3>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {CHARACTER_LIST.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCardChar(c.id)}
                className={`min-h-[36px] rounded-xl px-2.5 py-1 text-xs font-bold ${
                  cardChar === c.id
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-100 text-stone-700 dark:bg-slate-800 dark:text-stone-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={cardRecipient}
            onChange={(e) => setCardRecipient(e.target.value)}
            maxLength={40}
            placeholder="Destinatario"
            className="w-full min-h-[42px] rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
          />

          <textarea
            value={cardMessage}
            onChange={(e) => setCardMessage(e.target.value)}
            maxLength={120}
            rows={3}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
          />

          {/* Live Card Preview */}
          <div className="rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 to-sky-50 p-4 text-center dark:border-amber-800 dark:from-slate-800 dark:to-slate-900">
            <p className="text-xs font-bold text-amber-800 dark:text-amber-300">{cardRecipient}</p>
            <div className="my-3 flex justify-center">
              <CharacterAvatar character={cardChar} size="md" />
            </div>
            <p className="font-display text-sm font-bold text-stone-900 dark:text-stone-100">
              “{cardMessage}”
            </p>
            <p className="mt-2 text-[11px] text-stone-500 dark:text-stone-400">
              {CHARACTERS[cardChar].favoriteVerse}
            </p>
          </div>
        </div>
      </div>

      {/* Saved Artworks Gallery */}
      {progress.artworks.length > 0 && (
        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Mi Galería del Reino ({progress.artworks.length})
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {progress.artworks.map((art) => (
              <div
                key={art.id}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 dark:border-slate-800 dark:bg-slate-950"
              >
                <img src={art.dataUrl} alt={art.title} className="h-36 w-full object-cover bg-white" />
                <div className="flex items-center justify-between p-3 text-xs">
                  <div>
                    <p className="font-bold text-stone-900 dark:text-stone-100">{art.title}</p>
                    <p className="text-stone-500">{art.createdAt}</p>
                  </div>
                  <a
                    href={art.dataUrl}
                    download={`${art.title.toLowerCase().replace(/\s+/g, '-')}.png`}
                    className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200"
                    aria-label="Descargar dibujo"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
