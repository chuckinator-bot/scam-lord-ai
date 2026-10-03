/**
 * @module remotion/chain-camera.test
 * The 30-second chain pauses, then eases. No whip past the next stop.
 * Depends on: chain-camera.
 * Used by: vitest.
 */

import { describe, expect, it } from "vitest";
import { CHAIN_FOCUS, CHAIN_GAP, CHAIN_NODE_WIDTH, CHAIN_VIEW_WIDTH, chainCameraAt, chainFocusX } from "./chain-camera";

describe("chain camera", () => {
    it("keeps about three large steps in the frame", () => {
        const visible = CHAIN_VIEW_WIDTH / (CHAIN_NODE_WIDTH + CHAIN_GAP);
        expect(visible).toBeGreaterThan(2.4);
        expect(visible).toBeLessThan(3.4);
        expect(CHAIN_NODE_WIDTH).toBeGreaterThanOrEqual(480);
    });

    it("dwells on invoice, disclosure, jev, policy, and plan", () => {
        expect(CHAIN_FOCUS).toEqual(["invoice", "disclosure", "jev", "policy", "plan"]);
        expect(chainCameraAt(0).active).toBe("invoice");
        expect(chainCameraAt(8).x).toBe(chainFocusX("invoice"));
        expect(chainCameraAt(40).active).toBe("disclosure");
        expect(chainCameraAt(40).x).toBe(chainFocusX("disclosure"));
        expect(chainCameraAt(72).active).toBe("jev");
        expect(chainCameraAt(104).active).toBe("policy");
        expect(chainCameraAt(140).active).toBe("plan");
        expect(chainCameraAt(140).x).toBe(chainFocusX("plan"));
    });

    it("eases between stops without passing the destination", () => {
        const from = chainFocusX("disclosure");
        const to = chainFocusX("jev");
        const mid = chainCameraAt(56);
        expect(mid.x).toBeGreaterThan(from);
        expect(mid.x).toBeLessThan(to);
        expect(mid.active).toBe("disclosure");
        const later = chainCameraAt(60);
        expect(later.x).toBeGreaterThan(mid.x);
        expect(later.x).toBeLessThan(to);
    });
});
