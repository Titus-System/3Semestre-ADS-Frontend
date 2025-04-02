import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/homePage";
import ConsultaDetalhamento from "../pages/consultaDetalhamento";
import AnaliseComparacoes from "../pages/analiseComparacoes";
import BuscarNCM from "../pages/buscaNCM";

export default function AppRoutes(){

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/consulta_detalhamento" element={<ConsultaDetalhamento/>} />
                <Route path="/analise_comparacoes" element={<AnaliseComparacoes/>} />
                <Route path="/buscaNCM" element={<BuscarNCM/>} />
                {/* <Route path="/dashboard" element={<DashboardPage/>} /> */}
            </Routes>
        </BrowserRouter>
    );
}