import { Logo } from './Icons';
import './Logo.css';

/**
 * LogoSection Component
 * Displays the application logo and tagline
 */
function LogoSection() {
    return (
        <header className="logo-section">
            <div className="logo">
                <div className="logo-icon">
                    <Logo />
                </div>
                <h1 className="logo-text">
                    Enterprise<span>Portal</span>
                </h1>
            </div>
            <p className="tagline">Secure access to your workspace</p>
        </header>
    );
}

export default LogoSection;
