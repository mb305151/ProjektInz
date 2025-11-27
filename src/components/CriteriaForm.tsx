import React from 'react'
import { CRITERIA } from '@/data/criteria'
import Slider from './Slider'
import { CriterionKey } from '@/types'

interface Props {
  inputs: Record<CriterionKey, number>
  onChange: (key: CriterionKey, v: number) => void
}

export default function CriteriaForm({ inputs, onChange }: Props) {
  return (
    <div className="grid grid-2">
      {CRITERIA.map(c => (
        <Slider
          key={c.key}
          label={c.label}
          description={c.description}
          value={inputs[c.key]}
          onChange={(v) => onChange(c.key, v)}
        />
      ))}
    </div>
  )
}
