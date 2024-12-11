// app/layout.tsx

import './globals.css'; // Importiere die Tailwind-Stile
import { ReactNode } from 'react';
import Image from "next/image";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
      <html lang="de">
      <head>
          <title>BallWatch</title>
          {/*
              <link
                  href="https://fonts.googleapis.com/icon?family=Material+Icons"
                  rel="stylesheet"
              />
          */}
      </head>

      <body className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
      <header className="text-gray-700 p-4 text-left text-2xl bg-blue-600 shadow">
          <nav className="flex items-center justify-between">
              <div className="flex items-center justify-between">
                  <a href="/"><Image src={"/images/logo.png"} alt={"logo"} width={50} height={30}/></a>
                  <a href="/test" className="font-[Poppins] p-4">BallWatch</a>
              </div>
              <ul className="flex items-center">
                  <li><a href="/about" className="hover:bg-blue-200 p-4 ">Über uns</a></li>
                  <li><a href="/blog" className="hover:bg-blue-200 p-4">Blog</a></li>
              </ul>
          </nav>
      </header>

      <main className="flex-grow p-8 top-full">{children}</main>

      <footer className="text-center p-2 bg-gray-800 text-white w-full">
        <p>&copy; 2024 BallWatch</p>
      </footer>
      </body>
      </html>
  );
}
