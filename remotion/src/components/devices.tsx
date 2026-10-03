/**
 * @module remotion/devices
 * Phone, waveform, and the hardship gauge.
 * Depends on: theme, fonts, chrome.
 * Used by: intro and story scenes.
 */

import type { ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import { fontDisplay, fontSans } from "../fonts";
import { theme } from "../theme";

export function Waveform({
    bars = 24,
    color = theme.ink,
    height = 56,
}: {
    bars?: number;
    color?: string;
    height?: number;
}) {
    const frame = useCurrentFrame();
    return (
        <div
            style={ {
                alignItems: "center",
                display: "flex",
                gap: 5,
                height,
            } }
        >
            { Array.from({ length: bars }, (_, index) => {
                const wave = Math.abs(Math.sin(frame * 0.45 + index * 0.62));
                const bar = 8 + wave * (height - 10);
                return (
                    <div
                        key={ index }
                        style={ {
                            background: color,
                            borderRadius: theme.radiusPill,
                            height: bar,
                            width: 6,
                        } }
                    />
                );
            }) }
        </div>
    );
}

export function Phone({
    children,
    shake = false,
    width = 300,
}: {
    children: ReactNode;
    shake?: boolean;
    width?: number;
}) {
    const frame = useCurrentFrame();
    const tilt = shake ? Math.sin(frame * 1.35) * 2.8 : 0;
    const height = Math.round(width * 1.86);
    return (
        <div
            style={ {
                background: theme.onMint,
                borderRadius: 36,
                height,
                padding: 12,
                transform: `rotate(${tilt}deg)`,
                width,
            } }
        >
            <div
                style={ {
                    background: theme.surface,
                    borderRadius: 26,
                    color: theme.ink,
                    fontFamily: fontSans,
                    height: "100%",
                    overflow: "hidden",
                    position: "relative",
                } }
            >
                <div
                    style={ {
                        background: theme.onMint,
                        borderRadius: theme.radiusPill,
                        height: 8,
                        left: "50%",
                        position: "absolute",
                        top: 10,
                        transform: "translateX(-50%)",
                        width: 72,
                    } }
                />
                <div style={ { height: "100%", padding: "36px 18px 18px" } }>{ children }</div>
            </div>
        </div>
    );
}

export function Gauge({
    score,
}: {
    score: number;
}) {
    const clamped = Math.max(0, Math.min(1, score));
    const hot = clamped >= 0.35;
    return (
        <div style={ { width: 820 } }>
            <div
                style={ {
                    background: theme.surfaceSunken,
                    border: `2px solid ${theme.borderStrong}`,
                    borderRadius: theme.radiusPill,
                    height: 36,
                    position: "relative",
                } }
            >
                <div
                    style={ {
                        background: hot ? theme.overdueInk : theme.paidInk,
                        borderRadius: theme.radiusPill,
                        bottom: 4,
                        left: 4,
                        position: "absolute",
                        top: 4,
                        width: `calc(${clamped * 100}% - 8px)`,
                    } }
                />
                <div
                    style={ {
                        background: theme.onMint,
                        bottom: -10,
                        left: "35%",
                        position: "absolute",
                        top: -10,
                        width: 3,
                    } }
                />
            </div>
            <div
                style={ {
                    color: theme.mutedInk,
                    fontFamily: fontSans,
                    fontSize: 16,
                    fontWeight: 600,
                    height: 24,
                    marginTop: 14,
                    position: "relative",
                } }
            >
                <span style={ { left: 0, position: "absolute" } }>0</span>
                <span
                    style={ {
                        left: "35%",
                        position: "absolute",
                        transform: "translateX(-50%)",
                    } }
                >
                    0.35
                </span>
                <span style={ { position: "absolute", right: 0 } }>1</span>
            </div>
        </div>
    );
}

export function BigAmount({
    amount,
    label,
    tone,
}: {
    amount: string;
    label: string;
    tone: "overdue" | "paid" | "ink";
}) {
    const color = tone === "overdue"
        ? theme.overdueInk
        : tone === "paid"
            ? theme.paidInk
            : theme.ink;
    const background = tone === "overdue"
        ? theme.overdueBg
        : tone === "paid"
            ? theme.paidBg
            : theme.surface;
    return (
        <div
            style={ {
                background,
                border: `2px solid ${theme.onMint}`,
                borderRadius: theme.radiusLg,
                padding: "28px 36px",
            } }
        >
            <div
                style={ {
                    color,
                    fontFamily: fontDisplay,
                    fontSize: 72,
                    letterSpacing: -1.5,
                    lineHeight: 1,
                } }
            >
                { amount }
            </div>
            <div
                style={ {
                    color,
                    fontFamily: fontDisplay,
                    fontSize: 36,
                    letterSpacing: -0.5,
                    marginTop: 8,
                } }
            >
                { label }
            </div>
        </div>
    );
}
