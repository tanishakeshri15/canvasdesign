import React from 'react'

function getIcon(type) {
  if (type === 'rect') return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="10" height="8" rx="1"/>
    </svg>
  )
  if (type === 'text') return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="7" y1="2" x2="7" y2="12"/>
      <line x1="2" y1="2" x2="12" y2="2"/>
    </svg>
  )
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="10" height="10" rx="1"/>
      <circle cx="5" cy="5.5" r="1"/>
      <polyline points="2 10 5 7 7.5 9.5 9 8 12 10"/>
    </svg>
  )
}

function getLabel(element, index) {
  if (element.type === 'text') return element.content?.slice(0, 16) || `Text ${index + 1}`
  if (element.type === 'rect') return `Rectangle ${index + 1}`
  return `Image ${index + 1}`
}

export default function LayersPanel({ elements, selectedId, onSelect, onDelete }) {
  return (
    <div className="left-panel">
      <div className="panel-section">
        <div className="panel-section-title">Layers · {elements.length}</div>
      </div>
      <div className="layers-list">
        {elements.length === 0 ? (
          <div className="empty-layers">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
            <div className="empty-layers-text">No elements yet.<br/>Use the toolbar to add some.</div>
          </div>
        ) : (
          [...elements].reverse().map((el, i) => (
            <div
              key={el.id}
              className={`layer-item${el.id === selectedId ? ' selected' : ''}`}
              onClick={() => onSelect(el.id)}
            >
              <div className="layer-icon">{getIcon(el.type)}</div>
              <span className="layer-name">{getLabel(el, elements.indexOf(el))}</span>
              <button
                className="layer-delete-btn"
                onClick={(e) => { e.stopPropagation(); onDelete(el.id) }}
                title="Delete"
              >
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="2 3 10 3"/>
                  <path d="M4 3V2h4v1"/>
                  <path d="M3 3l.7 7h4.6L9 3"/>
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
