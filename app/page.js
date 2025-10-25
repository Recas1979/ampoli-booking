'use client';

import Link from "next/link";

export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      background: "#f9f9f9",
      padding: "20px"
    }}>
      {/* Pulsante HOME fisso in alto a destra */}
      <Link href="/" style={{
        position: "absolute",
        top: 16, 
        right: 24,
        zIndex: 50,
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
        }}>
          HOME
        </button>
      </Link>

      {/* Logo in alto */}
      <div style={{
        position: "absolute",
        top: "32px",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center"
      }}>
        <img
          src="logo.png"
          alt="Logo"
          style={{ 
            height: "400px", 
            width: "auto", 
            objectFit: "contain" 
          }}
        />
      </div>

    {/* Scritta centrale con a capo */}
      <div style={{ 
        marginTop: "250px", 
        textAlign: "center",
        color: "#0057B8",
        fontWeight: "bold",
        lineHeight: "1.5"
      }}>
        <h1 style={{ 
          fontSize: "40px" 
        }}>
          Un caloroso benvenuto
        </h1>
        <h2 style={{ 
          fontSize: "40px" 
        }}>
          dalla
        </h2>
        <h2 style={{ 
          fontSize: "40px" 
        }}>
          AmpoliAPP Global Mega Corporation 
        </h2>
      </div>

      {/* Link alla pagina accesso */}
      <Link 
        href="/accesso"
        style={{
          marginTop: "40px",
          display: "inline-block",
          background: "#0057B8",
          color: "#fff",
          padding: "15px 30px",
          borderRadius: "10px",
          textDecoration: "none",
          fontSize: "18px",
          fontWeight: "bold",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          transition: "transform 0.2s"
        }}
        onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
      >
        Accedi al Sistema
      </Link>
    </main>
  );
}