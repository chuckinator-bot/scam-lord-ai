/**
 * @module remotion/chain-camera
 * Paused camera stops for the 30-second agent chain.
 * Depends on: floor-layout, agent step names.
 * Used by: Demo30 chain scene, tests.
 */

import type { TAgentStep } from "../../src/lib/agent-floor/agents";
import { chainWidth } from "./floor-layout";

/** Large cards so a zoomed frame holds about three steps. */
export const CHAIN_NODE_WIDTH = 520;
export const CHAIN_GAP = 40;
export const CHAIN_VIEW_WIDTH = 1824;

export const CHAIN_FOCUS: readonly TAgentStep[] = [
    "invoice",
    "disclosure",
    "jev",
    "policy",
    "plan",
];

const STEP_INDEX: Partial<Record<TAgentStep, number>> = {
    disclosure: 2,
    invoice: 0,
    jev: 3,
    plan: 5,
    policy: 4,
};

const DWELL = 18;
const TRAVEL = 14;

export interface IChainCamera {
    readonly active: TAgentStep;
    readonly litThrough: number;
    readonly x: number;
}

function easeInOutCubic(t: number): number {
    const clamped = Math.max(0, Math.min(1, t));
    if (clamped < 0.5) {
        return 4 * clamped * clamped * clamped;
    }
    return 1 - ((-2 * clamped + 2) ** 3) / 2;
}

/** Horizontal camera target that centers one step inside the viewport. */
export function chainFocusX(step: TAgentStep): number {
    const index = STEP_INDEX[step as keyof typeof STEP_INDEX] ?? 0;
    const nodeX = index * (CHAIN_NODE_WIDTH + CHAIN_GAP);
    const total = chainWidth(CHAIN_NODE_WIDTH, CHAIN_GAP);
    const raw = nodeX + CHAIN_NODE_WIDTH / 2 - CHAIN_VIEW_WIDTH / 2;
    const max = Math.max(0, total - CHAIN_VIEW_WIDTH);
    return Math.min(max, Math.max(0, raw));
}

function lit(step: TAgentStep): number {
    return (STEP_INDEX[step as keyof typeof STEP_INDEX] ?? 0) + 0.2;
}

function hold(step: TAgentStep): IChainCamera {
    return {
        active: step,
        litThrough: lit(step),
        x: chainFocusX(step),
    };
}

/**
 * Dwells on each focus step, then eases to the next. The last dwell absorbs
 * leftover frames. Travel uses an in-out cubic so the pan does not whip.
 * @param frame - Local frame inside the chain beat.
 * @param duration - Beat length in frames.
 */
export function chainCameraAt(frame: number, duration = 150): IChainCamera {
    const stops = CHAIN_FOCUS.length;
    const used = stops * DWELL + (stops - 1) * TRAVEL;
    const extra = Math.max(0, duration - used);
    let cursor = 0;
    for (let index = 0; index < stops; index += 1) {
        const step = CHAIN_FOCUS[index] ?? "invoice";
        const dwell = DWELL + (index === stops - 1 ? extra : 0);
        if (frame < cursor + dwell) {
            return hold(step);
        }
        cursor += dwell;
        const next = CHAIN_FOCUS[index + 1];
        if (!next) {
            return hold(step);
        }
        if (frame < cursor + TRAVEL) {
            const t = easeInOutCubic((frame - cursor) / TRAVEL);
            const fromX = chainFocusX(step);
            const toX = chainFocusX(next);
            return {
                active: step,
                litThrough: lit(step) + (lit(next) - lit(step)) * t,
                x: fromX + (toX - fromX) * t,
            };
        }
        cursor += TRAVEL;
    }
    return hold(CHAIN_FOCUS[stops - 1] ?? "plan");
}
