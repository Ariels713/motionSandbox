'use client'

import { useState, useEffect } from 'react'
import { SandboxTabs } from '@/components/SandboxTabs/SandboxTabs'
import { SandboxWorkspace } from '@/components/SandboxWorkspace/SandboxWorkspace'
import { REACT_TEMPLATE, MOTION_TEMPLATE } from '@/lib/templates'
import { getStoredActiveTab, setStoredActiveTab } from '@/lib/storage'
import type { SandboxId } from '@/lib/types'
import styles from './SandboxApp.module.css'

const TEMPLATES = [REACT_TEMPLATE, MOTION_TEMPLATE]

export function SandboxApp() {
  const [activeTab, setActiveTab] = useState<SandboxId>('react')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = getStoredActiveTab()
    if (stored) setActiveTab(stored)
    setHydrated(true)
  }, [])

  const handleTabChange = (tab: SandboxId) => {
    setActiveTab(tab)
    setStoredActiveTab(tab)
  }

  if (!hydrated) return null

  return (
    <div className={styles.app}>
      <SandboxTabs activeTab={activeTab} onChange={handleTabChange} />
      <div className={styles.workspaces}>
        {TEMPLATES.map((template) => (
          <SandboxWorkspace
            key={template.id}
            template={template}
            isVisible={activeTab === template.id}
          />
        ))}
      </div>
    </div>
  )
}
