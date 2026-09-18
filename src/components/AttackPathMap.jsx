import React, { useState } from 'react';
import { 
  Network, Search, ZoomIn, ZoomOut, Maximize, Filter, X,
  Server, Shield, AlertTriangle, ShieldAlert, Cpu
} from 'lucide-react';

const NODES = [
  { id: 'n1', label: 'Vendor VPN Gateway', type: 'source', x: 50, y: 200, risk: 'high', icon: Network },
  { id: 'n2', label: 'Jump Host A', type: 'pivot', x: 300, y: 200, risk: 'critical', icon: Server },
  { id: 'n3', label: 'HMI Server 2', type: 'pivot', x: 550, y: 200, risk: 'high', icon: Server },
  { id: 'n4', label: 'Safety PLC Core', type: 'target', x: 800, y: 200, risk: 'critical', icon: Cpu },
  
  // Noise / Context Nodes
  { id: 'n5', label: 'Eng Workstation 04', type: 'unknown', x: 300, y: 350, risk: 'low', icon: Server, partial: true },
  { id: 'n6', label: '+12 Similar Workstations', type: 'cluster', x: 50, y: 350, risk: 'low', icon: Server }
];

const EDGES = [
  { id: 'e1', source: 'n1', target: 'n2', label: 'RDP (3389)', type: 'suspicious', confidence: 'high' },
  { id: 'e2', source: 'n2', target: 'n3', label: 'SMB (445)', type: 'suspicious', confidence: 'high' },
  { id: 'e3', source: 'n3', target: 'n4', label: 'Modbus TCP', type: 'critical', confidence: 'high' },
  
  // Noise edges
  { id: 'e4', source: 'n6', target: 'n5', label: 'SMB', type: 'normal', confidence: 'high' },
  { id: 'e5', source: 'n5', target: 'n2', label: 'RDP', type: 'normal', confidence: 'high' }
];

