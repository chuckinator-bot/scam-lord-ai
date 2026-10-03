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
 * @param handoffY - Top of the handoff card. Kept close under the main row.
 * @returns One layout entry per AGENT_STEPS value. Handoff sits under Jev.
 */
export function layoutChain(nodeWidth: number, gap: number, handoffY = 108): INodeLayout[] {
    const nodes: INodeLayout[] = MAIN_PATH.map((step, index) => ({
        step,
        x: index * (nodeWidth + gap),
        y: 0,
    }));
    const jev = nodes.find((node) => node.step === "jev");
    nodes.push({
        step: "handoff",
        x: jev?.x ?? 0,
        y: handoffY,
    });
    return nodes;
}

/**
 * Center of the traveling dot, kept in the gap so it never covers a label.
 * @param litThrough - Progress along the main path, in node steps.
 * @param nodeWidth - Card width in pixels.
 * @param gap - Horizontal gap between cards.
 * @param radius - Dot radius in pixels.
 * @returns X position, or null once the dot would enter a card.
 */
export function edgeDotCenter(
    litThrough: number,
    nodeWidth: number,
    gap: number,
    radius: number,
): number | null {
    const segments = MAIN_PATH.length - 1;
    if (litThrough <= 0 || litThrough >= segments) {
        return null;
    }
    const index = Math.floor(litThrough);
    const along = litThrough - index;
    const rightEdge = index * (nodeWidth + gap) + nodeWidth;
    const leftEdge = (index + 1) * (nodeWidth + gap);
    const start = rightEdge + radius;
    const end = leftEdge - radius;
    if (end <= start) {
        return null;
    }
    return start + (end - start) * along;
}

export function nodeLabel(tenant: string, step: TAgentStep): string {
    return `${tenant} · ${STEP_LABEL[step]}`;
}

export { AGENT_EDGES, AGENT_STEPS };
