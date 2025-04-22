export default function AnaliseComparacoes (){
  return(
      <div>
      <div className="flex flex-col items-center gap-6 mt-16">

          <div className="text-center">
              <h1 className="text-4xl font-bold text-black mt-6 mb-4">Análises e Comparações</h1>
              <p className="text-lg text-black mt-20">Escolha o recurso que deseja utilizar</p>
          </div>

          <div className="flex flex-col items-center gap-6 mt-20 mb-[1000px]">

          <a href="/paginaHanking">
              <button className="w-full max-w-xl h-14 rounded-full px-10 py-3 bg-[#0A0A37] text-white hover:bg-[#11114E] text-lg font-semibold">
                  Comparação Global de Valor Agregado
              </button>
          </a>

          <a href="/comparacaoEstado">
              <button className="w-full max-w-xl h-14 rounded-full px-10 py-3 bg-[#0A0A37] text-white hover:bg-[#11114E] text-lg font-semibold">
                  Comparação de Estados
              </button>
          </a>

          <a href="/previsao">
              <button className="w-full max-w-xl h-14 rounded-full px-10 py-3 bg-[#0A0A37] text-white hover:bg-[#11114E] text-lg font-semibold">
                  Previsão de Tendências
              </button>
          </a>

      </div>            
      </div>
  </div>
  );
};