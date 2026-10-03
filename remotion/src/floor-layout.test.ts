/**
 * @module remotion/floor-layout.test
 * The video chain stays tied to the agent floor graph.
 * Depends on: floor-layout, agents.
 * Used by: vitest.
 */

import { describe, expect, it } from "vitest";
import { AGENT_EDGES, AGENT_STEPS } from "../../src/lib/agent-floor/agents";
import { edgeDotCenter, layoutChain, MAIN_PATH, nodeLabel, STEP_LABEL } from "./floor-layout";

describe("agent floor layout", () => {
    it("follows the main-path edges from the app", () => {
        for (let index = 0; index < MAIN_PATH.length - 1; index += 1) {
            const source = MAIN_PATH[index];
            const target = MAIN_PATH[index + 1];
            expect(AGENT_EDGES).toContainEqual([source, target]);
        }
        expect(AGENT_EDGES).toContainEqual(["jev", "handoff"]);
    });

    it("places every agent step, with handoff under Jev", () => {
        const layout = layoutChain(160, 20);
        expect(layout.map((node) => node.step).sort()).toEqual([...AGENT_STEPS].sort());
        const jev = layout.find((node) => node.step === "jev");
        const handoff = layout.find((node) => node.step === "handoff");
        expect(handoff?.x).toBe(jev?.x);
        expect(handoff?.y ?? 0).toBeGreaterThan(jev?.y ?? 0);
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

    it("pulls the handoff card close under Jev", () => {
        const layout = layoutChain(200, 12, 110);
        const handoff = layout.find((node) => node.step === "handoff");
        expect(handoff?.y).toBe(110);
        expect(handoff?.y ?? 0).toBeLessThan(200 * 0.78);
    });

    it("labels a node the way the floor does", () => {
        expect(nodeLabel("John Smith", "invoice")).toBe("John Smith · Stripe invoice");
        expect(STEP_LABEL.handoff).toBe("Handoff");
        expect(Object.keys(STEP_LABEL).sort()).toEqual([...AGENT_STEPS].sort());
    });
});
