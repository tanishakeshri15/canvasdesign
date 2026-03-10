import React, { useRef } from 'react'

function NumInput({ label, value, onChange, min = 0, max = 9999, suffix = '' }) {
  return (
    <div className="props-field">
      <span className="props-field-label">{label}</span>
      <input
        type="number"
        className="props-input"
        value={Math.round(value)}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        onMouseDown={(e) => e.stopPropagation()}
      />
    </div>
  )
}

export default function PropertiesPanel({ element, onUpdate }) {
  const colorInputRef = useRef()
  const strokeInputRef = useRef()

  if (!element) {
    return (
      <div className="right-panel">
        <div className="no-selection">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
            <path d="M13 13l6 6"/>
          </svg>
          <div className="no-selection-text">Select an element<br/>to edit its properties</div>
        </div>
      </div>
    )
  }

  return (
    <div className="right-panel">
      {/* Position & Size */}
      <div className="props-section">
        <div className="props-section-title">Position</div>
        <div className="props-row-2">
          <NumInput label="X" value={element.x} onChange={(v) => onUpdate(element.id, { x: v })} />
          <NumInput label="Y" value={element.y} onChange={(v) => onUpdate(element.id, { y: v })} />
        </div>
      </div>

      <div className="props-section">
        <div className="props-section-title">Size</div>
        <div className="props-row-2">
          <NumInput label="W" value={element.width} min={10} onChange={(v) => onUpdate(element.id, { width: v })} />
          <NumInput label="H" value={element.height} min={10} onChange={(v) => onUpdate(element.id, { height: v })} />
        </div>
      </div>

      {/* Fill / Color */}
      {(element.type === 'rect' || element.type === 'text') && (
        <div className="props-section">
          <div className="props-section-title">
            {element.type === 'rect' ? 'Fill' : 'Color'}
          </div>
          <div className="color-row">
            <div
              className="color-swatch"
              style={{ background: element.fill || (element.type === 'rect' ? 'rgba(124,106,247,0.25)' : '#f0f0f4') }}
              onClick={() => colorInputRef.current?.click()}
            />
            <input
              ref={colorInputRef}
              type="color"
              defaultValue={element.fill || '#7c6af7'}
              onChange={(e) => onUpdate(element.id, { fill: e.target.value })}
            />
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              {element.fill || 'default'}
            </span>
          </div>

          {element.type === 'rect' && (
            <>
              <div className="props-section-title" style={{ marginTop: 12 }}>Stroke</div>
              <div className="color-row">
                <div
                  className="color-swatch"
                  style={{ background: element.stroke || 'rgba(124,106,247,0.6)' }}
                  onClick={() => strokeInputRef.current?.click()}
                />
                <input
                  ref={strokeInputRef}
                  type="color"
                  defaultValue={element.stroke || '#7c6af7'}
                  onChange={(e) => onUpdate(element.id, { stroke: e.target.value })}
                />
              </div>

              <div className="props-section-title" style={{ marginTop: 12 }}>Corner Radius</div>
              <input
                type="number"
                className="props-input"
                value={element.borderRadius ?? 4}
                min={0}
                max={100}
                onChange={(e) => onUpdate(element.id, { borderRadius: Number(e.target.value) })}
                onMouseDown={(e) => e.stopPropagation()}
              />
            </>
          )}

          {element.type === 'text' && (
            <>
              <div className="props-section-title" style={{ marginTop: 12 }}>Font Size</div>
              <input
                type="number"
                className="props-input"
                value={element.fontSize || 14}
                min={8}
                max={120}
                onChange={(e) => onUpdate(element.id, { fontSize: Number(e.target.value) })}
                onMouseDown={(e) => e.stopPropagation()}
              />
            </>
          )}
        </div>
      )}

      {/* Layer order */}
      <div className="props-section">
        <div className="props-section-title">Layer</div>
        <NumInput label="Z" value={element.zIndex} min={0} max={999} onChange={(v) => onUpdate(element.id, { zIndex: v })} />
      </div>
    </div>
  )
}
