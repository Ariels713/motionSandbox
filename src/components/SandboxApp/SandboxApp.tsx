'use client'

import { useState, useEffect, useCallback } from 'react'
import { SandboxTabs } from '@/components/SandboxTabs/SandboxTabs'
import { InstanceTabs } from '@/components/InstanceTabs/InstanceTabs'
import { SandboxWorkspace } from '@/components/SandboxWorkspace/SandboxWorkspace'
import { REACT_TEMPLATE, MOTION_TEMPLATE } from '@/lib/templates'
import {
  getStoredActiveTab,
  setStoredActiveTab,
  getInstances,
  saveInstances,
  getActiveInstanceId,
  setActiveInstanceId,
} from '@/lib/storage'
import type { SandboxId, SandboxInstance } from '@/lib/types'
import styles from './SandboxApp.module.css'

const TEMPLATES = [REACT_TEMPLATE, MOTION_TEMPLATE]

function createInstance(name: string): SandboxInstance {
  return { id: crypto.randomUUID(), name, createdAt: Date.now() }
}

function nextUntitledName(instances: SandboxInstance[]): string {
  const nums = instances
    .map((i) => {
      const m = i.name.match(/^Untitled (\d+)$/)
      return m ? parseInt(m[1], 10) : 0
    })
    .filter(Boolean)
  const max = nums.length ? Math.max(...nums) : 0
  return `Untitled ${max + 1}`
}

export function SandboxApp() {
  const [activeTab, setActiveTab] = useState<SandboxId>('react')
  const [instances, setInstances] = useState<Record<SandboxId, SandboxInstance[]>>({ react: [], motion: [] })
  const [activeInstanceId, setActiveInstanceIdState] = useState<Record<SandboxId, string>>({ react: '', motion: '' })
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const storedTab = getStoredActiveTab()
    if (storedTab) setActiveTab(storedTab)

    const newInstances: Record<SandboxId, SandboxInstance[]> = { react: [], motion: [] }
    const newActiveIds: Record<SandboxId, string> = { react: '', motion: '' }

    for (const template of TEMPLATES) {
      let list = getInstances(template.id)
      if (list.length === 0) {
        const first = createInstance('Untitled 1')
        list = [first]
        saveInstances(template.id, list)
      }
      newInstances[template.id] = list

      const storedActiveId = getActiveInstanceId(template.id)
      const valid = list.find((i) => i.id === storedActiveId)
      newActiveIds[template.id] = valid ? valid.id : list[0].id
    }

    setInstances(newInstances)
    setActiveInstanceIdState(newActiveIds)
    setHydrated(true)
  }, [])

  const handleTabChange = (tab: SandboxId) => {
    setActiveTab(tab)
    setStoredActiveTab(tab)
  }

  const handleSelectInstance = useCallback((templateId: SandboxId, id: string) => {
    setActiveInstanceIdState((prev) => ({ ...prev, [templateId]: id }))
    setActiveInstanceId(templateId, id)
  }, [])

  const handleCreateInstance = useCallback((templateId: SandboxId) => {
    setInstances((prev) => {
      const list = prev[templateId]
      const newInst = createInstance(nextUntitledName(list))
      const updated = [...list, newInst]
      saveInstances(templateId, updated)
      setActiveInstanceIdState((prevIds) => ({ ...prevIds, [templateId]: newInst.id }))
      setActiveInstanceId(templateId, newInst.id)
      return { ...prev, [templateId]: updated }
    })
  }, [])

  const handleDeleteInstance = useCallback((templateId: SandboxId, id: string) => {
    setInstances((prev) => {
      let list = prev[templateId].filter((i) => i.id !== id)
      if (list.length === 0) {
        const fallback = createInstance('Untitled 1')
        list = [fallback]
      }
      saveInstances(templateId, list)
      setActiveInstanceIdState((prevIds) => {
        if (prevIds[templateId] !== id) return prevIds
        const newActiveId = list[0].id
        setActiveInstanceId(templateId, newActiveId)
        return { ...prevIds, [templateId]: newActiveId }
      })
      return { ...prev, [templateId]: list }
    })
  }, [])

  const handleRenameInstance = useCallback((templateId: SandboxId, id: string, name: string) => {
    setInstances((prev) => {
      const updated = prev[templateId].map((i) => (i.id === id ? { ...i, name: name.trim() || i.name } : i))
      saveInstances(templateId, updated)
      return { ...prev, [templateId]: updated }
    })
  }, [])

  if (!hydrated) return null

  const activeTemplate = TEMPLATES.find((t) => t.id === activeTab)!
  const activeInstId = activeInstanceId[activeTab]

  return (
    <div className={styles.app}>
      <SandboxTabs activeTab={activeTab} onChange={handleTabChange} />
      <InstanceTabs
        instances={instances[activeTab]}
        activeId={activeInstId}
        onSelect={(id) => handleSelectInstance(activeTab, id)}
        onCreate={() => handleCreateInstance(activeTab)}
        onDelete={(id) => handleDeleteInstance(activeTab, id)}
        onRename={(id, name) => handleRenameInstance(activeTab, id, name)}
      />
      <div className={styles.workspaces}>
        <SandboxWorkspace
          key={activeInstId}
          template={activeTemplate}
          instanceId={activeInstId}
        />
      </div>
    </div>
  )
}
