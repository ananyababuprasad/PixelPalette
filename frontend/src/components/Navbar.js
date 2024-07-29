import { NavLink } from "react-router-dom"
const Navbar=()=>{
    return (
        <header id='Navbar'>
            <h1>PixelPalette</h1>
            <nav>
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/generate-palette'>Generate Palette</NavLink>
            </nav>            
        </header>
    )
}
export default Navbar;