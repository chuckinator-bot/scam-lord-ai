/**
 * @module remotion/hype30/scenes
 * Picture for the 30-second hype film. Numbers on screen carry a Demo data tag.
 * Story figures come from the paused Mia/John pass.
 * Depends on: chrome, devices, demo30-story, fonts, hype30/beats, theme.
 * Used by: Hype30 film.
 */

import type { ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { DEMO30_FLAG_LINE, DEMO30_HARDSHIP_SCORE } from "../beats";
import { Logo, StatusBadge } from "../components/chrome";
import { Gauge, Phone, Waveform } from "../components/devices";
import {
    ASSISTANCE_URL,
    COLLECTED_DOLLARS,
    DEMO30_DISPUTE,
    DEMO30_DISTRESSED,
    LEDGER_ROWS,
    SCHEDULED_DOLLARS,
    WORK_ORDER,
    WORK_ORDER_WHEN,
} from "../demo30-story";
import { fontDisplay, fontSans } from "../fonts";
import { theme } from "../theme";
import { DEMO_TAG } from "./beats";

const OPEN_BALANCE = "$2,400";

function money(amount: number): string {
    const body = String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `$${body}.00`;
}

function SnapCut({ children }: { children: ReactNode }) {
    const frame = useCurrentFrame();
    const into = frame % 15;
    const dir = Math.floor(frame / 15) % 2 === 0 ? -1 : 1;
    const shift = interpolate(into, [0, 5], [36 * dir, 0], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const scale = interpolate(into, [0, 5], [1.07, 1], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    return (
        <AbsoluteFill style={ { transform: `translateX(${shift}px) scale(${scale})` } }>
            { children }
        </AbsoluteFill>
    );
}

function DemoTag() {
    return (
        <div
            style={ {
                background: theme.white,
                border: `2px solid ${theme.ink}`,
                borderRadius: theme.radiusPill,
                color: theme.ink,
                fontFamily: fontSans,
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 1.4,
                padding: "8px 14px",
                textTransform: "uppercase",
            } }
        >
            { DEMO_TAG }
        </div>
    );
}

function Stage({
    children,
    tone = "wash",
}: {
    children: ReactNode;
    tone?: "ink" | "mint" | "wash";
}) {
    const background = tone === "ink" ? theme.ink : tone === "mint" ? theme.mint : theme.bg;
    return (
        <AbsoluteFill
            style={ {
                background,
                fontFamily: fontSans,
                overflow: "hidden",
            } }
        >
            <SnapCut>
                <AbsoluteFill
                    style={ {
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "72px 96px 180px",
                    } }
                >
                    { children }
                </AbsoluteFill>
            </SnapCut>
        </AbsoluteFill>
    );
}

function LateScene() {
    return (
        <Stage tone="ink">
            <div style={ { alignItems: "center", display: "flex", flexDirection: "column", gap: 28 } }>
                <DemoTag />
                <div
                    style={ {
                        color: theme.mint,
                        fontFamily: fontDisplay,
                        fontSize: 160,
                        letterSpacing: -4,
                        lineHeight: 0.9,
                    } }
                >
                    { OPEN_BALANCE }
                </div>
                <StatusBadge
                    size="lg"
                    status="Overdue"
                />
                <div style={ { color: theme.mint, fontSize: 36, fontWeight: 700 } }>October rent</div>
            </div>
        </Stage>
    );
}

function CallScene() {
    return (
        <Stage>
            <Phone
                shake
                width={ 440 }
            >
                <div
                    style={ {
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                        gap: 18,
                        height: "100%",
                        justifyContent: "center",
                    } }
                >
                    <div
                        style={ {
                            color: theme.violet,
                            fontSize: 18,
                            fontWeight: 800,
                            letterSpacing: 1.6,
                        } }
                    >
                        CALLING
                    </div>
                    <div style={ { fontFamily: fontDisplay, fontSize: 72 } }>Mia</div>
                    <div style={ { color: theme.inkSoft, fontSize: 28, fontWeight: 700 } }>for John</div>
                    <Waveform height={ 64 } />
                </div>
            </Phone>
        </Stage>
    );
}

function RepairScene() {
    return (
        <Stage>
            <div
                style={ {
                    background: theme.white,
                    border: `3px solid ${theme.ink}`,
                    borderRadius: 28,
                    padding: "48px 64px",
                    textAlign: "center",
                } }
            >
                <div style={ { color: theme.inkSoft, fontSize: 22, fontWeight: 800, letterSpacing: 1.4 } }>
                    WORK ORDER
                </div>
                <div style={ { fontFamily: fontDisplay, fontSize: 84, marginTop: 8 } }>{ WORK_ORDER }</div>
                <div style={ { fontFamily: fontDisplay, fontSize: 56, marginTop: 8 } }>{ WORK_ORDER_WHEN }</div>
                <div style={ { marginTop: 22 } }>
                    <StatusBadge
                        size="lg"
                        status="In progress"
                    />
                </div>
            </div>
        </Stage>
    );
}

function OctoberScene() {
    return (
        <Stage tone="wash">
            <div style={ { alignItems: "center", display: "flex", flexDirection: "column", gap: 24 } }>
                <DemoTag />
                <div style={ { fontFamily: fontDisplay, fontSize: 120, letterSpacing: -3 } }>{ OPEN_BALANCE }</div>
                <StatusBadge
                    size="lg"
                    status="Overdue"
                />
                <div style={ { fontSize: 40, fontWeight: 700 } }>October unpaid</div>
            </div>
        </Stage>
    );
}

function LedgerScene() {
    return (
        <Stage>
            <div style={ { display: "flex", flexDirection: "column", gap: 18, width: 860 } }>
                <DemoTag />
                { LEDGER_ROWS.map(([month, state]) => (
                    <div
                        key={ month }
                        style={ {
                            alignItems: "center",
                            background: theme.white,
                            border: `2px solid ${theme.ink}`,
                            borderRadius: 18,
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "22px 28px",
                        } }
                    >
                        <div style={ { fontFamily: fontDisplay, fontSize: 48 } }>{ month }</div>
                        <span
                            style={ {
                                background: state === "Unpaid" ? theme.overdueBg : theme.waitingBg,
                                borderRadius: theme.radiusPill,
                                color: state === "Unpaid" ? theme.overdueInk : theme.waitingInk,
                                fontSize: 22,
                                fontWeight: 700,
                                padding: "8px 16px",
                            } }
                        >
                            { state }
                        </span>
                    </div>
                )) }
            </div>
        </Stage>
    );
}

function HoursScene() {
    return (
        <Stage tone="mint">
            <div
                style={ {
                    background: theme.ink,
                    borderRadius: 28,
                    color: theme.mint,
                    fontFamily: fontDisplay,
                    fontSize: 84,
                    lineHeight: 1,
                    padding: "42px 56px",
                } }
            >
                Hours got cut
            </div>
        </Stage>
    );
}

function HardshipScene() {
    return (
        <Stage>
            <div
                style={ {
                    background: theme.white,
                    border: `2px solid ${theme.border}`,
                    borderRadius: 24,
                    padding: "36px 48px",
                    width: 980,
                } }
            >
                <div style={ { alignItems: "center", display: "flex", justifyContent: "space-between" } }>
                    <div style={ { fontFamily: fontDisplay, fontSize: 42 } }>Jev</div>
                    <div style={ { display: "flex", gap: 12 } }>
                        <DemoTag />
                        <span
                            style={ {
                                background: theme.overdueBg,
                                borderRadius: theme.radiusPill,
                                color: theme.overdueInk,
                                fontSize: 22,
                                fontWeight: 800,
                                padding: "8px 16px",
                            } }
                        >
                            Flagged
                        </span>
                    </div>
                </div>
                <div style={ { marginTop: 28 } }>
                    <div style={ { fontSize: 22, fontWeight: 800, marginBottom: 8 } }>
                        Hardship
                        { " " }
                        { DEMO30_HARDSHIP_SCORE.toFixed(2) }
                    </div>
                    <Gauge
                        flagLine={ DEMO30_FLAG_LINE }
                        score={ DEMO30_HARDSHIP_SCORE }
                        width={ 880 }
                    />
                </div>
                <div style={ { display: "flex", gap: 18, marginTop: 28 } }>
                    <ScoreChip
                        label="Dispute"
                        score={ DEMO30_DISPUTE }
                    />
                    <ScoreChip
                        label="Distressed"
                        score={ DEMO30_DISTRESSED }
                    />
                </div>
            </div>
        </Stage>
    );
}

function ScoreChip({ label, score }: { label: string; score: number }) {
    return (
        <div
            style={ {
                background: theme.paidBg,
                borderRadius: 16,
                color: theme.paidInk,
                flex: 1,
                padding: "16px 18px",
            } }
        >
            <div style={ { fontSize: 16, fontWeight: 800, letterSpacing: 1.1 } }>{ label }</div>
            <div style={ { fontFamily: fontDisplay, fontSize: 40 } }>{ score.toFixed(2) }</div>
        </div>
    );
}

function SmsScene() {
    return (
        <Stage>
            <Phone width={ 420 }>
                <div
                    style={ {
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        height: "100%",
                        justifyContent: "flex-end",
                        paddingBottom: 12,
                    } }
                >
                    <div
                        style={ {
                            background: theme.mint,
                            borderRadius: 18,
                            color: theme.ink,
                            fontFamily: fontDisplay,
                            fontSize: 32,
                            padding: "18px 16px",
                        } }
                    >
                        { ASSISTANCE_URL }
                    </div>
                    <div style={ { color: theme.inkSoft, fontSize: 16, fontWeight: 700 } }>Text message</div>
                </div>
            </Phone>
        </Stage>
    );
}

function MoneyScene({
    amount,
    chip,
    line,
}: {
    amount: string;
    chip: "Paid" | "Plan active";
    line: string;
}) {
    return (
        <Stage tone={ chip === "Paid" ? "mint" : "wash" }>
            <div style={ { alignItems: "center", display: "flex", flexDirection: "column", gap: 22 } }>
                <DemoTag />
                <div style={ { fontFamily: fontDisplay, fontSize: 120, letterSpacing: -3 } }>{ amount }</div>
                <StatusBadge
                    size="lg"
                    status={ chip }
                />
                <div style={ { fontSize: 36, fontWeight: 700 } }>{ line }</div>
            </div>
        </Stage>
    );
}

function CheckMark() {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            height="42"
            viewBox="0 0 32 32"
            width="42"
        >
            <path
                d="M7 16.5l6 6L25 10"
                stroke={ theme.paidInk }
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
            />
        </svg>
    );
}

function ReceivedScene() {
    return (
        <Stage tone="mint">
            <div
                style={ {
                    alignItems: "center",
                    background: theme.paidBg,
                    borderRadius: 28,
                    color: theme.paidInk,
                    display: "flex",
                    gap: 28,
                    padding: "40px 52px",
                } }
            >
                <div
                    style={ {
                        alignItems: "center",
                        background: theme.white,
                        borderRadius: 48,
                        display: "flex",
                        height: 96,
                        justifyContent: "center",
                        width: 96,
                    } }
                >
                    <CheckMark />
                </div>
                <div>
                    <DemoTag />
                    <div style={ { fontFamily: fontDisplay, fontSize: 88, letterSpacing: -2, marginTop: 8 } }>
                        $1,200
                    </div>
                    <div style={ { fontSize: 32, fontWeight: 800 } }>Payment received</div>
                </div>
            </div>
        </Stage>
    );
}

function HomeScene() {
    const frame = useCurrentFrame();
    const zoom = interpolate(frame, [60, 90], [1, 1.55], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const lift = interpolate(frame, [60, 90], [0, -40], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const tiles = [
        { label: "Rent recovered", value: money(COLLECTED_DOLLARS) },
        { label: "Still overdue", value: money(SCHEDULED_DOLLARS) },
        { label: "Promised on plans", value: money(SCHEDULED_DOLLARS) },
        { label: "Time to first call", value: "—" },
    ];
    return (
        <Stage>
            <div style={ { transform: `translateY(${lift}px) scale(${zoom})`, width: 1100 } }>
                <div style={ { marginBottom: 16 } }>
                    <DemoTag />
                </div>
                <div style={ { display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" } }>
                    { tiles.map((tile, index) => (
                        <div
                            key={ tile.label }
                            style={ {
                                background: theme.white,
                                border: index === 0 ? `3px solid ${theme.violet}` : `1px solid ${theme.border}`,
                                borderRadius: 20,
                                boxShadow: index === 0 ? `0 0 0 6px ${theme.activeBg}` : undefined,
                                padding: "20px 22px",
                            } }
                        >
                            <div
                                style={ {
                                    color: theme.mutedInk,
                                    fontSize: 16,
                                    fontWeight: 800,
                                    letterSpacing: 1.5,
                                    textTransform: "uppercase",
                                } }
                            >
                                { tile.label }
                            </div>
                            <div
                                style={ {
                                    fontSize: 42,
                                    fontVariantNumeric: "tabular-nums",
                                    fontWeight: 700,
                                    marginTop: 8,
                                } }
                            >
                                { tile.value }
                            </div>
                        </div>
                    )) }
                </div>
            </div>
        </Stage>
    );
}

function BrandScene() {
    const frame = useCurrentFrame();
    const scale = interpolate(frame, [0, 8], [1.08, 1], {
        easing: Easing.out(Easing.cubic),
        extrapolateRight: "clamp",
    });
    return (
        <AbsoluteFill
            style={ {
                alignItems: "center",
                background: theme.mint,
                justifyContent: "center",
            } }
        >
            <div style={ { textAlign: "center", transform: `scale(${scale})` } }>
                <Logo
                    markHeight={ 128 }
                    tone="mint"
                    wordmarkSize={ 96 }
                />
                <div
                    style={ {
                        color: theme.ink,
                        fontFamily: fontDisplay,
                        fontSize: 54,
                        marginTop: 36,
                    } }
                >
                    From overdue to paid.
                </div>
            </div>
        </AbsoluteFill>
    );
}

export function HypeScene({ id }: { id: string }) {
    if (id === "late") {
        return <LateScene />;
    }
    if (id === "call") {
        return <CallScene />;
    }
    if (id === "repair") {
        return <RepairScene />;
    }
    if (id === "october") {
        return <OctoberScene />;
    }
    if (id === "ledger") {
        return <LedgerScene />;
    }
    if (id === "hours") {
        return <HoursScene />;
    }
    if (id === "hardship") {
        return <HardshipScene />;
    }
    if (id === "sms") {
        return <SmsScene />;
    }
    if (id === "today") {
        return (
            <MoneyScene
                amount="$1,200"
                chip="Plan active"
                line="today"
            />
        );
    }
    if (id === "eighteenth") {
        return (
            <MoneyScene
                amount="$1,200"
                chip="Plan active"
                line="by the 18th"
            />
        );
    }
    if (id === "received") {
        return <ReceivedScene />;
    }
    if (id === "home") {
        return <HomeScene />;
    }
    return <BrandScene />;
}
