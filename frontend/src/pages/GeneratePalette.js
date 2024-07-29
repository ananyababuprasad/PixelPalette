import React, {useState,useEffect} from "react";
import axios from 'axios';
import ColourPaletteItem from "../components/ColourPaletteItem";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GeneratePalette=()=>{
    //states
    const [file,setFile]=useState(null);
    const [numColours,setNumColours]=useState(3);
    const [result,setResult]=useState(null);
    const [swatchWidth,setSwatchWidth]=useState(100);
    const [swatchHeight,setSwatchHeight]=useState(100);
    const [swatchPadding,setSwatchPadding]=useState(10);
    const [colourCode,setColourCode]=useState('None');

    //refs
    const fileInputRef=React.createRef();
    const selectRef=React.createRef();
    const canvasRef=React.createRef();
    
    //functions
    const handleFileChange=(e)=>{
        setFile(e.target.files[0]);
    };

    const handleSubmit=async(e)=>{
        e.preventDefault();
        if (file==null){
            console.log("upload image please")
            toast.error("Please upload an image to generate palette");
            return;
        }
        const formData = new FormData();
        formData.append('image', file);
        formData.append('numColours', numColours);
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/generate-palette', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setResult(response.data);
            console.log("result:", response.data);
        }catch(error){
            console.log("error occured")
            toast.error("Couldn't generate colours, please try again");
        }
    };

    function clearResults(e){
        setFile(null);
        setNumColours(3);
        setResult(null);
        fileInputRef.current.value = null;
        selectRef.current.value=3;
    }

    function drawMultilineText(ctx,text,x,y,maxWidth,maxHeight){
        const lines = text.split('\n'); 
        const lineHeight = Math.min(maxWidth, maxHeight) * 0.2; 
        lines.forEach((line, index) => {
            ctx.fillText(line, x, y + index * lineHeight - (lines.length - 1) * lineHeight / 2);
        });
    }

    function updateSwatch(){
        if (!result) return;
        
        setSwatchHeight(Number(swatchHeight));
        setSwatchPadding(Number(swatchPadding));
        setSwatchWidth(Number(swatchWidth));
        
        const canvas=canvasRef.current;
        const ctx=canvas.getContext('2d');
        
        const totalWidth=swatchWidth*result.length+swatchPadding*(result.length + 1);
        canvas.width=totalWidth;
        canvas.height=swatchHeight+(swatchPadding*2);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        result.forEach((colour, index)=>{
            ctx.fillStyle=colour.hex;
            ctx.fillRect(
                swatchPadding+index*(swatchWidth+swatchPadding),
                swatchPadding,
                swatchWidth,
                swatchHeight
            );
            
            if (colourCode!=='None'){
                ctx.fillStyle=(colour.bgr[0]<50 || colour.bgr[1]<50 || colour.bgr[2]<50)?'#FFFFFF':'#000000';
                ctx.font=swatchHeight>swatchWidth?`${swatchWidth * 0.2}px Arial`:`${swatchHeight * 0.2}px Arial`;
                ctx.textAlign='center';
                ctx.textBaseline='middle';
    
                let text='';
                if (colourCode==='RGB') {                
                    text=`R: ${colour.bgr[2]}\nG: ${colour.bgr[1]}\nB: ${colour.bgr[0]}`;
                } else if (colourCode==='Hex') {
                    text=colour.hex;
                }
    
                if (swatchWidth<swatchHeight) {
                    //vertical text
                    ctx.save();
                    ctx.translate(
                        swatchPadding+index*(swatchWidth+swatchPadding)+swatchWidth/2,
                        swatchPadding+swatchHeight/2
                    );
                    ctx.rotate(-Math.PI/2);
                    drawMultilineText(ctx,text,0,0,swatchWidth,swatchHeight);
                    ctx.restore();
                } else {
                    // Horizontal text
                    drawMultilineText(ctx,text,swatchPadding+index*(swatchWidth+swatchPadding)+swatchWidth/2,swatchPadding+swatchHeight/2,swatchWidth,swatchHeight);
                }
            }
        });
    }
    
    useEffect(()=>{
        updateSwatch();
        // eslint-disable-next-line
    },[result, swatchWidth, swatchHeight, swatchPadding, colourCode]);

    function handleDownloadSwatches(){
        const canvas=canvasRef.current;
        const url=canvas.toDataURL('image/png');
        const a=document.createElement('a');
        a.href=url;
        a.download='colours.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function handleDownloadCSV(){
        const filename='colours.csv'
        const data=result.map(colour=>({
            hex:colour.hex.toUpperCase(),
            rgb:JSON.stringify(colour.bgr.reverse()),
        }));
        const csvRows=[];
        const headers=Object.keys(data[0]);
        csvRows.push(headers.join(','));
      
        for (const row of data) {
          const values = headers.map(header => JSON.stringify(row[header]));
          csvRows.push(values.join(','));
        }
        const csvData=csvRows.join('\n');
        const blob=new Blob([csvData],{type:'text/csv'});
        const url=URL.createObjectURL(blob);
        const a=document.createElement('a');
        a.href=url;
        a.download=filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function handleDownloadJSON(){
        const filename='colours.json'
        const data=result.map(colour=>({
            hex:colour.hex.toUpperCase(),
            rgb:colour.bgr.reverse(),
        }));
        const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
        const url=URL.createObjectURL(blob);
        const a=document.createElement('a');
        a.href=url;
        a.download=filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    return(
        <div id='generate-form'>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
            <form>
                <div id='picture-input'>
                    {!file &&
                        <div>
                            <span className="material-symbols-outlined" style={{fontSize:'150px'}}>
                            add_photo_alternate
                            </span>
                            <p>Upload a picture</p>
                        </div>
                    }
                    {file && <img src={URL.createObjectURL(file)} alt="Uploaded"/>}
                    <input type="file" accept=".png, .jpg, .jpeg, .svg" onChange={handleFileChange} ref={fileInputRef}></input>
                </div>

                <div id='select-num'>
                    <label>
                        Select Number of colours: 
                        <select name="numColours" defaultValue={3} onChange={e=>setNumColours(e.target.value)} ref={selectRef}>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                            <option value={9}>9</option>
                            <option value={10}>10</option>
                        </select>
                    </label>
                </div>

                <div className='centered'>
                    <button onClick={handleSubmit}>Generate</button>
                    <button onClick={clearResults}>Clear Results</button>
                </div>
            </form>

            {result && result.length>0 &&
                <div id='palette'>
                    {result.map((colour,index)=>(<ColourPaletteItem key={index} colour={colour}/>))}
                </div>
            }
            {result && result.length>0 &&
                <div className='downloads'>
                    <div className='centered'>
                        <button type="button" onClick={handleDownloadSwatches}>Download as Swatch</button>
                        <button type="button" onClick={handleDownloadJSON}>Download as JSON</button>
                        <button type="button" onClick={handleDownloadCSV}>Download as CSV</button>
                    </div>
                    
                    <div id="swatch-customization">
                        <label>
                            Swatch Width :
                            <input type="number" defaultValue={100} onChange={e=>setSwatchWidth(Number(e.target.value))} min={50} max={500}
                            onInput={e=>{
                                if(e.target.value>500) e.target.value=500;
                                if(e.target.value<50) e.target.value=50;
                            }}/>
                        </label>
                        <label>
                            Swatch Height :
                            <input type="number" defaultValue={100} onChange={e=>setSwatchHeight(Number(e.target.value))} min={50} max={500} 
                            onInput={e=>{
                                if(e.target.value>500) e.target.value=500;
                                if(e.target.value<50) e.target.value=50;
                            }}/>
                        </label>
                        <label>
                            Padding :
                            <input type="number" defaultValue={10} onChange={e=>setSwatchPadding(Number(e.target.value))} min={0} max={100}
                            onInput={e => {
                                if (e.target.value>100) e.target.value=100;
                                if (e.target.value<0) e.target.value=0;
                            }}/>
                        </label>
                        <label>
                            Colour code :
                            <select name="colourCode" defaultValue="None" onChange={e=>setColourCode(e.target.value)}>
                                <option value='None'>None</option>
                                <option value='Hex'>Hexacode</option>
                                <option value='RGB'>RGB code</option>
                            </select>
                        </label>
                    </div>

                    <div className='centered'>
                        <canvas ref={canvasRef}></canvas>
                    </div>
                </div>
            }
        </div>
    );
};

export default GeneratePalette;
