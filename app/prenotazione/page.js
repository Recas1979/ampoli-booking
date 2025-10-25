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
        padding: 8px