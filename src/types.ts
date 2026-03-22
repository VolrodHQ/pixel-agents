import type * as vscode from 'vscode';

export interface AgentMetrics {
  totalInputTokens: number;
  totalOutputTokens: number;
  model: string | null;
  teamName: string | null;
  agentType: string | null;
  agentDescription: string | null;
  relationships: Set<string>; // agentTypes communicated via SendMessage
  currentTask: string | null; // from last TaskUpdate
  taskStatus: string | null;
}

export function createEmptyMetrics(): AgentMetrics {
  return {
    totalInputTokens: 0,
    totalOutputTokens: 0,
    model: null,
    teamName: null,
    agentType: null,
    agentDescription: null,
    relationships: new Set(),
    currentTask: null,
    taskStatus: null,
  };
}

export interface AgentState {
  id: number;
  terminalRef: vscode.Terminal | null; // null for file-based subagents
  projectDir: string;
  jsonlFile: string;
  fileOffset: number;
  lineBuffer: string;
  activeToolIds: Set<string>;
  activeToolStatuses: Map<string, string>;
  activeToolNames: Map<string, string>;
  activeSubagentToolIds: Map<string, Set<string>>; // parentToolId → active sub-tool IDs
  activeSubagentToolNames: Map<string, Map<string, string>>; // parentToolId → (subToolId → toolName)
  isWaiting: boolean;
  permissionSent: boolean;
  hadToolsInTurn: boolean;
  /** Workspace folder name (only set for multi-root workspaces) */
  folderName?: string;
  /** Metrics accumulated from JSONL: tokens, model, task, relationships */
  metrics: AgentMetrics;
  /** True for subagents discovered on disk (no own terminal) */
  isFileSubagent: boolean;
  /** ID of the parent session agent (for file-based subagents) */
  parentSessionAgentId: number | null;
}

export interface PersistedAgent {
  id: number;
  terminalName: string;
  jsonlFile: string;
  projectDir: string;
  /** Workspace folder name (only set for multi-root workspaces) */
  folderName?: string;
  agentType?: string;
  agentDescription?: string;
}
