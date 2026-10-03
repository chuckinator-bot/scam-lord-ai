/**
 * @module remotion/story
 * Portfolio, agent floor, call, hardship, payment, and the closing lockup.
 * Depends on: chrome, devices, AgentChain, theme, fonts.
 * Used by: Films.
 */

import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
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
import { Gauge, Phone, Waveform } from "../components/devices";
import { fontDisplay, fontSans } from "../fonts";
import { theme, type TStatus } from "../theme";

const ROWS: ReadonlyArray<{
    name: string;
    place: string;
    due: string;
    amount: string;
    status: TStatus;
}> = [
    {
        amount: "$2,400.00",
        due: "Oct 1, 2026",
        name: "John Smith",
        place: "Sunset Properties · Unit 4",
        status: "Overdue",
    },
    {
        amount: "$960.00",
        due: "Aug 28, 2026",
        name: "Casey Diaz",
        place: "9 Alder · Unit 2",
        status: "Overdue",
    },
    {
        amount: "$1,800.00",
        due: "Sep 1, 2026",
        name: "Avery Cole",
        place: "14 Birch · Unit 1",
        status: "In progress",
    },
    {
        amount: "$2,400.00",
        due: "Sep 3, 2026",
        name: "Blake Nguyen",
        place: "2 Cedar · Unit 3",
        status: "Waiting on payment",
    },
];

function countTo(frame: number, end: number): number {
    return Math.round(interpolate(frame, [8, 78], [0, end], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    }));
}

export function PortfolioScene() {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const importOpacity = interpolate(frame, [96, 118], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const tableIn = spring({
        config: { damping: 16, stiffness: 120 },
        fps,
        frame: frame - 100,
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
                        opacity: tableIn,
                        padding: "8px 14px",
                    } }
                >
                    <LockIcon />
                    Row-level security
                </div>
            ) }
            section="Portfolio"
            title="Portfolio"
        >
            <div
                style={ {
                    inset: 0,
                    opacity: importOpacity,
                    pointerEvents: "none",
                    position: "absolute",
                } }
            >
                <div
                    style={ {
                        background: theme.surface,
                        border: `1px solid ${theme.border}`,
                        borderRadius: theme.radiusLg,
                        margin: "120px auto 0",
                        padding: "28px 36px",
                        width: 860,
                    } }
                >
                    <div style={ labelStyle }>APPFOLIO IMPORT</div>
                    <div
                        style={ {
                            fontFamily: fontDisplay,
                            fontSize: 40,
                            marginTop: 8,
                        } }
                    >
                        Synced to Supabase
                    </div>
                    <div style={ { display: "flex", gap: 18, marginTop: 28 } }>
                        { [
                            ["Properties", countTo(frame, 18)],
                            ["Units", countTo(frame, 64)],
                            ["Tenancies", countTo(frame, 64)],
                        ].map(([label, value]) => (
                            <div
                                key={ String(label) }
                                style={ {
                                    background: theme.surfaceSunken,
                                    borderRadius: theme.radiusLg,
                                    flex: 1,
                                    padding: "18px 20px",
                                } }
                            >
                                <div style={ labelStyle }>{ label }</div>
                                <div
                                    style={ {
                                        fontFamily: fontDisplay,
                                        fontSize: 56,
                                        fontVariantNumeric: "tabular-nums",
                                        marginTop: 8,
                                    } }
                                >
                                    { value }
                                </div>
                            </div>
                        )) }
                    </div>
                </div>
            </div>
            <div
                style={ {
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: theme.radiusLg,
                    opacity: tableIn,
                    overflow: "hidden",
                    transform: `translateY(${(1 - tableIn) * 28}px)`,
                } }
            >
                <div
                    style={ {
                        background: theme.surfaceSunken,
                        display: "grid",
                        gridTemplateColumns: "1.2fr 1.6fr 0.8fr 0.7fr 1fr",
                        padding: "12px 20px",
                        ...labelStyle,
                    } }
                >
                    <span>Tenant</span>
                    <span>Property</span>
                    <span>Due</span>
                    <span style={ { textAlign: "right" } }>Amount</span>
                    <span style={ { textAlign: "right" } }>Status</span>
                </div>
                { ROWS.map((row, index) => {
                    const rowIn = spring({
                        config: { damping: 14, stiffness: 140 },
                        fps,
                        frame: frame - 108 - index * 8,
                    });
                    return (
                        <div
                            key={ row.name }
                            style={ {
                                alignItems: "center",
                                borderTop: `1px solid ${theme.border}`,
                                display: "grid",
                                gridTemplateColumns: "1.2fr 1.6fr 0.8fr 0.7fr 1fr",
                                opacity: rowIn,
                                padding: "16px 20px",
                            } }
                        >
                            <span style={ { fontWeight: 600 } }>{ row.name }</span>
                            <span style={ { color: theme.mutedInk, fontSize: 15 } }>{ row.place }</span>
                            <span style={ { fontSize: 15 } }>{ row.due }</span>
                            <span
                                style={ {
                                    fontSize: 18,
                                    fontVariantNumeric: "tabular-nums",
                                    fontWeight: 600,
                                    textAlign: "right",
                                } }
                            >
                                { row.amount }
                            </span>
                            <span style={ { textAlign: "right" } }>
                                <StatusBadge status={ row.status } />
                            </span>
                        </div>
                    );
                }) }
            </div>
        </AppShell>
    );
}

