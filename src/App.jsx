import React, { useState } from 'react';
import { 
  ShieldAlert, Activity, ServerCrash, ChevronRight, 
  Search, Filter, AlertTriangle, Network, Map, LayoutList,
  LayoutDashboard, Palette
} from 'lucide-react';
import './index.css';
import AttackPathMap from './components/AttackPathMap';
import DesignSystem from './components/DesignSystem';

export default function App() {
  // Toggle between Healthy and Degraded for demonstration
  const [isDegraded, setIsDegraded] = useState(false);
  
  // Navigation
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' or 'attack-path'

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* ZONE: Header + global filters */}
      <header style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: 'var(--space-4) var(--space-5)', 
        borderBottom: '1px solid var(--border-strong)', 
        backgroundColor: 'var(--bg-panel)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-primary)' }}>
            <ShieldAlert size={24} color="var(--brand-focus)" />
            <span style={{ fontWeight: 700, fontSize: 'var(--text-h1)' }}>CyberForge</span>
          </div>
          
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-strong)' }} />
          
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <button 
              onClick={() => setActiveView('dashboard')}
              style={{ background: 'none', border: 'none', color: activeView === 'dashboard' ? 'var(--brand-focus)' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button 
              onClick={() => setActiveView('attack-path')}
              style={{ background: 'none', border: 'none', color: activeView === 'attack-path' ? 'var(--brand-focus)' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              <Network size={18} /> Attack Path Map
            </button>
            <button 
              onClick={() => setActiveView('design-system')}
              style={{ background: 'none', border: 'none', color: activeView === 'design-system' ? 'var(--brand-focus)' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              <Palette size={18} /> Design System
            </button>
          </div>
          
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-strong)' }} />

          <select style={{ 
            background: 'transparent', color: 'var(--text-primary)', border: 'none', 
            fontSize: 'var(--text-body)', outline: 'none', cursor: 'pointer' 
          }}>
            <option>Global / All Sites</option>
            <option>Plant Alpha (Frankfurt)</option>
            <option>Plant Beta (Texas)</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-4)', color: 'var(--text-secondary)' }}>
            <Search size={20} style={{ cursor: 'pointer' }} />
            <Filter size={20} style={{ cursor: 'pointer' }} />
          </div>
          <button 
            className="btn-primary" 
            onClick={() => setIsDegraded(!isDegraded)}
          >
            Toggle State: {isDegraded ? 'Degraded' : 'Healthy'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {activeView === 'dashboard' ? (
          <div className="dashboard-grid">
            
            {/* Global Degraded Warning Bar */}
            {isDegraded && (
              <div style={{ 
                gridColumn: '1 / -1', 
                background: 'var(--state-unknown-bg)', 
                border: '1px dashed var(--state-unknown-border)', 
                color: 'var(--text-primary)',
                padding: 'var(--space-3) var(--space-4)', 
                borderRadius: 'var(--radius-md)', 
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)' 
              }}>
                <AlertTriangle size={20} color="var(--state-unknown-text)" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, fontSize: 'var(--text-body)' }}>Sensor Degradation in Zone C</span>
                  <span className="text-caption text-secondary">Visibility is limited. Metrics for this zone may be incomplete or missing.</span>
                </div>
              </div>
            )}

            {/* ZONE: Hero row (posture, sensor health, exposure) */}
            <div className="panel" style={{ gridColumn: 'span 4' }}>
              <div className="h1"><Activity size={20} className="text-tertiary" /> Security Posture</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
                <div className="hero-num" style={{ color: isDegraded ? 'var(--state-unknown-text)' : 'var(--text-primary)' }}>
                  {isDegraded ? '72' : '84'}
                </div>
                <span className="text-secondary">/ 100</span>
              </div>
              <div className="text-caption text-secondary" style={{ marginTop: 'auto' }}>
                {isDegraded ? 'Score impacted by degraded visibility' : '+4 points vs last week'}
              </div>
            </div>

            <div className="panel" style={{ gridColumn: 'span 4' }}>
              <div className="h1"><ServerCrash size={20} className="text-tertiary" /> Sensor Health</div>
              <div className="hero-num" style={{ color: isDegraded ? 'var(--state-unknown-text)' : 'var(--text-primary)' }}>
                {isDegraded ? '64%' : '98%'}
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', gap: 'var(--space-2)' }}>
                {isDegraded ? (
                  <>
                    <span className="badge badge-unknown"><div className="status-dot unknown"></div> Zone C Offline</span>
                    <span className="badge badge-critical"><div className="status-dot critical"></div> 1 Collector Down</span>
                  </>
                ) : (
                  <span className="badge badge-healthy"><div className="status-dot healthy"></div> All Systems Operational</span>
                )}
              </div>
            </div>

            <div className="panel" style={{ gridColumn: 'span 4' }}>
              <div className="h1"><Network size={20} className="text-tertiary" /> Exposed Crown Jewels</div>
              <div className="hero-num">{isDegraded ? '??' : '3'}</div>
              <div style={{ marginTop: 'auto', display: 'flex', gap: 'var(--space-2)' }}>
                {isDegraded ? (
                  <span className="badge badge-unknown">Incomplete Data</span>
                ) : (
                  <span className="badge badge-critical"><div className="status-dot critical"></div> 3 Requiring Triage</span>
                )}
              </div>
            </div>

            {/* ZONE: Middle-left - Top attack paths preview */}
            <div className="panel" style={{ gridColumn: 'span 7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <div className="h1" style={{ margin: 0 }}><Map size={20} className="text-tertiary" /> Active Attack Paths</div>
                {!isDegraded && <span className="badge badge-critical">3 High Risk</span>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {isDegraded ? (
                  <div style={{ 
                    textAlign: 'center', padding: 'var(--space-6)', 
                    border: '1px dashed var(--state-unknown-border)', 
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--state-unknown-bg)'
                  }}>
                    <Network size={32} color="var(--state-unknown-border)" style={{ margin: '0 auto var(--space-2)' }} />
                    <div style={{ fontWeight: 600, color: 'var(--state-unknown-text)' }}>Path Analysis Paused</div>
                    <div className="text-caption text-secondary">Insufficient sensor data to confidently calculate attack paths.</div>
                  </div>
                ) : (
                  <>
                    {/* Path 1 */}
                    <div className="interactive-row" onClick={() => setActiveView('attack-path')}>
                      <span className="badge badge-critical">P1</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1 }}>
                        <span className="text-body text-secondary">Eng_Workstation_01</span>
                        <ChevronRight size={14} className="text-tertiary" />
                        <span className="text-body text-secondary">Jump_Host_A</span>
                        <ChevronRight size={14} className="text-tertiary" />
                        <span className="text-body" style={{ color: 'var(--severity-critical-text)', fontWeight: 600 }}>Safety_PLC_Core</span>
                      </div>
                      <button className="btn-primary" style={{ padding: 'var(--space-1) var(--space-3)' }}>Investigate</button>
                    </div>
                    
                    {/* Path 2 */}
                    <div className="interactive-row" onClick={() => setActiveView('attack-path')}>
                      <span className="badge badge-high">P2</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1 }}>
                        <span className="text-body text-secondary">Vendor_VPN_Gateway</span>
                        <ChevronRight size={14} className="text-tertiary" />
                        <span className="text-body text-secondary">HMI_Server_2</span>
                        <ChevronRight size={14} className="text-tertiary" />
                        <span className="text-body" style={{ color: 'var(--severity-high-text)', fontWeight: 600 }}>Historian_DB</span>
                      </div>
                      <button className="btn-primary" style={{ padding: 'var(--space-1) var(--space-3)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)' }}>View</button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ZONE: Middle-right - Severity distribution + findings list */}
            <div className="panel" style={{ gridColumn: 'span 5' }}>
              <div className="h1"><LayoutList size={20} className="text-tertiary" /> Top Findings</div>
              
              <div style={{ display: 'flex', gap: '2px', marginBottom: 'var(--space-5)' }}>
                <div style={{ flex: 2, height: '8px', background: 'var(--severity-critical-border)', borderRadius: '4px 0 0 4px' }}></div>
                <div style={{ flex: 5, height: '8px', background: 'var(--severity-high-border)' }}></div>
                <div style={{ flex: 8, height: '8px', background: 'var(--severity-healthy-border)', borderRadius: '0 4px 4px 0' }}></div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                    <span className="text-body" style={{ fontWeight: 500 }}>Unpatched CVE-2023-XYZ</span>
                    <span className="text-caption text-secondary">Zone B • Asset: HMI_Server_2</span>
                  </div>
                  <span className="badge badge-critical">Critical</span>
                </div>
                
                <div style={{ height: '1px', background: 'var(--border-subtle)' }}></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                    <span className="text-body" style={{ fontWeight: 500 }}>Default credentials exposed</span>
                    <span className="text-caption text-secondary">Zone A • Asset: Switch_Core_01</span>
                  </div>
                  <span className="badge badge-high">High</span>
                </div>
              </div>
            </div>

            {/* ZONE: Bottom - Topology hotspots + recent changes */}
            <div className="panel" style={{ gridColumn: 'span 7' }}>
              <div className="h1">Topology & Unknown Assets</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
                <div style={{ padding: 'var(--space-4)', background: 'var(--bg-page)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div className="text-caption text-secondary" style={{ marginBottom: 'var(--space-2)' }}>Total Tracked Assets</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>1,492</div>
                </div>
                <div style={{ padding: 'var(--space-4)', background: 'var(--state-unknown-bg)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--state-unknown-border)' }}>
                  <div className="text-caption text-secondary" style={{ marginBottom: 'var(--space-2)' }}>Unidentified Assets</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--state-unknown-text)' }}>
                    {isDegraded ? 'Unknown' : '7'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="panel" style={{ gridColumn: 'span 5' }}>
              <div className="h1">Recent Activity</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <div className="status-dot healthy" style={{ marginTop: '6px' }}></div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="text-body">New connection established</span>
                    <span className="text-caption text-secondary">HMI-02 → DB-Core (Modbus TCP)</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <div className="status-dot critical" style={{ marginTop: '6px' }}></div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="text-body">Operator suppressed finding</span>
                    <span className="text-caption text-secondary">"Accepted risk for legacy PLC"</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : activeView === 'attack-path' ? (
          <AttackPathMap />
        ) : (
          <DesignSystem />
        )}
      </main>
    </div>
  );
}
