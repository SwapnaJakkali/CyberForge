import React from 'react';
import { ShieldAlert, Server, Network } from 'lucide-react';

export default function DesignSystem() {
  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 className="h1">Design System Extract</h1>
        <p className="text-secondary text-body">Tokens, components, and semantics for the CyberForge platform.</p>
      </div>

      {/* Colors & Semantics */}
      <section className="panel">
        <h2 className="h2" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-3)' }}>Severity & State Semantics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
          <div style={{ background: 'var(--severity-critical-bg)', border: '1px solid var(--severity-critical-border)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
            <div className="text-body" style={{ color: 'var(--severity-critical-text)', fontWeight: 600 }}>Critical</div>
            <div className="text-caption text-secondary">Immediate action required</div>
          </div>
          <div style={{ background: 'var(--severity-high-bg)', border: '1px solid var(--severity-high-border)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
            <div className="text-body" style={{ color: 'var(--severity-high-text)', fontWeight: 600 }}>High / Medium</div>
            <div className="text-caption text-secondary">Elevated risk</div>
          </div>
          <div style={{ background: 'var(--severity-healthy-bg)', border: '1px solid var(--severity-healthy-border)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
            <div className="text-body" style={{ color: 'var(--severity-healthy-text)', fontWeight: 600 }}>Healthy</div>
            <div className="text-caption text-secondary">Normal operation</div>
          </div>
          <div style={{ background: 'var(--state-unknown-bg)', border: '1px dashed var(--state-unknown-border)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
            <div className="text-body" style={{ color: 'var(--state-unknown-text)', fontWeight: 600 }}>Unknown / Degraded</div>
            <div className="text-caption text-secondary">Missing data or unidentified</div>
          </div>
        </div>
      </section>

      {/* Typography & Base Variables */}
      <section className="panel">
        <h2 className="h2" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-3)' }}>Typography & Brand Focus</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-4)' }}>
          <div>
            <div className="hero-num">40px Hero</div>
            <div className="h1">20px Section Header (H1)</div>
            <div className="text-body" style={{ marginBottom: 'var(--space-2)' }}>14px Body Text - Default reading size</div>
            <div className="text-caption text-secondary">12px Caption - Metadata and helper text</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ background: 'var(--brand-focus-alpha)', border: '1px solid var(--brand-focus)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
              <div className="text-body" style={{ color: 'var(--brand-focus)', fontWeight: 600 }}>Brand Orange (Focus/Action)</div>
              <div className="text-caption text-secondary">Used strictly for interaction, never severity.</div>
            </div>
            <button className="btn-primary" style={{ width: 'fit-content' }}>Interactive Button</button>
          </div>
        </div>
      </section>

      {/* Reusable Components */}
      <section className="panel">
        <h2 className="h2" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-3)' }}>Components & Badges</h2>
        <div style={{ display: 'flex', gap: 'var(--space-6)', marginTop: 'var(--space-4)', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <span className="text-caption text-secondary">Badges</span>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <span className="badge badge-critical">Critical</span>
              <span className="badge badge-high">High</span>
              <span className="badge badge-healthy">Healthy</span>
              <span className="badge badge-unknown">Unknown</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <span className="text-caption text-secondary">Status Dots</span>
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
              <div className="status-dot critical"></div>
              <div className="status-dot high"></div>
              <div className="status-dot healthy"></div>
              <div className="status-dot unknown"></div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>
            <span className="text-caption text-secondary">Interactive Row (List Items)</span>
            <div className="interactive-row" tabIndex={0}>
              <span className="badge badge-critical">P1</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span className="text-body text-secondary">Jump Host</span>
                <span className="text-body" style={{ color: 'var(--severity-critical-text)', fontWeight: 600 }}>Target Asset</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
