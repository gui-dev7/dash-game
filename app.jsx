import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Sun, Moon, Search, X } from 'lucide-react';

// Registrando os componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// --- CONFIGURAÇÃO DA API ---
// IMPORTANTE: Obtenha sua chave de API gratuita em https://rawg.io/signup
// e substitua 'SUA_CHAVE_API' abaixo.
const API_KEY = 'ceada46cdd784f0698e6d2deebd2ab35'; 
const API_URL = 'https://api.rawg.io/api';

// --- COMPONENTES AUXILIARES ---

// Componente para o ícone de carregamento (Spinner)
const Spinner = () => (
  <div className="flex justify-center items-center h-full w-full">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

// Componente para exibir mensagens de erro
const ErrorMessage = ({ message }) => (
  <div className="text-center p-8 bg-red-900/20 rounded-lg">
    <h3 className="text-xl font-bold text-red-400">Oops! Algo deu errado.</h3>
    <p className="text-red-300 mt-2">{message}</p>
  </div>
);

// Componente para o Card de Jogo
const GameCard = ({ game }) => (
  <div className="group relative rounded-xl overflow-hidden shadow-lg bg-gray-800 transform hover:scale-105 transition-transform duration-300 ease-in-out">
    <img 
      src={game.background_image} 
      alt={`Capa do jogo ${game.name}`} 
      className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-20"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
    <div className="absolute bottom-0 left-0 p-4">
      <h3 className="text-lg font-bold text-white drop-shadow-md">{game.name}</h3>
      <p className="text-sm text-gray-300">{game.genres.map(g => g.name).join(', ')}</p>
    </div>
    {/* Detalhes que aparecem no hover */}
    <div className="absolute inset-0 p-4 bg-black/70 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
      <h4 className="text-xl font-extrabold text-indigo-400">{game.name}</h4>
      <div className="mt-4 space-y-2 text-sm">
        <p><span className="font-bold text-gray-300">Avaliação:</span> <span className="text-yellow-400">{game.rating} / 5 ({game.ratings_count} avaliações)</span></p>
        <p><span className="font-bold text-gray-300">Metacritic:</span> <span className="font-bold text-green-400 p-1 rounded bg-green-900/50">{game.metacritic || 'N/A'}</span></p>
        <p><span className="font-bold text-gray-300">Lançamento:</span> <span className="text-gray-200">{new Date(game.released).toLocaleDateString('pt-BR')}</span></p>
        <p><span className="font-bold text-gray-300">Plataformas:</span> <span className="text-gray-200">{game.platforms.map(p => p.platform.name).slice(0, 3).join(', ')}</span></p>
      </div>
    </div>
  </div>
);

// Componente para o Gráfico de Estatísticas
const StatsChart = ({ games }) => {
  const chartData = {
    labels: games.map(game => game.name),
    datasets: [
      {
        label: 'Pontuação Metacritic',
        data: games.map(game => game.metacritic),
        fill: false,
        borderColor: 'rgb(129, 140, 248)', // indigo-400
        tension: 0.1,
      },
       {
        label: 'Avaliação dos Usuários (x20)',
        data: games.map(game => game.rating * 20), // Multiplicado por 20 para ficar na mesma escala do Metacritic
        fill: false,
        borderColor: 'rgb(250, 204, 21)', // yellow-400
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#D1D5DB' }
      },
      title: {
        display: true,
        text: 'Comparativo de Avaliações: Top 5 Jogos',
        color: '#F9FAFB',
        font: { size: 18 }
      },
    },
    scales: {
        x: { ticks: { color: '#9CA3AF' } },
        y: { ticks: { color: '#9CA3AF' }, suggestedMin: 40, suggestedMax: 100 }
    }
  };

  return <Line options={options} data={chartData} />;
};


// --- COMPONENTE PRINCIPAL (APP) ---

function App() {
  // Estado para tema (claro/escuro)
  const [theme, setTheme] = useState('dark');
  // Estados para dados dos jogos
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estados para filtros
  const [category, setCategory] = useState('-added'); // -metacritic para melhor avaliados, -added para mais populares/recentes
  const [platform, setPlatform] = useState('4'); // 4 = PC, 187 = PlayStation 5, 186 = Xbox Series S/X
  const [search, setSearch] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');

  // Efeito para alternar classe do tema no body
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900';
  }, [theme]);

  // Função para buscar dados da API
  const fetchGames = useCallback(async () => {
    if (API_KEY === 'SUA_CHAVE_API') {
        setError("Por favor, adicione sua chave de API da RAWG no arquivo App.jsx para começar.");
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);
    let url = `${API_URL}/games?key=${API_KEY}&ordering=${category}&page_size=20`;
    if (platform) {
      url += `&platforms=${platform}`;
    }
    if (currentSearch) {
        url += `&search=${encodeURIComponent(currentSearch)}&search_exact=true`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }
      const data = await response.json();
      setGames(data.results);
    } catch (err) {
      setError(err.message);
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, [category, platform, currentSearch]);

  // Efeito para buscar dados quando os filtros mudam
  useEffect(() => {
    const timer = setTimeout(() => {
        if(search === currentSearch) fetchGames();
    }, 10); // Pequeno debounce para evitar chamadas múltiplas
    return () => clearTimeout(timer);
  }, [fetchGames, search, currentSearch]);
  
  const handleSearchSubmit = (e) => {
      e.preventDefault();
      setCurrentSearch(search);
  }

  // Memoizando os dados do gráfico para evitar recálculos desnecessários
  const top5GamesForChart = useMemo(() => games.slice(0, 5), [games]);

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4 py-8">
        
        {/* Cabeçalho */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-4 sm:mb-0">
            GameStats Dashboard
          </h1>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {theme === 'dark' ? <Sun className="text-yellow-400" /> : <Moon className="text-indigo-500" />}
          </button>
        </header>

        {/* Barra de Filtros */}
        <div className="mb-8 p-4 rounded-lg shadow-md bg-opacity-20 backdrop-blur-sm border border-opacity-20 transition-colors ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Filtro de Categoria */}
            <div>
              <label className="block text-sm font-medium mb-1">Categoria</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full p-2 rounded border transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
              >
                <option value="-added">Mais Populares</option>
                <option value="-metacritic">Melhor Avaliados</option>
                <option value="-released">Lançamentos Recentes</option>
              </select>
            </div>
            {/* Filtro de Plataforma */}
            <div>
              <label className="block text-sm font-medium mb-1">Plataforma</label>
              <select 
                value={platform} 
                onChange={(e) => setPlatform(e.target.value)}
                className={`w-full p-2 rounded border transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
              >
                <option value="4">PC</option>
                <option value="187">PlayStation 5</option>
                <option value="186">Xbox Series S/X</option>
                <option value="7">Nintendo Switch</option>
              </select>
            </div>
            {/* Barra de Busca */}
             <form onSubmit={handleSearchSubmit}>
                <label className="block text-sm font-medium mb-1">Buscar Jogo</label>
                <div className="relative">
                    <input 
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Ex: Cyberpunk 2077..."
                        className={`w-full p-2 pr-10 rounded border transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                    />
                    {search && <X onClick={() => {setSearch(''); setCurrentSearch('')}} className="absolute right-10 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400" size={20}/>}
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search size={20} />
                    </button>
                </div>
            </form>
          </div>
        </div>

        {/* Seção Principal (Gráfico e Galeria) */}
        <main>
          {loading ? <Spinner /> : error ? <ErrorMessage message={error} /> : (
            <>
              {/* Gráfico */}
              {games.length > 0 && (
                <div className="mb-12 p-4 rounded-lg shadow-lg transition-colors ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}">
                   <StatsChart games={top5GamesForChart} />
                </div>
              )}
              
              {/* Galeria de Jogos */}
              {games.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {games.map(game => <GameCard key={game.id} game={game} />)}
                </div>
              ) : (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-semibold">Nenhum jogo encontrado</h2>
                    <p className="mt-2 text-gray-400">Tente ajustar seus filtros ou o termo de busca.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