export default function AttackPathMap() {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isEmptyState, setIsEmptyState] = useState(false);
  const [isClusterExpanded, setIsClusterExpanded] = useState(false);
  const [showIsolateConfirm, setShowIsolateConfirm] = useState(false);

  // Helper to draw SVG lines connecting nodes
  const getEdgePath = (sourceId, targetId) => {
    const s = NODES.find(n => n.id === sourceId);
    const t = NODES.find(n => n.id === targetId);
    if (!s || !t) return '';
    
    // Calculate simple bezier curve connecting right side of source to left side of target
    const startX = s.x + 180; // node width approx
    const startY = s.y + 40;  // node height approx / 2
    const endX = t.x;
    const endY = t.y + 40;
    
    // Curvature
    const cp1x = startX + (endX - startX) / 2;
    const cp2x = startX + (endX - startX) / 2;
    
    return `M ${startX} ${startY} C ${cp1x} ${startY}, ${cp2x} ${endY}, ${endX} ${endY}`;
  };

  const selectedNode = NODES.find(n => n.id === selectedNodeId);

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden', backgroundColor: 'var(--bg-page)', position: 'relative' }}>
      
      {/* TOOLBAR CONTROLS (Top Left) */}
      <div style={{ position: 'absolute', top: 'var(--space-4)', left: 'var(--space-4)', zIndex: 10, display: 'flex', gap: 'var(--space-2)' }}>
        <div className="panel" style={{ padding: 'var(--space-2)', flexDirection: 'row', gap: 'var(--space-2)' }}>
          <button className="btn-primary" style={{ border: 'none', padding: '4px' }} title="Zoom In"><ZoomIn size={18} color="var(--text-secondary)"/></button>
          <button className="btn-primary" style={{ border: 'none', padding: '4px' }} title="Zoom Out"><ZoomOut size={18} color="var(--text-secondary)"/></button>
          <button className="btn-primary" style={{ border: 'none', padding: '4px' }} title="Fit to View"><Maximize size={18} color="var(--text-secondary)"/></button>
          <div style={{ width: '1px', backgroundColor: 'var(--border-strong)', margin: '0 var(--space-1)' }}></div>
          <button className="btn-primary" style={{ border: 'none', padding: '4px' }} title="Filter"><Filter size={18} color="var(--text-secondary)"/></button>
          <button className="btn-primary" style={{ border: 'none', padding: '4px' }} title="Search"><Search size={18} color="var(--text-secondary)"/></button>
        </div>
        <button className="btn-primary" style={{ background: 'var(--brand-focus-alpha)', borderColor: 'var(--brand-focus)', color: 'var(--brand-focus)' }}>
          Highlight Critical Path
        </button>
        <button className="btn-primary" onClick={() => setIsEmptyState(!isEmptyState)}>
          Toggle Empty State: {isEmptyState ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* LEGEND (Bottom Left) */}
      <div className="panel" style={{ position: 'absolute', bottom: 'var(--space-4)', left: 'var(--space-4)', zIndex: 10, width: '220px', padding: 'var(--space-3)' }}>
        <div className="text-caption text-secondary" style={{ marginBottom: 'var(--space-2)', fontWeight: 600 }}>GRAPH LEGEND</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', border: '2px solid var(--severity-critical-border)' }}></div>
            <span className="text-caption">Target / Crown Jewel</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid var(--severity-high-border)' }}></div>
            <span className="text-caption">Source / Pivot Node</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{ width: '20px', height: '2px', backgroundColor: 'var(--severity-critical-border)' }}></div>
            <span className="text-caption">Critical Path Edge</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{ width: '20px', height: '2px', borderTop: '2px dashed var(--text-secondary)' }}></div>
            <span className="text-caption">Normal/Noise Edge</span>
          </div>
        </div>
      </div>

      {/* MAIN GRAPH AREA (Canvas) */}
      <div style={{ flex: 1, position: 'relative', overflow: 'auto' }}>
        
        {isEmptyState ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
            <Network size={48} style={{ marginBottom: 'var(--space-4)', opacity: 0.5 }} />
            <h2 className="h1">No Attack Paths Found</h2>
            <p>The current filters or site selection yield zero active paths.</p>
          </div>
        ) : (
          <>
            {/* SVG Edges Layer */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '2000px', height: '1000px', pointerEvents: 'none' }}>
          <defs>
            <marker id="arrowhead-critical" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--severity-critical-border)" />
            </marker>
            <marker id="arrowhead-suspicious" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--severity-high-border)" />
            </marker>
            <marker id="arrowhead-normal" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--text-tertiary)" />
            </marker>
          </defs>

          {EDGES.map(edge => {
            const isSelectedPath = selectedNodeId === null || edge.source === selectedNodeId || edge.target === selectedNodeId;
            const opacity = isSelectedPath ? 1 : 0.2;
            
            let strokeColor = 'var(--text-tertiary)';
            let markerEnd = 'url(#arrowhead-normal)';
            let strokeDasharray = 'none';

            if (edge.type === 'critical') {
              strokeColor = 'var(--severity-critical-border)';
              markerEnd = 'url(#arrowhead-critical)';
            } else if (edge.type === 'suspicious') {
              strokeColor = 'var(--severity-high-border)';
              markerEnd = 'url(#arrowhead-suspicious)';
            } else if (edge.type === 'normal') {
              strokeDasharray = '4,4';
            }

            const pathData = getEdgePath(edge.source, edge.target);
            const sourceNode = NODES.find(n => n.id === edge.source);
            const targetNode = NODES.find(n => n.id === edge.target);
            
            // Calculate label position (midpoint of curve roughly)
            const midX = sourceNode && targetNode ? sourceNode.x + 180 + (targetNode.x - (sourceNode.x + 180)) / 2 : 0;
            const midY = sourceNode && targetNode ? sourceNode.y + 40 + (targetNode.y - sourceNode.y) / 2 : 0;

            return (
              <g key={edge.id} style={{ opacity, transition: 'opacity 0.3s' }}>
                <path 
                  d={pathData} 
                  fill="none" 
                  stroke={strokeColor} 
                  strokeWidth="2" 
                  strokeDasharray={strokeDasharray}
                  markerEnd={markerEnd} 
                />
                <rect x={midX - 40} y={midY - 22} width="80" height="24" rx="4" fill="var(--bg-page)" stroke={strokeColor} strokeWidth="1" />
                <text x={midX} y={midY - 5} fill="var(--text-primary)" fontSize="10" textAnchor="middle" fontWeight="600">{edge.label}</text>
              </g>
            );
          })}
        </svg>

        {/* HTML Nodes Layer */}
        {NODES.map(node => {
          const isSelected = selectedNodeId === node.id;
          const isDimmed = selectedNodeId !== null && !isSelected;
          
          let borderColor = 'var(--border-strong)';
          let badgeClass = 'badge-healthy';
          let shapeRadius = 'var(--radius-md)';
          
          if (node.type === 'target') {
            borderColor = 'var(--severity-critical-border)';
            badgeClass = 'badge-critical';
            shapeRadius = '2px'; // Square for targets
          } else if (node.risk === 'critical') {
            borderColor = 'var(--severity-critical-border)';
            badgeClass = 'badge-critical';
          } else if (node.risk === 'high') {
            borderColor = 'var(--severity-high-border)';
            badgeClass = 'badge-high';
          }

          if (node.type === 'cluster' || node.type === 'unknown') {
            borderColor = 'var(--state-unknown-border)';
            badgeClass = 'badge-unknown';
          }

          const Icon = node.icon;

          return (
            <div 
              key={node.id}
              tabIndex={0}
              onClick={() => {
                if (node.type === 'cluster') {
                  setIsClusterExpanded(!isClusterExpanded);
                  setSelectedNodeId(null);
                } else {
                  setSelectedNodeId(isSelected ? null : node.id);
                  setShowIsolateConfirm(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (node.type === 'cluster') {
                    setIsClusterExpanded(!isClusterExpanded);
                    setSelectedNodeId(null);
                  } else {
                    setSelectedNodeId(isSelected ? null : node.id);
                    setShowIsolateConfirm(false);
                  }
                }
              }}
              style={{
                position: 'absolute',
                left: node.x,
                top: node.y,
                width: '180px',
                height: '80px',
                backgroundColor: isSelected ? 'var(--bg-panel-active)' : 'var(--bg-panel)',
                border: `2px solid ${isSelected ? 'var(--brand-focus)' : borderColor}`,
                borderRadius: shapeRadius,
                padding: 'var(--space-3)',
                cursor: 'pointer',
                opacity: isDimmed ? 0.3 : 1,
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isSelected ? '0 0 0 4px var(--brand-focus-alpha)' : 'none',
                borderStyle: node.type === 'cluster' ? 'dashed' : 'solid'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Icon size={16} color="var(--text-secondary)" />
                <span className="text-body" style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {node.label}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${badgeClass}`} style={{ fontSize: '10px' }}>
                  {node.type.toUpperCase()}
                </span>
                {node.type !== 'cluster' && <span className="text-caption text-secondary">ID: {node.partial ? 'Unknown' : node.id}</span>}
              </div>
            </div>
          );
        })}

        {/* Cluster Expansion Popover */}
        {isClusterExpanded && (
          <div className="panel" style={{ position: 'absolute', top: 440, left: 50, width: '250px', zIndex: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
              <span className="text-body" style={{ fontWeight: 600 }}>Clustered Assets (12)</span>
              <X size={16} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setIsClusterExpanded(false)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {['Eng_WS_05', 'Eng_WS_06', 'Eng_WS_07', '...9 more'].map((name, i) => (
                <div key={i} className="text-caption text-secondary" style={{ padding: 'var(--space-2)', background: 'var(--bg-page)', borderRadius: 'var(--radius-sm)' }}>
                  {name}
                </div>
              ))}
            </div>
          </div>
        )}
        </>
        )}
      </div>

      {/* STEP 4: INVESTIGATION SIDE PANEL */}
      {selectedNode && (
        <div style={{ 
          width: '400px', 
          backgroundColor: 'var(--bg-panel)', 
          borderLeft: '1px solid var(--border-strong)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.5)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          {/* Panel Header */}
          <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                <span className="badge badge-high">{selectedNode.type}</span>
                <span className="text-caption text-secondary">Asset Details</span>
              </div>
              <div className="h1" style={{ margin: 0 }}>{selectedNode.label}</div>
            </div>
            <button onClick={() => setSelectedNodeId(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Panel Content (Scrollable) */}
          <div style={{ padding: 'var(--space-4)', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            
            {/* Why it matters */}
            <div>
              <h3 className="text-body text-secondary" style={{ marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Why it matters</h3>
              <p className="text-body" style={{ lineHeight: 1.6 }}>
                {selectedNode.type === 'target' 
                  ? "This is a critical physical safety controller (Crown Jewel). A compromise here could lead to direct physical damage or safety hazards."
                  : "This node acts as a primary pivot point. An attacker who compromises this asset gains direct routing access to the ICS restricted zone."}
              </p>
            </div>

            {/* Evidence & Vulnerabilities */}
            <div>
              <h3 className="text-body text-secondary" style={{ marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Evidence & Vulnerabilities</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div style={{ background: 'var(--bg-page)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                    <span className="text-body" style={{ fontWeight: 600 }}>Unpatched Service (SMB)</span>
                    <span className="badge badge-critical">CVE-2020-1472</span>
                  </div>
                  <span className="text-caption text-secondary">Exploitable via ZeroLogon. High confidence.</span>
                </div>
                <div style={{ background: 'var(--bg-page)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                    <span className="text-body" style={{ fontWeight: 600 }}>Suspicious RDP Login</span>
                    <span className="badge badge-high">Anomaly</span>
                  </div>
                  <span className="text-caption text-secondary">First-time login from Vendor VPN gateway.</span>
                </div>
              </div>
            </div>

            {/* Path Context */}
            <div>
              <h3 className="text-body text-secondary" style={{ marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Path Context</h3>
              <div className="panel" style={{ background: 'var(--bg-page)', padding: 'var(--space-3)', gap: 'var(--space-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-caption text-secondary">Inbound Exposure</span>
                  <span className="text-body" style={{ color: 'var(--severity-critical-border)', fontWeight: 600 }}>1 Critical</span>
                </div>
                <div style={{ height: '1px', background: 'var(--border-subtle)' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-caption text-secondary">Outbound Reach</span>
                  <span className="text-body" style={{ fontWeight: 600 }}>4 Assets</span>
                </div>
              </div>
            </div>

          </div>

          {/* Panel Footer (Actions) */}
          <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {showIsolateConfirm ? (
              <div style={{ padding: 'var(--space-3)', background: 'var(--severity-critical-bg)', border: '1px solid var(--severity-critical-border)', borderRadius: 'var(--radius-sm)' }}>
                <div className="text-body" style={{ color: 'var(--severity-critical-text)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Confirm Isolation?</div>
                <div className="text-caption text-secondary" style={{ marginBottom: 'var(--space-3)' }}>This will sever network connections for this asset. Operations may be impacted.</div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn-primary" style={{ flex: 1, background: 'var(--severity-critical-border)', color: '#fff', border: 'none' }} onClick={() => setShowIsolateConfirm(false)}>Confirm</button>
                  <button className="btn-primary" style={{ flex: 1, color: 'var(--text-primary)', border: '1px solid var(--border-strong)' }} onClick={() => setShowIsolateConfirm(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button className="btn-primary" style={{ flex: 1, background: 'var(--brand-focus)', color: '#fff', fontWeight: 600 }} onClick={() => setShowIsolateConfirm(true)}>Isolate Asset</button>
                <button className="btn-primary" style={{ flex: 1, border: '1px solid var(--border-strong)', color: 'var(--text-primary)' }}>View Full Log</button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Required for slide animation */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
