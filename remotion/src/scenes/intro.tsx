/**
 * @module remotion/intro
 * Shared 11 second open. Copy is fixed.
 * Depends on: chrome, devices, theme, fonts.
 * Used by: Films.
 */

import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Logo, Tick } from "../components/chrome";
import { BigAmount, Phone, Waveform } from "../components/devices";
import { fontDisplay, fontSans } from "../fonts";
import { overdueOnScreen, paidOnScreen, SPLIT_ENTER_START, SPLIT_EXIT_END, SPLIT_EXIT_START, SPLIT_SETTLE_FRAMES } from "../split-swap";
import { theme } from "../theme";

export function LateBeat() {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const titleScale = interpolate(frame, [0, 8], [1.14, 1], {
        easing: Easing.out(Easing.cubic),
        extrapolateRight: "clamp",
    });
    const titleBlur = interpolate(frame, [0, 8], [7, 0], { extrapolateRight: "clamp" });
    const card = spring({
        config: { damping: 13, mass: 0.7, stiffness: 170 },
        fps,
        frame: frame - 14,
    });

    return (
        <AbsoluteFill style={ { background: theme.ink, color: theme.mint, fontFamily: fontDisplay } }>
            <AbsoluteFill
                style={ {
                    alignItems: "center",
                    filter: `blur(${titleBlur}px)`,
                    justifyContent: "center",
                    transform: `scale(${titleScale})`,
                } }
            >
                <div
                    style={ {
                        fontFamily: fontDisplay,
                        fontSize: 148,
                        letterSpacing: -3,
                        lineHeight: 0.92,
                    } }
                >
                    RENT IS LATE.
                </div>
            </AbsoluteFill>
            <div
                style={ {
                    display: "flex",
                    justifyContent: "center",
                    left: 0,
                    opacity: card,
                    position: "absolute",
                    right: 0,
                    top: 64,
                    transform: `translateY(${(1 - card) * -48}px)`,
                } }
            >
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
                        padding: "18px 28px",
                    } }
                >
                    <div>
                        <div
                            style={ {
                                fontFamily: fontSans,
                                fontSize: 28,
                                fontWeight: 600,
                            } }
                        >
                            John Smith
                        </div>
                        <div
                            style={ {
                                fontFamily: fontDisplay,
                                fontSize: 36,
                                letterSpacing: -0.5,
                                marginTop: 4,
                            } }
                        >
                            $2,400 overdue
                        </div>
                    </div>
                    <div
                        style={ {
                            background: theme.mint,
                            borderRadius: theme.radiusPill,
                            color: theme.ink,
                            fontFamily: fontSans,
                            fontSize: 18,
                            fontWeight: 600,
                            padding: "8px 14px",
                        } }
                    >
                        Overdue
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
}

export function ChaseBeat() {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const punch = spring({
        config: { damping: 11, mass: 0.6, stiffness: 180 },
        fps,
        frame: frame - 28,
    });
    return (
        <AbsoluteFill style={ { background: theme.ink, color: theme.mint, fontFamily: fontDisplay } }>
            <div
                style={ {
                    fontFamily: fontDisplay,
                    fontSize: 64,
                    left: 0,
                    letterSpacing: -1,
                    position: "absolute",
                    right: 0,
                    textAlign: "center",
                    top: 72,
                } }
            >
                Someone has to chase it.
            </div>
            <div
                style={ {
                    alignItems: "center",
                    display: "flex",
                    gap: 48,
                    justifyContent: "center",
                    left: 0,
                    position: "absolute",
                    right: 0,
                    top: 210,
                } }
            >
                <div style={ { display: "flex", flexDirection: "column", gap: 14 } }>
                    { [
                        ["John Smith", "$2,400.00"],
                        ["Casey Diaz", "$960.00"],
                        ["Avery Cole", "$1,800.00"],
                    ].map(([name, amount], index) => (
                        <div
                            key={ name }
                            style={ {
                                background: theme.white,
                                border: `2px solid ${theme.mint}`,
                                borderRadius: theme.radiusMd,
                                color: theme.ink,
                                fontFamily: fontSans,
                                padding: "12px 16px",
                                transform: `rotate(${index === 1 ? 2.5 : -2}deg)`,
                                width: 280,
                            } }
                        >
                            <div style={ { fontSize: 18, fontWeight: 600 } }>{ name }</div>
                            <div style={ { fontSize: 16, marginTop: 2 } }>{ amount }</div>
                        </div>
                    )) }
                </div>
                <Phone
                    shake
                    width={ 280 }
                >
                    <div style={ { fontSize: 14, fontWeight: 600, letterSpacing: 1.4 } }>INCOMING</div>
                    <div
                        style={ {
                            fontFamily: fontDisplay,
                            fontSize: 32,
                            letterSpacing: -0.5,
                            lineHeight: 1.05,
                            marginTop: 18,
                        } }
                    >
                        John Smith
                    </div>
                    <div style={ { color: theme.mutedInk, fontSize: 16, marginTop: 8 } }>Sunset Properties</div>
                    <div style={ { marginTop: 36 } }>
                        <Waveform
                            color={ theme.ink }
                            height={ 48 }
                        />
                    </div>
                </Phone>
            </div>
            <div
                style={ {
                    bottom: 80,
                    fontFamily: fontDisplay,
                    fontSize: 92,
                    left: 0,
                    letterSpacing: -2,
                    opacity: punch,
                    position: "absolute",
                    right: 0,
                    textAlign: "center",
                    transform: `scale(${0.86 + punch * 0.14})`,
                } }
            >
                Not anymore.
            </div>
        </AbsoluteFill>
    );
}

