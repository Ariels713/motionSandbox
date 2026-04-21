'use client'

import type { SandboxTabsProps, SandboxId } from '@/lib/types'
import styles from './SandboxTabs.module.css'

const TABS: { id: SandboxId; label: string }[] = [
  { id: 'react', label: 'React' },
  { id: 'motion', label: 'Motion' },
]

export function SandboxTabs({ activeTab, onChange }: SandboxTabsProps) {
  return (
    <div role="tablist" aria-label="Sandbox type" className={styles.tabs}>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          id={`tab-${tab.id}`}
          aria-selected={activeTab === tab.id}
          aria-controls={`workspace-${tab.id}`}
          onClick={() => onChange(tab.id)}
          className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
