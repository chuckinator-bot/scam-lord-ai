/**
 * @module remotion/floor-layout
 * Positions for the agent-floor chain. Step order and edges come from the app.
 * Depends on: src/lib/agent-floor/agents.
 * Used by: AgentChain, tests.
 */

import {
    AGENT_EDGES,
    AGENT_STEPS,
    type TAgentStep,
} from "../../src/lib/agent-floor/agents";

/** Labels match build-floor-graph STEP_LABEL. */
export const STEP_LABEL: Record<TAgentStep, string> = {
    invoice: "Stripe invoice",
    workflow_start: "Workflow start",
    disclosure: "Disclosure",
    jev: "Jev check",
    policy: "Policy",
    plan: "Stripe plan",
    payment_link: "Payment link",
    paid: "Paid",
    handoff: "Handoff",
};

/** Main path. Handoff is the other ending off Jev, matching AGENT_EDGES. */
export const MAIN_PATH: readonly TAgentStep[] = [
    "invoice",
    "workflow_start",
    "disclosure",
    "jev",
    "policy",
    "plan",
    "payment_link",
    "paid",
];

export interface INodeLayout {
    step: TAgentStep;
    x: number;
    y: number;
}

/**
 * @param nodeWidth - Card width in pixels.
 * @param gap - Horizontal gap between main-path cards.
 * @returns One layout entry per AGENT_STEPS value. Handoff sits under Jev.
 */
export function layoutChain(nodeWidth: number, gap: number): INodeLayout[] {
    const nodes: INodeLayout[] = MAIN_PATH.map((step, index) => ({
        step,
        x: index * (nodeWidth + gap),
        y: 0,
    }));
    const jev = nodes.find((node) => node.step === "jev");
    nodes.push({
        step: "handoff",
        x: jev?.x ?? 0,
        y: nodeWidth * 0.78,
    });
    return nodes;
}

export function nodeLabel(tenant: string, step: TAgentStep): string {
    return `${tenant} · ${STEP_LABEL[step]}`;
}

export { AGENT_EDGES, AGENT_STEPS };
