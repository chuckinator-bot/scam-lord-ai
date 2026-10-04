/**
 * @module remotion/submission/scenes
 * Picture for the six submission sections. On-screen words come from narration.ts.
 * Depends on: captions, chrome, devices, floor-layout, home-data, narration, theme, timing.
 * Used by: Film.
 */

import type { ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { AgentChain } from "../components/AgentChain";
import { Logo, StatusBadge } from "../components/chrome";
import { Phone, Waveform } from "../components/devices";
import { fontDisplay, fontSans } from "../fonts";
import { MAIN_PATH, STEP_LABEL } from "../floor-layout";
import { theme } from "../theme";
import { ASSET_FLAGS } from "./asset-flags";
import { localFrameAtPhrase } from "./captions";
import {
    DEMO_DATA_TAG,
    HOME_TILES,
    NEEDS_YOU,
    NEEDS_YOU_HEADING,
    OPEN_CALL,
    type IHomeTile,
} from "./home-data";
import {
    CALLOUT_FILINGS,
    CALLOUT_SATISFIED,
    CLOSE_TAGLINE,
    LIVE_CALL_LINES,
    LIVE_CALL_SLATE,
    STAT_BEHIND,
    STAT_BURDEN,
    STAT_RENT,
} from "./narration";
import { LIVE_CALL_WINDOW, sectionById, sectionFrames } from "./timing";

const BOTTOM_SAFE = 170;

function fadeIn(local: number): number {
    return interpolate(local, [0, 10], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
}

function StatsScene() {
    const frame = useCurrentFrame();
    const cues = [
        0,
        localFrameAtPhrase("stats", "Nearly"),
        localFrameAtPhrase("stats", "That's not bad"),
    ];
    const lines = [STAT_RENT, STAT_BEHIND, STAT_BURDEN];
    const index = frame >= cues[2] ? 2 : frame >= cues[1] ? 1 : 0;
    const local = frame - cues[index];
    const dark = index !== 1;
    const size = index === 2 ? 64 : 92;
    return (
        <AbsoluteFill
            style={ {
                alignItems: "center",
                background: dark ? theme.ink : theme.mint,
                color: dark ? theme.mint : theme.ink,
                fontFamily: fontDisplay,
                justifyContent: "center",
                padding: 120,
            } }
        >
            <div
                style={ {
                    fontSize: size,
                    letterSpacing: -1.5,
                    lineHeight: 1.05,
                    maxWidth: 1500,
                    opacity: fadeIn(local),
                    textAlign: "center",
                    transform: `translateY(${interpolate(local, [0, 10], [16, 0], { extrapolateRight: "clamp" })}px)`,
                } }
            >
                { lines[index] }
            </div>
        </AbsoluteFill>
    );
}

function Paper({ children, tall = false }: { children: ReactNode; tall?: boolean }) {
    return (
        <div
            style={ {
                background: theme.white,
                border: `3px solid ${theme.ink}`,
                borderRadius: 6,
                boxShadow: "8px 10px 0 rgba(16, 36, 27, 0.12)",
                height: tall ? 600 : 560,
                padding: 28,
                width: 400,
            } }
        >
            { children }
        </div>
    );
}

function Rule({ width }: { width: string }) {
    return (
        <div
            style={ {
                background: theme.border,
                height: 8,
                marginBottom: 10,
                width,
            } }
        />
    );
}

function LateFeeLetter() {
    return (
        <Paper>
            <Rule width="72%" />
            <Rule width="90%" />
            <Rule width="64%" />
            <div
                style={ {
                    border: `4px solid ${theme.overdueInk}`,
                    color: theme.overdueInk,
                    fontFamily: fontDisplay,
                    fontSize: 40,
                    letterSpacing: 1,
                    marginTop: 64,
                    padding: "16px 10px",
                    textAlign: "center",
                    transform: "rotate(-8deg)",
                } }
            >
                LATE FEE
            </div>
        </Paper>
    );
}

function DoorNotice() {
    return (
        <div
            style={ {
                background: theme.ink,
                borderRadius: 10,
                height: 620,
                position: "relative",
                width: 340,
            } }
        >
            <div
                style={ {
                    background: theme.mint,
                    border: `3px solid ${theme.mint}`,
                    color: theme.ink,
                    fontFamily: fontDisplay,
                    fontSize: 32,
                    left: 42,
                    padding: "18px 14px",
                    position: "absolute",
                    textAlign: "center",
                    top: 48,
                    transform: "rotate(3deg)",
                    width: 190,
                } }
            >
                NOTICE
            </div>
            <div
                style={ {
                    background: theme.mint,
                    borderRadius: 28,
                    height: 72,
                    position: "absolute",
                    right: 28,
                    top: 230,
                    width: 36,
                } }
            />
        </div>
    );
}

function CourtForm() {
    return (
        <Paper tall>
            <div
                style={ {
                    color: theme.ink,
                    fontFamily: fontSans,
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: 1.4,
                } }
            >
                COURT
            </div>
            <div
                style={ {
                    fontFamily: fontDisplay,
                    fontSize: 44,
                    margin: "8px 0 22px",
                } }
            >
                SUMMONS
            </div>
            <Rule width="100%" />
            <Rule width="92%" />
            <Rule width="80%" />
            <Rule width="96%" />
            <Rule width="70%" />
        </Paper>
    );
}

function Illustration({
    at,
    children,
    label,
}: {
    at: number;
    children: ReactNode;
    label: string;
}) {
    const frame = useCurrentFrame();
    const local = frame - at;
    const shown = local >= 0;
    return (
        <div
            style={ {
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                opacity: shown ? fadeIn(local) : 0,
                transform: `translateY(${shown ? interpolate(local, [0, 12], [20, 0], { extrapolateRight: "clamp" }) : 20}px)`,
                width: 460,
            } }
        >
            { children }
            <div
                style={ {
                    color: theme.inkSoft,
                    fontFamily: fontSans,
                    fontSize: 28,
                    fontWeight: 700,
                } }
            >
                { label }
            </div>
        </div>
    );
}

function Callout({ at, text }: { at: number; text: string }) {
    const frame = useCurrentFrame();
    const local = frame - at;
    if (local < 0) {
        return null;
    }
    return (
        <div
            style={ {
                background: theme.ink,
                borderRadius: theme.radiusPill,
                color: theme.mint,
                fontFamily: fontSans,
                fontSize: 36,
                fontWeight: 700,
                opacity: fadeIn(local),
                padding: "18px 28px",
            } }
        >
            { text }
        </div>
    );
}

function OldWayScene() {
    const letterAt = localFrameAtPhrase("oldway", "late fee");
    const doorAt = localFrameAtPhrase("oldway", "notice");
    const formAt = localFrameAtPhrase("oldway", "3.6 million");
    const satisfiedAt = localFrameAtPhrase("oldway", "Only");
    return (
        <AbsoluteFill
            style={ {
                background: theme.bg,
                display: "flex",
                flexDirection: "column",
                fontFamily: fontSans,
                justifyContent: "space-between",
                padding: `36px 48px ${BOTTOM_SAFE}px`,
            } }
        >
            <div
                style={ {
                    alignItems: "center",
                    display: "flex",
                    flex: 1,
                    justifyContent: "space-between",
                } }
            >
                <Illustration
                    at={ letterAt }
                    label="Late fee"
                >
                    <LateFeeLetter />
                </Illustration>
                <Illustration
                    at={ doorAt }
                    label="Notice on the door"
                >
                    <DoorNotice />
                </Illustration>
                <Illustration
                    at={ formAt }
                    label="Eviction filing"
                >
                    <CourtForm />
                </Illustration>
            </div>
            <div
                style={ {
                    display: "flex",
                    gap: 18,
                    justifyContent: "center",
                    marginTop: 36,
                } }
            >
                <Callout
                    at={ formAt }
                    text={ CALLOUT_FILINGS }
                />
                <Callout
                    at={ satisfiedAt }
                    text={ CALLOUT_SATISFIED }
                />
            </div>
        </AbsoluteFill>
    );
}

function RingScene() {
    const frame = useCurrentFrame();
    const ringAt = localFrameAtPhrase("ring", "Nobody");
    const miaAt = localFrameAtPhrase("ring", "So we built");
    if (frame < ringAt) {
        const opacity = fadeIn(frame);
        return (
            <AbsoluteFill
                style={ {
                    alignItems: "center",
                    background: theme.mintWash,
                    color: theme.ink,
                    fontFamily: fontDisplay,
                    fontSize: 104,
                    justifyContent: "center",
                    lineHeight: 1.05,
                    padding: "80px 100px 160px",
                    textAlign: "center",
                } }
            >
                <div
                    style={ {
                        background: theme.white,
                        borderRadius: 36,
                        maxWidth: 1680,
                        opacity,
                        padding: "72px 80px",
                        width: "100%",
                    } }
                >
                    A conversation the day rent goes late.
                </div>
            </AbsoluteFill>
        );
    }
    const showMia = frame >= miaAt;
    return (
        <AbsoluteFill
            style={ {
                alignItems: "center",
                background: theme.bg,
                justifyContent: "center",
                paddingBottom: BOTTOM_SAFE,
            } }
        >
            <Phone
                shake
                width={ 480 }
            >
                <div
                    style={ {
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                        gap: 28,
                        height: "100%",
                        justifyContent: "center",
                        textAlign: "center",
                    } }
                >
                    <div
                        style={ {
                            color: theme.inkSoft,
                            fontFamily: fontSans,
                            fontSize: 28,
                            fontWeight: 700,
                            letterSpacing: 1.4,
                        } }
                    >
                        INCOMING
                    </div>
                    <div
                        style={ {
                            fontFamily: fontDisplay,
                            fontSize: 92,
                        } }
                    >
                        { showMia ? "Mia" : "…" }
                    </div>
                    { showMia ? (
                        <div
                            style={ {
                                color: theme.inkSoft,
                                fontFamily: fontSans,
                                fontSize: 36,
                            } }
                        >
                            an AI voice agent
                        </div>
                    ) : null }
                    <Waveform
                        bars={ 28 }
                        height={ 96 }
                    />
                </div>
            </Phone>
        </AbsoluteFill>
    );
}

function slotClock(localFrame: number): string {
    const start = sectionById("livecall").startSec;
    const total = start + localFrame / 30;
    const minutes = Math.floor(total / 60);
    const seconds = Math.floor(total % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function LivePlaceholder() {
    const frame = useCurrentFrame();
    return (
        <div
            style={ {
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                gap: 28,
                height: "100%",
                justifyContent: "center",
                padding: 18,
                textAlign: "center",
            } }
        >
            <div
                style={ {
                    color: theme.violet,
                    fontFamily: fontSans,
                    fontSize: 26,
                    fontWeight: 800,
                    letterSpacing: 1.4,
                } }
            >
                { LIVE_CALL_SLATE }
            </div>
            <div
                style={ {
                    fontFamily: fontDisplay,
                    fontSize: 52,
                    lineHeight: 1.1,
                } }
            >
                { LIVE_CALL_WINDOW }
            </div>
            <div
                style={ {
                    color: theme.inkSoft,
                    fontFamily: fontSans,
                    fontSize: 44,
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 700,
                } }
            >
                { slotClock(frame) }
            </div>
        </div>
    );
}

function StepRail({ activeIndex }: { activeIndex: number }) {
    return (
        <div style={ { display: "flex", flex: 1, flexDirection: "column", gap: 14 } }>
            { MAIN_PATH.map((step, index) => {
                const current = index === activeIndex;
                return (
                    <div
                        key={ step }
                        style={ {
                            alignItems: "center",
                            background: theme.white,
                            border: current ? `3px solid ${theme.violet}` : `1px solid ${theme.border}`,
                            borderRadius: 16,
                            color: index <= activeIndex ? theme.ink : theme.mutedInk,
                            display: "flex",
                            flex: 1,
                            fontFamily: fontSans,
                            fontSize: 32,
                            fontWeight: current ? 700 : 500,
                            padding: "0 28px",
                        } }
                    >
                        { STEP_LABEL[step] }
                    </div>
                );
            }) }
        </div>
    );
}

function LiveOverlay({ activeIndex }: { activeIndex: number }) {
    const frame = useCurrentFrame();
    const window = sectionFrames(sectionById("livecall"));
    const started = LIVE_CALL_LINES.filter((_, index) => {
        const at = Math.round((index * window.duration) / LIVE_CALL_LINES.length);
        return frame >= at;
    });
    const visible = started.slice(-5);
    const step = MAIN_PATH[activeIndex] ?? "invoice";
    return (
        <div style={ { display: "flex", flex: 1, flexDirection: "column", gap: 18, minWidth: 0 } }>
            <div style={ { overflow: "hidden", width: "100%" } }>
                <div style={ { transform: "scale(0.76)", transformOrigin: "top left", width: 1400 } }>
                    <AgentChain
                        active={ step }
                        floor
                        litThrough={ activeIndex }
                        nodeWidth={ 150 }
                        showHandoff={ false }
                        tenant="John"
                    />
                </div>
            </div>
            <div
            style={ {
                background: theme.white,
                border: `1px solid ${theme.border}`,
                borderRadius: 16,
                display: "flex",
                flex: 1,
                flexDirection: "column",
                padding: 16,
            } }
            >
                <div
                    style={ {
                        color: theme.inkSoft,
                        fontFamily: fontSans,
                        fontSize: 22,
                        fontWeight: 700,
                        letterSpacing: 1.1,
                    } }
                >
                    OPEN BALANCE · $2,400
                </div>
                <div
                    style={ {
                        display: "flex",
                        flex: 1,
                        flexDirection: "column",
                        gap: 14,
                        justifyContent: "space-evenly",
                        marginTop: 12,
                    } }
                >
                    { visible.map((line) => {
                        const tenant = line.speaker === "John";
                        return (
                            <div
                                key={ `${line.speaker}-${line.text}` }
                                style={ {
                                    alignSelf: tenant ? "flex-end" : "flex-start",
                                    background: tenant ? theme.ink : theme.mintSoft,
                                    borderRadius: 14,
                                    color: tenant ? theme.mint : theme.ink,
                                    fontFamily: fontSans,
                                    fontSize: 26,
                                    maxWidth: 720,
                                    padding: "10px 14px",
                                } }
                            >
                                <strong>
                                    { line.speaker }
                                    { ": " }
                                </strong>
                                { line.text }
                            </div>
                        );
                    }) }
                </div>
            </div>
        </div>
    );
}

function LiveCallScene({ overlay }: { overlay: boolean }) {
    const frame = useCurrentFrame();
    const window = sectionFrames(sectionById("livecall"));
    const step = Math.min(
        MAIN_PATH.length - 1,
        Math.floor(frame / (window.duration / MAIN_PATH.length)),
    );
    return (
        <AbsoluteFill
            style={ {
                background: theme.bg,
                display: "flex",
                flexDirection: "row",
                fontFamily: fontSans,
            } }
        >
            <div
                style={ {
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    paddingBottom: BOTTOM_SAFE,
                    width: "42%",
                } }
            >
                <Phone width={ 470 }>
                    { ASSET_FLAGS.hasCall ? (
                        <div style={ { height: "100%", overflow: "hidden" } }>
                            <OffthreadVideo
                                muted={ ASSET_FLAGS.hasCallAudio }
                                src={ staticFile("submission/call.mp4") }
                                style={ { height: "100%", objectFit: "cover", width: "100%" } }
                            />
                        </div>
                    ) : (
                        <LivePlaceholder />
                    ) }
                </Phone>
            </div>
            <div
                style={ {
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    height: "100%",
                    padding: `36px 36px ${BOTTOM_SAFE}px 8px`,
                    width: "58%",
                } }
            >
                <div
                    style={ {
                        color: theme.ink,
                        fontSize: 40,
                        fontWeight: 700,
                    } }
                >
                    Live calls
                </div>
                { overlay ? <LiveOverlay activeIndex={ step } /> : <StepRail activeIndex={ step } /> }
            </div>
        </AbsoluteFill>
    );
}

function Sidebar() {
    return (
        <div
            style={ {
                background: theme.white,
                borderRight: `1px solid ${theme.border}`,
                display: "flex",
                flexDirection: "column",
                padding: "28px 22px",
                width: 320,
            } }
        >
            <Logo
                markHeight={ 36 }
                tone="mint"
                wordmarkSize={ 26 }
            />
            <div
                style={ {
                    background: theme.violet,
                    borderRadius: 12,
                    color: theme.white,
                    fontFamily: fontSans,
                    fontSize: 18,
                    fontWeight: 700,
                    marginTop: 28,
                    padding: "12px 14px",
                    textAlign: "center",
                } }
            >
                New Chat
            </div>
            <div
                style={ {
                    color: theme.mutedInk,
                    fontFamily: fontSans,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: 1.4,
                    marginTop: 28,
                } }
            >
                NAVIGATE
            </div>
            <div
                style={ {
                    color: theme.mutedInk,
                    fontFamily: fontSans,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: 1.4,
                    marginTop: 36,
                } }
            >
                RECENTS
            </div>
            <div style={ { flex: 1 } } />
            <div
                style={ {
                    borderTop: `1px solid ${theme.border}`,
                    color: theme.ink,
                    fontFamily: fontSans,
                    fontSize: 18,
                    fontWeight: 650,
                    paddingTop: 16,
                } }
            >
                Sunset Properties
            </div>
        </div>
    );
}

function Tile({ active, large = false, tile }: { active: boolean; large?: boolean; tile: IHomeTile }) {
    return (
        <div
            style={ {
                background: theme.white,
                border: active ? `2px solid ${theme.violet}` : `1px solid ${theme.border}`,
                borderRadius: 20,
                boxShadow: active ? `0 0 0 4px ${theme.activeBg}` : undefined,
                display: large ? "flex" : undefined,
                flexDirection: large ? "column" : undefined,
                height: large ? "100%" : undefined,
                justifyContent: large ? "center" : undefined,
                padding: large ? "48px 56px" : "18px 20px",
            } }
        >
            <div
                style={ {
                    color: theme.mutedInk,
                    fontFamily: fontSans,
                    fontSize: large ? 28 : 16,
                    fontWeight: 700,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                } }
            >
                { tile.label }
            </div>
            <div
                style={ {
                    color: theme.ink,
                    fontFamily: fontSans,
                    fontSize: large ? 96 : 40,
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 650,
                    marginTop: 8,
                } }
            >
                { tile.value }
            </div>
        </div>
    );
}

type THomeFocus = "needs" | "none" | IHomeTile["id"] | "transcript";

function homeFocus(frame: number): THomeFocus {
    const cues: readonly { at: number; id: THomeFocus }[] = [
        { at: localFrameAtPhrase("home", "rent recovered"), id: "recovered" },
        { at: localFrameAtPhrase("home", "still overdue"), id: "overdue" },
        { at: localFrameAtPhrase("home", "promised on plans"), id: "promised" },
        { at: localFrameAtPhrase("home", "how fast"), id: "speed" },
        { at: localFrameAtPhrase("home", "A short list"), id: "needs" },
        { at: localFrameAtPhrase("home", "Every call"), id: "transcript" },
    ];
    let focus: THomeFocus = "none";
    for (const cue of cues) {
        if (frame >= cue.at) {
            focus = cue.id;
        }
    }
    return focus;
}

function HomeScene() {
    const frame = useCurrentFrame();
    const focus = homeFocus(frame);
    const needsOn = focus === "needs" || focus === "transcript";
    const transcriptOn = focus === "transcript";
    return (
        <AbsoluteFill style={ { background: theme.bg, display: "flex", flexDirection: "row" } }>
            <Sidebar />
            <div
                style={ {
                    display: "flex",
                    flex: 1,
                    flexDirection: "column",
                    gap: 12,
                    padding: `20px 28px ${BOTTOM_SAFE}px`,
                } }
            >
                <div style={ { alignItems: "center", display: "flex", gap: 22 } }>
                    <div
                        style={ {
                            borderBottom: `3px solid ${theme.violet}`,
                            color: theme.ink,
                            fontFamily: fontSans,
                            fontSize: 22,
                            fontWeight: 700,
                            paddingBottom: 8,
                        } }
                    >
                        Home
                    </div>
                    <div
                        style={ {
                            color: theme.mutedInk,
                            fontFamily: fontSans,
                            fontSize: 22,
                            fontWeight: 600,
                            paddingBottom: 8,
                        } }
                    >
                        Live calls
                    </div>
                    <div style={ { flex: 1 } } />
                    <span
                        style={ {
                            border: `1px solid ${theme.ink}`,
                            borderRadius: theme.radiusPill,
                            color: theme.ink,
                            fontFamily: fontSans,
                            fontSize: 13,
                            fontWeight: 800,
                            letterSpacing: 1.2,
                            padding: "4px 10px",
                            textTransform: "uppercase",
                        } }
                    >
                        { DEMO_DATA_TAG }
                    </span>
                </div>
                <div
                    style={ {
                        display: "grid",
                        gap: 14,
                        gridTemplateColumns: "1fr 1fr",
                    } }
                >
                    { HOME_TILES.map((tile) => (
                        <Tile
                            active={ focus === tile.id }
                            key={ tile.id }
                            tile={ tile }
                        />
                    )) }
                </div>
                <div
                    style={ {
                        background: theme.white,
                        border: focus === "needs" ? `2px solid ${theme.violet}` : `1px solid ${theme.border}`,
                        borderRadius: 20,
                        opacity: needsOn ? 1 : 0.4,
                        padding: "12px 16px",
                    } }
                >
                    <div
                        style={ {
                            fontFamily: fontSans,
                            fontSize: 20,
                            fontWeight: 700,
                        } }
                    >
                        { NEEDS_YOU_HEADING }
                    </div>
                    { NEEDS_YOU.map((row) => (
                        <div
                            key={ row.tenant }
                            style={ {
                                alignItems: "center",
                                borderTop: `1px solid ${theme.border}`,
                                display: "flex",
                                gap: 12,
                                marginTop: 6,
                                paddingTop: 6,
                            } }
                        >
                            <div style={ { flex: 1 } }>
                                <div style={ { fontFamily: fontSans, fontSize: 18, fontWeight: 700 } }>
                                    { row.tenant }
                                </div>
                                <div style={ { color: theme.inkSoft, fontFamily: fontSans, fontSize: 15 } }>
                                    { row.property }
                                    { " · " }
                                    { row.reason }
                                </div>
                            </div>
                            <span
                                style={ {
                                    border: `1px solid ${theme.borderStrong}`,
                                    borderRadius: theme.radiusPill,
                                    color: theme.ink,
                                    fontFamily: fontSans,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    padding: "4px 10px",
                                } }
                            >
                                Handoff
                            </span>
                        </div>
                    )) }
                </div>
                { transcriptOn ? (
                    <div
                        style={ {
                            background: theme.white,
                            border: `2px solid ${theme.violet}`,
                            borderRadius: 20,
                            padding: "16px 18px",
                        } }
                    >
                        <div style={ { fontFamily: fontSans, fontSize: 22, fontWeight: 700 } }>
                            { OPEN_CALL.tenant }
                        </div>
                        <div style={ { color: theme.inkSoft, fontFamily: fontSans, fontSize: 16 } }>
                            { OPEN_CALL.property }
                        </div>
                        { OPEN_CALL.lines.map((line) => (
                            <div
                                key={ line.text }
                                style={ {
                                    alignItems: "center",
                                    display: "flex",
                                    gap: 16,
                                    marginTop: 8,
                                } }
                            >
                                <div
                                    style={ {
                                        background: theme.ink,
                                        borderRadius: 14,
                                        color: theme.mint,
                                        flex: 1,
                                        fontFamily: fontSans,
                                        fontSize: 20,
                                        padding: "10px 14px",
                                    } }
                                >
                                    { line.text }
                                </div>
                                <StatusBadge status={ line.chip } />
                            </div>
                        )) }
                    </div>
                ) : null }
            </div>
        </AbsoluteFill>
    );
}

function CloseScene() {
    const frame = useCurrentFrame();
    const zoomAt = localFrameAtPhrase("close", "64 billion");
    const logoAt = localFrameAtPhrase("close", "RentRecovery");
    const logoIn = logoAt - 12;
    if (frame >= logoIn) {
        const opacity = interpolate(frame, [logoIn, logoAt], [0, 1], {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        });
        return (
            <AbsoluteFill
                style={ {
                    alignItems: "center",
                    background: theme.mint,
                    justifyContent: "center",
                    opacity,
                } }
            >
                <Logo
                    markHeight={ 160 }
                    tone="mint"
                    wordmarkSize={ 120 }
                />
                <div
                    style={ {
                        color: theme.ink,
                        fontFamily: fontSans,
                        fontSize: 52,
                        fontWeight: 650,
                        marginTop: 48,
                        maxWidth: 1400,
                        textAlign: "center",
                    } }
                >
                    { CLOSE_TAGLINE }
                </div>
            </AbsoluteFill>
        );
    }
    if (frame >= zoomAt) {
        const scale = interpolate(frame, [zoomAt, zoomAt + 20], [0.92, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        });
        const recovered = HOME_TILES[0];
        return (
            <AbsoluteFill
                style={ {
                    background: theme.bg,
                    padding: "72px 96px 180px",
                } }
            >
                <div style={ { height: "100%", transform: `scale(${scale})`, width: "100%" } }>
                    { recovered ? (
                        <Tile
                            active
                            large
                            tile={ recovered }
                        />
                    ) : null }
                </div>
            </AbsoluteFill>
        );
    }
    return (
        <AbsoluteFill
            style={ {
                alignItems: "center",
                background: theme.mintWash,
                display: "flex",
                flexDirection: "column",
                fontFamily: fontDisplay,
                padding: "56px 88px 140px",
            } }
        >
            <div
                style={ {
                    display: "flex",
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-between",
                    maxWidth: 1700,
                    width: "100%",
                } }
            >
                <div style={ { fontSize: 92, lineHeight: 0.98 } }>
                    A plan that fits his payday
                </div>
                <div style={ { color: theme.inkSoft, fontFamily: fontSans, fontSize: 48, fontWeight: 650 } }>
                    instead of a late-fee letter
                </div>
                <div style={ { fontSize: 92, lineHeight: 0.98 } }>
                    The manager gets paid today
                </div>
                <div style={ { color: theme.inkSoft, fontFamily: fontSans, fontSize: 48, fontWeight: 650 } }>
                    with no notice and no filing
                </div>
            </div>
        </AbsoluteFill>
    );
}

export function SubmissionSection({
    id,
    overlay,
}: {
    id: "close" | "home" | "livecall" | "oldway" | "ring" | "stats";
    overlay: boolean;
}) {
    if (id === "stats") {
        return <StatsScene />;
    }
    if (id === "oldway") {
        return <OldWayScene />;
    }
    if (id === "ring") {
        return <RingScene />;
    }
    if (id === "livecall") {
        return <LiveCallScene overlay={ overlay } />;
    }
    if (id === "home") {
        return <HomeScene />;
    }
    return <CloseScene />;
}
