/**
 * @module remotion/chrome
 * Shared Mint Condition chrome: logo, badges, captions, app shell.
 * Depends on: theme, fonts.
 * Used by: scenes.
 */

import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { fontDisplay, fontSans } from "../fonts";
import { statusColors, theme, type TStatus } from "../theme";

export function Logo({
    tone,
    markHeight,
    wordmarkSize,
}: {
    tone: "mint" | "dark";
    markHeight: number;
    wordmarkSize: number;
}) {
    const src = tone === "mint"
        ? staticFile("brand/mark.svg")
        : staticFile("brand/mark-reversed.svg");
    const color = tone === "mint" ? theme.onMint : theme.brandMint;
    return (
        <div style={ { alignItems: "center", display: "flex", gap: 16 } }>
            <Img
                src={ src }
                style={ { height: markHeight, width: markHeight } }
            />
            <div
                style={ {
                    color,
                    fontFamily: fontDisplay,
                    fontSize: wordmarkSize,
                    letterSpacing: -1,
                    lineHeight: 0.95,
                } }
            >
                RentRecovery
            </div>
        </div>
    );
}

export function StatusBadge({ status, size = "md" }: { status: TStatus; size?: "md" | "lg" }) {
    const colors = statusColors(status);
    const large = size === "lg";
    return (
        <span
            style={ {
                background: colors.bg,
                borderRadius: theme.radiusPill,
                color: colors.ink,
                display: "inline-block",
                fontFamily: fontSans,
                fontSize: large ? 22 : 16,
                fontWeight: 600,
                lineHeight: large ? "28px" : "20px",
                padding: large ? "8px 16px" : "6px 12px",
                whiteSpace: "nowrap",
            } }
        >
            { status }
        </span>
    );
}

export function LockIcon() {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            height="20"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="20"
        >
            <rect
                height="10"
                rx="2"
                width="14"
                x="5"
                y="11"
            />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
    );
}

export function Tick({ size = 28, color = theme.ink }: { size?: number; color?: string }) {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            height={ size }
            viewBox="0 0 32 32"
            width={ size }
        >
            <circle
                cx="16"
                cy="16"
                fill={ theme.white }
                r="15"
                stroke={ color }
                strokeWidth="2"
            />
            <path
                d="M9 16.5l4.2 4.2L23 11.5"
                fill="none"
                stroke={ color }
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.4"
            />
        </svg>
    );
}

export function Caption({ text }: { text: string }) {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 6], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const y = interpolate(frame, [0, 8], [18, 0], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    return (
        <div
            style={ {
                background: theme.onMint,
                bottom: 0,
                color: theme.brandMint,
                fontFamily: fontSans,
                fontSize: 36,
                fontWeight: 600,
                left: 0,
                lineHeight: "46px",
                opacity,
                padding: "26px 72px 34px",
                position: "absolute",
                right: 0,
                transform: `translateY(${y}px)`,
            } }
        >
            { text }
        </div>
    );
}

export function Snap({
    amount = 0.045,
    children,
}: {
    amount?: number;
    children: ReactNode;
}) {
    const frame = useCurrentFrame();
    const zoom = interpolate(frame, [0, 12], [1 + amount, 1], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const blur = interpolate(frame, [0, 10], [5.5, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    return (
        <AbsoluteFill
            style={ {
                filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
                transform: `scale(${zoom})`,
            } }
        >
            { children }
        </AbsoluteFill>
    );
}

const NAV = ["New Chat"] as const;

export function AppShell({
    title,
    children,
    extra,
}: {
    title: string;
    children: ReactNode;
    extra?: ReactNode;
}) {
    return (
        <AbsoluteFill style={ { background: theme.bg, color: theme.ink, fontFamily: fontSans } }>
            <aside
                style={ {
                    background: theme.surface,
                    borderRight: `1px solid ${theme.border}`,
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    left: 0,
                    padding: "36px 29px",
                    position: "absolute",
                    top: 0,
                    width: 390,
                } }
            >
                <div style={ { marginBottom: 36, paddingLeft: 10 } }>
                    <Logo
                        markHeight={ 57 }
                        tone="mint"
                        wordmarkSize={ 31 }
                    />
                </div>
                { NAV.map((item) => (
                    <div
                        key={ item }
                        style={ {
                            borderRadius: theme.radiusMd,
                            color: theme.ink,
                            fontFamily: fontSans,
                            fontSize: 23,
                            fontWeight: 600,
                            padding: "16px 21px",
                        } }
                    >
                        { item }
                    </div>
                )) }
                <div style={ { ...labelStyle, fontSize: 17, marginTop: 23, paddingLeft: 21 } }>Navigate</div>
                <div style={ { ...labelStyle, fontSize: 17, marginTop: 23, paddingLeft: 21 } }>Recents</div>
            </aside>
            <main
                style={ {
                    bottom: 150,
                    display: "flex",
                    flexDirection: "column",
                    left: 390,
                    padding: "47px 52px 26px",
                    position: "absolute",
                    right: 0,
                    top: 0,
                } }
            >
                <div
                    style={ {
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 31,
                    } }
                >
                    <h1
                        style={ {
                            fontFamily: fontDisplay,
                            fontSize: 52,
                            fontWeight: 400,
                            letterSpacing: -0.5,
                            lineHeight: 1.08,
                            margin: 0,
                        } }
                    >
                        { title }
                    </h1>
                    { extra }
                </div>
                { children }
            </main>
        </AbsoluteFill>
    );
}

export function AgentBanner({
    detail,
    status,
}: {
    detail: string;
    status: TStatus;
}) {
    return (
        <div
            style={ {
                alignItems: "center",
                background: theme.inverse,
                borderRadius: theme.radiusLg,
                color: theme.onInverse,
                display: "flex",
                justifyContent: "space-between",
                padding: "18px 24px",
            } }
        >
            <div>
                <div
                    style={ {
                        fontFamily: fontDisplay,
                        fontSize: 26,
                        letterSpacing: -0.4,
                        lineHeight: 1.15,
                    } }
                >
                    RentRecovery activated
                </div>
                <div
                    style={ {
                        fontFamily: fontSans,
                        fontSize: 20,
                        fontWeight: 600,
                        marginTop: 6,
                    } }
                >
                    { detail }
                </div>
            </div>
            <StatusBadge status={ status } />
        </div>
    );
}

export function DotField() {
    return (
        <svg
            height="100%"
            style={ { inset: 0, position: "absolute" } }
            width="100%"
        >
            <defs>
                <pattern
                    height="22"
                    id="floor-dots"
                    patternUnits="userSpaceOnUse"
                    width="22"
                >
                    <circle
                        cx="1.5"
                        cy="1.5"
                        fill={ theme.border }
                        r="1.35"
                    />
                </pattern>
            </defs>
            <rect
                fill="url(#floor-dots)"
                height="100%"
                width="100%"
            />
        </svg>
    );
}

export const labelStyle: CSSProperties = {
    color: theme.mutedInk,
    fontFamily: fontSans,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 1.5,
    lineHeight: "16px",
    textTransform: "uppercase",
};
