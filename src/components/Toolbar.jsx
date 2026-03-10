import React from 'react'

function RectIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="12" height="8" rx="1.5"/>
    </svg>
  )
}

function TextIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="8" y1="3" x2="8" y2="13"/>
      <line x1="3" y1="3" x2="13" y2="3"/>
      <line x1="5" y1="13" x2="11" y2="13"/>
    </svg>
  )
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="12" height="10" rx="1.5"/>
      <circle cx="5.5" cy="6.5" r="1"/>
      <polyline points="2 12 6 8 9 11 11 9 14 12"/>
    </svg>
  )
}

export default function Toolbar({ onAdd }) {
  return (
    <div className="toolbar">
      <button className="tool-btn" onClick={() => onAdd('rect')} title="Add Rectangle">
        <RectIcon /> Rectangle
      </button>
      <button className="tool-btn" onClick={() => onAdd('text')} title="Add Text">
        <TextIcon /> Text
      </button>
      <button className="tool-btn" onClick={() => onAdd('image')} title="Add Image">
        <ImageIcon /> Image
      </button>
    </div>
  )
}
