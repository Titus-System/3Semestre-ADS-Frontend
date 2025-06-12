import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/homePage";
import ConsultaDetalhamento from "../pages/funcionalidades";
import SobreNos from "../pages/sobreNos";
import Funcionalidades from "../pages/funcionalidades";
import ConsultaEstado from "../pages/consultaEstado";
import PaginaRanking from "../pages/paginaRanking"
import TendenciasPage from "../pages/tendencias";
import PaginaBuscaInfo from "../pages/paginaBuscaInfo";


export default function AppRoutes(){

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/consulta_detalhamento" element={<ConsultaDetalhamento/>} />
                <Route path="/funcionalidades" element={<Funcionalidades/>} />
                <Route path="/sobreNos" element={<SobreNos/>} />
                <Route path="/previsao" element={<TendenciasPage/>} />      
                <Route path="/consulta_estado" element={<ConsultaEstado/>} /> 
                <Route path="/paginaRanking" element={<PaginaRanking/>} />
                <Route path="/info" element={<PaginaBuscaInfo/>} />
            </Routes>
        </BrowserRouter>
    );
}