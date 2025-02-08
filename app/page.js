import "./landing.css";
import Link from "next/link";

export default function FrontPage() {
    return (
        <main>
            <div className="topBar">
                <div className="headerLogo">
                    <Link href="/">
                        <img src="/logo.png" alt="Logo" />
                    </Link>
                </div>
                <div className="headerMiddleContent">
                    <Link href="/About">About</Link>
                    <Link href="/About">About</Link>
                    <Link href="/About">About</Link>  
                </div>
                <div className="headerRightContent">
                    <Link className="round-button" href="/About">Sign in</Link>
                </div>
            </div>

            <div className="hero">
                <div className="hero-image">
                    <img src="/hero.png" alt="Hero" />
                </div>
                <div className="hero-right">
                    <h1 className="hero-main">
                        Snap. Wait. See.
                    </h1>
                    <h2 className="hero-desc">
                        Take a picture and get accurate nutrition facts in seconds. <b>It's that easy.</b>
                    </h2>
                    <Link className="round-button" href="/About">Get Started</Link>
                </div>
            </div>

            <div className="footer">
                Snappit © 2023
            </div>

        </main>
    );
}