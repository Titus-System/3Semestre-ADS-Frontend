export default function Funcionalidades() {
    return (
        <div className="relative bg-[#11114e]">
            {/* Hero Section */}
            <div className="relative h-[700px] flex flex-col items-center justify-center text-center overflow-hidden">
                {/* Imagem de fundo com opacidade */}
                <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-40 z-0"></div>

                {/* Gradientes superior e inferior */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#11114e] to-transparent z-10"></div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#11114e] to-transparent z-10"></div>

                {/* Conteúdo */}
                <div className="relative z-20 max-w-3xl px-4">
                    <h1 className="text-white text-4xl md:text-5xl font-bold">
                    Funcionalidades
                    </h1>
                    <p className="text-white text-md md:text-lg mt-6 leading-relaxed">
                    O que oferecemos a você?
                    </p>
                </div>
            </div>

            {/* Botões de funcionalidades */}
            <div className="flex flex-col items-center gap-6 mt-40 mb-[300px] max-w-2xl w-full mx-auto px-4">
                <a href="/consulta_estado" className="w-full">
                    <button className="w-full h-16 rounded-full px-10 py-4 bg-[#0A0A37] text-white hover:bg-[#34538D] text-xl font-semibold">
                        Análise de Estados
                    </button>
                </a>
                <a href="/buscaNCM" className="w-full">
                    <button className="w-full h-16 rounded-full px-10 py-4 bg-[#0A0A37] text-white hover:bg-[#34538D] text-xl font-semibold">
                        Busca por NCM
                    </button>
                </a>
                <a href="/paginaRanking" className="w-full">
                    <button className="w-full h-16 rounded-full px-10 py-4 bg-[#0A0A37] text-white hover:bg-[#34538D] text-xl font-semibold">
                        Comparação geral de Estados e Paises
                    </button>
                </a> 
                <a href="/previsao" className="w-full">
                    <button className="w-full h-16 rounded-full px-10 py-4 bg-[#0A0A37] text-white hover:bg-[#34538D] text-xl font-semibold">
                        Previsão de Tendências
                    </button>
                </a>
            </div>
        </div>
    );
}