export function WebhookScene() {
    const frame = useCurrentFrame();
    const lit = interpolate(frame, [16, 168], [0, 7.2], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const pull = interpolate(frame, [0, 28], [0, 1], {
        easing: Easing.out(Easing.cubic),
        extrapolateRight: "clamp",
    });
    const scale = interpolate(pull, [0, 1], [1.28, 1]);
    const shift = interpolate(pull, [0, 1], [220, 0]);
    const blur = interpolate(frame, [0, 22], [4, 0], { extrapolateRight: "clamp" });
    const ring = interpolate(frame, [150, 170], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const activeIndex = Math.min(6, Math.floor(lit));
    const steps = ["invoice", "workflow_start", "disclosure", "jev", "policy", "plan", "payment_link"] as const;

    return (
        <AbsoluteFill style={ { background: theme.bg, fontFamily: fontSans } }>
            <DotField />
            <div
                style={ {
                    left: 48,
                    position: "absolute",
                    right: 48,
                    top: 36,
                } }
            >
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
                    display: "flex",
                    filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
                    justifyContent: "center",
                    left: 0,
                    position: "absolute",
                    right: 0,
                    top: 250,
                    transform: `translateX(${shift}px) scale(${scale})`,
                } }
            >
                <AgentChain
                    active={ steps[activeIndex] ?? "invoice" }
                    litThrough={ lit }
                    showHandoff
                    tenant="John Smith"
                />
            </div>
            <div
                style={ {
                    bottom: 188,
                    opacity: ring,
                    position: "absolute",
                    right: 64,
                    transform: `translateY(${(1 - ring) * 20}px)`,
                } }
            >
                <Phone
                    shake
                    width={ 220 }
                >
                    <div style={ labelStyle }>Calling</div>
                    <div style={ { fontFamily: fontDisplay, fontSize: 26, marginTop: 12 } }>John Smith</div>
                    <div style={ { marginTop: 20 } }>
                        <Waveform
                            bars={ 12 }
                            color={ theme.violet }
                            height={ 48 }
                        />
                    </div>
                </Phone>
            </div>
        </AbsoluteFill>
    );
}

const TURNS: ReadonlyArray<{
    at: number;
    plan: boolean;
    speaker: string;
    text: string;
    tenant: boolean;
}> = [
    {
        at: 8,
        plan: false,
        speaker: "RentRecovery · AI",
        tenant: false,
        text: "Hi John, this is RentRecovery, an AI assistant calling on behalf of Sunset Properties. The open balance is $2,400.00.",
    },
    {
        at: 120,
        plan: false,
        speaker: "John Smith",
        tenant: true,
        text: "Can I split this into 4 payments?",
    },
    {
        at: 300,
        plan: true,
        speaker: "RentRecovery · AI",
        tenant: false,
        text: "$800.00 today and $1,600.00 on the 14th. We'll mow the lawn Saturday.",
    },
    {
        at: 430,
        plan: false,
        speaker: "John Smith",
        tenant: true,
        text: "Send the link.",
    },
];

