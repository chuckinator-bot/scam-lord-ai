/**
 * @module remotion/demo30
 * Portfolio, zoomed chain, and benefit screens for the 30-second film.
 * Depends on: chrome, devices, AgentChain, demo30-story, chain-camera.
 * Used by: Films.
 */

import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { chainCameraAt, CHAIN_GAP, CHAIN_NODE_WIDTH, CHAIN_VIEW_WIDTH } from "../chain-camera";
import { AgentChain } from "../components/AgentChain";
import {
    AgentBanner,
    AppShell,
    DotField,
    labelStyle,
    LockIcon,
    Logo,
    StatusBadge,
} from "../components/chrome";
import {
    ARRANGED_DOLLARS,
    BOOK_DOLLARS,
    bookPercent,
    COLLECTED_DOLLARS,
    dollars,
    OPEN_DOLLARS,
    PORTFOLIO_COUNTS,
    SCHEDULED_DOLLARS,
    SOURCE_NAME,
    SYNC_HEADLINE,
    UNTOUCHED_DOLLARS,
} from "../demo30-story";
import { fontDisplay, fontSans } from "../fonts";
import { TENANTS } from "../roster";
import { theme } from "../theme";

function countTo(frame: number, end: number, settle: number): number {
    return Math.round(interpolate(frame, [6, settle], [0, end], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    }));
}

export function Demo30Portfolio() {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const enter = spring({
        config: { damping: 16, stiffness: 120 },
        fps,
        frame,
    });

    return (
        <AppShell
            extra={ (
                <div
                    style={ {
                        alignItems: "center",
                        border: `2px solid ${theme.borderStrong}`,
                        borderRadius: theme.radiusPill,
                        color: theme.ink,
                        display: "flex",
                        fontWeight: 600,
                        gap: 8,
                        padding: "8px 14px",
                    } }
                >
                    <LockIcon />
                    Row-level security
                </div>
            ) }
            title="Portfolio"
        >
            <div
                style={ {
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: theme.radiusLg,
                    opacity: enter,
                    padding: "22px 28px 20px",
                    transform: `translateY(${(1 - enter) * 16}px)`,
                } }
            >
                <div style={ { alignItems: "center", display: "flex", gap: 14 } }>
                    <div style={ labelStyle }>Property management</div>
                    <div
                        style={ {
                            background: theme.surfaceSunken,
                            border: `1px solid ${theme.border}`,
                            borderRadius: theme.radiusPill,
                            color: theme.ink,
                            fontFamily: fontSans,
                            fontSize: 18,
                            fontWeight: 600,
                            padding: "6px 14px",
                        } }
                    >
                        { SOURCE_NAME }
                    </div>
                </div>
                <div
                    style={ {
                        fontFamily: fontDisplay,
                        fontSize: 40,
                        letterSpacing: -0.6,
                        lineHeight: 1.05,
                        marginTop: 10,
                        maxWidth: 1180,
                    } }
                >
                    { SYNC_HEADLINE }
                </div>
                <div style={ { display: "flex", gap: 12, marginTop: 18 } }>
                    { PORTFOLIO_COUNTS.map(([label, value]) => (
                        <div
                            key={ label }
                            style={ {
                                background: theme.surfaceSunken,
                                borderRadius: theme.radiusMd,
                                flex: 1,
                                padding: "12px 14px",
                            } }
                        >
                            <div style={ labelStyle }>{ label }</div>
                            <div
                                style={ {
                                    fontFamily: fontDisplay,
                                    fontSize: 44,
                                    fontVariantNumeric: "tabular-nums",
                                    marginTop: 4,
                                } }
                            >
                                { countTo(frame, value, 36) }
                            </div>
                        </div>
                    )) }
                </div>
            </div>
            <div
                style={ {
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: theme.radiusLg,
                    display: "flex",
                    flex: 1,
                    flexDirection: "column",
                    marginTop: 16,
                    opacity: enter,
                    overflow: "hidden",
                } }
            >
                <div
                    style={ {
                        ...labelStyle,
                        background: theme.surfaceSunken,
                        columnGap: 24,
                        display: "grid",
                        gridTemplateColumns: "minmax(0, 1fr) 180px 240px",
                        padding: "12px 20px",
                    } }
                >
                    <span>Tenancy</span>
                    <span style={ { textAlign: "right" } }>Amount</span>
                    <span style={ { textAlign: "right" } }>Status</span>
                </div>
                { TENANTS.map((row) => (
                    <div
                        key={ row.name }
                        style={ {
                            alignItems: "center",
                            borderTop: `1px solid ${theme.border}`,
                            columnGap: 24,
                            display: "grid",
                            flex: 1,
                            gridTemplateColumns: "minmax(0, 1fr) 180px 240px",
                            padding: "0 20px",
                        } }
                    >
                        <div>
                            <div style={ { fontSize: 20, fontWeight: 600 } }>{ row.name }</div>
                            <div style={ { color: theme.mutedInk, fontSize: 16 } }>{ row.place }</div>
                        </div>
                        <span
                            style={ {
                                fontSize: 20,
                                fontVariantNumeric: "tabular-nums",
                                fontWeight: 600,
                                textAlign: "right",
                            } }
                        >
                            { row.amount }
                        </span>
                        <span style={ { display: "flex", justifyContent: "flex-end" } }>
                            <StatusBadge status={ row.status } />
                        </span>
                    </div>
                )) }
            </div>
        </AppShell>
    );
}

