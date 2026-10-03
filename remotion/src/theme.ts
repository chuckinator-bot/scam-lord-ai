/**
 * @module remotion/theme
 * Mint Condition v1 tokens. Hex values from the design system.
 * Depends on: none.
 * Used by: every scene.
 */

export const theme = {
    brandMint: "#B8F2D0",
    onMint: "#10241B",
    brandViolet: "#5B2BD9",
    yellow: "#FFD873",
    bg: "#EFFBF4",
    surface: "#FFFFFF",
    surfaceSunken: "#E1F7EA",
    ink: "#10241B",
    mutedInk: "#3F5A4E",
    violet: "#5B2BD9",
    onViolet: "#FFFFFF",
    border: "#B5D9C4",
    borderStrong: "#5E8A72",
    inverse: "#10241B",
    onInverse: "#B8F2D0",
    paidBg: "#C9F2D8",
    paidInk: "#0A5C32",
    overdueBg: "#FFE0D6",
    overdueInk: "#8A2C0B",
    waitingBg: "#FFEFC2",
    waitingInk: "#6B4A00",
    activeBg: "#E6DEFF",
    activeInk: "#3E1BA6",
    radiusSm: 8,
    radiusMd: 14,
    radiusLg: 20,
    radiusPill: 999,
} as const;

export type TStatus =
    | "Overdue"
    | "Payment failed"
    | "In progress"
    | "Waiting on a person"
    | "Waiting on payment"
    | "Plan active"
    | "Paid";

export function statusColors(status: TStatus): { bg: string; ink: string } {
    switch (status) {
        case "Overdue":
        case "Payment failed":
            return { bg: theme.overdueBg, ink: theme.overdueInk };
        case "In progress":
            return { bg: theme.activeBg, ink: theme.activeInk };
        case "Waiting on a person":
        case "Waiting on payment":
            return { bg: theme.waitingBg, ink: theme.waitingInk };
        case "Plan active":
        case "Paid":
            return { bg: theme.paidBg, ink: theme.paidInk };
        default:
            return { bg: theme.surfaceSunken, ink: theme.ink };
    }
}
