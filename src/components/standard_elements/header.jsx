import { Link } from "react-router-dom";

const TODAY = new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "long" });

function Header() {
    return (
        <header className="masthead">
            <div className="masthead-inner">
                <Link to="/" className="wordmark">The News</Link>
                <p className="masthead-date">{TODAY.format(new Date())}</p>
            </div>
        </header>
    );
}

export default Header;
