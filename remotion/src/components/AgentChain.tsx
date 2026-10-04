/**
 * @module remotion/AgentChain
 * React Flow chain recreation. Edges and step names come from the agent floor.
 * Depends on: floor-layout, theme, fonts, chrome.
 * Used by: webhook, call, hardship, teaser.
 */

import { fontSans } from "../fonts";
import {
    AGENT_EDGES,
    branchConnector,
    edgeConnector,
    edgeDotCenter,
    layoutChain,
    MAIN_PATH,
    STEP_LABEL,
} from "../floor-layout";
import type { TAgentStep } from "../../../src/lib/agent-floor/agents";
import { theme } from "../theme";
import { StatusBadge } from "./chrome";
import type { TStatus } from "../theme";

const DOT_RADIUS = 6;

export function AgentChain({
    tenant,
    litThrough,
    active,
    showHandoff = true,
    nodeWidth = 168,
    gap = 28,
    badge,
    floor = false,
    labels,
}: {
    tenant: string;
    litThrough: number;
    active: TAgentStep | null;
    showHandoff?: boolean;
    nodeWidth?: number;
    gap?: number;
    badge?: TStatus;
    /** StepNode chrome: current step uses the ring, other steps stay on the card border. */
    floor?: boolean;
    /** Optional on-screen names. Omitted steps keep STEP_LABEL. */
    labels?: Partial<Record<TAgentStep, string>>;
}) {
    const nodeHeight = Math.max(72, Math.round(nodeWidth * 0.46));
    const layout = layoutChain(nodeWidth, gap).filter((node) => showHandoff || node.step !== "handoff");
    const width = Math.max(...layout.map((node) => node.x)) + nodeWidth;
    const height = nodeHeight + (showHandoff ? 28 : 0);
    const byStep = new Map(layout.map((node) => [node.step, node]));
    const labelSize = Math.max(18, Math.round(nodeWidth * 0.1));
    const nameSize = Math.max(16, Math.round(nodeWidth * 0.078));
    const dotX = edgeDotCenter(litThrough, nodeWidth, gap, DOT_RADIUS);
    const dotRow = byStep.get("invoice");
    const arrowId = `chain-arrow-${nodeWidth}`;
    const arrowMutedId = `chain-arrow-muted-${nodeWidth}`;

    return (
        <div style={ { fontFamily: fontSans, height, position: "relative", width } }>
            <svg
                height={ height }
                style={ { left: 0, position: "absolute", top: 0 } }
                width={ width }
            >
                <defs>
                    <marker
                        id={ arrowId }
                        markerHeight="8"
                        markerWidth="8"
                        orient="auto"
                        refX="7"
                        refY="4"
                    >
                        <path
                            d="M0,0 L8,4 L0,8 Z"
                            fill={ theme.ink }
                        />
                    </marker>
                    <marker
                        id={ arrowMutedId }
                        markerHeight="8"
                        markerWidth="8"
                        orient="auto"
                        refX="7"
                        refY="4"
                    >
                        <path
                            d="M0,0 L8,4 L0,8 Z"
                            fill={ theme.mintDeep }
                        />
                    </marker>
                </defs>
                { AGENT_EDGES.map(([source, target]) => {
                    const from = byStep.get(source);
                    const to = byStep.get(target);
                    if (!from || !to) {
                        return null;
                    }
                    const targetIndex = MAIN_PATH.indexOf(target);
                    const lit = target === "handoff"
                        ? active === "handoff"
                        : targetIndex >= 0 && litThrough >= targetIndex;
                    const stroke = lit ? theme.ink : theme.mintDeep;
                    const marker = lit ? `url(#${arrowId})` : `url(#${arrowMutedId})`;
                    if (target === "handoff") {
                        const branch = branchConnector(from, to, nodeWidth, nodeHeight);
                        return (
                            <polyline
                                fill="none"
                                key={ `${source}-${target}` }
                                markerEnd={ marker }
                                points={ `${branch.x1},${branch.y1} ${branch.x1},${branch.ySpan} ${branch.x2},${branch.ySpan} ${branch.x2},${branch.y2}` }
                                stroke={ stroke }
                                strokeWidth={ lit ? 3 : 2 }
                            />
                        );
                    }
                    const ends = edgeConnector(from, to, nodeWidth, nodeHeight);
                    return (
                        <line
                            key={ `${source}-${target}` }
                            markerEnd={ marker }
                            stroke={ stroke }
                            strokeWidth={ lit ? 3 : 2 }
                            x1={ ends.x1 }
                            x2={ ends.x2 }
                            y1={ ends.y1 }
                            y2={ ends.y2 }
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
                            background: theme.white,
                            border: current
                                ? `2px solid ${theme.violet}`
                                : `1px solid ${floor || !lit ? theme.border : theme.ink}`,
                            borderRadius: theme.radiusMd,
                            boxShadow: "0 1px 2px rgba(16, 36, 27, 0.08)",
                            height: nodeHeight,
                            left: node.x,
                            padding: "12px 14px 10px",
                            position: "absolute",
                            top: node.y,
                            width: nodeWidth,
                        } }
                    >
                        <div
                            style={ {
                                background: theme.mutedInk,
                                border: `1px solid ${theme.border}`,
                                borderRadius: theme.radiusPill,
                                height: 10,
                                left: -5,
                                position: "absolute",
                                top: nodeHeight / 2 - 5,
                                width: 10,
                            } }
                        />
                        <div
                            style={ {
                                background: theme.mutedInk,
                                border: `1px solid ${theme.border}`,
                                borderRadius: theme.radiusPill,
                                height: 10,
                                position: "absolute",
                                right: -5,
                                top: nodeHeight / 2 - 5,
                                width: 10,
                            } }
                        />
                        <div
                            style={ {
                                color: theme.mutedInk,
                                fontFamily: fontSans,
                                fontSize: nameSize,
                                fontWeight: 600,
                                letterSpacing: 1.1,
                                lineHeight: nameSize > 18 ? `${Math.round(nameSize * 1.15)}px` : "16px",
                                textTransform: "uppercase",
                            } }
                        >
                            { tenant }
                        </div>
                        <div
                            style={ {
                                color: theme.ink,
                                fontFamily: fontSans,
                                fontSize: labelSize,
                                fontWeight: current ? 600 : 500,
                                lineHeight: labelSize > 20 ? `${Math.round(labelSize * 1.2)}px` : "20px",
                                marginTop: 4,
                            } }
                        >
                            { labels?.[node.step] ?? STEP_LABEL[node.step] }
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
