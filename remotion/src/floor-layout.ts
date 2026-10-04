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

/** Nine step cards, matching the React Flow pitch, with room for a 64px side margin. */
export const HERO_NODE_WIDTH = 168;
export const HERO_GAP = 20;
export const FRAME_WIDTH = 1920;

export function chainWidth(nodeWidth: number, gap: number, count = AGENT_STEPS.length): number {
    return (count - 1) * (nodeWidth + gap) + nodeWidth;
}

export function chainSideMargin(nodeWidth: number, gap: number, frameWidth = FRAME_WIDTH): number {
    return (frameWidth - chainWidth(nodeWidth, gap)) / 2;
}

export interface IConnector {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}

/**
 * Horizontal edge from the right edge of the source card to the left edge of the target.
 * Both ends sit just outside the cards, so the stroke does not enter either card.
 * @param from - Source card layout.
 * @param to - Target card layout.
 * @param nodeWidth - Card width in pixels.
 * @param nodeHeight - Card height in pixels.
 */
export function edgeConnector(
    from: INodeLayout,
    to: INodeLayout,
    nodeWidth: number,
    nodeHeight: number,
): IConnector {
    const inset = 2;
    return {
        x1: from.x + nodeWidth + inset,
        x2: to.x - inset,
        y1: from.y + nodeHeight / 2,
        y2: to.y + nodeHeight / 2,
    };
}

export interface IBranchConnector extends IConnector {
    /** Y of the run that passes under the row, outside every card. */
    readonly ySpan: number;
}

/**
 * Jev to Handoff when Handoff sits at the end of the row.
 * The run leaves Jev at its right edge, passes under the cards, and enters Handoff at its left edge.
 * @param from - Jev card layout.
 * @param to - Handoff card layout.
 * @param nodeWidth - Card width in pixels.
 * @param nodeHeight - Card height in pixels.
 */
export function branchConnector(
    from: INodeLayout,
    to: INodeLayout,
    nodeWidth: number,
    nodeHeight: number,
): IBranchConnector {
    const inset = 2;
    const y = from.y + nodeHeight / 2;
    return {
        x1: from.x + nodeWidth + inset,
        x2: to.x - inset,
        y1: y,
        y2: to.y + nodeHeight / 2,
        ySpan: Math.max(from.y, to.y) + nodeHeight + 14,
    };
}

/**
 * @param nodeWidth - Card width in pixels.
 * @param gap - Horizontal gap between cards.
 * @returns One layout entry per AGENT_STEPS value, left to right, including Handoff.
 */
export function layoutChain(nodeWidth: number, gap: number): INodeLayout[] {
    return AGENT_STEPS.map((step, index) => ({
        step,
        x: index * (nodeWidth + gap),
        y: 0,
    }));
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
