import { useState } from "react";
import { queryAI } from "../api/aiClient";

export default function AIHub() {
  const bots = [
    { name: "NewsBot", description: "Podsumowuje aktualne wiadomości z całego świata.", avatar: "/avatars/news.png" },
    { name: "LangBuddy", description: "Pomaga w nauce języków obcych.", avatar: "/avatars/lang.png" },
    { name: "LifeCoach", description: "Daje porady dotyczące zdrowia i stylu życia.", avatar: "/avatars/coach.png" },
    { name: "StartupGuru", description: "Doradza w sprawach biznesowych i startupów.", avatar: "/avatars/startup.png" }
  ];

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(10);

  const sendMessage = async () => {
    if (!input || loading || credits <= 0) return;
    const user = { role: "user", content: input };
    setMessages(prev => [...prev, user]);
    setInput(""); setLoading(true);
    try {
      const resp = await queryAI(input);
      const botMsg = resp?.[0]?.generated_text || "Brak odpowiedzi.";
      setMessages(prev => [...prev, user, { role: "bot", content: botMsg }]);
      setCredits(prev => prev - 1);
    } catch {
      setMessages(prev => [...prev, user, { role: "bot", content: "Błąd AI." }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">AI Kontakty</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {bots.map((b,i)=>
            <div key={i} className="bg-white rounded-2xl p-6 shadow-md">
              <img src={b.avatar} alt={b.name} className="w-16 h-16 rounded-full mb-4"/>
              <h2 className="text-xl font-semibold">{b.name}</h2>
              <p className="text-sm text-gray-500 mb-3">{b.description}</p>
              <button className="bg-blue-600 text-white py-2 px-4 rounded-full w-full">Rozpocznij rozmowę</button>
            </div>
          )}
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Czat – pozostało {credits} kamyczków</h2>
          <div className="h-64 overflow-y-auto mb-4 border p-3 rounded bg-gray-50">
            {messages.map((m,i)=>
              <div key={i} className={`mb-2 ${m.role==="user"?"text-right":"text-left"}`}>
                <span className="inline-block px-3 py-2 rounded bg-gray-200">{m.content}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input className="border rounded px-4 py-2 flex-1" placeholder="Twoje pytanie..." value={input} onChange={e=>setInput(e.target.value)}/>
            <button onClick={sendMessage} disabled={loading||credits<=0} className="bg-blue-600 text-white px-4 py-2 rounded">
              {loading?"...":"Wyślij"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
