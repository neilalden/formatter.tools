export function PhraseFormatterTool() {
  return (
    <div className="aero-card grid gap-5 px-5 py-5 sm:grid-cols-2">
      <div>
        <p className="text-sm font-semibold text-slate-700">Variables</p>
        <div className="mt-2 grid gap-2">
          {['var1: {name}', 'var2: {role}', 'var3: {company}'].map((label) => (
            <button key={label} type="button" className="aero-ghost">
              {label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700">Phrase Editor</p>
        <textarea
          className="aero-input h-32 resize-none"
          placeholder="Hello {name}, welcome to {company}."
        />
      </div>
      <div className="sm:col-span-2">
        <p className="text-sm font-semibold text-slate-700">Rendered Output</p>
        <div className="mt-2 aero-metric">
          <p className="text-xs uppercase text-slate-500">Preview</p>
          <p className="aero-title text-lg">Hello Alex, welcome to Bluewave.</p>
          <span className="text-xs text-slate-600">Sample output</span>
        </div>
      </div>
    </div>
  )
}
