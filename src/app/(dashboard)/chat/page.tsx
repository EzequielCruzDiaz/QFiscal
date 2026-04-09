"use client";

import { useEffect, useRef, useState } from "react";
import type { Message } from "@/types";

const suggestions = [
  "¿Cómo calculo la retención del 10%?",
  "Vencimiento IT-1",
  "¿Qué es un NCF B02?",
];

const recursos = [
  { label: "Reglamento ITBIS", href: "https://dgii.gov.do/legislacion/leyes/Documents/147-00.pdf" },
  { label: "Código Tributario", href: "https://dgii.gov.do/legislacion/codigoTributario/Paginas/default.aspx" },
];

const calculadoras = [
  {
    label: "ISR Personas",
    desc: "Cálculo de retenciones",
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    label: "ITBIS/NCF",
    desc: "Validación de facturas",
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
      </svg>
    ),
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef    = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updated }),
    });
    const data = await res.json();
    setMessages([...updated, { role: "assistant", content: data.reply ?? "" }]);
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="chat-page">
      {/* ── Center: Chat ── */}
      <section className="chat-main">
        {/* Welcome + chips */}
        {messages.length === 0 && (
          <div className="max-w-2xl mb-6">
            <h2 className="font-display text-2xl font-extrabold text-primary tracking-tight mb-1">
              Asistente Fiscal IA
            </h2>
            <p className="text-on-surface-muted text-sm mb-5">
              ¿En qué puedo ayudarte con tus obligaciones fiscales hoy?
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="suggestion-chip"
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="chat-messages space-y-5">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="chat-avatar-bot">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a2 2 0 012 2v1h3a2 2 0 012 2v2a2 2 0 01-2 2h-1v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2H5a2 2 0 01-2-2V7a2 2 0 012-2h3V4a2 2 0 012-2zm0 5a1 1 0 100 2 1 1 0 000-2zM9 9a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2z" />
                  </svg>
                </div>
              )}
              <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-bot"}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === "user" && (
                <div className="chat-avatar-user">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="chat-avatar-bot">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a2 2 0 012 2v1h3a2 2 0 012 2v2a2 2 0 01-2 2h-1v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2H5a2 2 0 01-2-2V7a2 2 0 012-2h3V4a2 2 0 012-2zm0 5a1 1 0 100 2 1 1 0 000-2zM9 9a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2z" />
                </svg>
              </div>
              <div className="chat-bubble-bot flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-on-surface-faint animate-bounce bounce-1" />
                <span className="w-2 h-2 rounded-full bg-on-surface-faint animate-bounce bounce-2" />
                <span className="w-2 h-2 rounded-full bg-on-surface-faint animate-bounce bounce-3" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu consulta fiscal aquí..."
            className="chat-input"
            aria-label="Mensaje para el asistente fiscal"
          />
          <button
            type="button"
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="btn-primary py-2.5 px-5 text-sm shrink-0"
          >
            Enviar →
          </button>
        </div>
      </section>

      {/* ── Right: Resources ── */}
      <aside className="chat-sidebar">
        {/* Recursos DGII */}
        <div>
          <p className="label-section mb-3">Recursos DGII</p>
          <div className="space-y-2">
            {recursos.map((r) => (
              <a key={r.label} href={r.href} target="_blank" rel="noopener noreferrer" className="chat-resource-link">
                <span>{r.label}</span>
                <svg className="w-3.5 h-3.5 text-on-surface-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Calculadoras */}
        <div>
          <p className="label-section mb-3">Calculadoras</p>
          <div className="space-y-2">
            {calculadoras.map((c) => (
              <button key={c.label} type="button" className="chat-calc-card w-full text-left">
                <div className="w-9 h-9 rounded-lg bg-surface-low flex items-center justify-center shrink-0">
                  {c.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">{c.label}</p>
                  <p className="text-xs text-on-surface-faint">{c.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Catálogo de Cuentas */}
        <div className="mt-auto">
          <div className="dgii-card">
            <p className="text-sm font-display font-bold text-white mb-1">Catálogo de Cuentas</p>
            <p className="text-xs text-white/60 mb-4 leading-relaxed">
              Revisa la estructura contable de tu empresa.
            </p>
            <button type="button" className="w-full py-2.5 rounded-lg text-sm font-bold text-primary bg-success-light hover:bg-success hover:text-white transition-colors">
              VER ESTRUCTURA →
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
