import React, { useState, useEffect } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";

interface FootballPlayer {
  nombre: string;
  posicion: string;
  edad: number;
  nacionalidad: string;
  salario_semanal: number;
  salario_anual: number;
  equipo: string; 
}

function FootballHomePage() {
  const [players, setPlayers] = useState<FootballPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    position: '',
    maxSalary: '',
    nationality: '',
    age: '',
    orderBy: '',     // 
    order: 'desc',   // 
  });
  const [scraped, setScraped] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);

  const scrapeSalaries = async () => {
    try {
      if (!scraped) {
        const res = await fetch(`${BACKEND_URL}/api/scrape/salaries`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`❌ Backend Error: ${res.status} - ${text}`);
        }
        const data = await res.json();
        console.log("📡 Salaries scraped", data);
        setScraped(true);
      }
    } catch (err) {
      console.error("❌ Error scraping salaries:", err);
    }
  };

  useEffect(() => {
    scrapeSalaries();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setPage(1); // Reinicia a la primera página
    handleSearchWithForm(form, 1);
  };
  
  const toggleSort = (field: string) => {
    setForm(prev => {
      const newOrder = prev.orderBy === field && prev.order === 'asc' ? 'desc' : 'asc';
      const updatedForm = { ...prev, orderBy: field, order: newOrder };
      handleSearchWithForm(updatedForm);
      return updatedForm;
    });
  };
  
const handleSearchWithForm = async (formState = form, pageNum = page) => {
  setIsLoading(true);
  const query = new URLSearchParams();
  const skip = (pageNum - 1) * limit;

  if (formState.position) query.append("posicion", formState.position);
  if (formState.maxSalary) query.append("max_sueldo", formState.maxSalary);
  if (formState.nationality) query.append("nacionalidad", formState.nationality);
  if (formState.age) query.append("max_edad", formState.age);
  if (formState.orderBy) query.append("ordenar_por", formState.orderBy);
  if (formState.order) query.append("orden", formState.order);
  query.append("skip", skip.toString());
  query.append("limit", limit.toString());

  try {
    const res = await fetch(`${BACKEND_URL}/api/players?${query.toString()}`);
    const data = await res.json();
    setPlayers(data.players || []);
    setTotal(data.total || 0);
  } catch (err) {
    console.error("Error fetching players:", err);
  }

  setIsLoading(false);
};
  
  
  return (
    <div className="min-h-screen bg-green-50">
      <nav className="border-b bg-green-900 text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold">Football Data AI</h1>
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-1">Explore players <ChevronDown className="w-4 h-4" /></button>
              <a href="mailto:hoopsdataAI@gmail.com" className="flex items-center gap-1 hover:underline">
                Pricing <ChevronDown className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-white">Sign up</button>
            <button className="px-4 py-2 bg-white text-green-900 rounded-full font-semibold">Log in</button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-6xl font-bold text-green-900 mb-6">
          Discover talent<br />through football analytics
        </h2>
        <p className="text-xl text-gray-700 mb-12">
          Leverage data to evaluate players, strategies, and performance. Perfect for scouts, analysts, and coaches.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-6">
          <input
            name="position"
            placeholder="Position"
            value={form.position}
            onChange={handleChange}
            className="py-3 px-4 rounded-full border border-gray-300"
          />
          <input
            name="maxSalary"
            placeholder="Max Annual Salary (€)"
            value={form.maxSalary}
            onChange={handleChange}
            className="py-3 px-4 rounded-full border border-gray-300"
          />
          <input
            name="nationality"
            placeholder="Nationality"
            value={form.nationality}
            onChange={handleChange}
            className="py-3 px-4 rounded-full border border-gray-300"
          />
          <input
            name="age"
            placeholder="Max Age"
            value={form.age}
            onChange={handleChange}
            className="py-3 px-4 rounded-full border border-gray-300"
          />
        </div>

        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-green-900 text-white rounded-full font-semibold"
        >
          {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Search players"}
        </button>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {players.length > 0 && (
          <div className="overflow-x-auto mt-6 bg-white rounded-xl shadow-md">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-green-900 text-white">
                <tr>
                 <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort("nombre")}>
                    Name {form.orderBy === "nombre" ? (form.order === "asc" ? "▲" : "▼") : ""}
                 </th>
                  <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort("equipo")}>
                    Team {form.orderBy === "equipo" ? (form.order === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort("posicion")}>
                    Position {form.orderBy === "posicion" ? (form.order === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort("edad")}>
                    Age {form.orderBy === "edad" ? (form.order === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort("nacionalidad")}>
                    Nationality {form.orderBy === "nacionalidad" ? (form.order === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort("salario_semanal")}>
                    Weekly Salary {form.orderBy === "salario_semanal" ? (form.order === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort("salario_anual")}>
                    Annual Salary {form.orderBy === "salario_anual" ? (form.order === "asc" ? "▲" : "▼") : ""}
                  </th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr key={index} className="border-b hover:bg-green-50">
                    <td className="px-6 py-3">{player.nombre}</td>
                    <td className="px-6 py-3">{player.equipo || "N/A"}</td>
                    <td className="px-6 py-3">{player.posicion}</td>
                    <td className="px-6 py-3">{player.edad}</td>
                    <td className="px-6 py-3">{player.nacionalidad}</td>
                    <td className="px-6 py-3">€{player.salario_semanal.toLocaleString()}</td>
                    <td className="px-6 py-3">€{player.salario_anual.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center items-center gap-4 mt-4">
                <button
                    disabled={page === 1}
                    onClick={() => {
                    setPage(prev => prev - 1);
                    handleSearchWithForm(form, page - 1);
                    }}
                    className="px-4 py-2 bg-green-900 text-white rounded disabled:opacity-50"
                >
                    Previous
                </button>

                <span className="text-green-900 font-semibold">
                        Page {page} of {Math.max(1, Math.ceil(total / limit))}
                </span>

                <button
                    disabled={page >= Math.ceil(total / limit)}
                    onClick={() => {
                    setPage(prev => prev + 1);
                    handleSearchWithForm(form, page + 1);
                    }}
                    className="px-4 py-2 bg-green-900 text-white rounded disabled:opacity-50"
                >
                    Next
                </button>
                </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FootballHomePage;
