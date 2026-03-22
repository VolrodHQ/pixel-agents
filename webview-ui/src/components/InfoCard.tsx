import type { AgentMetricsData } from '../hooks/useExtensionMessages.js';

interface InfoCardProps {
  agentId: number;
  metrics: AgentMetricsData | null;
  isActive: boolean;
  isWaiting: boolean;
  screenX: number;
  screenY: number;
  containerWidth: number;
  containerHeight: number;
  onClose: () => void;
}

function toTitleCase(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

const CARD_W = 220;
const CARD_H = 220;

export function InfoCard({
  agentId,
  metrics,
  isActive,
  isWaiting,
  screenX,
  screenY,
  containerWidth,
  containerHeight,
  onClose,
}: InfoCardProps) {
  // Flip horizontally/vertically if near edges
  const flipX = screenX + CARD_W + 16 > containerWidth;
  const flipY = screenY + CARD_H + 16 > containerHeight;

  const left = flipX ? screenX - CARD_W - 8 : screenX + 8;
  const top = flipY ? screenY + 8 : screenY - CARD_H - 8;

  const agentType = metrics?.agentType ? toTitleCase(metrics.agentType) : `Agent #${agentId}`;
  const statusText = isActive ? 'Active' : isWaiting ? 'Waiting' : 'Idle';
  const statusColor = isActive
    ? 'var(--vscode-charts-blue, #3794ff)'
    : isWaiting
      ? 'var(--vscode-charts-yellow, #cca700)'
      : 'var(--vscode-foreground)';

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: CARD_W,
        background: 'var(--pixel-bg, #1e1e2e)',
        border: '2px solid var(--pixel-border, #444)',
        boxShadow: 'var(--pixel-shadow, 4px 4px 0 #000)',
        zIndex: 50,
        fontFamily: 'var(--vscode-editor-font-family, monospace)',
        fontSize: '18px',
        color: 'var(--vscode-foreground)',
        pointerEvents: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '4px 8px',
          background: 'var(--pixel-accent, #7c6f64)',
          borderBottom: '2px solid var(--pixel-border, #444)',
        }}
      >
        <span
          style={{
            fontWeight: 'bold',
            fontSize: '16px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}
        >
          {agentType}
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--vscode-foreground)',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '0 0 0 6px',
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Status */}
        <Row label="Status">
          <span style={{ color: statusColor }}>● {statusText}</span>
        </Row>

        {/* Model */}
        {metrics?.model && <Row label="Model">{metrics.model.replace('claude-', '')}</Row>}

        {/* Team */}
        {metrics?.teamName && <Row label="Team">{metrics.teamName}</Row>}

        {/* Tokens */}
        <Row label="Tokens">{formatTokens(metrics?.totalTokens ?? 0)}</Row>

        {/* Current task */}
        {metrics?.currentTask && (
          <div style={{ marginTop: 2 }}>
            <div style={{ color: 'var(--vscode-descriptionForeground)', fontSize: '15px' }}>
              Task:
            </div>
            <div
              style={{
                fontSize: '15px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: CARD_W - 16,
              }}
            >
              {metrics.currentTask}
            </div>
          </div>
        )}

        {/* Relationships */}
        {metrics?.relationships && metrics.relationships.length > 0 && (
          <div style={{ marginTop: 2 }}>
            <div style={{ color: 'var(--vscode-descriptionForeground)', fontSize: '15px' }}>
              Talks to:
            </div>
            {metrics.relationships.slice(0, 4).map((r) => (
              <div key={r} style={{ fontSize: '15px', paddingLeft: 4 }}>
                → {toTitleCase(r)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
      <span style={{ color: 'var(--vscode-descriptionForeground)', flexShrink: 0 }}>{label}:</span>
      <span
        style={{
          textAlign: 'right',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </span>
    </div>
  );
}
