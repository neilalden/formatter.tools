import { TabNavigation } from './components/TabNavigation'
import { PhoneFormatterTool } from './components/tools/PhoneFormatterTool'
import { IncomeFormatterTool } from './components/tools/IncomeFormatterTool'
import { PhraseFormatterTool } from './components/tools/PhraseFormatterTool'
import { useState } from 'react'
import { Tabs } from './types'

const isTabValue = (value: string | null): value is Tabs =>
  !!value && Object.values(Tabs).includes(value as Tabs)

export function MainScreen() {
  const [activeTab, setActiveTab] = useState<Tabs>(() => {
    const params = new URLSearchParams(window.location.search)
    const initial = params.get('tab')
    return isTabValue(initial) ? initial : Tabs['Phone Formatter']
  })

  const updateParams = (nextTab: Tabs) => {
    const params = new URLSearchParams(window.location.search)
    params.set('tab', nextTab)
    const next = params.toString()
    const url = next ? `${window.location.pathname}?${next}` : window.location.pathname
    window.history.replaceState({}, '', url)
  }

  const handleTabChange = (nextTab: Tabs) => {
    setActiveTab(nextTab)
    updateParams(nextTab)
  }

  const render = ()=>{
    switch (activeTab) {
      case Tabs['Phone Formatter']: return <PhoneFormatterTool />
      case Tabs['Income Formatter']: return <IncomeFormatterTool />
      case Tabs['Phrase Formatter']: return <PhraseFormatterTool />
      default: return null
    }
  }
  return (
    <div className="aero-shell">
      <div className="aero-orb aero-orb--one" aria-hidden="true" />
      <div className="aero-orb aero-orb--two" aria-hidden="true" />
      <div className="aero-orb aero-orb--three" aria-hidden="true" />
      <main className="relative z-10 mx-auto w-full max-w-[768px] px-5 pb-16 pt-10">
        <header className="aero-card px-6 py-5">
          <p className="aero-kicker">Formatter Tools</p>
          <div className="mt-5">
            <TabNavigation activeTab={activeTab} onSelect={handleTabChange} />
          </div>
        </header>

        <section className="mt-6">
        {render()}
        </section>
      </main>
    </div>
  )
}
