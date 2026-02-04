import React, { useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalculator, faHome, faShieldAlt, faPercent } from '@fortawesome/free-solid-svg-icons'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export default function CostCalculator(){
  // Inputs with sensible defaults
  const [homePrice, setHomePrice] = useState<number>(400000)
  const [downAmount, setDownAmount] = useState<number>(() => Math.round(400000 * 0.2))
  const [termYears, setTermYears] = useState<number>(30)
  const [interestRate, setInterestRate] = useState<number>(6.75)
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState<number>(4800)
  const [insuranceAnnual, setInsuranceAnnual] = useState<number>(1500)
  const [hoaMonthly, setHoaMonthly] = useState<number>(0)
  const [pmiRate, setPmiRate] = useState<number>(0.6)
  const [extraPrincipal, setExtraPrincipal] = useState<number>(0)
  // single-dollar down payment input (percent derived in results)

  // Derived values
  const derived = useMemo(() => {
    const hp = Math.max(0, Number(homePrice) || 0)
    const dpAmt = Math.max(0, Number(downAmount) || 0)
    const dpPct = hp > 0 ? Math.min(100, (dpAmt / hp) * 100) : 0
    const loanAmount = Math.max(0, hp - dpAmt)
    const r = (Math.max(0, Number(interestRate) || 0) / 100) / 12
    const n = Math.max(1, Number(termYears) || 30) * 12

    let pi = 0
    if (r > 0) {
      const numerator = loanAmount * r * Math.pow(1 + r, n)
      const denominator = Math.pow(1 + r, n) - 1
      pi = denominator ? numerator / denominator : loanAmount / n
    } else {
      pi = loanAmount / n
    }

    // PMI applies when down payment < 20%
    const pmiMonthly = dpPct < 20 ? (loanAmount * (Math.max(0, Number(pmiRate) || 0) / 100)) / 12 : 0

    const propertyTaxMonthly = Math.max(0, Number(propertyTaxAnnual) || 0) / 12
    const insuranceMonthly = Math.max(0, Number(insuranceAnnual) || 0) / 12
    const hoa = Math.max(0, Number(hoaMonthly) || 0)

    const total = pi + pmiMonthly + propertyTaxMonthly + insuranceMonthly + hoa + Math.max(0, Number(extraPrincipal) || 0)

    return {
      homePrice: hp,
      downAmount: dpAmt,
      downPercent: Number(dpPct.toFixed(2)),
      loanAmount,
      monthlyPI: pi,
      pmiMonthly,
      propertyTaxMonthly,
      insuranceMonthly,
      hoaMonthly: hoa,
      extraPrincipal: Math.max(0, Number(extraPrincipal) || 0),
      total
    }
  }, [homePrice, downAmount, termYears, interestRate, propertyTaxAnnual, insuranceAnnual, hoaMonthly, pmiRate, extraPrincipal])

  // Helpers
  const fmt = (v:number) => currency.format(v)

  return (
    <div>
      <section className="content-block">
        <h2><span className="icon-badge"><FontAwesomeIcon icon={faCalculator} /></span> Cost Calculator</h2>
        <p className="muted">Estimate monthly ownership costs with live updates as you edit inputs.</p>

        <div className="grid">
          <div className="card">
            <h3>Inputs</h3>
            <div className="stack">
              <label>
                Home price
                <input
                  type="number"
                  step="100"
                  min={0}
                  value={homePrice}
                  onChange={(e)=> setHomePrice(Math.max(0, Number(e.target.value) || 0))}
                  className="form-control"
                  style={{width:'100%', marginTop:8}}
                />
              </label>

              <label>
                Down payment (dollars)
                <input type="number" step="100" min={0} value={downAmount}
                  onChange={(e)=> setDownAmount(Math.max(0, Number(e.target.value) || 0))}
                  className="form-control"
                  style={{width:'100%', marginTop:8}}
                />
              </label>

              <label>
                Loan term (years)
                <select value={termYears} onChange={(e)=> setTermYears(Number(e.target.value))} className="form-select" style={{width:'100%', marginTop:8}}>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </select>
              </label>

              <label>
                Interest rate (APR %)
                <input type="number" step="0.01" min={0} value={interestRate}
                  onChange={(e)=> setInterestRate(Math.max(0, Number(e.target.value) || 0))}
                  className="form-control"
                  style={{width:'100%', marginTop:8}}
                />
              </label>

              <label>
                Property tax (annual $)
                <input type="number" step="1" min={0} value={propertyTaxAnnual}
                  onChange={(e)=> setPropertyTaxAnnual(Math.max(0, Number(e.target.value) || 0))}
                  className="form-control"
                  style={{width:'100%', marginTop:8}}
                />
              </label>

              <label>
                Homeowners insurance (annual $)
                <input type="number" step="1" min={0} value={insuranceAnnual}
                  onChange={(e)=> setInsuranceAnnual(Math.max(0, Number(e.target.value) || 0))}
                  className="form-control"
                  style={{width:'100%', marginTop:8}}
                />
              </label>

              <label>
                HOA / Condo fees (monthly $)
                <input type="number" step="1" min={0} value={hoaMonthly}
                  onChange={(e)=> setHoaMonthly(Math.max(0, Number(e.target.value) || 0))}
                  className="form-control"
                  style={{width:'100%', marginTop:8}}
                />
              </label>

              <label>
                PMI rate (annual % of loan)
                  <input type="number" step="0.01" min={0} value={pmiRate}
                    onChange={(e)=> setPmiRate(Math.max(0, Number(e.target.value) || 0))}
                    className="form-control"
                    style={{width:'100%', marginTop:8}}
                  />
                <div className="muted" style={{fontSize:12, marginTop:6}}>PMI is automatically excluded when down payment ≥ 20%.</div>
              </label>

              <label>
                Extra principal (monthly $)
                <input type="number" step="1" min={0} value={extraPrincipal}
                  onChange={(e)=> setExtraPrincipal(Math.max(0, Number(e.target.value) || 0))}
                  className="form-control"
                  style={{width:'100%', marginTop:8}}
                />
              </label>
            </div>
          </div>

          <div className="card">
            <h3>Results</h3>
            <div className="stack">
              <div className="row"><strong>Total monthly</strong><div style={{marginLeft:'auto', fontSize:20}}>{fmt(derived.total)}</div></div>

              <div className="row"><div>Principal &amp; Interest</div><div style={{marginLeft:'auto'}}>{fmt(derived.monthlyPI)}</div></div>
              <div className="row"><div>PMI</div><div style={{marginLeft:'auto'}}>{fmt(derived.pmiMonthly)}</div></div>
              <div className="row"><div>Property taxes</div><div style={{marginLeft:'auto'}}>{fmt(derived.propertyTaxMonthly)}</div></div>
              <div className="row"><div>Homeowners insurance</div><div style={{marginLeft:'auto'}}>{fmt(derived.insuranceMonthly)}</div></div>
              <div className="row"><div>HOA</div><div style={{marginLeft:'auto'}}>{fmt(derived.hoaMonthly)}</div></div>
              {derived.extraPrincipal > 0 && (
                <div className="row"><div>Extra principal</div><div style={{marginLeft:'auto'}}>{fmt(derived.extraPrincipal)}</div></div>
              )}

              <hr />

              <div><strong>Loan amount:</strong> {fmt(derived.loanAmount)}</div>
              <div><strong>Down payment:</strong> {fmt(derived.downAmount)} ({derived.downPercent}%)</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
