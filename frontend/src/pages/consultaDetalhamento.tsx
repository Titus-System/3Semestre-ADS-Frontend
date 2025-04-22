export default function ConsultaDetalhamento (){
    return (
        <div>
            <div className="flex flex-col items-center gap-6 mt-16">

                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mt-6 mb-4">Consulta e Detalhamento</h1>
                    <p className="text-lg text-white mt-20">Escolha o recurso que deseja utilizar</p>
                </div>

                
                <div className="flex flex-col items-center gap-6 mt-20 mb-[1000px]">
                <a href="/consulta_estado">
                        <button className="w-full max-w-2xl rounded-full px-10 py-4 bg-[#0A0A37] text-white hover:bg-[#11114E] text-xl font-semibold">
                            Consulta por estado
                        </button>
                </a>
                    <a href="/buscaNCM">
                        <button className="w-full max-w-2xl rounded-full px-10 py-4 bg-[#0A0A37] text-white hover:bg-[#11114E] text-xl font-semibold">
                            Busca por NCM
                        </button>
                    </a>

                </div>
                

            </div>
        </div>
    );
};