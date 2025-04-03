import logosemfundo from "../assets/logosemfundo.png"

export default function Header() {    

    return (
      <header className="bg-[#0A0A37] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-x-2 sm:gap-x-4">
            <img src={logosemfundo} alt="Descrição" className="w-24 h-24w-20 h-20 object-contain" />
            <h1 className="text-2xl font-bold self-center relative-top">InsightFlow</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="/" className="hover:underline">Home</a>
              </li>
              <li>
                <a href="/consulta_detalhamento" className="hover:underline">Consulta e Detalhamento</a>
              </li>
              <li>
                <a href="/analise_comparacoes" className="hover:underline">Análise e Comparações</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
  };

  