import React from 'react'

interface Props {
  label: string
  description?: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
}

export default function Slider({ label, description, value, onChange, min = 1, max = 10, step = 1 }: Props) {
  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700 }}>{label}</div>
          {description && <div className="muted" style={{ fontSize: 13 }}>{description}</div>}
        </div>
        <div className="badge">{value}</div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', marginTop: 10 }}
      />
      <div className="row" style={{ justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)' }}>
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  )
}
