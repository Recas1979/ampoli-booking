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
      {/* Pulsante HOME fisso in alto a destra */}
      <Link href="/" style={{
        position: "absolute",
        top: 16, right: 24,
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
        }}>HOME</button>
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
          src="/logo.png"
          alt="Logo"
          style={{ height: "160px", width: "auto", objectFit: "contain" }}
        />
      </div>
      {/* Scritta centrale */}
      <h1 style={{ marginTop: "89px", fontSize: "30px", paddingTop: "10px" }}>
        Un caloroso benvenuto dalla AmpoliAPP Global Mega Corporation of the universe
      </h1>
      {/* Link alla pagina accesso */}
      <

