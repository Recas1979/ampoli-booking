'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ACCESS_CODE = "ILOVERCP";
const ADMIN_CODE = "admin";

export default function Accesso() {
  const [input, setInput] = useState("");
  const [nome, setNome] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const inputCode = input.trim().toUpperCase();
    const isValidCode = inputCode === ACCESS_CODE || inputCode === ADMIN_CODE.toUpperCase();
    const isAdmin = inputCode === ADMIN_CODE.toUpperCase();

    if (isValidCode && nome.trim() !== "") {
      sessionStorage.setItem("access_granted", "true");
      sessionStorage.setItem("user_name", nome.trim());
      
      // Salva il flag admin se ha usato il codice admin
      if (isAdmin) {
        sessionStorage.setItem("is_admin", "true");
      } else {
        sessionStorage.setItem("is_admin", "false");
      }
      
      router.push("/prenotazione");
    } else {
      setError(
        nome.trim() === ""
          ? "Inserisci il tuo nome."
          : "Codice errato. Riprova."
      );
    }
  };

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative"
    }}>
      {/* Pulsante HOME */}
      <Link href="/" style={{
        position: "absolute",
        top: 16, right: 24,
        textDecoration: "none"
      }}>
        <button style={{
          padding: "8px 24px",
          fontSize: 20,
          borderRadius: "7px",
          background: "#eee",
          color: "#0057B8",
          border: "2px solid #0057B8",
          fontWeight: "bold",
          cursor: "pointer"
        }}>HOME</button>
      </Link>

      <h2 style={{ fontSize: "32px", marginBottom: "22px" }}>
        Inserisci nome e codice di accesso
      </h2>

      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.3rem",
        width: "320px"
      }}>
        <input
          type="text"
          placeholder="Il tuo nome"
          value={nome}
          onChange={e => setNome(e.target.value)}
          style={{
            padding: "13px",
            fontSize: "22px",
            borderRadius: "7px",
            border: "2px solid #bbb",
            textAlign: "center"
          }}
          required
        />

        <input
          type="password"
          placeholder="Codice"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{
            padding: "13px", 
            fontSize: "22px", 
            borderRadius: "7px", 
            border: "2px solid #bbb", 
            textAlign: "center"
          }}
          required
        />

        <button
          type="submit"
          style={{
            padding: "12px 36px",
            fontSize: "22px",
            fontWeight: "bold",
            borderRadius: "7px",
            background: "#009fe3",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          Entra
        </button>

        {error && <div style={{ color: "crimson", fontSize: "16px" }}>{error}</div>}
      </form>
    </main>
  );
}