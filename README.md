GameStats Dashboard - Um Dashboard Interativo de Jogos
Este é um projeto de dashboard web criado com React e Vite para visualizar dados sobre jogos de PC e consoles, utilizando a API da RAWG.

Funcionalidades
Visualização Dinâmica: Explore jogos por popularidade, avaliação e lançamentos recentes.

Filtros Interativos: Filtre os resultados por plataforma (PC, PlayStation, Xbox, Nintendo) e categoria.

Busca Integrada: Encontre jogos específicos pelo nome.

Gráficos Comparativos: Analise as avaliações dos jogos mais relevantes em um gráfico de linha.

Design Moderno: Interface responsiva com tema claro e escuro, inspirada nas lojas de jogos modernas.

Animações Suaves: Efeitos de hover nos cards para exibir detalhes adicionais com transições CSS fluidas.

⚙️ Configuração do Projeto
Siga os passos abaixo para rodar o projeto localmente.

Pré-requisitos
Node.js (versão 18 ou superior)

npm (geralmente instalado com o Node.js)

Passo 1: Obtenha sua Chave da API
Este projeto utiliza a RAWG Video Games Database API para buscar os dados dos jogos. O acesso é gratuito, mas requer uma chave de API.

Acesse rawg.io/signup para criar uma conta gratuita.

Após o login, vá para a página da sua conta e encontre a seção "API Key".

Copie a sua chave de API.

Passo 2: Configure o Código Fonte
Clone o repositório (ou crie os arquivos App.jsx, package.json e README.md em uma pasta local).

Abra o arquivo src/App.jsx.

Localize a seguinte linha de código:

const API_KEY = 'SUA_CHAVE_API';

Substitua 'SUA_CHAVE_API' pela chave que você copiou no passo anterior.

Passo 3: Instale as Dependências
Navegue até a pasta raiz do projeto no seu terminal e execute o seguinte comando para instalar todas as bibliotecas necessárias:

npm install

Passo 4: Rode o Projeto
Após a instalação, inicie o servidor de desenvolvimento com o comando:

npm run dev

O terminal irá exibir um endereço local (geralmente http://localhost:5173). Abra este endereço no seu navegador para ver o dashboard em ação!

🚀 Tecnologias Utilizadas
Framework: React.js com Vite

Estilização: Tailwind CSS

Gráficos: Chart.js com react-chartjs-2

Ícones: Lucide React

API: RAWG Video Games Database API

🔮 Melhorias Futuras
Este projeto é uma base excelente que pode ser expandida com novas funcionalidades:

Página de Detalhes: Clicar em um card poderia levar a uma página dedicada com informações completas sobre o jogo (screenshots, trailers, descrição, requisitos de sistema).

Filtros Avançados: Adicionar filtros por gênero, tags ou ano de lançamento.

Autenticação de Usuários: Permitir que usuários criem contas para salvar listas de jogos favoritos.

Persistência de Dados: Integrar com um backend e um banco de dados (como Firebase ou Supabase) para salvar as listas dos usuários.

Exportação de Relatórios: Gerar um PDF ou CSV com os dados da visualização atual.

Cache de API: Implementar um cache mais robusto (ex: com React Query) para otimizar as chamadas à API e melhorar a performance.

Divirta-se explorando e customizando o seu dashboard de jogos!