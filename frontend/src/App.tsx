import Header from './components/header'
import Footer from './components/footer'
import AppRoutes from './routes/appRoutes';

function App() {
  return (
    <>
        <div className="flex flex-col min-h-screen bg-[#656586]">
            <Header/>
            <main className='flex-grow container mx-auto p-4'>
                <AppRoutes/>
            </main>
            <Footer/>
        </div>
    </>
  );
}

export default App
