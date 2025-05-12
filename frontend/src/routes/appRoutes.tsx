import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/homePage";
import ConsultaDetalhamento from "../pages/consultaDetalhamento";
import AnaliseComparacoes from "../pages/analiseComparacoes";
import BuscarNCM from "../pages/buscaNCM";
import ComparacaoEstados from "../pages/comparacaoEstado";
import Previsao from "../pages/previsao";
import ComparacaoEstado from "../pages/comparacaoEstado";
import ConsultaEstado from "../pages/consultaEstado";
import PaginaRanking from "../pages/paginaRanking"
import TendenciasPage from "../pages/tendencias";
import PaginaPais from "../pages/paginaPais";




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
                <Route path="/previsao" element={<TendenciasPage/>} />      
                <Route path="/consulta_estado" element={<ConsultaEstado/>} /> 
                <Route path="/paginaRanking" element={<PaginaRanking/>} />
                <Route path="/pais" element={<PaginaPais/>} />

            </Routes>
        </BrowserRouter>
    );
}