/**
 * @module remotion/theme
 * Light-mode tokens from src/styles/global.css. Brand mint, ink, and violet
 * match the product. Status pairs follow the product even where they leave mint.
 * Depends on: src/styles/global.css.
 * Used by: every Remotion scene.
 */

export const theme = {
    mint: "#B8F2D0",
    mintSoft: "#E1F7EA",
    mintWash: "#EFFBF4",
    mintDeep: "#B5D9C4",
    ink: "#10241B",
    inkSoft: "#3F5A4E",
    white: "#FFFFFF",
    violet: "#5B2BD9",
    brandMint: "#B8F2D0",
    onMint: "#10241B",
    bg: "#EFFBF4",
    surface: "#FFFFFF",
    surfaceSunken: "#E1F7EA",
    mutedInk: "#3F5A4E",
    border: "#B5D9C4",
    borderStrong: "#10241B",
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
    radiusSm: 10,
    radiusMd: 12,
    radiusLg: 14,
    radiusPill: 999,
} as const;

export type TStatus =
    | "Overdue"
    | "In progress"
    | "Waiting on payment"
    | "Plan active"
    | "Paid"
    | "Payment failed"
    | "Waiting on a person";

export function statusColors(status: TStatus): { bg: string; ink: string } {
    if (status === "Overdue" || status === "Payment failed") {
        return { bg: theme.overdueBg, ink: theme.overdueInk };
    }
    if (status === "Waiting on payment" || status === "Waiting on a person") {
        return { bg: theme.waitingBg, ink: theme.waitingInk };
    }
    if (status === "Paid" || status === "Plan active") {
        return { bg: theme.paidBg, ink: theme.paidInk };
    }
    return { bg: theme.activeBg, ink: theme.activeInk };
}
