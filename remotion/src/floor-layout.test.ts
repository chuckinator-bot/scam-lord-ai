/**
 * @module remotion/floor-layout.test
 * The video chain stays tied to the agent floor graph.
 * Depends on: floor-layout, agents.
 * Used by: vitest.
 */

import { describe, expect, it } from "vitest";
import { AGENT_EDGES, AGENT_STEPS } from "../../src/lib/agent-floor/agents";
import {
    chainSideMargin,
    branchConnector,
    edgeConnector,
    edgeDotCenter,
    HERO_GAP,
    HERO_NODE_WIDTH,
    layoutChain,
    MAIN_PATH,
    nodeLabel,
    STEP_LABEL,
} from "./floor-layout";

describe("agent floor layout", () => {
    it("follows the main-path edges from the app", () => {
        for (let index = 0; index < MAIN_PATH.length - 1; index += 1) {
            const source = MAIN_PATH[index];
            const target = MAIN_PATH[index + 1];
            expect(AGENT_EDGES).toContainEqual([source, target]);
        }
        expect(AGENT_EDGES).toContainEqual(["jev", "handoff"]);
    });

    it("places every agent step on one row, handoff after paid", () => {
        const layout = layoutChain(160, 20);
        expect(layout.map((node) => node.step)).toEqual([...AGENT_STEPS]);
        const paid = layout.find((node) => node.step === "paid");
        const handoff = layout.find((node) => node.step === "handoff");
        expect(handoff?.y).toBe(0);
        expect(handoff?.x).toBe((paid?.x ?? 0) + 160 + 20);
    });

    it("keeps the traveling dot in the gap before the paid card", () => {
        const nodeWidth = 100;
        const gap = 40;
        const radius = 8;
        const paidLeft = 7 * (nodeWidth + gap);
        const mid = edgeDotCenter(6.5, nodeWidth, gap, radius);
        expect(mid).not.toBeNull();
        expect((mid ?? 0) + radius).toBeLessThan(paidLeft);
        expect(edgeDotCenter(7.2, nodeWidth, gap, radius)).toBeNull();
    });

    it("leaves at least 64px on each side of the hero chain", () => {
        expect(chainSideMargin(HERO_NODE_WIDTH, HERO_GAP)).toBeGreaterThanOrEqual(64);
        expect(HERO_NODE_WIDTH).toBe(168);
    });

    it("stops main-path connectors on the card edges", () => {
        const nodeWidth = 156;
        const gap = 16;
        const nodeHeight = 84;
        const layout = layoutChain(nodeWidth, gap);
        const plan = layout.find((node) => node.step === "plan");
        const link = layout.find((node) => node.step === "payment_link");
        const paid = layout.find((node) => node.step === "paid");
        const toLink = edgeConnector(plan!, link!, nodeWidth, nodeHeight);
        const toPaid = edgeConnector(link!, paid!, nodeWidth, nodeHeight);
        expect(toLink.x1).toBeGreaterThanOrEqual((plan?.x ?? 0) + nodeWidth);
        expect(toLink.x2).toBeLessThanOrEqual(link?.x ?? 0);
        expect(toPaid.x1).toBeGreaterThanOrEqual((link?.x ?? 0) + nodeWidth);
        expect(toPaid.x2).toBeLessThanOrEqual(paid?.x ?? 0);
        expect(toLink.x2).toBeGreaterThan(toLink.x1);
        expect(toLink.y1).toBe(nodeHeight / 2);
    });

    it("routes the handoff connector under the row and outside the cards", () => {
        const layout = layoutChain(HERO_NODE_WIDTH, HERO_GAP);
        const jev = layout.find((node) => node.step === "jev");
        const handoff = layout.find((node) => node.step === "handoff");
        const nodeHeight = 80;
        const edge = branchConnector(jev!, handoff!, HERO_NODE_WIDTH, nodeHeight);
        expect(edge.x1).toBeGreaterThanOrEqual((jev?.x ?? 0) + HERO_NODE_WIDTH);
        expect(edge.x2).toBeLessThanOrEqual(handoff?.x ?? 0);
        expect(edge.ySpan).toBeGreaterThan(nodeHeight);
        expect(edge.y1).toBeLessThan(edge.ySpan);
    });

    it("labels a node the way the floor does", () => {
        expect(nodeLabel("John Smith", "invoice")).toBe("John Smith · Stripe invoice");
        expect(STEP_LABEL.handoff).toBe("Handoff");
        expect(Object.keys(STEP_LABEL).sort()).toEqual([...AGENT_STEPS].sort());
    });
});
