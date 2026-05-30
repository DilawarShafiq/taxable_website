export type AgentType =
  | "tax_advisor"
  | "document_analyzer"
  | "compliance_monitor"
  | "market_analyst"
  | "general";

export interface AgentMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AgentContext {
  jurisdictions: string[];
  businessType?: string;
  companyName?: string;
  clientName?: string;
  agentType: AgentType;
}

export interface RoutingDecision {
  agent: AgentType;
  reasoning: string;
}
