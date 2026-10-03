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
    Tick,
} from "../components/chrome";
import { BigAmount, Phone, Waveform } from "../components/devices";
import { VOICE_LINE_V7 } from "../beats";
import {
    BOOK_DOLLARS,
    dollars,
    PAST_DUE_END,
    PLAN_LINE,
    PORTFOLIO_COUNTS,
    ROI_LINE,
    SATISFACTION_FROM,
    SATISFACTION_TO,
    SOURCE_NAME,
    SYNC_HEADLINE,
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
                        background: theme.surfaceSunken,
                        padding: "14px 20px 8px",
                    } }
                >
                    <div style={ { fontFamily: fontDisplay, fontSize: 32 } }>Needs attention</div>
                </div>
                <div
                    style={ {
                        ...labelStyle,
                        background: theme.surfaceSunken,
                        columnGap: 24,
                        display: "grid",
                        gridTemplateColumns: "minmax(0, 1fr) 180px 240px",
                        padding: "8px 20px 12px",
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

const STAR_PATH = "M12 1.8 14.7 8.2 21.6 8.8 16.4 13.4 18.1 20.2 12 16.6 5.9 20.2 7.6 13.4 2.4 8.8 9.3 8.2 Z";

function Star({ fill, index }: { fill: number; index: number }) {
    const clip = `sat-star-${index}`;
    return (
        <svg
            height={ 88 }
            viewBox="0 0 24 24"
            width={ 88 }
        >
            <defs>
                <clipPath id={ clip }>
                    <rect
                        height="24"
                        width={ 24 * fill }
                        x="0"
                        y="0"
                    />
                </clipPath>
            </defs>
            <path
                d={ STAR_PATH }
                fill={ theme.surfaceSunken }
                stroke={ theme.ink }
                strokeWidth={ 0.8 }
            />
            <path
                clipPath={ `url(#${clip})` }
                d={ STAR_PATH }
                fill={ theme.ink }
            />
        </svg>
    );
}

export function Demo30Stakes() {
    return (
        <AbsoluteFill
            style={ {
                alignItems: "center",
                background: theme.ink,
                color: theme.mint,
                fontFamily: fontDisplay,
                justifyContent: "center",
                padding: "72px 96px",
            } }
        >
            <div
                style={ {
                    fontSize: 108,
                    letterSpacing: -2.5,
                    lineHeight: 0.92,
                    textAlign: "center",
                } }
            >
                RENT IS LATE.
            </div>
            <div
                style={ {
                    alignItems: "center",
                    background: theme.white,
                    border: `2px solid ${theme.mint}`,
                    borderRadius: theme.radiusLg,
                    color: theme.ink,
                    display: "flex",
                    fontFamily: fontSans,
                    gap: 28,
                    marginTop: 28,
                    padding: "16px 28px",
                } }
            >
                <div>
                    <div style={ { fontSize: 28, fontWeight: 600 } }>John Smith</div>
                    <div style={ { fontFamily: fontDisplay, fontSize: 36, marginTop: 4 } }>$2,400 overdue</div>
                </div>
                <div
                    style={ {
                        background: theme.mint,
                        borderRadius: theme.radiusPill,
                        fontSize: 18,
                        fontWeight: 600,
                        padding: "8px 14px",
                    } }
                >
                    Overdue
                </div>
            </div>
            <div style={ { fontSize: 48, letterSpacing: -0.8, marginTop: 48, textAlign: "center" } }>
                Someone has to chase it.
            </div>
            <div style={ { fontSize: 92, letterSpacing: -2, marginTop: 8, textAlign: "center" } }>
                Not anymore.
            </div>
        </AbsoluteFill>
    );
}

export function Demo30Wake() {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const logo = spring({
        config: { damping: 14, stiffness: 140 },
        fps,
        frame,
    });
    return (
        <AbsoluteFill style={ { background: theme.ink, color: theme.mint } }>
            <div
                style={ {
                    left: 120,
                    opacity: logo,
                    position: "absolute",
                    top: 72,
                } }
            >
                <Logo
                    markHeight={ 96 }
                    tone="dark"
                    wordmarkSize={ 52 }
                />
            </div>
            <div
                style={ {
                    fontFamily: fontDisplay,
                    fontSize: 72,
                    left: 120,
                    letterSpacing: -1.5,
                    position: "absolute",
                    top: 240,
                } }
            >
                RentRecovery wakes up
            </div>
            <div
                style={ {
                    alignItems: "center",
                    display: "flex",
                    gap: 36,
                    left: 120,
                    position: "absolute",
                    right: 120,
                    top: 420,
                } }
            >
                <Phone width={ 250 }>
                    <div style={ { fontSize: 13, fontWeight: 600, letterSpacing: 1.4 } }>CALLING</div>
                    <div style={ { fontFamily: fontDisplay, fontSize: 28, marginTop: 16 } }>John Smith</div>
                    <div style={ { marginTop: 28 } }>
                        <Waveform
                            bars={ 16 }
                            color={ theme.ink }
                            height={ 64 }
                        />
                    </div>
                </Phone>
                <div
                    style={ {
                        fontFamily: fontSans,
                        fontSize: 36,
                        fontWeight: 600,
                        lineHeight: "48px",
                        maxWidth: 820,
                    } }
                >
                    { VOICE_LINE_V7 }
                </div>
            </div>
        </AbsoluteFill>
    );
}

export function Demo30Close() {
    return (
        <AbsoluteFill
            style={ {
                alignItems: "center",
                background: theme.brandMint,
                justifyContent: "center",
                padding: "64px 72px",
            } }
        >
            <div style={ { alignItems: "center", display: "flex", gap: 28 } }>
                <BigAmount
                    amount="$2,400"
                    label="OVERDUE"
                    tone="overdue"
                />
                <div style={ { position: "relative" } }>
                    <BigAmount
                        amount="$800"
                        label="PAID"
                        tone="paid"
                    />
                    <div style={ { position: "absolute", right: -8, top: -12 } }>
                        <Tick size={ 54 } />
                    </div>
                </div>
                <BigAmount
                    amount="$1,600"
                    label="SCHEDULED"
                    tone="ink"
                />
            </div>
            <div style={ { marginTop: 56 } }>
                <Logo
                    markHeight={ 120 }
                    tone="mint"
                    wordmarkSize={ 72 }
                />
            </div>
            <div
                style={ {
                    color: theme.onMint,
                    fontFamily: fontDisplay,
                    fontSize: 48,
                    letterSpacing: -0.8,
                    marginTop: 28,
                } }
            >
                From overdue to paid.
            </div>
        </AbsoluteFill>
    );
}

export function Demo30Benefit() {
    const frame = useCurrentFrame();
    const pastDue = Math.round(interpolate(frame, [8, 52], [BOOK_DOLLARS, PAST_DUE_END], {
        easing: Easing.inOut(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    }));
    const score = interpolate(frame, [8, 52], [SATISFACTION_FROM, SATISFACTION_TO], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill
            style={ {
                background: theme.bg,
                color: theme.ink,
                display: "flex",
                flexDirection: "column",
                fontFamily: fontSans,
                gap: 18,
                padding: "28px 56px 148px",
            } }
        >
            <div
                style={ {
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: theme.radiusLg,
                    display: "flex",
                    flex: 1.35,
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "28px 36px",
                    position: "relative",
                } }
            >
                <div
                    style={ {
                        position: "absolute",
                        right: 28,
                        top: 22,
                    } }
                >
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
                <div style={ { ...labelStyle, fontSize: 22 } }>Past due</div>
                <div
                    style={ {
                        fontFamily: fontDisplay,
                        fontSize: 128,
                        fontVariantNumeric: "tabular-nums",
                        letterSpacing: -3,
                        lineHeight: 0.92,
                        marginTop: 8,
                    } }
                >
                    { dollars(pastDue) }
                </div>
                <div style={ { fontSize: 28, fontWeight: 600, marginTop: 12 } }>
                    { PLAN_LINE }
                </div>
            </div>
            <div
                style={ {
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: theme.radiusLg,
                    display: "flex",
                    flex: 0.8,
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "24px 36px",
                } }
            >
                <div style={ { ...labelStyle, fontSize: 22 } }>ROI</div>
                <div
                    style={ {
                        fontFamily: fontDisplay,
                        fontSize: 52,
                        letterSpacing: -0.8,
                        marginTop: 10,
                    } }
                >
                    { ROI_LINE }
                </div>
            </div>
            <div
                style={ {
                    alignItems: "center",
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: theme.radiusLg,
                    display: "flex",
                    flex: 1,
                    justifyContent: "space-between",
                    padding: "24px 36px",
                } }
            >
                <div>
                    <div style={ { ...labelStyle, fontSize: 22 } }>Owner satisfaction</div>
                    <div
                        style={ {
                            fontFamily: fontDisplay,
                            fontSize: 72,
                            fontVariantNumeric: "tabular-nums",
                            letterSpacing: -1,
                            marginTop: 8,
                        } }
                    >
                        { `${score.toFixed(1)} / 5` }
                    </div>
                </div>
                <div style={ { display: "flex", gap: 8 } }>
                    { [0, 1, 2, 3, 4].map((index) => (
                        <Star
                            fill={ Math.max(0, Math.min(1, score - index)) }
                            index={ index }
                            key={ index }
                        />
                    )) }
                </div>
            </div>
        </AbsoluteFill>
    );
}