export function Demo30Chain() {
    const frame = useCurrentFrame();
    const camera = chainCameraAt(frame, 150);

    return (
        <AbsoluteFill style={ { background: theme.bg, fontFamily: fontSans } }>
            <DotField />
            <div style={ { left: 48, position: "absolute", right: 48, top: 36 } }>
                <div style={ { alignItems: "center", display: "flex", justifyContent: "space-between" } }>
                    <Logo
                        markHeight={ 44 }
                        tone="mint"
                        wordmarkSize={ 24 }
                    />
                    <div style={ { ...labelStyle, color: theme.ink, fontSize: 16 } }>Agent floor</div>
                </div>
                <div style={ { marginTop: 22 } }>
                    <AgentBanner
                        detail="John Smith · $2,400.00 · Sunset Properties"
                        status="In progress"
                    />
                </div>
            </div>
            <div
                style={ {
                    bottom: 200,
                    left: (1920 - CHAIN_VIEW_WIDTH) / 2,
                    overflow: "hidden",
                    position: "absolute",
                    top: 220,
                    width: CHAIN_VIEW_WIDTH,
                } }
            >
                <div
                    style={ {
                        left: 0,
                        position: "absolute",
                        top: "50%",
                        transform: `translate(${-camera.x}px, -50%)`,
                    } }
                >
                    <AgentChain
                        active={ camera.active }
                        gap={ CHAIN_GAP }
                        litThrough={ camera.litThrough }
                        nodeWidth={ CHAIN_NODE_WIDTH }
                        showHandoff
                        tenant="John Smith"
                    />
                </div>
            </div>
        </AbsoluteFill>
    );
}

function MoneyTile({
    amount,
    detail,
    label,
}: {
    amount: string;
    detail: string;
    label: string;
}) {
    return (
        <div
            style={ {
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: theme.radiusLg,
                flex: 1,
                padding: "18px 20px",
            } }
        >
            <div style={ labelStyle }>{ label }</div>
            <div
                style={ {
                    fontFamily: fontDisplay,
                    fontSize: 40,
                    fontVariantNumeric: "tabular-nums",
                    marginTop: 8,
                } }
            >
                { amount }
            </div>
            <div style={ { color: theme.mutedInk, fontSize: 18, marginTop: 6 } }>{ detail }</div>
        </div>
    );
}

