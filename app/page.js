import Link from "next/link";

export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative"
    }}>
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
          src="/logo.png"
          alt="Logo"
          style={{ height: "160px", width: "auto", objectFit: "contain" }}
        />
      </div>

      {/* Scritta centrale */}
      <h1 style={{ marginTop: "120px", fontSize: "60px", paddingTop: "10px" }}>
        Benvenuto nella tua Home Page!
      </h1>

      {/* Link alla pagina accesso */}
      <Link href="/accesso">
        <button style={{ marginTop: "50px", fontSize: "22px", padding: "12px 40px", borderRadius: "8px", background: "#0057B8", color: "white", border: "none", cursor: "pointer" }}>
          Prenota una scrivania
        </button>
      </Link>
    </main>
  );
}