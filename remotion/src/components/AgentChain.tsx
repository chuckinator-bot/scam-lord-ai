/**
 * @module remotion/AgentChain
 * React Flow chain recreation. Edges and step names come from the agent floor.
 * Depends on: floor-layout, theme, fonts, chrome.
 * Used by: webhook, call, hardship, teaser.
 */

import { fontSans } from "../fonts";
import { AGENT_EDGES, edgeDotCenter, layoutChain, MAIN_PATH, STEP_LABEL, type INodeLayout } from "../floor-layout";
import type { TAgentStep } from "../../../src/lib/agent-floor/agents";
import { theme } from "../theme";
import { StatusBadge } from "./chrome";
import type { TStatus } from "../theme";

const DOT_RADIUS = 6;

function centerOf(node: INodeLayout, nodeWidth: number, nodeHeight: number): { x: number; y: number } {
    return { x: node.x + nodeWidth / 2, y: node.y + nodeHeight / 2 };
}

export function AgentChain({
    tenant,
    litThrough,
    active,
    showHandoff = true,
    nodeWidth = 168,
    gap = 28,
    badge,
}: {
    tenant: string;
    litThrough: number;
    active: TAgentStep | null;
    showHandoff?: boolean;
    nodeWidth?: number;
    gap?: number;
    badge?: TStatus;
}) {
    const nodeHeight = Math.round(nodeWidth * 0.54);
    const handoffY = nodeHeight + 16;
    const layout = layoutChain(nodeWidth, gap, handoffY).filter((node) => showHandoff || node.step !== "handoff");
    const width = (MAIN_PATH.length - 1) * (nodeWidth + gap) + nodeWidth;
    const height = showHandoff ? handoffY + nodeHeight : nodeHeight;
    const byStep = new Map(layout.map((node) => [node.step, node]));
    const labelSize = Math.max(18, Math.round(nodeWidth * 0.1));
    const nameSize = Math.max(16, Math.round(nodeWidth * 0.078));
    const dotX = edgeDotCenter(litThrough, nodeWidth, gap, DOT_RADIUS);
    const dotRow = byStep.get("invoice");

    return (
        <div style={ { fontFamily: fontSans, height, position: "relative", width } }>
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
                    const a = centerOf(from, nodeWidth, nodeHeight);
                    const b = centerOf(to, nodeWidth, nodeHeight);
                    const targetIndex = MAIN_PATH.indexOf(target);
                    const lit = target === "handoff"
                        ? active === "handoff"
                        : targetIndex >= 0 && litThrough >= targetIndex;
                    return (
                        <line
                            key={ `${source}-${target}` }
                            stroke={ lit ? theme.ink : theme.mintDeep }
                            strokeWidth={ lit ? 4 : 3 }
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
                            background: current ? theme.mint : theme.white,
                            border: `2px solid ${current || lit ? theme.ink : theme.mintDeep}`,
                            borderRadius: theme.radiusLg,
                            height: nodeHeight,
                            left: node.x,
                            opacity: lit || current ? 1 : 0.45,
                            padding: "14px 14px 12px",
                            position: "absolute",
                            top: node.y,
                            width: nodeWidth,
                        } }
                    >
                        <div
                            style={ {
                                color: theme.ink,
                                fontFamily: fontSans,
                                fontSize: labelSize,
                                fontWeight: 600,
                                lineHeight: "22px",
                            } }
                        >
                            { STEP_LABEL[node.step] }
                        </div>
                        <div
                            style={ {
                                color: theme.inkSoft,
                                fontFamily: fontSans,
                                fontSize: nameSize,
                                lineHeight: "22px",
                                marginTop: 6,
                            } }
                        >
                            { tenant }
                        </div>
                        { current && badge ? (
                            <div style={ { marginTop: 8 } }>
                                <StatusBadge status={ badge } />
                            </div>
                        ) : null }
                    </div>
                );
            }) }
            { dotX !== null && dotRow ? (
                <div
                    style={ {
                        background: theme.ink,
                        borderRadius: theme.radiusPill,
                        height: DOT_RADIUS * 2,
                        left: dotX - DOT_RADIUS,
                        position: "absolute",
                        top: dotRow.y + nodeHeight / 2 - DOT_RADIUS,
                        width: DOT_RADIUS * 2,
                    } }
                />
            ) : null }
        </div>
    );
}
