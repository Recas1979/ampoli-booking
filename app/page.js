'use client';

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f5f5",
      padding: "20px"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "40px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        textAlign: "center",
        maxWidth: "400px",
        width: "100%"
      }}>
        <h1 style={{
          color: "#0057B8",
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "30px"
        }}>
          Ampoli Booking
        </h1>
        
        <p style={{
          fontSize: "16px",
          color: "#666",
          marginBottom: "30px"
        }}>
          Sistema di prenotazione scrivanie
        </p>

        {/* Link alla pagina accesso */}
        <Link 
          href="/accesso"
          style={{
            display: "inline-block",
            background: "#0057B8",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "background 0.3s"
          }}
        >
          Accedi al Sistema
        </Link>
      </div>
    </main>
  );
}