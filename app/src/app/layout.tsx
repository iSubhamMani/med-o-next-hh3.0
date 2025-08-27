import type { Metadata } from "next";
import { Inter, Poppins, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";

// Option 1: Inter - Clean, modern, highly readable
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Option 2: Poppins - Friendly yet professional
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Option 3: Source Sans 3 - Excellent for medical/technical content
const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Choose one of the fonts above - I recommend Inter for medical sites
const selectedFont = sourceSans;

export const metadata: Metadata = {
  title: "Med-o-Next",
  description: "Professional medical platform with modern design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${selectedFont.className} antialiased`}>
        <Toaster closeButton richColors  position="top-right"  />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
      function googleTranslateElementInit() {
        new google.translate.TranslateElement(
          {pageLanguage: 'en'},
          'google_translate_element'
        );
      }
    `,
          }}
        />
        <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></Script>
        {/* <div id="google_translate_element"></div> */}
        {children}
      </body>
    </html>
  );
}