'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from '@supabase/supabase-js';

// Inizializza Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);

  // Controllo accesso e caricamento nome utente
  useEffect(() => {
    if (typeof window !== "undefined") {
      const access = sessionStorage.getItem("access_granted");
      const user = sessionStorage.getItem("user_name") || "";
      if (access !== "true") {
        router.replace("/accesso");
      } else {
        setUserName(user);
        setName(user);
      }
    }
  }, [router]);

  // Carica prenotazioni quando cambia la data
  useEffect(() => {
    if (date) {
      loadBookings();
    }
  }, [date]);

  // Funzione per caricare le prenotazioni da Supabase
  const loadBookings = async () => {
    if (!date) return;
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', date);
      
      if (error) {
        console.error('Errore nel caricamento delle prenotazioni:', error);
        return;
      }
      
      setBookings(data || []);
    } catch (error) {
      console.error('Errore generale nel caricamento:', error);
    }
  };

  // Funzione per annullare una prenotazione
  const cancelBooking = async (deskId) => {
    const booking = bookings.find(b => b.date === date && b.desk_id === deskId);
    
    if (!booking) {
      alert("Prenotazione non trovata!");
      return;
    }

    // Verifica che sia la propria prenotazione
    if (booking.name !== userName) {
      alert("Puoi annullare solo le tue prenotazioni!");
      return;
    }

    const confirmCancel = confirm(`Vuoi annullare la prenotazione della scrivania n°${deskId}?`);
    if (!confirmCancel) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', booking.id);

      if (error) {
        console.error('Errore annullamento:', error);
        alert('Errore nell\'annullare la prenotazione:\n' + error.message);
        return;
      }

      alert(`Prenotazione annullata! Scrivania n°${deskId} ora è libera.`);
      await loadBookings();
      
    } catch (error) {
      console.error('Errore generale:', error);
      alert('Errore nell\'annullare la prenotazione');
    } finally {
      setLoading(false);
    }
  };

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
      b => b.date === date && b.desk_id === desk
    );
    return found ? found.name : null;
  };

  // Verifica se è la propria prenotazione
  const isMyBooking = (desk) => {
    const prenotatore = getPrenotatore(desk);
    return prenotatore === userName;
  };

  // Griglia scrivanie
  const renderDesks = (start, end) => (
    <div className="row-desks">
      {Array.from({ length: end - start + 1 }, (_, i) => {
        const deskNum = start + i;
        const prenotatore = getPrenotatore(deskNum);
        const occupata = !!prenotatore;
        const isMyReservation = isMyBooking(deskNum);
        
        return (
          <button
            key={deskNum}
            disabled={loading}
            onClick={() => {
              if (occupata && isMyReservation) {
                // Se è occupata ed è la mia prenotazione, annulla
                cancelBooking(deskNum);
              } else if (!occupata) {
                // Se è libera, seleziona per prenotare
                setSelectedDesk(deskNum);
              } else {
                // Se è occupata da altri, non fare nulla
                alert("Scrivania già prenotata da " + prenotatore);
              }
            }}
            className={`desk-btn${occupata ? " desk-occupata" : ""}${selectedDesk === deskNum ? " desk-selected" : ""}${isMyReservation ? " my-booking" : ""}`}
            title={
              occupata 
                ? isMyReservation 
                  ? `La tua prenotazione - Clicca per annullare`
                  : `Prenotata da ${prenotatore}` 
                : `Scrivania ${deskNum} - Clicca per selezionare`
            }
          >
            {deskNum}
            {prenotatore && (
              <span className="prenotatore-name">
                {prenotatore}
              </span>
            )}
            {isMyReservation && (
              <span className="cancel-icon">✕</span>
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
        background: #ffbcbc; color: #800; border: 2px solid #e87d7d; cursor: pointer;
      }
      .desk-btn.my-booking {
        background: #fff3cd; color: #856404; border: 2px solid #ffc107; cursor: pointer;
      }
      .desk-btn.my-booking:hover {
        background: #ffecb5; border-color: #e0a800;
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
      .cancel-icon {
        position: absolute;
        top: 2px;
        right: 2px;
        font-size: 10px;
        color: #dc3545;
        font-weight: bold;
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
        .desk-btn, .desk-btn.desk-selected, .desk-btn.desk-occupata, .desk-btn.my-booking { width: 38px; height: 38px; font-size:14px;}
        .logo-center img { height: 40px;}
        .cancel-icon { font-size: 8px; top: 1px; right: 1px; }
      }
      `}</style>

      {/* Pulsante HOME */}
      <Link href="/" className="home-btn-top">
        <button>HOME</button>
      </Link>

      {/* Saluto nome utente in alto */}
      {userName && (
        <div className="saluto-utente"> {userName}</div>
      )}

      {/* Titolo mese e navigazione */}
      <div className="mese-nav">
        <button
          onClick={() => { 
            setMonthOffset(monthOffset - 1); 
            setDate(""); 
            setSelectedDesk(null);
            setBookings([]); 
          }}
          className="mese-btn"
          aria-label="Precedente"
        >‹</button>
        <span className="mese-txt">
          {monthNames[month]} {year}
        </span>
        <button
          onClick={() => { 
            setMonthOffset(monthOffset + 1); 
            setDate(""); 
            setSelectedDesk(null);
            setBookings([]); 
          }}
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
              onClick={() => { 
                setDate(iso); 
                setSelectedDesk(null); 
              }}
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
        onSubmit={async (e) => {
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

          setLoading(true);

          try {
            const { data, error } = await supabase
              .from('bookings')
              .insert([
                {
                  date,
                  desk_id: selectedDesk,
                  name: name.trim(),
                  user_email: null
                }
              ]);

            if (error) {
              console.error('Errore inserimento:', error);
              alert('Errore nel salvare la prenotazione:\n' + error.message);
              return;
            }

            alert(`Prenotazione effettuata! Scrivania n°${selectedDesk}`);
            setSelectedDesk(null);
            await loadBookings();
            
          } catch (error) {
            console.error('Errore generale:', error);
            alert('Errore nel salvare la prenotazione');
          } finally {
            setLoading(false);
          }
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
          disabled={loading}
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
          disabled={!selectedDesk || !date || loading}
          style={{
            padding: "10px 0",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "8px",
            background: loading ? "#cccccc" : "#0057B8",
            color: "#fff",
            border: "none",
            cursor: (selectedDesk && date && !loading) ? "pointer" : "not-allowed",
            opacity: (selectedDesk && date && !loading) ? 1 : 0.7,
            width: "100%"
          }}>
          {loading ? "Prenotando..." : "Prenota"}
        </button>
      </form>

      {/* Legenda */}
      <div style={{ marginTop: "20px", fontSize: "12px", color: "#666", textAlign: "center" }}>
        <div>🟢 Libera | 🔴 Occupata | 🟡 Tua prenotazione (clicca per annullare)</div>
      </div>
    </main>
  );
}

