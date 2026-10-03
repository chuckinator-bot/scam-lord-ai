/**
 * @module remotion/AgentChain
 * React Flow chain recreation. Edges and step names come from the agent floor.
 * Depends on: floor-layout, theme, fonts, chrome.
 * Used by: webhook, call, hardship, teaser.
 */

import { fontSans } from "../fonts";
import { AGENT_EDGES, layoutChain, MAIN_PATH, STEP_LABEL, type INodeLayout } from "../floor-layout";
import type { TAgentStep } from "../../../src/lib/agent-floor/agents";
import { theme } from "../theme";
import { StatusBadge } from "./chrome";
import type { TStatus } from "../theme";

const NODE_H = 88;

function centerOf(node: INodeLayout, nodeWidth: number): { x: number; y: number } {
    return { x: node.x + nodeWidth / 2, y: node.y + NODE_H / 2 };
}

export function AgentChain({
    tenant,
    litThrough,
    active,
    showHandoff = true,
    nodeWidth = 168,
    badge,
}: {
    tenant: string;
    litThrough: number;
    active: TAgentStep | null;
    showHandoff?: boolean;
    nodeWidth?: number;
    badge?: TStatus;
}) {
    const gap = 16;
    const layout = layoutChain(nodeWidth, gap).filter((node) => showHandoff || node.step !== "handoff");
    const width = (MAIN_PATH.length - 1) * (nodeWidth + gap) + nodeWidth;
    const height = showHandoff ? NODE_H + nodeWidth * 0.78 + 8 : NODE_H;
    const byStep = new Map(layout.map((node) => [node.step, node]));

    return (
        <div style={ { height, position: "relative", width } }>
            <svg
                height={ height }
                style={ { left: 0, position: "absolute", top: 0 } }
                width={ width }
            >
                { AGENT_EDGES.map(([source, target]) => {
                    const from = byStep.get(source);
                    const to = byStep.get(target);
                    if (!from || !to) {
                        return null;
                    }
                    const a = centerOf(from, nodeWidth);
                    const b = centerOf(to, nodeWidth);
                    const targetIndex = MAIN_PATH.indexOf(target);
                    const lit = target === "handoff"
                        ? active === "handoff"
                        : targetIndex >= 0 && litThrough >= targetIndex;
                    return (
                        <line
                            key={ `${source}-${target}` }
                            stroke={ lit ? theme.violet : theme.borderStrong }
                            strokeWidth={ lit ? 3 : 2 }
                            x1={ a.x }
                            x2={ b.x }
                            y1={ a.y }
                            y2={ b.y }
                        />
                    );
                }) }
            </svg>
            { layout.map((node) => {
                const index = MAIN_PATH.indexOf(node.step);
                const lit = node.step === "handoff"
                    ? active === "handoff"
                    : index >= 0 && litThrough >= index + 0.15;
                const current = node.step === active;
                return (
                    <div
                        key={ node.step }
                        style={ {
                            background: current ? theme.activeBg : theme.surface,
                            border: current
                                ? `2px solid ${theme.violet}`
                                : `1px solid ${lit ? theme.borderStrong : theme.border}`,
                            borderRadius: theme.radiusLg,
                            height: NODE_H,
                            left: node.x,
                            opacity: lit || current ? 1 : 0.4,
                            padding: "12px 12px 10px",
                            position: "absolute",
                            top: node.y,
                            width: nodeWidth,
                        } }
                    >
                        <div
                            style={ {
                                color: theme.ink,
                                fontFamily: fontSans,
                                fontSize: 15,
                                fontWeight: 600,
                                lineHeight: "18px",
                            } }
                        >
                            { STEP_LABEL[node.step] }
                        </div>
                        <div
                            style={ {
                                color: theme.mutedInk,
                                fontFamily: fontSans,
                                fontSize: 13,
                                lineHeight: "18px",
                                marginTop: 4,
                            } }
                        >
                            { tenant }
                        </div>
                        { current && badge ? (
                            <div style={ { marginTop: 6 } }>
                                <StatusBadge status={ badge } />
                            </div>
                        ) : null }
                    </div>
                );
            }) }
            { litThrough > 0 && litThrough < MAIN_PATH.length ? (
                <Pulse
                    litThrough={ litThrough }
                    nodeWidth={ nodeWidth }
                    nodes={ byStep }
                />
            ) : null }
        </div>
    );
}

function Pulse({
    litThrough,
    nodeWidth,
    nodes,
}: {
    litThrough: number;
    nodeWidth: number;
    nodes: Map<TAgentStep, INodeLayout>;
}) {
    const index = Math.min(MAIN_PATH.length - 1, Math.max(0, litThrough));
    const fromStep = MAIN_PATH[Math.floor(index)] ?? "invoice";
    const toStep = MAIN_PATH[Math.min(MAIN_PATH.length - 1, Math.floor(index) + 1)] ?? fromStep;
    const fromNode = nodes.get(fromStep);
    const toNode = nodes.get(toStep);
    if (!fromNode || !toNode) {
        return null;
    }
    const blend = index - Math.floor(index);
    const a = centerOf(fromNode, nodeWidth);
    const b = centerOf(toNode, nodeWidth);
    const x = a.x + (b.x - a.x) * blend;
    const y = a.y + (b.y - a.y) * blend;
    return (
        <div
            style={ {
                background: theme.violet,
                borderRadius: theme.radiusPill,
                height: 16,
                left: x - 8,
                position: "absolute",
                top: y - 8,
                width: 16,
            } }
        />
    );
}
