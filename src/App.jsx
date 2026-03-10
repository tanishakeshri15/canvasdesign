import React, { useState, useCallback, useEffect, useRef } from 'react'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar'
import LayersPanel from './components/LayersPanel'
import PropertiesPanel from './components/PropertiesPanel'
import './styles/canvas.css'

const CANVAS_W = 900
const CANVAS_H = 600
let nextId = 1

const DEFAULTS = {
  rect:  { width: 160, height: 100, fill: '#7c6af7', stroke: '#9d90ff', borderRadius: 6 },
  text:  { width: 180, height: 60,  fill: '#f0f0f4', fontSize: 18, content: 'Text' },
  image: { width: 180, height: 140 },
}

function makeElement(type, maxZ) {
  const d = DEFAULTS[type]
  return {
    id: `el-${nextId++}`,
    type,
    x: Math.round((CANVAS_W - d.width) / 2),
    y: Math.round((CANVAS_H - d.height) / 2),
    zIndex: maxZ + 1,
    ...d,
  }
}

export default function App() {
  const [elements, setElements] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [snapToGrid, setSnapToGrid] = useState(false)
  const [toast, setToast] = useState({ msg: '', visible: false })
  const [contextMenu, setContextMenu] = useState(null)
  const toastTimer = useRef(null)

  const showToast = (msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ msg, visible: true })
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000)
  }

  const maxZ = elements.length > 0 ? Math.max(...elements.map(e => e.zIndex)) : 0

  const addElement = useCallback((type) => {
    const el = makeElement(type, maxZ)
    setElements(prev => [...prev, el])
    setSelectedId(el.id)
    showToast(`Added ${type}`)
  }, [maxZ])

  const updateElement = useCallback((id, patch) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...patch } : el))
  }, [])

  const deleteElement = useCallback((id) => {
    setElements(prev => prev.filter(el => el.id !== id))
    setSelectedId(prev => prev === id ? null : prev)
    showToast('Deleted')
  }, [])

  const duplicateElement = useCallback((id) => {
    const el = elements.find(e => e.id === id)
    if (!el) return
    const newEl = {
      ...el,
      id: `el-${nextId++}`,
      x: Math.min(el.x + 20, CANVAS_W - el.width),
      y: Math.min(el.y + 20, CANVAS_H - el.height),
      zIndex: maxZ + 1,
    }
    setElements(prev => [...prev, newEl])
    setSelectedId(newEl.id)
    showToast('Duplicated')
  }, [elements, maxZ])

  const bringToFront = useCallback((id) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, zIndex: maxZ + 1 } : el))
  }, [maxZ])

  const sendToBack = useCallback((id) => {
    const minZ = elements.length > 0 ? Math.min(...elements.map(e => e.zIndex)) : 0
    setElements(prev => prev.map(el => el.id === id ? { ...el, zIndex: minZ - 1 } : el))
  }, [elements])

  const handleSelect = useCallback((id) => {
    setSelectedId(id)
    bringToFront(id)
  }, [bringToFront])

  const handleTextChange = useCallback((id, content) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, content } : el))
  }, [])

  const handleContextMenu = useCallback((e, id) => {
    e.preventDefault()
    setSelectedId(id)
    setContextMenu({ x: e.clientX, y: e.clientY, id })
  }, [])

  const closeContextMenu = () => setContextMenu(null)

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        deleteElement(selectedId)
      }
      if (e.key === 'd' && (e.ctrlKey || e.metaKey) && selectedId) {
        e.preventDefault()
        duplicateElement(selectedId)
      }
      if (e.key === 'Escape') {
        setSelectedId(null)
        closeContextMenu()
      }
      if (selectedId && ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
        e.preventDefault()
        const step = e.shiftKey ? 10 : 1
        const map = { ArrowUp:[0,-step], ArrowDown:[0,step], ArrowLeft:[-step,0], ArrowRight:[step,0] }
        const [dx, dy] = map[e.key]
        setElements(prev => prev.map(el => {
          if (el.id !== selectedId) return el
          return {
            ...el,
            x: Math.max(0, Math.min(el.x + dx, CANVAS_W - el.width)),
            y: Math.max(0, Math.min(el.y + dy, CANVAS_H - el.height)),
          }
        }))
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedId, deleteElement, duplicateElement])

  const selectedElement = elements.find(e => e.id === selectedId) || null

  return (
    <div className="app-shell" onClick={closeContextMenu}>
      {/* TOP BAR */}
      <div className="topbar">
        <div className="topbar-logo">
          <svg viewBox="0 0 26 26" fill="none" width="26" height="26">
            <rect x="1" y="1" width="10" height="10" rx="2.5" fill="#7c6af7"/>
            <rect x="15" y="1" width="10" height="10" rx="2.5" fill="#9d90ff" opacity="0.7"/>
            <rect x="1" y="15" width="10" height="10" rx="2.5" fill="#9d90ff" opacity="0.7"/>
            <rect x="15" y="15" width="10" height="10" rx="2.5" fill="#7c6af7" opacity="0.4"/>
          </svg>
          <span className="topbar-logo-name">Canvas</span>
          <span className="topbar-logo-tag">beta</span>
        </div>
        <div className="topbar-divider" />
        <Toolbar onAdd={addElement} />
        <div className="topbar-right">
          <button
            className={`topbar-action-btn${snapToGrid ? ' primary' : ''}`}
            onClick={() => { setSnapToGrid(s => !s); showToast(snapToGrid ? 'Snap off' : 'Snap on') }}
          >
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13">
              <path d="M7 2v8M4 5l3-3 3 3"/><path d="M2 10v1a1 1 0 001 1h8a1 1 0 001-1v-1"/>
            </svg>
            Snap {snapToGrid ? 'On' : 'Off'}
          </button>
          {selectedId && (
            <button className="topbar-action-btn" onClick={() => duplicateElement(selectedId)}>
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13">
                <rect x="5" y="5" width="8" height="8" rx="1"/>
                <path d="M3 9H2a1 1 0 01-1-1V2a1 1 0 011-1h6a1 1 0 011 1v1"/>
              </svg>
              Duplicate
            </button>
          )}
        </div>
      </div>

      {/* MAIN */}
      <div className="main-area">
        <LayersPanel elements={elements} selectedId={selectedId} onSelect={handleSelect} onDelete={deleteElement} />
        <Canvas
          elements={elements}
          selectedId={selectedId}
          onSelect={handleSelect}
          onUpdate={updateElement}
          onTextChange={handleTextChange}
          onDeselect={() => setSelectedId(null)}
          snapToGrid={snapToGrid}
          onContextMenu={handleContextMenu}
        />
        <PropertiesPanel element={selectedElement} onUpdate={updateElement} />
      </div>

      {/* STATUS BAR */}
      <div className="status-bar">
        <div className="status-item"><div className="status-dot" />Ready</div>
        <div className="status-item">{elements.length} element{elements.length !== 1 ? 's' : ''}</div>
        {selectedElement && (
          <div className="status-item">
            {selectedElement.type} · {Math.round(selectedElement.x)},{Math.round(selectedElement.y)} · {Math.round(selectedElement.width)}×{Math.round(selectedElement.height)}
          </div>
        )}
        <div className="status-item" style={{ marginLeft: 'auto' }}>
          <span className="kbd">Del</span>&nbsp;delete&nbsp;&nbsp;
          <span className="kbd">⌘D</span>&nbsp;duplicate&nbsp;&nbsp;
          <span className="kbd">↑↓←→</span>&nbsp;nudge
        </div>
      </div>

      {/* CONTEXT MENU */}
      {contextMenu && (
        <div className="context-menu" style={{ left: contextMenu.x, top: contextMenu.y }} onClick={(e) => e.stopPropagation()}>
          <button className="context-menu-item" onClick={() => { duplicateElement(contextMenu.id); closeContextMenu() }}>
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13">
              <rect x="5" y="5" width="8" height="8" rx="1"/><path d="M3 9H2a1 1 0 01-1-1V2a1 1 0 011-1h6a1 1 0 011 1v1"/>
            </svg>
            Duplicate <span className="context-menu-shortcut">⌘D</span>
          </button>
          <button className="context-menu-item" onClick={() => { bringToFront(contextMenu.id); closeContextMenu() }}>
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13">
              <path d="M7 2v8M4 5l3-3 3 3"/>
            </svg>
            Bring to Front
          </button>
          <button className="context-menu-item" onClick={() => { sendToBack(contextMenu.id); closeContextMenu() }}>
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13">
              <path d="M7 12V4M4 9l3 3 3-3"/>
            </svg>
            Send to Back
          </button>
          <div className="context-menu-divider" />
          <button className="context-menu-item danger" onClick={() => { deleteElement(contextMenu.id); closeContextMenu() }}>
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13">
              <polyline points="2 3.5 12 3.5"/><path d="M5 3.5V2.5h4v1"/><path d="M3 3.5l.8 8h6.4l.8-8"/>
            </svg>
            Delete <span className="context-menu-shortcut">Del</span>
          </button>
        </div>
      )}

      {/* TOAST */}
      <div className={`toast${toast.visible ? ' visible' : ''}`}>{toast.msg}</div>
    </div>
  )
}
