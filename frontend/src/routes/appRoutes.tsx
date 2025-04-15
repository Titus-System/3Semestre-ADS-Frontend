import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/homePage";
import ConsultaDetalhamento from "../pages/consultaDetalhamento";
import AnaliseComparacoes from "../pages/analiseComparacoes";
import BuscarNCM from "../pages/buscaNCM";
import ComparacaoEstados from "../pages/comparacaoEstado";
import PaginaHanking from "../pages/paginaTendencia";
import Previsao from "../pages/previsao";
import ComparacaoValorAgregado from "../pages/comparacaoValorAgregado";
import ComparacaoEstado from "../pages/comparacaoEstado";
import ConsultaEstado from "../pages/consultaEstado";


export default function AppRoutes(){

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/consulta_detalhamento" element={<ConsultaDetalhamento/>} />
                <Route path="/analise_comparacoes" element={<AnaliseComparacoes/>} />
                <Route path="/buscaNCM" element={<BuscarNCM/>} />
                <Route path="/ComparacaoEstado" element={<ComparacaoEstado/>} />
                {/* <Route path="/dashboard" element={<DashboardPage/>} /> */}
                <Route path="/paginaHanking" element={<PaginaHanking/>} />
                <Route path="/previsao" element={<Previsao/>} />
                <Route path="/valor_agregado" element={<ComparacaoValorAgregado/>} />
                <Route path="/consulta_estado" element={<ConsultaEstado/>} />
                
            </Routes>
        </BrowserRouter>
    );
}