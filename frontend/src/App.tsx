import Header from './components/header'
import Footer from './components/footer'
import AppRoutes from './routes/appRoutes';

function App() {
  return (
    <>
        <div className="flex flex-col min-h-screen bg-[#11114e]">
            <Header/>
            <main className=''>
                <AppRoutes/>
            </main>
            <Footer/>
        </div>
    </>
  );
}

export default App
