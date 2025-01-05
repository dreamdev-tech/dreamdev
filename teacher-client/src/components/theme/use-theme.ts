import { ThemeProviderState } from "@/types/theme-types";
import { useContext,createContext } from "react";

const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null,
};

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
};