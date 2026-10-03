/**
 * @module remotion/theme
 * Mint Condition palette reduced to mint, ink, white, and one violet accent.
 * Depends on: uploads/design-system tokens.
 * Used by: every Remotion scene.
 */

export const theme = {
    mint: "#B8F2D0",
    mintSoft: "#E3FAEC",
    mintWash: "#F2FDF7",
    mintDeep: "#86B49A",
    ink: "#10241B",
    inkSoft: "#294336",
    white: "#FFFFFF",
    violet: "#5B2BD9",
    brandMint: "#B8F2D0",
    onMint: "#10241B",
    bg: "#F2FDF7",
    surface: "#FFFFFF",
    surfaceSunken: "#E3FAEC",
    mutedInk: "#294336",
    border: "#B8F2D0",
    borderStrong: "#10241B",
    inverse: "#10241B",
    onInverse: "#B8F2D0",
    paidBg: "#B8F2D0",
    paidInk: "#10241B",
    overdueBg: "#10241B",
    overdueInk: "#B8F2D0",
    waitingBg: "#E3FAEC",
    waitingInk: "#10241B",
    activeBg: "#E3FAEC",
    activeInk: "#10241B",
    radiusSm: 6,
    radiusMd: 10,
    radiusLg: 16,
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
        return { bg: theme.ink, ink: theme.mint };
    }
    if (status === "Paid" || status === "Plan active" || status === "Waiting on payment" || status === "Waiting on a person") {
        return { bg: theme.mint, ink: theme.ink };
    }
    return { bg: theme.mintSoft, ink: theme.ink };
}