export function WakeBeat() {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const logo = spring({
        config: { damping: 14, stiffness: 140 },
        fps,
        frame,
    });
    const event = spring({
        config: { damping: 14, stiffness: 160 },
        fps,
        frame: frame - 16,
    });
    const line = interpolate(frame, [18, 32], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    return (
        <AbsoluteFill style={ { background: theme.onMint, color: theme.brandMint } }>
            <div
                style={ {
                    left: 120,
                    opacity: logo,
                    position: "absolute",
                    top: 88,
                    transform: `translateY(${(1 - logo) * 24}px)`,
                } }
            >
                <Logo
                    markHeight={ 120 }
                    tone="dark"
                    wordmarkSize={ 64 }
                />
            </div>
            <div
                style={ {
                    left: 140,
                    opacity: event,
                    position: "absolute",
                    top: 280,
                    transform: `translateX(${(1 - event) * -36}px)`,
                } }
            >
                <div
                    style={ {
                        background: theme.mint,
                        borderRadius: theme.radiusPill,
                        color: theme.ink,
                        display: "inline-block",
                        fontFamily: fontSans,
                        fontSize: 22,
                        fontWeight: 600,
                        padding: "8px 16px",
                    } }
                >
                    invoice.overdue
                </div>
                <div
                    style={ {
                        fontFamily: fontDisplay,
                        fontSize: 72,
                        letterSpacing: -1.5,
                        lineHeight: 1,
                        marginTop: 28,
                    } }
                >
                    RentRecovery wakes up
                </div>
            </div>
            <div
                style={ {
                    alignItems: "center",
                    display: "flex",
                    gap: 28,
                    opacity: line,
                    position: "absolute",
                    right: 120,
                    top: 470,
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
                        fontSize: 28,
                        fontWeight: 600,
                        lineHeight: "38px",
                        maxWidth: 640,
                    } }
                >
                    Hi John, this is RentRecovery, an AI assistant calling on behalf of Sunset Properties...
                </div>
            </div>
        </AbsoluteFill>
    );
}

export function SplitBeat() {
    const frame = useCurrentFrame();
    const leaving = interpolate(frame, [SPLIT_EXIT_START, SPLIT_EXIT_END], [0, 1], {
        easing: Easing.in(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const settled = interpolate(
        frame,
        [SPLIT_ENTER_START, SPLIT_ENTER_START + SPLIT_SETTLE_FRAMES],
        [0, 1],
        {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        },
    );
    return (
        <AbsoluteFill
            style={ {
                alignItems: "center",
                background: theme.bg,
                fontFamily: fontSans,
                justifyContent: "center",
            } }
        >
            { overdueOnScreen(frame) ? (
                <div
                    style={ {
                        opacity: 1 - leaving,
                        position: "absolute",
                        transform: `translateY(${-72 * leaving}px)`,
                    } }
                >
                    <BigAmount
                        amount="$2,400"
                        label="OVERDUE"
                        tone="overdue"
                    />
                </div>
            ) : null }
            { paidOnScreen(frame) ? (
                <div
                    style={ {
                        alignItems: "center",
                        display: "flex",
                        gap: 28,
                        opacity: settled,
                        transform: `translateY(${(1 - settled) * 30}px)`,
                    } }
                >
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
            ) : null }
        </AbsoluteFill>
    );
}

export function BrandBeat() {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const enter = spring({
        config: { damping: 14, stiffness: 120 },
        fps,
        frame,
    });
    return (
        <AbsoluteFill
            style={ {
                alignItems: "center",
                background: theme.brandMint,
                justifyContent: "center",
            } }
        >
            <div
                style={ {
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    gap: 84,
                    opacity: enter,
                    padding: 80,
                    transform: `scale(${0.94 + enter * 0.06})`,
                } }
            >
                <Logo
                    markHeight={ 168 }
                    tone="mint"
                    wordmarkSize={ 92 }
                />
                <div
                    style={ {
                        color: theme.onMint,
                        fontFamily: fontDisplay,
                        fontSize: 48,
                        letterSpacing: -0.8,
                    } }
                >
                    From overdue to paid.
                </div>
            </div>
        </AbsoluteFill>
    );
}
