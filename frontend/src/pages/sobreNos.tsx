import { Link } from "react-router-dom";

export default function SobreNos (){
  return(
    <div className="relative">
      <div className="flex flex-col items-center gap-6 mt-16">

        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mt-6 mb-4">Sobre Nós</h1>
          <p className="text-lg text-white mt-20">A InsightFlow é uma plataforma inovadora que visa transformar a maneira como as empresas analisam e utilizam dados de importação e exportação. Nossa missão é fornecer insights valiosos e ferramentas poderosas para ajudar as empresas a tomar decisões informadas e estratégicas.</p>
        </div>

        <div className="flex flex-col items-center gap-6 mt-20 mb-[1000px]">

          <Link to="/funcionalidades">
            <button className="w-full max-w-xl h-14 rounded-full px-10 py-3 bg-[#0A0A37] text-white hover:bg-[#11114E] text-lg font-semibold">
              Funcionalidades
            </button>
          </Link>

        </div>


      </div>
    </div>
  );
};