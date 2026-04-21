'use client'

import { useState, useRef, useEffect } from 'react'
import type { InstanceTabsProps } from '@/lib/types'
import styles from './InstanceTabs.module.css'

export function InstanceTabs({ instances, activeId, onSelect, onCreate, onDelete, onRename }: InstanceTabsProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingId) inputRef.current?.select()
  }, [editingId])

  const startEditing = (id: string, name: string) => {
    setEditingId(id)
    setEditingName(name)
  }

  const commitEdit = () => {
    if (editingId) onRename(editingId, editingName)
    setEditingId(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') setEditingId(null)
  }

  return (
    <div className={styles.bar}>
      <div role="tablist" className={styles.tabs}>
        {instances.map((inst) => (
          <div
            key={inst.id}
            role="tab"
            aria-selected={inst.id === activeId}
            className={`${styles.tab} ${inst.id === activeId ? styles.tabActive : ''}`}
            onClick={() => onSelect(inst.id)}
            onDoubleClick={() => startEditing(inst.id, inst.name)}
          >
            {editingId === inst.id ? (
              <input
                ref={inputRef}
                className={styles.renameInput}
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className={styles.tabName}>{inst.name}</span>
            )}
            {instances.length > 1 && (
              <button
                className={styles.closeBtn}
                onClick={(e) => { e.stopPropagation(); onDelete(inst.id) }}
                aria-label={`Delete ${inst.name}`}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      <button className={styles.newBtn} onClick={onCreate} aria-label="New sandbox">
        +
      </button>
    </div>
  )
}
