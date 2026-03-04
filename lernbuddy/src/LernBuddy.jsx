import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `Du bist LernBuddy, ein einfühlsamer und geduldiger KI-Nachhilfelehrer für österreichische und deutsche Schüler.

DEINE PERSÖNLICHKEIT:
- Freundlich, motivierend, nie herablassend
- Du erklärst Dinge auf verschiedene Weisen, bis der Schüler es versteht
- Du gibst NIE einfach die Lösung — du führst den Schüler mit Fragen dahin
- Du verwendest immer alltagsnahe Beispiele und Analogien
- Du sprichst den Schüler direkt an ("du")

WENN EIN DOKUMENT/BILD HOCHGELADEN WURDE:
- Beziehe dich explizit auf den Inhalt des hochgeladenen Dokuments/Bildes
- Erkläre genau den Stoff, der darin enthalten ist
- Frage zuerst: "Was davon ist noch unklar?" um den Fokus zu finden

DEINE METHODE (Sokrates-Prinzip):
1. Verstehe zuerst, was der Schüler bereits weiß
2. Erkläre schrittweise, vom Einfachen zum Komplexen
3. Stelle Verständnisfragen zwischendurch
4. Gib Beispiele aus dem Alltag
5. Lobe Fortschritte, korrigiere sanft Fehler

FORMATIERUNG:
- Kurze Absätze, wichtige Begriffe mit **fett**
- Stelle am Ende jeder Antwort eine Frage zum Verständnis`;

