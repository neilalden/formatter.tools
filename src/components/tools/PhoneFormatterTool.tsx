import { useRef, useState } from 'react'
import { useToast } from '../../hooks/useToast'
import formatPhone from '../../utils/formatPhone'

export function PhoneFormatterTool() {
  const { toast } = useToast()
  const [value, setValue] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('phone') ?? ''
  })
  const [formatted, setFormatted] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const initial = params.get('phone') ?? ''
    return formatPhone(initial) ?? '(999) 888-7777'
  })
  const formattedRef = useRef<HTMLParagraphElement | null>(null)

  const updateParams = (newValue: string) => {
    const params = new URLSearchParams(window.location.search)
    if (newValue) {
      params.set('phone', newValue)
    } else {
      params.delete('phone')
    }
    const next = params.toString()
    const url = next ? `${window.location.pathname}?${next}` : window.location.pathname
    window.history.replaceState({}, '', url)
  }

  const handleValueChange = (newValue: string) => {
    setValue(newValue)
    updateParams(newValue)
    const formattedValue = formatPhone(value)
    if(formattedValue) setFormatted(formattedValue)
  }

  // const handleFormat = () => {
  //   const next = formatPhone(value)
  //   if (!next) return toast({ message: 'Enter at least 10 digits to format.', variant: 'error' })
  //   setFormatted(next)
  // }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatted)
      toast({ message: 'Copied to clipboard.', variant: 'success' })
    } catch {
      toast({ message: 'Copy failed. Please try again.', variant: 'error' })
    } finally {
      if (!formattedRef.current) return
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        const range = document.createRange()
        range.selectNodeContents(formattedRef.current)
        selection.addRange(range)
      }
    }
  }

  return (
    <div className="aero-card grid gap-5 px-5 py-5 sm:grid-cols-2">
      <div>
        <p className="text-sm font-semibold text-slate-700">Raw Phone Input</p>
        <div className="relative">
          <input
            className="aero-input px-4 py-3"
            type="text"
            placeholder="+199  98887777abc"
            value={value}
            onChange={(event) => handleValueChange(event.target.value)}
          />
          {/* <button
            type="button"
            className="absolute top-3 right-3 rounded-full px-1 text-lg"
            onClick={handleFormat}
            aria-label="Format phone number"
          >
            🚀
          </button> */}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700">Output</p>
        <div className="aero-title bg-white rounded-2xl flex justify-between items-center">
          <p ref={formattedRef} className="px-4 py-3">
            {formatted}
          </p>
          <button
            type="button"
            className="mr-2 h-fit rounded-full px-1 text-lg"
            onClick={handleCopy}
            aria-label="Copy formatted number"
          >
            📋
          </button>
        </div>
      </div>
      <div className="sm:col-span-2">
        <p className="text-sm text-slate-700">
          Converts text to the North American Numbering Plan (NANP) format.
        </p>
      </div>
    </div>
  )
}
