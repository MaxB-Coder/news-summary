import { Link } from "react-router-dom";
import Title from "./title";

function header() {
    return ( 
        <>
            <header className="fixed-top">
                <nav className="navbar navbar-expand-md navbar-dark">
                    <div className="container">
                        <Link to="/" className="navbar-brand"><img className="logo nav-articles nav-item nav-link active" src="https://cdn3.iconfinder.com/data/icons/ballicons-reloaded-free/512/icon-70-1024.png" alt="Logo, a newspaper" /></Link>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link to="/" className="nav-link"><Title className="title nav-item nav-link" /></Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        </>
    );
}

export default header;