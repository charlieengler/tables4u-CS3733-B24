import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
    src: "./fonts/Inter.ttf",
    variable: "--font-inter",
    weight: "100 900",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} antialiased`}>
                {children}
            </body>
        </html>
    );
}