export function CallScene() {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const lit = frame < 120 ? 3 : frame < 220 ? 4.2 : frame < 310 ? 5.15 : 6.3;
    const active = frame < 120 ? "disclosure" : frame < 220 ? "jev" : frame < 310 ? "policy" : "plan";
    const policyIn = spring({
        config: { damping: 14, stiffness: 140 },
        fps,
        frame: frame - 200,
    });

    return (
        <AbsoluteFill style={ { background: theme.bg, color: theme.ink, fontFamily: fontSans } }>
            <div style={ { left: 48, position: "absolute", right: 48, top: 28 } }>
                <div style={ { alignItems: "center", display: "flex", justifyContent: "space-between" } }>
                    <div style={ labelStyle }>On the call</div>
                    <StatusBadge status="In progress" />
                </div>
                <div style={ { display: "flex", justifyContent: "center", marginTop: 16 } }>
                    <AgentChain
                        active={ active }
                        litThrough={ lit }
                        nodeWidth={ 156 }
                        showHandoff={ false }
                        tenant="John Smith"
                    />
                </div>
            </div>
            <div
                style={ {
                    bottom: 170,
                    display: "flex",
                    gap: 28,
                    left: 56,
                    position: "absolute",
                    right: 56,
                    top: 210,
                } }
            >
                <div style={ { display: "flex", flex: 1.35, flexDirection: "column", gap: 14 } }>
                    <Waveform
                        bars={ 32 }
                        color={ theme.ink }
                        height={ 48 }
                    />
                    { TURNS.map((turn) => {
                        const shown = spring({
                            config: { damping: 14, stiffness: 150 },
                            fps,
                            frame: frame - turn.at,
                        });
                        if (frame < turn.at) {
                            return null;
                        }
                        return (
                            <div
                                key={ turn.text }
                                style={ {
                                    alignSelf: turn.tenant ? "flex-end" : "flex-start",
                                    background: turn.tenant ? theme.surfaceSunken : theme.surface,
                                    border: turn.plan
                                        ? `2px solid ${theme.violet}`
                                        : `1px solid ${theme.border}`,
                                    borderRadius: theme.radiusMd,
                                    maxWidth: 760,
                                    opacity: shown,
                                    padding: "14px 16px",
                                    transform: `translateY(${(1 - shown) * 12}px)`,
                                } }
                            >
                                <div style={ labelStyle }>{ turn.speaker }</div>
                                <div style={ { fontSize: 20, lineHeight: "28px", marginTop: 6 } }>{ turn.text }</div>
                            </div>
                        );
                    }) }
                </div>
                <div
                    style={ {
                        background: theme.surface,
                        border: `2px solid ${theme.violet}`,
                        borderRadius: theme.radiusLg,
                        opacity: policyIn,
                        padding: "22px 24px",
                        transform: `translateX(${(1 - policyIn) * 24}px)`,
                        width: 420,
                    } }
                >
                    <div style={ labelStyle }>Policy</div>
                    <PolicyRow
                        label="Maximum installments"
                        value="2"
                    />
                    <PolicyRow
                        label="Grace window"
                        value="14 days"
                    />
                    <PolicyRow
                        label="Fee-waiver cap"
                        value="$0.00"
                    />
                    <div
                        style={ {
                            background: theme.overdueBg,
                            borderRadius: theme.radiusMd,
                            color: theme.overdueInk,
                            marginTop: 22,
                            padding: "12px 14px",
                        } }
                    >
                        <div style={ labelStyle }>Asked</div>
                        <div style={ { fontFamily: fontDisplay, fontSize: 28, marginTop: 4 } }>4 payments</div>
                    </div>
                    <div style={ { fontFamily: fontDisplay, fontSize: 28, marginTop: 18 } }>
                        $800.00 today
                    </div>
                    <div style={ { fontFamily: fontDisplay, fontSize: 28, marginTop: 6 } }>
                        $1,600.00 on the 14th
                    </div>
                    <div style={ { color: theme.mutedInk, fontSize: 16, marginTop: 12 } }>
                        Lawn mowed Saturday
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
}

function PolicyRow({ label, value }: { label: string; value: string }) {
    return (
        <div
            style={ {
                borderBottom: `1px solid ${theme.border}`,
                display: "flex",
                fontSize: 16,
                justifyContent: "space-between",
                padding: "10px 0",
            } }
        >
            <span>{ label }</span>
            <span style={ { fontVariantNumeric: "tabular-nums", fontWeight: 600 } }>{ value }</span>
        </div>
    );
}

export function HardshipScene() {
    const frame = useCurrentFrame();
    const casey = frame >= 132;
    const local = casey ? frame - 132 : frame;
    const score = casey
        ? interpolate(local, [0, 36], [0.2, 0.82], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        : interpolate(local, [0, 24], [0, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const name = casey ? "Casey Diaz" : "John Smith";
    const place = casey ? "9 Alder · $960.00" : "Sunset Properties · $2,400.00";
    const status: TStatus = casey && score >= 0.35 ? "Waiting on a person" : "In progress";

    return (
        <AbsoluteFill style={ { background: theme.bg, color: theme.ink, fontFamily: fontSans } }>
            <div style={ { left: 72, position: "absolute", right: 72, top: 48 } }>
                <div style={ { alignItems: "center", display: "flex", justifyContent: "space-between" } }>
                    <div>
                        <div style={ labelStyle }>Jev check · Hardship</div>
                        <div style={ { fontFamily: fontDisplay, fontSize: 48, marginTop: 8 } }>{ name }</div>
                        <div style={ { color: theme.mutedInk, fontSize: 18, marginTop: 4 } }>{ place }</div>
                    </div>
                    <StatusBadge
                        size="lg"
                        status={ status }
                    />
                </div>
                <div style={ { marginTop: 36 } }>
                    <div
                        style={ {
                            fontFamily: fontDisplay,
                            fontSize: 88,
                            fontVariantNumeric: "tabular-nums",
                            letterSpacing: -2,
                        } }
                    >
                        { score.toFixed(2) }
                    </div>
                    <div style={ { marginTop: 12 } }>
                        <Gauge score={ score } />
                    </div>
                </div>
                <div style={ { display: "flex", gap: 18, marginTop: 28 } }>
                    <MiniScore
                        label="Dispute"
                        value={ casey ? 0.1 : 0.04 }
                    />
                    <MiniScore
                        label="Distressed"
                        value={ casey ? 0.4 : 0.06 }
                    />
                </div>
                { casey ? (
                    <div style={ { alignItems: "stretch", display: "flex", gap: 18, marginTop: 28 } }>
                        <div
                            style={ {
                                background: theme.surfaceSunken,
                                borderRadius: theme.radiusMd,
                                maxWidth: 760,
                                padding: "16px 18px",
                            } }
                        >
                            <div style={ labelStyle }>Casey Diaz</div>
                            <div style={ { fontSize: 22, marginTop: 6 } }>{ "I lost my job. I can't pay this." }</div>
                            <div style={ { ...labelStyle, marginTop: 14 } }>RentRecovery · AI</div>
                            <div style={ { fontSize: 22, marginTop: 6 } }>
                                A person from Sunset Properties will follow up with you.
                            </div>
                        </div>
                        { score >= 0.35 ? (
                            <div
                                style={ {
                                    background: theme.activeBg,
                                    border: `2px solid ${theme.violet}`,
                                    borderRadius: theme.radiusLg,
                                    padding: "16px 18px",
                                    width: 280,
                                } }
                            >
                                <div style={ labelStyle }>Handoff</div>
                                <div style={ { fontFamily: fontDisplay, fontSize: 28, marginTop: 8 } }>Casey Diaz</div>
                                <div style={ { marginTop: 12 } }>
                                    <StatusBadge status="Waiting on a person" />
                                </div>
                            </div>
                        ) : null }
                    </div>
                ) : null }
            </div>
        </AbsoluteFill>
    );
}

function MiniScore({ label, value }: { label: string; value: number }) {
    return (
        <div
            style={ {
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: theme.radiusLg,
                padding: "14px 18px",
                width: 220,
            } }
        >
            <div style={ labelStyle }>{ label }</div>
            <div
                style={ {
                    fontFamily: fontDisplay,
                    fontSize: 32,
                    fontVariantNumeric: "tabular-nums",
                    marginTop: 6,
                } }
            >
                { value.toFixed(2) }
            </div>
        </div>
    );
}

export function PayScene() {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const messages = spring({ config: { damping: 14, stiffness: 140 }, fps, frame: frame - 4 });
    const checkout = spring({ config: { damping: 14, stiffness: 130 }, fps, frame: frame - 48 });
    const paid = interpolate(frame, [118, 136], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const planActive = frame >= 156;

    return (
        <AbsoluteFill style={ { background: theme.bg, color: theme.ink, fontFamily: fontSans } }>
            <div
                style={ {
                    display: "flex",
                    gap: 28,
                    left: 56,
                    opacity: messages,
                    position: "absolute",
                    top: 48,
                } }
            >
                <Phone width={ 280 }>
                    <div style={ labelStyle }>Text</div>
                    <div
                        style={ {
                            background: theme.surfaceSunken,
                            borderRadius: theme.radiusMd,
                            fontSize: 18,
                            lineHeight: "26px",
                            marginTop: 16,
                            padding: "12px 14px",
                        } }
                    >
                        Sunset Properties: your plan is ready. Pay $800.00 today.
                    </div>
                </Phone>
                <div
                    style={ {
                        background: theme.surface,
                        border: `1px solid ${theme.border}`,
                        borderRadius: theme.radiusLg,
                        padding: "20px 22px",
                        width: 420,
                    } }
                >
                    <div style={ labelStyle }>Email</div>
                    <div style={ { fontWeight: 600, marginTop: 12 } }>Payment link for John Smith</div>
                    <div style={ { color: theme.mutedInk, fontSize: 16, marginTop: 6 } }>
                        john.smith@sunset.example
                    </div>
                    <div style={ { fontSize: 18, lineHeight: "26px", marginTop: 16 } }>
                        $800.00 today and $1,600.00 on the 14th.
                    </div>
                </div>
            </div>
            <div
                style={ {
                    background: theme.surface,
                    border: `2px solid ${theme.onMint}`,
                    borderRadius: theme.radiusLg,
                    opacity: checkout,
                    padding: "28px 32px",
                    position: "absolute",
                    right: 72,
                    top: 80,
                    transform: `translateY(${(1 - checkout) * 24}px) scale(${0.96 + checkout * 0.04})`,
                    width: 520,
                } }
            >
                <div style={ labelStyle }>Checkout</div>
                <div style={ { fontFamily: fontDisplay, fontSize: 64, letterSpacing: -1, marginTop: 8 } }>
                    $800.00
                </div>
                <div style={ { color: theme.mutedInk, marginTop: 4 } }>Sunset Properties · today</div>
                <div
                    style={ {
                        border: `2px solid ${theme.borderStrong}`,
                        borderRadius: theme.radiusSm,
                        fontSize: 18,
                        marginTop: 22,
                        padding: "12px 14px",
                    } }
                >
                    Card ···· 4242
                </div>
                <div
                    style={ {
                        alignItems: "center",
                        background: paid > 0.5 ? theme.paidBg : theme.violet,
                        borderRadius: theme.radiusMd,
                        color: paid > 0.5 ? theme.paidInk : theme.onViolet,
                        display: "flex",
                        fontSize: 18,
                        fontWeight: 600,
                        gap: 10,
                        height: 52,
                        justifyContent: "center",
                        marginTop: 16,
                    } }
                >
                    { paid > 0.5 ? <Tick size={ 26 } /> : null }
                    { paid > 0.5 ? "Paid" : "Pay $800.00" }
                </div>
            </div>
            <div
                style={ {
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: theme.radiusLg,
                    bottom: 180,
                    left: 56,
                    padding: "16px 20px",
                    position: "absolute",
                    right: 640,
                } }
            >
                <div style={ labelStyle }>Calls</div>
                <div
                    style={ {
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 12,
                    } }
                >
                    <div>
                        <div style={ { fontWeight: 600 } }>John Smith</div>
                        <div style={ { color: theme.mutedInk, fontSize: 15 } }>Sunset Properties · $2,400.00</div>
                    </div>
                    <StatusBadge status={ planActive ? "Plan active" : "Waiting on payment" } />
                </div>
            </div>
        </AbsoluteFill>
    );
}

const STACK = ["Supabase", "Claude", "LiveKit", "ElevenLabs", "Stripe", "Twilio"] as const;

export function LockupScene() {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const enter = spring({ config: { damping: 14, stiffness: 120 }, fps, frame });
    return (
        <AbsoluteFill
            style={ {
                alignItems: "center",
                background: theme.brandMint,
                justifyContent: "center",
                paddingBottom: 150,
            } }
        >
            <div
                style={ {
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    opacity: enter,
                    transform: `translateY(${(1 - enter) * 20}px)`,
                } }
            >
                <div style={ { padding: 70 } }>
                    <Logo
                        markHeight={ 140 }
                        tone="mint"
                        wordmarkSize={ 76 }
                    />
                </div>
                <div
                    style={ {
                        color: theme.onMint,
                        fontFamily: fontDisplay,
                        fontSize: 40,
                        letterSpacing: -0.6,
                    } }
                >
                    From overdue to paid.
                </div>
                <div style={ { display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 48, maxWidth: 1100 } }>
                    { STACK.map((name, index) => {
                        const chip = spring({
                            config: { damping: 14, stiffness: 160 },
                            fps,
                            frame: frame - 10 - index * 3,
                        });
                        return (
                            <div
                                key={ name }
                                style={ {
                                    background: theme.surface,
                                    border: `2px solid ${theme.onMint}`,
                                    borderRadius: theme.radiusPill,
                                    color: theme.onMint,
                                    fontFamily: fontSans,
                                    fontSize: 22,
                                    fontWeight: 600,
                                    opacity: chip,
                                    padding: "10px 18px",
                                } }
                            >
                                { name }
                            </div>
                        );
                    }) }
                </div>
            </div>
        </AbsoluteFill>
    );
}

export function TeaserChainScene() {
    const frame = useCurrentFrame();
    const lit = interpolate(frame, [6, 90], [0, 7], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const steps = ["invoice", "workflow_start", "disclosure", "jev", "policy", "plan", "payment_link"] as const;
    const active = steps[Math.min(steps.length - 1, Math.floor(lit))] ?? "invoice";
    return (
        <AbsoluteFill style={ { background: theme.bg } }>
            <DotField />
            <div style={ { left: 64, position: "absolute", top: 48 } }>
                <Logo
                    markHeight={ 44 }
                    tone="mint"
                    wordmarkSize={ 24 }
                />
            </div>
            <div style={ { left: 64, position: "absolute", right: 64, top: 130 } }>
                <AgentBanner
                    detail="John Smith · invoice.overdue · $2,400.00"
                    status="In progress"
                />
            </div>
            <AbsoluteFill style={ { alignItems: "center", justifyContent: "center", paddingBottom: 80 } }>
                <AgentChain
                    active={ active }
                    litThrough={ lit }
                    showHandoff
                    tenant="John Smith"
                />
            </AbsoluteFill>
        </AbsoluteFill>
    );
}

export function TeaserOfferScene() {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const inn = spring({ config: { damping: 13, stiffness: 140 }, fps, frame: frame - 8 });
    return (
        <AbsoluteFill
            style={ {
                background: theme.bg,
                color: theme.ink,
                fontFamily: fontSans,
                padding: "72px 80px 180px",
            } }
        >
            <div style={ labelStyle }>Policy cap</div>
            <div style={ { display: "flex", gap: 24, marginTop: 28 } }>
                <div
                    style={ {
                        background: theme.overdueBg,
                        borderRadius: theme.radiusLg,
                        color: theme.overdueInk,
                        padding: "22px 26px",
                    } }
                >
                    <div style={ labelStyle }>Asked</div>
                    <div style={ { fontFamily: fontDisplay, fontSize: 42, marginTop: 6 } }>4 payments</div>
                </div>
                <div
                    style={ {
                        background: theme.surface,
                        border: `2px solid ${theme.violet}`,
                        borderRadius: theme.radiusLg,
                        padding: "22px 26px",
                    } }
                >
                    <div style={ labelStyle }>Maximum installments</div>
                    <div style={ { fontFamily: fontDisplay, fontSize: 42, marginTop: 6 } }>2</div>
                </div>
            </div>
            <div
                style={ {
                    marginTop: 48,
                    opacity: inn,
                    transform: `translateY(${(1 - inn) * 16}px)`,
                } }
            >
                <div style={ { fontFamily: fontDisplay, fontSize: 76, letterSpacing: -1.5 } }>$800.00 today</div>
                <div style={ { fontFamily: fontDisplay, fontSize: 76, letterSpacing: -1.5, marginTop: 8 } }>
                    $1,600.00 on the 14th
                </div>
                <div
                    style={ {
                        background: theme.paidBg,
                        borderRadius: theme.radiusPill,
                        color: theme.paidInk,
                        display: "inline-block",
                        fontSize: 24,
                        fontWeight: 600,
                        marginTop: 28,
                        padding: "10px 18px",
                    } }
                >
                    Lawn mowed Saturday
                </div>
            </div>
        </AbsoluteFill>
    );
}
