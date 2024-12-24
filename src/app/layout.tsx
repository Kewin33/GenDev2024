// app/layout.tsx

import './globals.css'; // Importiere die Tailwind-Stile
import React, { ReactNode } from 'react';
import Image from "next/image";
import ScrollButton from "@/app/components/ScrollBtn";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
      <html lang="de">
      <head>
          <title>BallWatch</title>
          {
              <link
                  href="https://fonts.googleapis.com/icon?family=Material+Icons"
                  rel="stylesheet"
              />
          }
      </head>

      <body className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
      <header className="text-gray-700 p-4 text-left text-2xl bg-blue-600 shadow">
          <nav className="flex items-center justify-between">
              <div className="flex items-center justify-between">
                  <a href="/"><Image src={"/images/logo.png"} alt={"logo"} width={50} height={30}/></a>
                  <a href="/" className="font-[Poppins] p-4">BallWatch</a>
              </div>
              <ul className="flex items-center">
                  <li>
                      <a href="/help" className="hover:text-black flex">
                          Hilfe
                          <i className="material-icons p-1 pt-0.5">help</i>
                      </a>
                  </li>
              </ul>
          </nav>
      </header>

      <main className="flex-grow p-8 top-full">{children}</main>

      <ScrollButton></ScrollButton>

      <footer className="text-center p-2 bg-gray-800 text-white w-full">
          <p>&copy; 2024 BallWatch</p>
          <p className="float-end"> Made with <i className="material-icons">favorite</i> by Kewin33 :) </p>
      </footer>
      </body>
      </html>
  );
}
