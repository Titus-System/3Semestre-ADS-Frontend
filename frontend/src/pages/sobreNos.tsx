import { Link } from "react-router-dom";


export default function SobreNos() {
  return (
    <div className="relative">
      <div className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">

        {/* Imagem de fundo com opacidade geral */}
        <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-40 z-0"></div>

        {/* Gradientes superior e inferior */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#11114e] to-transparent z-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#11114e] to-transparent z-10"></div>

        {/* Conteúdo principal */}
        <div className="relative z-20 max-w-4xl px-4">
          <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight mt-5">
            Sobre Nós
          </h1>

          {/* Introduçao */}
          <h1 className="text-white text-3xl md:text-3xl font-bold leading-tight mt-20">
            Quem somos?
          </h1>

          <p className="text-white text-start text-md md:text-lg mt-3 leading-relaxed mt-5">
            O InsightFlow é uma plataforma dedicada ao monitoramento, análise e disseminação de dados de comércio exterior do Brasil. Voltada para profissionais, gestores e órgãos públicos, a plataforma centraliza informações essenciais para apoiar a tomada de decisões estratégicas e promover a transparência do mercado internacional brasileiro.
          </p>


          {/* Missão, Visão e Valores */}
          <h1 className="text-white text-3xl md:text-3xl font-bold leading-tight mt-20">
            Quais são os nossos fundamentos?
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-5">
            <div className="flex flex-col space-y-3 w-full">
              <div className="flex flex-col p-4 border rounded bg-blue/10 backdrop-blur text-white font-bold">Missão
                <hr className="border-0 h-[1px] w-full bg-[linear-gradient(to_right,#d5b8e8_60%,transparent_100%)]" />
                <p className="text-white text-start text-sm md:text-sm mt-3 leading-relaxed">
                  Prover informações precisas, acessíveis e atualizadas sobre o comércio exterior brasileiro, integrando dados de importação e exportação de forma visual e interativa. Nosso objetivo é apoiar políticas públicas, decisões estratégicas no setor privado e fortalecer a competitividade do Brasil no mercado internacional. </p>
              </div>
            </div>

            <div className="flex flex-col space-y-3 w-full">
              <div className="flex flex-col p-4 border rounded bg-blue/10 backdrop-blur text-white font-bold">Visão
                <hr className="border-0 h-[1px] w-full bg-[linear-gradient(to_right,#d5b8e8_60%,transparent_100%)]" />
                <p className="text-white text-start text-sm md:text-sm mt-3 leading-relaxed">Ser a principal referência nacional em dados e análises de comércio exterior, oferecendo soluções confiáveis, acessíveis e inovadoras que impulsionem o desenvolvimento econômico, fortaleçam a competitividade das empresas brasileiras e promovam a integração do país no cenário global.</p>
              </div>
            </div>

            <div className="flex flex-col space-y-3 w-full">
              <div className="flex flex-col p-4 border rounded bg-blue/10 backdrop-blur text-white font-bold">Valores
                <hr className="border-0 h-[1px] w-full bg-[linear-gradient(to_right,#d5b8e8_60%,transparent_100%)]" />
                <p className="text-white text-start text-sm md:text-sm mt-3 leading-relaxed">Transparência</p>
                <p className="text-white text-start text-sm md:text-sm mt-3 leading-relaxed">Inovação</p>
                <p className="text-white text-start text-sm md:text-sm mt-3 leading-relaxed">Previsão</p>
                <p className="text-white text-start text-sm md:text-sm mt-3 leading-relaxed">Acessibilidade</p>
                <p className="text-white text-start text-sm md:text-sm mt-3 leading-relaxed">Responsabilidade Social</p>
                <p className="text-white text-start text-sm md:text-sm mt-3 leading-relaxed">Segurança de Informação</p>
                <p className="text-white text-start text-sm md:text-sm mt-3 leading-relaxed">Colaboração</p>
              </div>
            </div>
          </div>

          {/* Objetivo */}
          <h1 className="text-white text-3xl md:text-3xl font-bold leading-tight mt-20">
            O que fazemos?
          </h1>

          <p className="text-white text-start text-md md:text-lg mt-3 leading-relaxed mt-5">
            O InsightFlow oferece uma plataforma inovadora que transforma dados complexos de comércio exterior em insights estratégicos acessíveis. Com uma interface intuitiva e recursos avançados, nossa solução permite que profissionais de logística, gestores e órgãos públicos tomem decisões informadas com agilidade e precisão. Centralizamos informações essenciais sobre importação e exportação do Brasil, proporcionando análises interativas, previsões de tendências e comparações entre estados. Além disso, disponibilizamos um painel detalhado com dados segmentados por categoria personalizada e código NCM, facilitando a busca e filtragem de informações. Nosso compromisso é apoiar decisões estratégicas que impulsionem a competitividade das empresas brasileiras no cenário global.


          </p>

          {/* Contatos */}
          <h1 className="text-white text-3xl md:text-3xl font-bold leading-tight mt-20">
            Entre em contato
          </h1>

          <div className="flex justify-center items-center mt-8 space-x-8">
            {/* Github */}
            <a href="https://github.com/Titus-System" target="_blank" rel="noopener noreferrer" className="text-[#7D8491] hover:text-white flex items-center group transition-colors duration-200">
              <svg className="w-8 h-8 transform transition-transform duration-200 group-hover:scale-110 hover:scale-110 mb-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>

            {/* Instagram */}
            <a href="https://www.instagram.com/seuperfil" target="_blank" rel="noopener noreferrer" className="text-[#7D8491] hover:text-white flex items-center group transition-colors duration-200">
              <svg className="w-8 h-8 transform transition-transform duration-200 group-hover:scale-110 hover:scale-110 mb-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5a4.25 4.25 0 00-4.25-4.25h-8.5zm8.5 3a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zm-4.25 1.25a4.25 4.25 0 110 8.5 4.25 4.25 0 010-8.5zm0 1.5a2.75 2.75 0 100 5.5 2.75 2.75 0 000-5.5z" />
              </svg>
            </a>


            {/* Linkedin */}
            

            {/* Gmail */}
            
          </div>



        </div>
      </div>

    </div>


  );
};