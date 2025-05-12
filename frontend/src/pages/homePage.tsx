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

            {/* Container funcional */}
            <div className="relative z-20 mt-[-100px] flex flex-col items-center px-4">
                
                <h2 className="text-white text-2xl font-semibold mb-6 mt-56">O que oferecemos a você?</h2>

                <div className="bg-white/10 backdrop-blur-md p-6 md:p-10 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
                    {[
                        {
                            title: 'Análise por Estado',
                            desc: 'Explore detalhes sobre o comércio em cada estado, incluindo principais cargas movimentadas e evolução histórica.',
                        },
                        {
                            title: 'Comparação Comercial',
                            desc: 'Compare o desempenho comercial entre estados e identifique quais países estão aumentando suas importações de produtos específicos.',
                        },
                        {
                            title: 'Previsão de Tendências',
                            desc: 'Utilize inteligência de dados para antecipar mudanças no comércio exterior e tomar decisões estratégicas.',
                        },
                        {
                            title: 'Gráficos Personalizáveis',
                            desc: 'Visualize dados por meio de gráficos dinâmicos que facilitam a análise econômica.',
                        },
                        {
                            title: 'Busca Avançada de Cargas',
                            desc: 'Pesquise detalhes sobre mercadorias e processos específicos por meio de filtros personalizados e códigos NCM.',
                        },
                        {
                            title: 'Detalhes de VA',
                            desc: 'Obtenha uma visão detalhada de diferentes operações comerciais, com informações e valores que permitem uma análise clara do valor agregado.',
                        },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="bg-white/20 p-4 rounded-xl text-white"
                        >
                            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                            <p className="text-sm">{item.desc}</p>
                        </div>
                    ))}
                    
                </div>
            </div>
            {/* Fontes de Dados */}
                <div className="relative z-20 mt-24 flex flex-col items-center px-4 mb-72">
                    <h2 className="text-white text-2xl font-semibold mb-10">Fontes de Dados</h2>

                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        {/* Comex Stat */}
                        <div className="flex items-center bg-[#34538D] rounded-full px-4 py-2 w-[300px] justify-between">
                            <div className="flex flex-col text-left text-sm">
                                <span className="font-semibold text-white ml-3">Comex Stat</span>
                                <span className="text-white ml-3">Dados de<br />comércio exterior</span>
                            </div>
                            <img
                                src="/logo_comex.png"
                                alt="Logo Comex Stat"
                                className="w-20 h-20  object-contain"
                            />
                        </div>

                        {/* IBGE */}
                        <div className="flex items-center bg-[#34538D] rounded-full px-4 py-2 w-[300px] justify-between">
                            <div className="flex flex-col text-left text-sm">
                                <span className="font-semibold text-white ml-4">IBGE</span>
                                <span className="text-white ml-4">Dados de produção</span>
                            </div>
                            <img
                                src="/logo_ibge.png"
                                alt="Logo IBGE"
                                className="w-[130px] h-20 object-contain"
                            />
                        </div>
                    </div>
                </div>


        </div>
    );
}
