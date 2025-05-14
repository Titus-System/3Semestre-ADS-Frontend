
export default function Footer(){
  return (
    <div className="flex relative z-0">
          {/* Degradê de fundo invertido */}
          <div className="flex absolute bottom-0 left-0 right-0 h-[730px] bg-gradient-to-t from-[#0A0A37] to-transparent pointer-events-none z-0"></div>
      <footer className="flex flex-col relative z-0 bg-transparent p-4 mt-20">
        
        <div className="flex flex-col relative z-0 w-full mx-auto px-4">
          <div className="w-full flex flex-col justify-center items-center">
          {/* <h1 className="self-start text-3xl font-bold text-[#7D8491]">InsightFlow</h1> */}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
            {/* Primeira coluna */}
            <div className="w-full max-w-1/4 flex flex-col">
            <h1 className="text-3xl font-bold text-[#7D8491] mb-6">InsightFlow</h1>
              <p className="text-base text-[#7D8491]">Projeto desenvolvido no âmbito acadêmico sob orientação da Fatec Prof. Jessen Vidal.</p>
              <p className="text-base text-[#7D8491] mt-5">Última atualização: Maio de 2025.</p>
            </div>
            
            {/* Segunda coluna */}
            <div className="w-full max-w-1/4 flex flex-col">
              <div className="flex flex-row items-center gap-2 mb-4">
                <h1 className="text-xl font-bold text-[#7D8491] mb-3">Titus Systems</h1>
                <a href="https://github.com/Titus-System" target="_blank" rel="noopener noreferrer" className="text-[#7D8491] hover:text-white flex items-center group transition-colors duration-200">
                  <svg className="w-8 h-8 transform transition-transform duration-200 group-hover:scale-110 hover:scale-110 mb-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
              <p className="text-base text-[#7D8491]">A Titus Systems foi a equipe responsável pelo desenvolvimento do site. Para conhecer os integrantes e explorar outros projetos nossos, basta acessar nosso GitHub.</p>
            </div>
            
            {/* Terceira coluna */}
            <div className="w-full max-w-1/4 flex flex-col">
              <h1 className="text-xl font-bold text-[#7D8491] mb-3">Atalhos</h1>
              <a href="/paginaRanking" className="text-base text-[#7D8491] mt-2 hover:text-white transition-colors duration-200">Comparação Global de Valor Agregado</a>
              <p className="text-base text-[#7D8491] mt-2 hover:text-white transition-colors duration-200">Análise de Estados</p>
              <p className="text-base text-[#7D8491] mt-2 hover:text-white transition-colors duration-200">Previsão de Tendências</p>
              <p className="text-base text-[#7D8491] mt-2 hover:text-white transition-colors duration-200">Busca por NCM</p>
            </div>
          </div>
          </div>
          
          <hr className="h-0.5 border-[#7D8491]"/>
          <div className="text-center text-[#7D8491] py-4">
            <p>&copy; {new Date().getFullYear()} <strong>InsightFlow.</strong> Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};