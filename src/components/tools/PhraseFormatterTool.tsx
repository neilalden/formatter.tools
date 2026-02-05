import { useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '../../hooks/useToast';
import generateRandomNumber from '../../utils/generateRandomNumber';
import step1 from '../../assets/phrase_formatter_step_1.png';
import step2 from '../../assets/phrase_formatter_step_2.png';
import step3 from '../../assets/phrase_formatter_step_3.png';
import step4 from '../../assets/phrase_formatter_step_4.jpg';
import { PhraseFormatterHelpModal } from './PhraseFormatterHelpModal';

export function PhraseFormatterTool() {
  const { toast } = useToast();

  const [variables, setVariables] = useState<Record<number, string>>({});
  const [selectedVariable, setSelectedVariable] = useState<number | undefined>(undefined);
  const [phrase, setPhrase] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const renderedPhraseRef = useRef<HTMLParagraphElement | null>(null);

  const renderedPhrase = useMemo(() => {
    let initialPhrase = phrase;
    Object.entries(variables).map(([key, variable]) => {
      initialPhrase = initialPhrase.replaceAll(`{Variable ${key}}`, variable);
    });
    return initialPhrase;
  }, [phrase, variables]);

  const resizeTextarea = (element: HTMLTextAreaElement | null) => {
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  const insertVariableAt = (index: number, position: number) => {
    const token = `{Variable ${index}}`;
    const before = phrase.slice(0, position);
    const after = phrase.slice(position);
    const nextValue = `${before}${token}${after}`;
    setPhrase(nextValue);
    requestAnimationFrame(() => {
      if (!textareaRef.current) return;
      const nextPos = position + token.length;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(nextPos, nextPos);
      resizeTextarea(textareaRef.current);
      setSelectedVariable(undefined);
    });
  };

  const handleTextareaClick = (event: React.MouseEvent<HTMLTextAreaElement>) => {
    if (selectedVariable === undefined) return;
    const position = event.currentTarget.selectionStart ?? phrase.length;
    insertVariableAt(selectedVariable, position);
  };

  const slides = [
    { src: step1, description: 'Enter in a phrase in the Phrase Editor' },
    { src: step2, description: 'Click "Add Variable" then type in any value' },
    { src: step3, description: `Select a variable by clicking the variable's button` },
    { src: step4, description: 'Place the selected variable by clicking anywhere in the phrase' },
  ];

  const handleOpenHelp = () => {
    setSlideIndex(0);
    setShowHelp(true);
  };

  const handleCloseHelp = () => setShowHelp(false);

  const handleNextSlide = () => {
    setSlideIndex(prev => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setSlideIndex(prev => (prev - 1 + slides.length) % slides.length);
  };
  const handleCopy = async () => {
    try {
      setSelectedVariable(undefined);
      await navigator.clipboard.writeText(String(renderedPhrase));
      toast({ message: 'Copied to clipboard.', variant: 'success' });
    } catch {
      toast({ message: 'Copy failed. Please try again.', variant: 'error' });
    } finally {
      if (!renderedPhraseRef.current) return;
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        const range = document.createRange();
        range.selectNodeContents(renderedPhraseRef.current);
        selection.addRange(range);
      }
    }
  };

  useEffect(() => {
    resizeTextarea(textareaRef.current);
  }, [phrase]);
  return (
    <div className="aero-card grid gap-5 px-5 py-5 sm:grid-cols-2">
      <div>
        <p className="text-sm font-semibold text-slate-700">Variables</p>
        <div className="mt-2 grid gap-2">
          {Object.entries(variables).map(([key, variable]) => (
            <div className="flex items-center relative">
              <button
                className={`${
                  selectedVariable === Number(key) ? 'border-dashed border-sky-500' : ''
                } bg-white text-sky-500 font-semibold py-2 px-4 rounded-l-xl border-2 border-white  hover:bg-sky-300 hover:text-white hover:border-sky-300 text-sm text-nowrap`}
                onClick={() => setSelectedVariable(Number(key))}
              >
                Variable {Number(key)}
              </button>
              <input
                type="text"
                placeholder="John Doe"
                className="aero-input"
                style={{
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
                value={variable}
                onChange={e => setVariables(prev => ({ ...prev, [Number(key)]: e.target.value }))}
              />
              <button
                type="button"
                className="absolute top-3 right-3 rounded-full px-1 text-sm"
                onClick={() =>
                  setVariables(prev => {
                    const copy = { ...prev };
                    delete copy[Number(key)];
                    return copy;
                  })
                }
                aria-label="remove variable"
              >
                🗑️
              </button>
            </div>
          ))}
          <button
            type="button"
            className="bg-sky-300 rounded-lg text-lg text-white py-1 mt-4 hover:bg-sky-400"
            onClick={() => {
              let id = generateRandomNumber(99);
              while (id in variables) {
                id = generateRandomNumber(99);
              }
              setVariables(prev => ({ ...prev, [id]: '' }));
              setSelectedVariable(undefined);
            }}
          >
            Add Variable
          </button>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">Phrase Editor</p>
          <button
            type="button"
            className="text-xs font-semibold text-slate-600 underline decoration-sky-400 underline-offset-4 hover:text-slate-800"
            onClick={handleOpenHelp}
          >
            How to use
          </button>
        </div>

        <textarea
          ref={textareaRef}
          className="aero-input resize-none"
          placeholder="Hello {Variable 7}, welcome to {Variable 54}."
          value={phrase}
          onChange={event => {
            setPhrase(event.target.value);
            resizeTextarea(event.currentTarget);
          }}
          onClick={handleTextareaClick}
          style={{ minHeight: '8rem' }}
        />
      </div>

      <div className="sm:col-span-2">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-slate-700">Rendered Output</p>
          <button
            type="button"
            className="h-fit rounded-full px-1 text-lg"
            onClick={handleCopy}
            aria-label="Copy formatted phrase"
          >
            📋
          </button>
        </div>
        <div className="mt-2 aero-metric">
          <p className="aero-title text-lg" ref={renderedPhraseRef}>
            {renderedPhrase}
          </p>
        </div>
      </div>
      <PhraseFormatterHelpModal
        open={showHelp}
        slides={slides}
        slideIndex={slideIndex}
        onClose={handleCloseHelp}
        onNext={handleNextSlide}
        onPrev={handlePrevSlide}
      />
    </div>
  );
}
