export default function HomePage() {
    return (
        <div className="relative">
            <div className="relative h-[800px] flex flex-col items-center justify-center text-center overflow-hidden">

                {/* Imagem de fundo com opacidade geral */}
                <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-40 z-0"></div>

                  {/* Gradientes superior e inferior */}
                  <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#11114e] to-transparent z-10"></div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#11114e] to-transparent z-10"></div>

                {/* Conteúdo principal */}
                <div className="relative z-20 max-w-4xl px-4">
                    <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight">
                        Compreenda o mercado e tome decisões com mais confiança
                    </h1>
                    <p className="text-white text-md md:text-lg mt-20 leading-relaxed">
                        O InsightFlow reúne dados confiáveis de comércio exterior do Brasil, permitindo a comparação de performances estaduais, 
                        a identificação de padrões e tendências e a segmentação personalizada de dados para diferentes necessidades.
                    </p>
                </div>
            </div>

            {/* Botões de funcionalidades */}
            <div className="flex flex-col items-center gap-6 mt-10 mb-[300px] max-w-2xl w-full mx-auto px-4">
                {/* seus botões aqui... */}
            </div>
        </div>
    );
}