export function Demo30Benefit() {
    const frame = useCurrentFrame();
    const open = Math.round(interpolate(frame, [8, 48], [BOOK_DOLLARS, OPEN_DOLLARS], {
        easing: Easing.inOut(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    }));
    const share = interpolate(frame, [16, 64], [0, ARRANGED_DOLLARS / BOOK_DOLLARS], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill
            style={ {
                background: theme.bg,
                color: theme.ink,
                fontFamily: fontSans,
                padding: "36px 64px 168px",
            } }
        >
            <div style={ { alignItems: "center", display: "flex", justifyContent: "space-between" } }>
                <div>
                    <div style={ labelStyle }>Collections</div>
                    <div style={ { fontFamily: fontDisplay, fontSize: 48, marginTop: 6 } }>What the owner gets</div>
                </div>
                <div
                    style={ {
                        background: theme.surfaceSunken,
                        border: `1px solid ${theme.border}`,
                        borderRadius: theme.radiusPill,
                        color: theme.mutedInk,
                        fontSize: 16,
                        fontWeight: 600,
                        padding: "6px 12px",
                    } }
                >
                    Demo data
                </div>
            </div>
            <div
                style={ {
                    alignItems: "flex-end",
                    display: "flex",
                    gap: 28,
                    marginTop: 22,
                } }
            >
                <div style={ { flex: 1.1 } }>
                    <div style={ labelStyle }>Still open</div>
                    <div
                        style={ {
                            fontFamily: fontDisplay,
                            fontSize: 92,
                            fontVariantNumeric: "tabular-nums",
                            letterSpacing: -2,
                            lineHeight: 0.95,
                            marginTop: 6,
                        } }
                    >
                        { dollars(open) }
                    </div>
                    <div style={ { color: theme.mutedInk, fontSize: 20, marginTop: 8 } }>
                        { `Started at ${dollars(BOOK_DOLLARS)}. Collected ${dollars(COLLECTED_DOLLARS)} today.` }
                    </div>
                </div>
                <div
                    style={ {
                        background: theme.surface,
                        border: `1px solid ${theme.border}`,
                        borderRadius: theme.radiusLg,
                        padding: "18px 22px",
                        width: 520,
                    } }
                >
                    <div style={ labelStyle }>Owner satisfaction</div>
                    <div style={ { fontFamily: fontDisplay, fontSize: 36, marginTop: 8 } }>Up</div>
                    <div
                        style={ {
                            background: theme.surfaceSunken,
                            borderRadius: theme.radiusPill,
                            height: 22,
                            marginTop: 14,
                            overflow: "hidden",
                        } }
                    >
                        <div
                            style={ {
                                background: theme.mint,
                                borderRadius: theme.radiusPill,
                                height: "100%",
                                width: `${share * 100}%`,
                            } }
                        />
                    </div>
                    <div style={ { fontSize: 18, marginTop: 10 } }>
                        { `${bookPercent(ARRANGED_DOLLARS)} of this book is collected or scheduled` }
                    </div>
                </div>
            </div>
            <div style={ { display: "flex", gap: 16, marginTop: 22 } }>
                <MoneyTile
                    amount={ dollars(COLLECTED_DOLLARS) }
                    detail={ `${bookPercent(COLLECTED_DOLLARS)} of ${dollars(BOOK_DOLLARS)} collected` }
                    label="Collected"
                />
                <MoneyTile
                    amount={ dollars(SCHEDULED_DOLLARS) }
                    detail={ `${bookPercent(SCHEDULED_DOLLARS)} scheduled, still open` }
                    label="Scheduled"
                />
                <MoneyTile
                    amount={ dollars(UNTOUCHED_DOLLARS) }
                    detail="Casey, Avery, and Blake"
                    label="Untouched"
                />
            </div>
            <div
                style={ {
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: theme.radiusLg,
                    marginTop: 16,
                    padding: "16px 22px",
                } }
            >
                <div style={ labelStyle }>Return on this book</div>
                <div style={ { display: "flex", gap: 32, marginTop: 10 } }>
                    { [
                        ["Collected", COLLECTED_DOLLARS],
                        ["Scheduled", SCHEDULED_DOLLARS],
                        ["Arranged", ARRANGED_DOLLARS],
                    ].map(([label, amount]) => (
                        <div key={ String(label) }>
                            <div style={ { color: theme.mutedInk, fontSize: 16 } }>{ label }</div>
                            <div style={ { fontFamily: fontDisplay, fontSize: 28, marginTop: 2 } }>
                                { `${dollars(Number(amount))} · ${bookPercent(Number(amount))}` }
                            </div>
                        </div>
                    )) }
                </div>
            </div>
        </AbsoluteFill>
    );
}
