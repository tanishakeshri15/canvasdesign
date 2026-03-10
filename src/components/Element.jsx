import React, { useRef, useState, useCallback } from 'react'

const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

function RectContent({ element }) {
  return (
    <div
      className="element-rect"
      style={{
        '--fill-color': element.fill || 'rgba(124, 106, 247, 0.25)',
        '--stroke-color': element.stroke || 'rgba(124, 106, 247, 0.6)',
        borderRadius: element.borderRadius ?? 4,
      }}
    />
  )
}

function TextContent({ element, isSelected, onTextChange }) {
  const [editing, setEditing] = useState(false)

  const handleDoubleClick = (e) => {
    if (!isSelected) return
    e.stopPropagation()
    setEditing(true)
  }

  const handleBlur = () => setEditing(false)

  if (editing) {
    return (
      <div className="element-text editing">
        <textarea
          className="text-editor"
          defaultValue={element.content}
          autoFocus
          onBlur={(e) => {
            onTextChange(element.id, e.target.value)
            handleBlur()
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        />
      </div>
    )
  }

  return (
    <div
      className="element-text"
      onDoubleClick={handleDoubleClick}
      style={{ color: element.fill || '#f0f0f4', fontSize: element.fontSize || 14 }}
    >
      {element.content || 'Double-click to edit'}
    </div>
  )
}

function ImageContent({ element }) {
  const [imgSrc, setImgSrc] = useState(element.src || null)
  const inputRef = useRef()

  const handleClick = (e) => {
    e.stopPropagation()
    inputRef.current?.click()
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setImgSrc(url)
  }

  if (imgSrc) {
    return (
      <div className="element-image">
        <img src={imgSrc} alt="" draggable={false} />
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      </div>
    )
  }

  return (
    <div className="element-image" onDoubleClick={handleClick}>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      <div className="element-image-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <span>Double-click to upload</span>
      </div>
    </div>
  )
}

export default function Element({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onTextChange,
  canvasRef,
  snapToGrid,
  allElements,
  onContextMenu,
}) {
  const dragStart = useRef(null)
  const resizeStart = useRef(null)

  const GRID = 10

  const getSnapPosition = useCallback((x, y) => {
    if (!snapToGrid) return { x, y }
    return {
      x: Math.round(x / GRID) * GRID,
      y: Math.round(y / GRID) * GRID,
    }
  }, [snapToGrid])

  const handleMouseDown = (e) => {
    if (e.button !== 0) return
    e.stopPropagation()
    onSelect(element.id)

    const canvasRect = canvasRef.current.getBoundingClientRect()
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      origX: element.x,
      origY: element.y,
      canvasW: canvasRef.current.offsetWidth,
      canvasH: canvasRef.current.offsetHeight,
    }

    const onMove = (ev) => {
      const dx = ev.clientX - dragStart.current.mouseX
      const dy = ev.clientY - dragStart.current.mouseY
      let newX = dragStart.current.origX + dx
      let newY = dragStart.current.origY + dy

      // Clamp to canvas
      newX = Math.max(0, Math.min(newX, dragStart.current.canvasW - element.width))
      newY = Math.max(0, Math.min(newY, dragStart.current.canvasH - element.height))

      const snapped = getSnapPosition(newX, newY)
      onUpdate(element.id, { x: snapped.x, y: snapped.y })
    }

    const onUp = () => {
      dragStart.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const handleResizeMouseDown = (e, direction) => {
    e.stopPropagation()
    e.preventDefault()
    onSelect(element.id)

    const canvasW = canvasRef.current.offsetWidth
    const canvasH = canvasRef.current.offsetHeight

    resizeStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      origX: element.x,
      origY: element.y,
      origW: element.width,
      origH: element.height,
    }

    const MIN = 20

    const onMove = (ev) => {
      const dx = ev.clientX - resizeStart.current.mouseX
      const dy = ev.clientY - resizeStart.current.mouseY
      let { origX, origY, origW, origH } = resizeStart.current
      let newX = origX, newY = origY, newW = origW, newH = origH

      if (direction.includes('e')) newW = Math.max(MIN, origW + dx)
      if (direction.includes('s')) newH = Math.max(MIN, origH + dy)
      if (direction.includes('w')) {
        newW = Math.max(MIN, origW - dx)
        newX = origX + (origW - newW)
      }
      if (direction.includes('n')) {
        newH = Math.max(MIN, origH - dy)
        newY = origY + (origH - newH)
      }

      // Clamp
      newX = Math.max(0, newX)
      newY = Math.max(0, newY)
      if (newX + newW > canvasW) newW = canvasW - newX
      if (newY + newH > canvasH) newH = canvasH - newY

      const snapped = getSnapPosition(newX, newY)
      onUpdate(element.id, { x: snapped.x, y: snapped.y, width: Math.round(newW), height: Math.round(newH) })
    }

    const onUp = () => {
      resizeStart.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onContextMenu(e, element.id)
  }

  return (
    <div
      className={`canvas-element${isSelected ? ' selected' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        zIndex: element.zIndex,
      }}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
    >
      {/* Hover border */}
      <div className="element-hover-border" />

      {/* Content */}
      {element.type === 'rect' && <RectContent element={element} />}
      {element.type === 'text' && (
        <TextContent element={element} isSelected={isSelected} onTextChange={onTextChange} />
      )}
      {element.type === 'image' && <ImageContent element={element} />}

      {/* Selection handles */}
      {isSelected && (
        <>
          <div className="selection-outline" />
          {HANDLES.map((dir) => (
            <div
              key={dir}
              className={`resize-handle ${dir}`}
              onMouseDown={(e) => handleResizeMouseDown(e, dir)}
            />
          ))}
        </>
      )}
    </div>
  )
}
