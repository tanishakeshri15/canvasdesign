import React, { useRef, useCallback } from 'react'
import Element from './Element'
import '../styles/canvas.css'

const CANVAS_W = 900
const CANVAS_H = 600

export default function Canvas({
  elements,
  selectedId,
  onSelect,
  onUpdate,
  onTextChange,
  onDeselect,
  snapToGrid,
  contextMenu,
  onContextMenu,
}) {
  const canvasRef = useRef(null)

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current || e.target.classList.contains('canvas-grid')) {
      onDeselect()
    }
  }

  const handleCanvasContextMenu = (e) => {
    e.preventDefault()
    // deselect context menu on canvas bg
  }

  return (
    <div className="canvas-viewport">
      <div className="canvas-bg-dots" />

      <div style={{ position: 'relative' }}>
        <div
          ref={canvasRef}
          className="canvas-frame"
          style={{ width: CANVAS_W, height: CANVAS_H }}
          onClick={handleCanvasClick}
          onContextMenu={handleCanvasContextMenu}
        >
          <div className="canvas-grid" />

          {[...elements]
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((el) => (
              <Element
                key={el.id}
                element={el}
                isSelected={el.id === selectedId}
                onSelect={onSelect}
                onUpdate={onUpdate}
                onTextChange={onTextChange}
                canvasRef={canvasRef}
                snapToGrid={snapToGrid}
                allElements={elements}
                onContextMenu={onContextMenu}
              />
            ))}
        </div>
        <div className="canvas-label">
          {CANVAS_W} × {CANVAS_H} — Design Canvas
        </div>
      </div>
    </div>
  )
}
