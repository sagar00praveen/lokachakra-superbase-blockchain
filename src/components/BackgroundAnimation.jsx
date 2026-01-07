import './BackgroundAnimation.css';

/**
 * BackgroundAnimation Component
 * Creates floating animated shapes for visual interest
 */
function BackgroundAnimation() {
    return (
        <div className="background-animation">
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-2"></div>
            <div className="floating-shape shape-3"></div>
            <div className="floating-shape shape-4"></div>
        </div>
    );
}

export default BackgroundAnimation;
