import React, { useMemo, useState } from 'react'
import './styles.css'
import CriteriaForm from './components/CriteriaForm'
import ResultsTable from './components/ResultsTable'
import Explanations from './components/Explanations'
import Presets from './components/Presets'
import RadarChart from './components/RadarChart'
import { CRITERIA } from './data/criteria'
import { defaultWeights, emptyInputs } from './engine/scoring'
import { CriterionKey, WorkloadType } from './types'

export default function App() {
  const [inputs, setInputs] = useState(emptyInputs())
  const [weights, setWeights] = useState(defaultWeights())
  const [workload, setWorkload] = useState<WorkloadType>('http_api')
  const [showWeights, setShowWeights] = useState(false)
  const [selectedOptionKey, setSelectedOptionKey] = useState<string | undefined>(undefined)

  function updateInput(key: CriterionKey, v: number) {
    setInputs(prev => ({ ...prev, [key]: v }))
  }

  function resetAll() {
    setInputs(emptyInputs())
    setWeights(defaultWeights())
    setWorkload('http_api')
    setSelectedOptionKey(undefined)
  }

  const totalWeight = useMemo(() => Object.values(weights).reduce((a, b) => a + b, 0), [weights])

  return (
    <div className="container">
      <h1>Kalkulator wyboru narzędzi do konteneryzacji</h1>
      <div className="muted" style={{ marginBottom: 16 }}>
        Podaj wymagania (1–10) i typ obciążenia. Aplikacja zarekomenduje narzędzia/stack.
      </div>

      <div className="grid" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h3>Parametry</h3>
            <div className="row">
              <select className="select" value={workload} onChange={e => setWorkload(e.target.value as WorkloadType)}>
                <option value="http_api">http_api</option>
                <option value="batch">batch</option>
                <option value="edge">edge</option>
                <option value="stateful">stateful</option>
                <option value="event">event</option>
              </select>
              <button className="button secondary" onClick={() => setShowWeights(v => !v)}>
                {showWeights ? 'Ukryj wagi' : 'Pokaż wagi'}
              </button>
              <button className="button secondary" onClick={resetAll}>Reset</button>
            </div>
          </div>

          {showWeights && (
            <>
              <div className="muted" style={{ margin: '8px 0' }}>
                Wagi (łączna suma: <span className="kbd">{totalWeight.toFixed(1)}</span>) — zmień, jeśli chcesz inaczej priorytetyzować kryteria.
              </div>
              <div className="grid grid-2">
                {CRITERIA.map(c => (
                  <div key={c.key} className="card">
                    <div className="row" style={{ justifyContent: 'space-between' }}>
                      <div><strong>{c.label}</strong><div className="muted" style={{ fontSize: 12 }}>{c.description}</div></div>
                      <div className="badge">{weights[c.key].toFixed(1)}</div>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      value={weights[c.key]}
                      onChange={(e) => setWeights(w => ({ ...w, [c.key]: Number(e.target.value) }))}
                      style={{ width: '100%', marginTop: 10 }}
                    />
                    <div className="row" style={{ justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)' }}>
                      <span>0.5</span><span>2.0</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <Presets onApply={(p) => { setInputs(p.inputs); setWorkload(p.workload); setSelectedOptionKey(undefined) }} />
      </div>

      <CriteriaForm inputs={inputs} onChange={updateInput} />

      <div className="grid" style={{ marginTop: 16 }}>
        <ResultsTable
          inputs={inputs}
          weights={weights}
          workload={workload}
          onSelect={setSelectedOptionKey}
        />
        <Explanations inputs={inputs} weights={weights} workload={workload} />
        <RadarChart
          inputs={inputs}
          weights={weights}
          workload={workload}
          selectedOptionKey={selectedOptionKey}
        />
      </div>

      <div className="muted" style={{ marginTop: 16, fontSize: 12 }}>
        Wyniki są jakościowe (model punktowy + reguły). Traktuj jako kompas wyboru, nie absolutny werdykt.
      </div>
    </div>
  )
}
