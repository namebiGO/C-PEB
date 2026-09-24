import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Compass } from 'lucide-react';
import SEO from '../components/SEO';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Animated particle dots on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 55 }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 2.5 + 1,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      o:  Math.random() * 0.4 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(23,168,90,${p.o})`;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height)  p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="nf-page">
      <SEO
        title="404 — Page Not Found | C-PEB"
        description="Oops! The page you're looking for doesn't exist. Head back to C-PEB's homepage."
      />

      <canvas ref={canvasRef} className="nf-canvas" aria-hidden="true" />

      <div className="nf-inner">
        {/* Giant glowing 404 */}
        <div className="nf-code-wrap fade-up">
          <span className="nf-four nf-four--left">4</span>
          <span className="nf-zero">
            <span className="nf-zero-inner">
              <Compass size={56} strokeWidth={1.4} />
            </span>
          </span>
          <span className="nf-four nf-four--right">4</span>
        </div>

        {/* Copy */}
        <p className="section-eyebrow fade-up delay-1">Error 404</p>
        <h1 className="nf-heading fade-up delay-2">
          Lost in the <span className="text-gradient">sauce?</span>
        </h1>
        <p className="nf-sub fade-up delay-3">
          This page took a wrong turn somewhere. It might have been moved,
          deleted, or perhaps it never existed.
        </p>

        {/* Actions */}
        <div className="nf-actions fade-up delay-4">
          <Link to="/" className="btn btn-primary btn-lg">
            <Home size={18} /> Back to Home
          </Link>
          <button onClick={() => navigate(-1)} className="btn btn-secondary btn-lg">
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>

        {/* Quick links */}
        <div className="nf-links fade-up delay-4">
          <p>Or explore:</p>
          <div className="nf-pill-row">
            {[
              { to: '/services/brand-promotion', label: 'Brand Promotion' },
              { to: '/startup-business-advisory', label: 'Pricing' },
              { to: '/creators',                 label: 'Join as Creator' },
              { to: '/contact',                  label: 'Contact Us' },
              { to: '/tools',                    label: 'Free Tools' },
            ].map(link => (
              <Link key={link.to} to={link.to} className="nf-pill">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
