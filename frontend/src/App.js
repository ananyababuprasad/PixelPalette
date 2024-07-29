import Home from './pages/Home';
import GeneratePalette from './pages/GeneratePalette';
import Navbar from './components/Navbar';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import {ToastContainer} from 'react-toastify';

function App(){
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer position="top-center"  />
        <Navbar/>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/generate-palette" element={<GeneratePalette/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
