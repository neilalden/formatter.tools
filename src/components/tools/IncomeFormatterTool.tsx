import { useMemo, useRef, useState, type RefObject } from 'react'
import { useToast } from '../../hooks/useToast'
import formatNumberToCurrency from '../../utils/formatNumberToCurrency'
const WEEKS_PER_YEAR = 52 // 52.1786 to be exact
export function IncomeFormatterTool() {
  const { toast } = useToast()

  const [income, setIncome] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const hourlyRate = Number(params.get('hourlyRate'))
    const hoursPerWeek = Number(params.get('hoursPerWeek'))
    return {
      hourlyRate: Number.isFinite(hourlyRate) ? hourlyRate : 0,
      hoursPerWeek: Number.isFinite(hoursPerWeek) ? hoursPerWeek : 0,
    }
  })

  const updateParams = (key: 'hourlyRate' | 'hoursPerWeek', rawValue: string) => {
    const params = new URLSearchParams(window.location.search)
    if (rawValue) {
      params.set(key, rawValue)
    } else {
      params.delete(key)
    }
    const next = params.toString()
    const url = next ? `${window.location.pathname}?${next}` : window.location.pathname
    window.history.replaceState({}, '', url)
  }

  const handleHourlyRateChange = (rawValue: string) => {
    const nextValue = rawValue === '' ? 0 : Number(rawValue)
    setIncome((prev) => ({ ...prev, hourlyRate: nextValue }))
    updateParams('hourlyRate', rawValue)
  }

  const handleHoursPerWeekChange = (rawValue: string) => {
    const nextValue = rawValue === '' ? 0 : Number(rawValue)
    setIncome((prev) => ({ ...prev, hoursPerWeek: nextValue }))
    updateParams('hoursPerWeek', rawValue)
  }

  const annualIncome = useMemo(
    () => Number((income.hourlyRate * income.hoursPerWeek * WEEKS_PER_YEAR).toFixed(2)),
    [income],
  )
  const monthlyIncome = useMemo(
    () => Number((annualIncome / 12).toFixed(2)),
    [annualIncome],
  )

  const monthlyIncomeRef = useRef<HTMLParagraphElement | null>(null)
  const annualIncomeRef = useRef<HTMLParagraphElement | null>(null)

  const handleCopy = async (value: number, ref: RefObject<HTMLParagraphElement | null>) => {
    try {
      await navigator.clipboard.writeText(String(value))
      toast({ message: 'Copied to clipboard.', variant: 'success' })
    } catch {
      toast({ message: 'Copy failed. Please try again.', variant: 'error' })
    } finally {
      if (!ref.current) return
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        const range = document.createRange()
        range.selectNodeContents(ref.current)
        selection.addRange(range)
      }
    }
  }
  return (
    <div className="aero-card grid gap-5 px-5 py-5 sm:grid-cols-2">
      <div>
        <p className="text-sm font-semibold text-slate-700">Hourly Rate (USD)</p>
        <input
          className="aero-input"
          type="number"
          value={income.hourlyRate > 0 ? income.hourlyRate : undefined}
          placeholder="22.50"
          onChange={(event) => handleHourlyRateChange(event.target.value)}
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700">Base hours per Week</p>
        <input
          className="aero-input"
          type="number"
          value={income.hoursPerWeek > 0 ? income.hoursPerWeek : undefined}
          placeholder="40"
          onChange={(event) => handleHoursPerWeekChange(event.target.value)}
        />
      </div>
      <div className=" bg-white rounded-2xl px-4 py-3">
        <p className="text-xs uppercase text-slate-500">Monthly income</p>
        <div className="aero-title flex justify-between items-center">
          <p ref={monthlyIncomeRef} >
            {formatNumberToCurrency(monthlyIncome)}
          </p>
          <button
            type="button"
            className="h-fit rounded-full px-1 text-lg"
            onClick={() => handleCopy(monthlyIncome, monthlyIncomeRef)}
            aria-label="Copy formatted number"
          >
            📋
          </button>
        </div>
      </div>
      <div className=" bg-white rounded-2xl px-4 py-3">
        <p className="text-xs uppercase text-slate-500">Annual income</p>
        <div className="aero-title flex justify-between items-center">
          <p ref={annualIncomeRef} >
            {formatNumberToCurrency(annualIncome)}
          </p>
          <button
            type="button"
            className="h-fit rounded-full px-1 text-lg"
            onClick={() => handleCopy(annualIncome, annualIncomeRef)}
            aria-label="Copy formatted number"
          >
            📋
          </button>
        </div>
      </div>
    </div>
  )
}
