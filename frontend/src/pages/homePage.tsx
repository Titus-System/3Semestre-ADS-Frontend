export default function HomePage(){
    return (

        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
            <div className="text-center max-w-2xl">
                <h1 className="text-4xl font-bold text-blue-600 mb-4">Bem-vindo ao MovieRating</h1>
                <p className="text-lg text-gray-700 mb-6">
                    Um sistema de gerenciamento de biblioteca moderno e eficiente. Acesse seu acervo,
                    gerencie empréstimos e administre usuários de forma simples e intuitiva.
                </p>

                <div className="flex space-x-4">
                <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition">
                    Entrar
                </a>
                <a href="/login" className="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg shadow-md hover:bg-gray-300 transition">
                    Criar Conta
                </a>
                </div>
            </div>
        </div>

    );
}