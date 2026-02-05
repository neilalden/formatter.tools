type Slide = {
  src: string;
  description: string;
};

type PhraseFormatterHelpModalProps = {
  open: boolean;
  slides: Slide[];
  slideIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

export function PhraseFormatterHelpModal({
  open,
  slides,
  slideIndex,
  onClose,
  onNext,
  onPrev,
}: PhraseFormatterHelpModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sky-900/40 p-4 backdrop-blur">
      <div className="relative w-full max-w-3xl rounded-3xl border border-white bg-white p-4 shadow-2xl">
        <div className="flex items-center justify-between px-2 pb-2">
          <p className="text-sm font-semibold text-slate-700">Phrase Formatter Guide</p>
          <button
            type="button"
            className="rounded-full px-2 text-lg text-slate-500 hover:text-slate-800"
            onClick={onClose}
            aria-label="Close how to use"
          >
            ❌
          </button>
        </div>
        <p className="text-xl text-center font-bold my-2">{slides[slideIndex].description}</p>
        <div className="overflow-hidden rounded-2xl border border-white/60 bg-white">
          <img src={slides[slideIndex].src} alt={'How to use'} className="h-auto w-full" />
        </div>
        <div className="mt-3 flex items-center justify-between px-2">
          <button
            type="button"
            className="rounded-full border border-white/70 bg-white/80 px-4 py-1 text-sm font-semibold text-slate-600 hover:text-slate-800"
            onClick={onPrev}
          >
            Prev
          </button>
          <p className="text-xs text-slate-500">
            Step {slideIndex + 1} of {slides.length}
          </p>
          <button
            type="button"
            className="rounded-full border border-white/70 bg-white/80 px-4 py-1 text-sm font-semibold text-slate-600 hover:text-slate-800"
            onClick={onNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
