import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home=()=>{
    const nav=useNavigate();

    const handleClick=()=>{
      toast.success("yay create now!");
      nav('/generate-palette')
    }
  return(
    <div className="homepage">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
      <div className="home-content">
          <h1>Welcome to PixelPalette!</h1>
            <p>PixelPalette allows you to easily create custom colour palettes from your images. 
              Simply Upload any image, choose the number of colours you need, and our algorithms will extract the most dominant colours for you. 
              Download your custom palette in JSON, CSV, or as a customizable swatch to use in your design projects.</p>
            <hr className="custom-hr" />
            <div className="column">
            <div className="left">
              <h3>Key Features</h3>
              <ul>
                <li><b>Image Upload :</b> Upload any image from your device to start extracting colours</li>
                <li><b>Colour Selection :</b> Choose the number of colours you need (1-10)</li>
                <li><b>Colour Extraction :</b> Advanced algorithms analyze your image to find the most dominant colours.</li>
                <li><b>Download Options :</b> Save your custom colour palette in JSON, CSV, or as a customizable swatch.</li>
              </ul>
            </div>
            <div className="right">
              <p>Start creating stunning colour palettes today!</p>
             <button id='create' onClick={handleClick}>
                  Create now {" "}  <b>{">"}</b>
             </button>
            </div>
            </div>           
      </div>
    </div>
  )
}

export default Home;