const subjects = [
  { emoji: "🔢", label: "Mathematik" },
  { emoji: "⚗️", label: "Chemie" },
  { emoji: "🔭", label: "Physik" },
  { emoji: "📖", label: "Deutsch" },
  { emoji: "🌍", label: "Geschichte" },
  { emoji: "🧬", label: "Biologie" },
  { emoji: "🗣️", label: "Englisch" },
  { emoji: "📐", label: "Geometrie" },
];

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "12px 16px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: "50%", background: "#C084FC",
          animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 16, gap: 10, alignItems: "flex-end" }}>
      {!isUser && (
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #7C6FFF, #C084FC)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, boxShadow: "0 2px 8px rgba(124,111,255,0.4)" }}>🦉</div>
      )}
      <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", gap: 8, alignItems: isUser ? "flex-end" : "flex-start" }}>
        {msg.file && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "rgba(192,132,252,0.15)", border: "1px solid rgba(192,132,252,0.3)", borderRadius: 12, fontSize: 12, color: "#C084FC" }}>
            <span>{msg.file.type === "image" ? "🖼️" : "📄"}</span>
            <span style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.file.name}</span>
          </div>
        )}
        {msg.content && (
          <div style={{ padding: "12px 16px", borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: isUser ? "linear-gradient(135deg, #7C6FFF, #9B8FFF)" : "rgba(255,255,255,0.06)", border: isUser ? "none" : "1px solid rgba(255,255,255,0.1)", color: "#F0EDFF", fontSize: 14, lineHeight: 1.6, backdropFilter: "blur(10px)", boxShadow: isUser ? "0 4px 15px rgba(124,111,255,0.3)" : "0 2px 10px rgba(0,0,0,0.2)" }}>
            {msg.content.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
              part.startsWith("**") && part.endsWith("**")
                ? <strong key={i} style={{ color: "#C084FC", fontWeight: 700 }}>{part.slice(2, -2)}</strong>
                : <span key={i}>{part}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function UploadArea({ onFile }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImage && !isPdf) return;
    const reader = new FileReader();
    reader.onload = (e) => onFile({ name: file.name, type: isImage ? "image" : "pdf", mediaType: file.type, data: e.target.result.split(",")[1] });
    reader.readAsDataURL(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => inputRef.current.click()}
      style={{ border: `2px dashed ${dragging ? "rgba(192,132,252,0.8)" : "rgba(124,111,255,0.35)"}`, borderRadius: 16, padding: "28px 20px", textAlign: "center", cursor: "pointer", background: dragging ? "rgba(124,111,255,0.08)" : "rgba(255,255,255,0.02)", transition: "all 0.25s", marginBottom: 20 }}
    >
      <input ref={inputRef} type="file" accept="image/*,application/pdf" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
      <div style={{ fontSize: 36, marginBottom: 10 }}>📎</div>
      <div style={{ color: "#C084FC", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Mitschrift oder Foto hochladen</div>
      <div style={{ color: "rgba(240,237,255,0.4)", fontSize: 12 }}>PDF, JPG, PNG · Drag & Drop oder klicken</div>
    </div>
  );
}

export default function LernBuddy() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [started, setStarted] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const buildApiMessages = (msgs) => msgs.map((msg) => {
    if (msg.role === "user" && msg.file) {
      const content = [];
      if (msg.file.type === "image") content.push({ type: "image", source: { type: "base64", media_type: msg.file.mediaType, data: msg.file.data } });
      else content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: msg.file.data } });
      if (msg.content) content.push({ type: "text", text: msg.content });
      return { role: "user", content };
    }
    return { role: msg.role, content: msg.content };
  });

  // ✅ Calls your secure /api/chat function — API key stays on server
  const callApi = async (newMessages) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: buildApiMessages(newMessages), system: SYSTEM_PROMPT }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "API Fehler");
    return data.text;
  };

  const startSession = async (subject) => {
    setSelectedSubject(subject); setStarted(true); setLoading(true); setError(null);
    const firstMsg = { role: "user", content: `Ich möchte ${subject.label} lernen.` };
    const newMessages = [firstMsg];
    setMessages(newMessages);
    try {
      const text = await callApi(newMessages);
      setMessages([...newMessages, { role: "assistant", content: text }]);
    } catch (e) { setError("Verbindungsfehler. Bitte versuche es erneut."); }
    finally { setLoading(false); setTimeout(() => inputRef.current?.focus(), 100); }
  };

  const sendMessage = async () => {
    if ((!input.trim() && !pendingFile) || loading) return;
    setError(null); setShowUpload(false);
    const userMsg = { role: "user", content: input.trim() || `Bitte erkläre den Inhalt dieser Datei.`, ...(pendingFile ? { file: pendingFile } : {}) };
    if (pendingFile) setUploadedFiles(prev => [...prev, pendingFile]);
    const newMessages = [...messages, userMsg];
    setMessages(newMessages); setInput(""); setPendingFile(null); setLoading(true);
    try {
      const text = await callApi(newMessages);
      setMessages([...newMessages, { role: "assistant", content: text }]);
    } catch (e) { setError("Verbindungsfehler. Bitte versuche es erneut."); }
    finally { setLoading(false); setTimeout(() => inputRef.current?.focus(), 100); }
  };

  const reset = () => { setMessages([]); setStarted(false); setSelectedSubject(null); setInput(""); setPendingFile(null); setUploadedFiles([]); setError(null); setShowUpload(false); };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0D0B1E 0%, #12102A 50%, #0D0B1E 100%)", fontFamily: "Georgia, serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: started ? "flex-start" : "center", padding: started ? "0" : "24px", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:0.8}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .subject-card:hover{transform:translateY(-4px) scale(1.04);border-color:rgba(124,111,255,0.6)!important;background:rgba(124,111,255,0.15)!important}
        .send-btn:hover:not(:disabled){background:linear-gradient(135deg,#9B8FFF,#C084FC)!important;transform:scale(1.05)}
        textarea:focus{outline:none}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(124,111,255,0.4);border-radius:2px}
      `}</style>

      {!started && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          {[...Array(30)].map((_, i) => (
            <div key={i} style={{ position: "absolute", width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, borderRadius: "50%", background: "white", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.5 + 0.1, animation: `pulse ${2 + Math.random() * 3}s infinite`, animationDelay: `${Math.random() * 3}s` }} />
          ))}
        </div>
      )}

      {!started ? (
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", animation: "fadeUp 0.6s ease", maxWidth: 640, width: "100%" }}>
          <div style={{ fontSize: 72, marginBottom: 16, animation: "float 4s ease-in-out infinite" }}>🦉</div>
          <h1 style={{ fontSize: 48, fontWeight: 700, color: "#F0EDFF", margin: "0 0 8px", letterSpacing: "-1px" }}>
            Lern<span style={{ color: "#C084FC" }}>Buddy</span>
          </h1>
          <p style={{ color: "#9B91CC", fontSize: 16, marginBottom: 36, lineHeight: 1.6 }}>
            Dein persönlicher KI-Nachhilfelehrer — erklärt, fragt nach,<br />und begleitet dich Schritt für Schritt.
          </p>
          <p style={{ color: "#7C6FFF", fontSize: 13, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 20 }}>Womit brauchst du Hilfe?</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {subjects.map((s) => (
              <button key={s.label} className="subject-card" onClick={() => startSession(s)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "20px 12px", cursor: "pointer", color: "#F0EDFF", transition: "all 0.25s", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, backdropFilter: "blur(10px)" }}>
                <span style={{ fontSize: 28 }}>{s.emoji}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</span>
              </button>
            ))}
          </div>
          <p style={{ marginTop: 40, color: "rgba(155,145,204,0.5)", fontSize: 12 }}>Powered by Claude · Für Schüler der Klassen 1–13</p>
        </div>
      ) : (
        <div style={{ width: "100%", maxWidth: 720, height: "100vh", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 12, background: "rgba(13,11,30,0.9)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 10 }}>
            <div style={{ fontSize: 28 }}>🦉</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#F0EDFF", fontWeight: 700, fontSize: 16 }}>LernBuddy</div>
              <div style={{ color: "#7C6FFF", fontSize: 12 }}>
                {selectedSubject?.emoji} {selectedSubject?.label}
                {uploadedFiles.length > 0 && <span style={{ marginLeft: 8, color: "#C084FC" }}>· 📎 {uploadedFiles.length} Datei{uploadedFiles.length > 1 ? "en" : ""}</span>}
              </div>
            </div>
            <button onClick={reset} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "6px 14px", color: "#9B91CC", fontSize: 12, cursor: "pointer" }}>Neu starten</button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column" }}>
            {messages.map((msg, i) => <div key={i} style={{ animation: "fadeUp 0.3s ease" }}><Message msg={msg} /></div>)}
            {loading && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #7C6FFF, #C084FC)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🦉</div>
                <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "18px 18px 18px 4px" }}><TypingIndicator /></div>
              </div>
            )}
            {error && <div style={{ textAlign: "center", color: "#FF7C7C", fontSize: 13, padding: "8px 16px", background: "rgba(255,100,100,0.1)", borderRadius: 10, marginBottom: 12 }}>{error}</div>}
            <div ref={bottomRef} />
          </div>

          {showUpload && (
            <div style={{ padding: "16px 20px 0", animation: "slideIn 0.25s ease" }}>
              <UploadArea onFile={(f) => { setPendingFile(f); setShowUpload(false); }} />
            </div>
          )}
          {pendingFile && !showUpload && (
            <div style={{ padding: "8px 20px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(192,132,252,0.12)", border: "1px solid rgba(192,132,252,0.3)", borderRadius: 12, marginBottom: 4 }}>
                <span style={{ fontSize: 20 }}>{pendingFile.type === "image" ? "🖼️" : "📄"}</span>
                <div style={{ flex: 1, color: "#C084FC", fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pendingFile.name}</div>
                <button onClick={() => setPendingFile(null)} style={{ background: "rgba(255,100,100,0.15)", border: "none", color: "#FF7C7C", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>✕</button>
              </div>
            </div>
          )}

          <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(13,11,30,0.9)", backdropFilter: "blur(20px)" }}>
            <div style={{ display: "flex", gap: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,111,255,0.3)", borderRadius: 16, padding: "8px 8px 8px 12px", alignItems: "flex-end" }}>
              <button onClick={() => setShowUpload(!showUpload)} style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: showUpload ? "rgba(192,132,252,0.2)" : "rgba(255,255,255,0.06)", border: `1px solid ${showUpload ? "rgba(192,132,252,0.5)" : "rgba(255,255,255,0.1)"}`, color: showUpload ? "#C084FC" : "rgba(240,237,255,0.5)", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", position: "relative" }}>
                📎
                {pendingFile && <div style={{ position: "absolute", top: -4, right: -4, width: 10, height: 10, borderRadius: "50%", background: "#C084FC", border: "2px solid #0D0B1E" }} />}
              </button>
              <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder={pendingFile ? "Nachricht hinzufügen (optional)…" : "Schreib deine Frage oder lade eine Mitschrift hoch…"} rows={1} style={{ flex: 1, background: "transparent", border: "none", color: "#F0EDFF", fontSize: 14, fontFamily: "Georgia, serif", resize: "none", lineHeight: 1.6, maxHeight: 120, overflowY: "auto", padding: "4px 0" }} />
              <button className="send-btn" onClick={sendMessage} disabled={(!input.trim() && !pendingFile) || loading} style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: (input.trim() || pendingFile) && !loading ? "linear-gradient(135deg, #7C6FFF, #C084FC)" : "rgba(255,255,255,0.08)", border: "none", cursor: (input.trim() || pendingFile) && !loading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, transition: "all 0.2s", color: "#F0EDFF" }}>↑</button>
            </div>
            <p style={{ textAlign: "center", color: "rgba(155,145,204,0.4)", fontSize: 11, marginTop: 8 }}>📎 Mitschriften hochladen · Enter zum Senden</p>
          </div>
        </div>
      )}
    </div>
  );
}
