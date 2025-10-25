'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Utility: giorni ITA
const weekdayLabels = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

// Ottieni tutti i giorni feriali di un mese
function getWorkdaysOfMonth(year, month) {
  const days = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    const day = date.getDay();
    if (day !== 6 && day !== 0) {
      days.push(new Date(date));
    }
    date.setDate(date.getDate() + 1);
  }
  return days;
}

const DESKS = 16;

export default function Prenotazione() {
  const router = useRouter();
  const [monthOffset, setMonthOffset] = useState(0);
  const [date, setDate] = useState("");
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");

  // Controllo accesso e caricamento nome utente
  useEffect(() => {
    if (typeof window !== "undefined") {
      const access = sessionStorage.getItem("access_granted");
      const user = sessionStorage.getItem("user_name") || "";
      if (access !== "true") {
        router.replace("/accesso");
      } else {
        setUserName(user);
        setName(user); // PRECOMPILA IL CAMPO NOME
      }
    }
  }, [router]);

  // Calcola mese corrente + offset
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = firstOfMonth.getFullYear();
  const month = firstOfMonth.getMonth();
  const monthFeriali = getWorkdaysOfMonth(year, month);

  // Funzione: chi ha prenotato
  const getPrenotatore = (desk) => {
    if (!date) return null;
    const found = bookings.find(
      b => b.date === date && b.desk === desk
    );
    return found ? found.name : null;
  };

  // Griglia scrivanie
  const renderDesks = (start, end) => (
    <div className="row-desks">
      {Array.from({ length: end - start + 1 }, (_, i) => {
        const deskNum = start + i;
        const prenotatore = getPrenotatore(deskNum);
        const occupata = !!prenotatore;
        return (
          <button
            key={deskNum}
            disabled={occupata}
            onClick={() => setSelectedDesk(deskNum)}
            className={`desk-btn${occupata ? " desk-occupata" : ""}${selectedDesk === deskNum ? " desk-selected" : ""}`}
          >
            {deskNum}
            {prenotatore && (
              <span className="prenotatore-name">
                {prenotatore}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  // Utility label mese italiano
  const monthNames = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];

  // Utility data: DD/MM
  const fmt = d => `${d.getDate().toString().padStart(2,"0")}/${(d.getMonth()+1).toString().padStart(2,"0")}`;
  const weekDay = d => (d.getDay() + 6) % 7;

  return (
    <main className="wrap-main">
      <style>{`
      .wrap-main {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        background: #fff;
        padding-top: 20px;
        padding-bottom: 20px;
      }
      .home-btn-top {
        position: absolute;
        top: 16px; right: 18px;
        text-decoration: none;
        z-index: 100;
      }
      .home-btn-top button {
        padding: 8px 18px;
        font-size: 16px;
        border-radius: 7px;
        background: #eee;
        color: #0057B8;
        border: 2px solid #0057B8;
        font-weight: bold;
        cursor: pointer;
      }
      @media (max-width: 420px) {
        .home-btn-top button { font-size: 14px; padding: 7px 10px;}
      }
      .saluto-utente {
        font-size: 21px;
        color: #0057B8;
        font-weight: bold;
        margin: 22px 0 5px 0;
      }
      .mese-nav {
        display: flex; align-items: center; gap: 13px;
        margin: 18px 0 7px 0;
      }
      .mese-btn {
        padding: 6px 9px;
        border-radius: 7px;
        border: 2px solid #0057B8;
        background: #F5F8FA;
        color: #0057B8;
        font-weight: bold;
        font-size: 20px;
        cursor: pointer;
        min-width: 33px
      }
      .mese-txt {
        font-size: 20px;
        color: #0057b8;
        font-weight: bold
      }
      .grid-fermese {
        display: grid;
        grid-template-columns: repeat(5, minmax(39px, 1fr));
        gap: 6px; width: 100%;
        max-width: 470px; margin-bottom: 14px;
        margin-top: 10px;
      }
      .weekday-btn {
        padding: 7px 0 3px 0;
        background: #e6f0fd;
        color: #0057b8;
        border-radius: 5px;
        font-weight: bold;
        font-size: 12px;
        border: 1.5px solid #b2c4e0;
        cursor: pointer;
        outline: none;
        min-height: 34px;
        min-width: 39px;
        transition: 0.15s
      }
      .weekday-btn.selected {
        background: #0057b8;
        color: #fff;
        border: 2px solid #0057b8;
      }
      .weekday-btn span {
        font-weight: normal;
        font-size: 11px;
        color: #0057B8
      }
      .weekday-btn.selected span {
        color: #fff;
      }
      .row-desks {
        display: flex; justify-content: center; margin: 9px 0;
        flex-wrap: wrap;
        gap: 6px;
      }
      .desk-btn {
        width: 45px; height: 45px;
        margin: 0 5px; border-radius: 10px;
        font-size: 17px; font-weight: bold;
        background: #eee;
        color: #333;
        border: 1.7px solid #bbb;
        cursor: pointer;
        transition: 0.15s;
        display: flex; align-items: center; justify-content: center; flex-direction: column;
        position: relative;
      }
      .desk-btn.desk-selected {
        background: #009fe3; color: #fff;
        border: 2.5px solid #0057b8
      }
      .desk-btn.desk-occupata {
        background: #ffbcbc; color: #800; border: 2px solid #e87d7d; cursor: not-allowed;
      }
      .prenotatore-name {
        display: block;
        font-size: 9px;
        font-weight: normal;
        color: #880;
        margin-top: 2px;
        user-select: none;
        max-width: 41px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .logo-center {
        margin: 24px 0;
        display: flex; justify-content: center;
      }
      .logo-center img {
        height: 73px;
        width: auto;
        object-fit: contain;
      }
      @media (max-width: 470px) {
        .grid-fermese { max-width: 99vw; }
        .logo-center img { height: 56px; }
      }
      @media (max-width: 380px) {
        .grid-fermese { gap: 3px;}
        .desk-btn, .desk-btn.desk-selected, .desk-btn.desk-occupata { width: 38px; height: 38px; font-size:14px;}
        .logo-center img { height: 40px;}
      }
      `}</style>

      {/* Pulsante HOME */}
      <Link href="/" className="home-btn-top">
        <button>HOME</button>
      </Link>

      {/* RIMOSSO IL SALUTO UTENTE */}

      {/* Titolo mese e navigazione */}
      <div className="mese-nav">
        <button
          onClick={() => { setMonthOffset(monthOffset - 1); setDate(""); setSelectedDesk(null); }}
          className="mese-btn"
          aria-label="Precedente"
        >‹</button>
        <span className="mese-txt">
          {monthNames[month]} {year}
        </span>
        <button
          onClick={() => { setMonthOffset(monthOffset + 1); setDate(""); setSelectedDesk(null); }}
          className="mese-btn"
          aria-label="Successivo"
        >›</button>
      </div>

      {/* GRIGLIA DEI GIORNI FERIALI CLICCABILI */}
      <div className="grid-fermese">
        {monthFeriali.map(d => {
          const iso = d.toISOString().slice(0, 10);
          return (
            <button
              key={iso}
              onClick={() => { setDate(iso); setSelectedDesk(null); }}
              className={`weekday-btn${date === iso ? " selected" : ""}`}
            >
              {fmt(d)}
              <br />
              <span>
                {weekdayLabels[weekDay(d)]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Griglia scrivanie */}
      {renderDesks(1, 4)}
      {renderDesks(5, 8)}

      {/* LOGO CENTRALE */}
      <div className="logo-center">
        <img
          src="/logo.png"
          alt="Logo"
        />
      </div>

      {renderDesks(9, 12)}
      {renderDesks(13, 16)}

      {/* FORM DI PRENOTAZIONE */}
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!date) {
            alert("Seleziona il giorno dal calendario!");
            return;
          }
          if (!selectedDesk) {
            alert("Seleziona una scrivania.");
            return;
          }
          if (!name.trim()) {
            alert("Inserisci il tuo nome (o nickname).");
            return;
          }
          if (getPrenotatore(selectedDesk)) {
            alert("Scrivania già prenotata!");
            return;
          }
          setBookings([...bookings, {
            date,
            desk: selectedDesk,
            name: name.trim()
          }]);
          setSelectedDesk(null);
          // Non serve resettare il nome se vuoi che resti precompilato
          alert(`Prenotazione effettuata! Scrivania n°${selectedDesk}`);
        }}
        style={{
          marginTop: "28px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.2rem",
          maxWidth: "97vw",
          width: "285px"
        }}
      >
        <input
          type="text"
          placeholder="Il tuo nome"
          required
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          readOnly
          value={selectedDesk ? "Scrivania n° " + selectedDesk : "Seleziona una scrivania"}
          style={{
            background: "#f7f7fa",
            fontWeight: "bold",
            border: "2px solid #bbb",
            borderRadius: "6px",
            fontSize: 15,
            color: "#333",
            padding: "7px 6px",
            width: "100%"
          }}
        />
        <button
          type="submit"
          disabled={!selectedDesk || !date}
          style={{
            padding: "10px 0",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "8px",
            background: "#0057B8",
            color: "#fff",
            border: "none",
            cursor: selectedDesk && date ? "pointer" : "not-allowed",
            opacity: selectedDesk && date ? 1 : 0.7,
            width: "100%"
          }}>
          Prenota
        </button>
      </form>
    </main>
  );
}