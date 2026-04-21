import { StateEffect, StateField, type Extension } from '@codemirror/state'
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  type ViewUpdate,
  WidgetType,
  keymap,
} from '@codemirror/view'

// ── State ─────────────────────────────────────────────────────────────────────

interface GhostState {
  text: string | null
  pos: number
  deco: DecorationSet
}

const setGhostText = StateEffect.define<{ text: string; pos: number } | null>()

class GhostWidget extends WidgetType {
  constructor(readonly text: string) {
    super()
  }
  toDOM() {
    const span = document.createElement('span')
    span.className = 'cm-ghostText'
    span.textContent = this.text
    return span
  }
  ignoreEvent() {
    return true
  }
}

const ghostField = StateField.define<GhostState>({
  create: () => ({ text: null, pos: -1, deco: Decoration.none }),

  update(value, tr) {
    for (const effect of tr.effects) {
      if (effect.is(setGhostText)) {
        if (!effect.value) return { text: null, pos: -1, deco: Decoration.none }
        const { text, pos } = effect.value
        return {
          text,
          pos,
          deco: Decoration.set([
            Decoration.widget({ widget: new GhostWidget(text), side: 1 }).range(pos),
          ]),
        }
      }
    }
    // Clear if the doc changed or cursor moved away from the ghost position
    if (value.text !== null && (tr.docChanged || tr.state.selection.main.head !== value.pos)) {
      return { text: null, pos: -1, deco: Decoration.none }
    }
    return value
  },

  provide: (f) => EditorView.decorations.from(f, (v) => v.deco),
})

// ── Accept / dismiss ──────────────────────────────────────────────────────────

function acceptGhost(view: EditorView): boolean {
  const { text, pos } = view.state.field(ghostField)
  if (!text) return false
  view.dispatch({
    changes: { from: pos, insert: text },
    selection: { anchor: pos + text.length },
    effects: setGhostText.of(null),
  })
  return true
}

function dismissGhost(view: EditorView): boolean {
  const { text } = view.state.field(ghostField)
  if (!text) return false
  view.dispatch({ effects: setGhostText.of(null) })
  return true
}

// ── Fetch plugin ──────────────────────────────────────────────────────────────

const completionPlugin = ViewPlugin.fromClass(
  class {
    private timer: ReturnType<typeof setTimeout> | null = null
    private controller: AbortController | null = null

    update(update: ViewUpdate) {
      if (!update.docChanged && !update.selectionSet) return
      this.cancel()
      this.timer = setTimeout(() => this.fetch(update.view), 650)
    }

    async fetch(view: EditorView) {
      const pos = view.state.selection.main.head
      const before = view.state.doc.sliceString(0, pos)
      const after = view.state.doc.sliceString(pos)

      if (before.trim().length < 5) return

      this.controller = new AbortController()

      try {
        const res = await fetch('/api/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ before, after }),
          signal: this.controller.signal,
        })
        if (!res.ok) return

        const { completion } = await res.json()
        if (!completion?.trim()) return

        // Cursor must not have moved since we fired the request
        if (view.state.selection.main.head !== pos) return

        view.dispatch({ effects: setGhostText.of({ text: completion, pos }) })
      } catch {
        // AbortError or network error — silently ignore
      }
    }

    cancel() {
      if (this.timer !== null) clearTimeout(this.timer)
      this.controller?.abort()
    }

    destroy() {
      this.cancel()
    }
  }
)

// ── Export ────────────────────────────────────────────────────────────────────

export const claudeCompletionExtension: Extension[] = [
  ghostField,
  completionPlugin,
  keymap.of([
    { key: 'Tab', run: acceptGhost },
    { key: 'Escape', run: dismissGhost },
  ]),
]
