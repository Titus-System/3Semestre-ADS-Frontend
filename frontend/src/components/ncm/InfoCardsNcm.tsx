import GraficoHistNcm from "./GraficoHistNcm";
import InfoGeralNcm from "./infoGeralNcm";

type Props = {
    ncm: number | null,
    tipo?: "exp" | "imp" | null,
    anos?: number[],
    estado?: number,
    pais?: number,
    transporte?: number[],
    urf?: number[],
}

export default function InfoCardsNcm({ ncm, anos, tipo, estado, pais, transporte, urf }: Props) {
    return (
        ncm ? (
            <section className="flex flex-col lg:flex-row gap-4 bg-transparent rounded p-4 w-full overflow-x-auto">

                <InfoGeralNcm
                    ncm = {ncm}
                    tipo={tipo ? tipo : null}
                    anos={anos ? anos : undefined}
                    estados={estado ? [estado] : undefined}
                    paises={pais ? [pais] : undefined}
                    transporte={transporte ? transporte : undefined}
                    urf={urf ? urf : undefined }
                />
                <br></br>
                <GraficoHistNcm
                    ncm={ncm}
                    tipo={tipo ? tipo : null}
                    anos={anos || null}
                    estado={estado || null}
                    pais={pais || null}
                    via={transporte || null}
                    urf={urf || null}
                />
            </section>
        ) : (
            <p className="text-center text-gray-300 mt-4">Selecione um NCM para visualizar o gráfico.</p>
        )
    );
}
