import logosemfundo from "../assets/logosemfundo_titus_system.png";
import { FaGlobe } from "react-icons/fa";
import { MdContactMail } from "react-icons/md";
import { FaGavel } from "react-icons/fa";
import { FaBullseye, FaLightbulb, FaHandshake } from "react-icons/fa";
import { FaTools } from "react-icons/fa"


export default function HomePage() {
  return (
    <div className="relative">
      <div className="relative h-[800px] flex flex-col items-center justify-center text-center overflow-hidden">

        {/* Imagem de fundo com opacidade geral */}
        <div className="absolute inset-0 bg-[url('/img-sub.jpg')] bg-cover bg-center opacity-40 z-0"></div>

        {/* Gradientes superior e inferior */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#11114e] to-transparent z-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#11114e] to-transparent z-10"></div>

        {/* Conteúdo principal */}
        <div className="relative z-20 max-w-4xl px-4">
          <div className="flex flex-col items-center max-w-[60ch] mx-auto">
            <div className="flex items-center gap-x-2 sm:gap-x-4 flex-shrink-0">
              <img
                src={logosemfundo}
                alt="Logo"
                className="w-20 h-20 object-contain"
              />
              <h1 className="flex items-center justify-center gap-3 text-white text-2xl md:text-5xl font-bold leading-tight">
                Quem somos nós?
              </h1>
            </div>

            <p className="text-white text-md md:text-lg mt-8 leading-relaxed text-center">
              O InsightFlow é uma plataforma dedicada ao monitoramento, análise e disseminação de dados de comércio exterior do Brasil. Voltada para profissionais, gestores e órgãos públicos, a plataforma centraliza informações essenciais para apoiar a tomada de decisões estratégicas e promover a transparência do mercado internacional brasileiro.
            </p>
          </div>

        </div>
      </div>

      {/*MVP*/}
      <div className="relative z-20 mt-[-100px] flex flex-col items-center px-4">

        <h2 className="flex items-center justify-center gap-3 text-white text-2xl md:text-3xl font-semibold mb-6 mt-56 text-center">
          <FaGavel className="text-white/50" size={28} />O que visamos?
        </h2>

        <div className="bg-white/10 backdrop-blur-md p-6 md:p-10 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">

          {/* Missão */}
          <div className="flex flex-col space-y-3 w-full min-h-40 md:min-h-60 lg:min-h-80">
            <div className="flex flex-col p-4 rounded bg-white/10 backdrop-blur text-white font-bold">
              <div className="flex items-center gap-2 mb-2">
                <FaBullseye className="text-white/50" size={24} />
                <span>Missão</span>
              </div>
              <hr className="border-0 h-[1px] w-full bg-[linear-gradient(to_right,#d5b8e8_60%,transparent_100%)]" />
              <p className="text-white text-start text-sm md:text-sm mt-3 leading-relaxed">
                Prover informações precisas, acessíveis e atualizadas sobre o comércio exterior brasileiro, integrando dados de importação e exportação de forma visual e interativa. Nosso objetivo é apoiar políticas públicas, decisões estratégicas no setor privado e fortalecer a competitividade do Brasil no mercado internacional.
              </p>
            </div>
          </div>

          {/* Visão */}
          <div className="flex flex-col space-y-3 w-full min-h-40 md:min-h-60 lg:min-h-80">
            <div className="flex flex-col p-4 rounded bg-white/10 backdrop-blur text-white font-bold">
              <div className="flex items-center gap-2 mb-2">
                {<FaLightbulb className="text-white/50" size={24} />}
                <span>Visão</span>
              </div>
              <hr className="border-0 h-[1px] w-full bg-[linear-gradient(to_right,#d5b8e8_60%,transparent_100%)]" />
              <p className="text-white text-start text-sm md:text-sm mt-3 leading-relaxed">
                Ser a principal referência nacional em dados e análises de comércio exterior, oferecendo soluções confiáveis, acessíveis e inovadoras que impulsionem o desenvolvimento econômico, fortaleçam a competitividade das empresas brasileiras e promovam a integração do país no cenário global.
              </p>
            </div>
          </div>

          {/* Valores */}
          <div className="flex flex-col space-y-3 w-full ">
            <div className="w-full p-4 rounded bg-white/10 backdrop-blur text-white font-bold focus:outline-none focus:ring-2 focus:ring-purple-500">
              <div className="flex items-center gap-2 mb-2">
                <FaHandshake className="text-white/50" size={24} />
                <span>Valores</span>
              </div>
              <hr className="border-0 h-[1px] w-full bg-[linear-gradient(to_right,#d5b8e8_60%,transparent_100%)]" />
              {[
                "Transparência",
                "Inovação",
                "Integridade",
                "Excelência",
                "Acessibilidade",
                "Responsabilidade Social",
                "Segurança da Informação",
                "Colaboração",
              ].map((valor) => (
                <p key={valor} className="text-white text-start text-sm md:text-sm mt-3 leading-relaxed">
                  {valor}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-20 max-w-4xl px-4">
          <h2 className="flex items-center justify-center gap-3 text-white text-2xl md:text-3xl font-semibold mb-6 mt-20 text-center">
            <FaTools className="text-white/70" size={28} /> O que fazemos?
          </h2>
          <p className="text-white text-md md:text-lg leading-relaxed text-center max-w-[60ch]">
            O InsightFlow oferece uma plataforma inovadora que transforma dados complexos de comércio exterior em insights estratégicos acessíveis. Com uma interface intuitiva e recursos avançados, nossa solução permite que profissionais de logística, gestores e órgãos públicos tomem decisões informadas com agilidade e precisão. Centralizamos informações essenciais sobre importação e exportação do Brasil, proporcionando análises interativas, previsões de tendências e comparações entre estados. Além disso, disponibilizamos um painel detalhado com dados segmentados por categoria personalizada e código NCM, facilitando a busca e filtragem de informações. Nosso compromisso é apoiar decisões estratégicas que impulsionem a competitividade das empresas brasileiras no cenário global.
          </p>
        </div>

        {/* Contatos */}
        <div className="w-full sm:w-[400px] md:w-[500px] lg:w-[700px] mx-auto">
          <h2 className="flex items-center justify-center gap-3 text-white text-2xl md:text-3xl font-semibold mb-6 mt-20 text-center">
            <MdContactMail className="text-white/50" size={28} /> Entre em contato
          </h2>

          <form
            action="https://formspree.io/f/mjkwdrgy"
            method="POST"
            className="bg-white/10 backdrop-blur-md p-6 md:p-10 rounded-2xl grid gap-6 w-full"
          >
            <div>
              <label htmlFor="nome" className="block text-sm font-medium mb-1 text-white">Nome</label>
              <input
                type="text"
                name="nome"
                id="nome"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md text-gray-300 border-gray focus:outline-none focus:ring-1 focus:ring-white/50"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-white">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md text-gray-300 border-gray focus:outline-none focus:ring-1 focus:ring-white/50"
              />
            </div>

            <div>
              <label htmlFor="mensagem" className="block text-sm font-medium mb-1 text-white">Mensagem</label>
              <textarea
                name="mensagem"
                id="mensagem"
                rows={5}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md text-gray-300 border-gray focus:outline-none focus:ring-1 focus:ring-white/50"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full font-bold px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md text-gray-300 hover:bg-white/20 hover:outline-none"
            >
              Enviar mensagem
            </button>
          </form>

          {/* <!-- Informações de Contato --> */}
           <h2 className="flex items-center justify-center gap-3 text-white text-2xl md:text-3xl font-semibold mb-6 mt-20 text-center">
            <FaGlobe className="text-white/50" size={28} /> Acesse nossas redes sociais
          </h2>
        <div className="mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl text-center space-y-4 mb-64">
          <p><span className="font-bold text-white">Email:</span> <a href="https://mail.google.com/mail/?view=cm&fs=1&to=titussystemsenterprise@gmail.com" className="text-white/50 hover:underline hover:text-[#d72c38] break-words" target="_newtab">Titussystemsenterprise@gmail.com</a></p>
          <p><span className="font-bold text-white">Instagram:</span> <a href="https://www.instagram.com/titus_systems/" className="text-white/50 hover:underline hover:text-[#d72c38" target="_blank">@titus_systems</a></p>
          <p><span className="font-bold text-white">GitHub:</span> <a href="https://github.com/Titus-System" className="text-white/50 hover:underline hover:text-[#d72c38" target="_blank">Titus Systems</a></p>
        </div>

      </div>
      </div>
      </div>
  );
}
