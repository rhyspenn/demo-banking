import { LayoutComponent } from '@/components/layout'
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import { CopilotPopup } from "@copilotkit/react-ui";
import CopilotContext from "@/components/copilot-context";
import { AuthContextProvider } from "@/components/auth-context";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "CoBankKit",
    description: "Collaborative finance for 21st century teams",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CopilotKit runtimeUrl="/api/copilotkit" showDevConsole={false}>
            <AuthContextProvider>
                <LayoutComponent>
                    <CopilotContext>
                        {children}
                    </CopilotContext>
                </LayoutComponent>
                <CopilotPopup
                    instructions={"You are assisting the user as best as you can. Ansewr in the best way possible given the data you have."}
                    labels={{
                        title: "Popup Assistant",
                        initial: "Need any help?",
                    }}
                />
            </AuthContextProvider>
        </CopilotKit>
        </body>
        </html>
    )
}
