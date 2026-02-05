import { Tabs } from "../types"

type TabNavigationProps = {
  activeTab: Tabs
  onSelect: (id: Tabs) => void
}

export function TabNavigation({  activeTab, onSelect }: TabNavigationProps) {
  return (
    <nav className="aero-tabs" aria-label="Tool tabs">
      {Object.values(Tabs).map((tab) => {
        const isActive = tab === activeTab
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onSelect(tab)}
            className={`aero-tab ${isActive ? 'aero-tab--active' : ''}`}
            aria-pressed={isActive}
          >
            <span className="text-sm font-semibold">{tab}</span>
          </button>
        )
      })}
    </nav>
  )
}
