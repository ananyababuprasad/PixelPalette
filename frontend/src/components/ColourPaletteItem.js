const ColourPaletteItem=({colour})=>{
    const bgr=colour.bgr
    return(
        <div id='palette-item'>
            <div style={{backgroundColor:colour.hex}}>
            </div>
            <p>{colour.percentage} %</p>
            <p className='code'>rgb : {bgr[2]},{bgr[1]},{bgr[0]}</p>
            <p className='code'>hex : {colour.hex.toUpperCase()}</p>
        </div>
    )
}
export default ColourPaletteItem;