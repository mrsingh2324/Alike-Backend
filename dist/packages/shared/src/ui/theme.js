import { colorPalette, spacingScale, typography } from "./tokens";
export const themeVariants = {
    light: {
        mode: "light",
        background: colorPalette.surfaceLight,
        surface: "#F7F7F7",
        chatPanel: "#FFFFFF",
        textPrimary: "#111111",
        textSecondary: "#4F4F4F",
        bubbleIncoming: colorPalette.incomingLight,
        bubbleOutgoing: colorPalette.outgoingLight,
        bubbleIncomingText: "#111111",
        bubbleOutgoingText: "#0F2F17",
        border: colorPalette.borderLight
    },
    dark: {
        mode: "dark",
        background: colorPalette.surfaceDark,
        surface: "#1C1C1C",
        chatPanel: "#1A1A1A",
        textPrimary: "#FFFFFF",
        textSecondary: "#B3B3B3",
        bubbleIncoming: colorPalette.incomingDark,
        bubbleOutgoing: colorPalette.outgoingDark,
        bubbleIncomingText: "#FFFFFF",
        bubbleOutgoingText: "#E6F6EA",
        border: colorPalette.borderDark
    }
};
export const designSystem = {
    spacing: spacingScale,
    typography,
    colors: themeVariants,
    palette: colorPalette
};
