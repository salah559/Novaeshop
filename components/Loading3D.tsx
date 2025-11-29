export default function Loading3D() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgba(5, 7, 8, 1) 0%, rgba(20, 10, 30, 0.5) 100%)',
      perspective: '1200px'
    }}>
      {/* Atomic Loading Animation */}
      <div style={{
        position: 'relative',
        width: '200px',
        height: '200px',
        marginBottom: 60
      }}>
        {/* Center Nucleus */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #39ff14, #00ff88)',
          boxShadow: `
            0 0 20px #39ff14,
            0 0 40px rgba(57, 255, 20, 0.5),
            inset 0 0 10px rgba(255, 255, 255, 0.3)
          `,
          zIndex: 10
        }} />

        {/* Electron Orbits */}
        {[
          { delay: 0, radius: 80, color: '#39ff14', duration: '6s' },
          { delay: 2, radius: 100, color: '#00ff88', duration: '8s' },
          { delay: 1, radius: 120, color: '#39ff14', duration: '10s' }
        ].map((orbit, i) => (
          <div key={`orbit-${i}`} style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${orbit.radius * 2}px`,
            height: `${orbit.radius * 2}px`,
            transform: 'translate(-50%, -50%)',
            border: `2px dashed ${orbit.color}`,
            borderRadius: '50%',
            opacity: 0.3,
            boxShadow: `0 0 15px ${orbit.color}40`
          }} />
        ))}

        {/* Rotating Electrons */}
        {[0, 1, 2].map((i) => (
          <div
            key={`electron-${i}`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, #39ff14, #00ff88)`,
              boxShadow: `0 0 15px #39ff14, inset 0 0 5px rgba(255,255,255,0.5)`,
              animation: `electronOrbit${i} ${7 + i * 2}s linear infinite`,
              transformOrigin: `${100 - i * 20}px center`,
              willChange: 'transform'
            }}
          />
        ))}

        {/* Energy Lines */}
        {[0, 1, 2, 3].map((line) => (
          <svg
            key={`line-${line}`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '200px',
              height: '200px',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
            viewBox="0 0 200 200"
          >
            <line
              x1="100"
              y1="100"
              x2={100 + 80 * Math.cos((line * Math.PI) / 2)}
              y2={100 + 80 * Math.sin((line * Math.PI) / 2)}
              stroke="#39ff14"
              strokeWidth="2"
              opacity="0.4"
              style={{
                animation: `pulseEnergy 2s ease-in-out infinite`,
                animationDelay: `${line * 0.3}s`
              }}
            />
          </svg>
        ))}
      </div>

      {/* Loading Text */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: 'clamp(1.1em, 3vw, 1.4em)',
          color: '#39ff14',
          fontWeight: 700,
          letterSpacing: '2px',
          margin: 0,
          marginBottom: 15,
          animation: 'fadeInOut 2s infinite',
          textShadow: '0 0 10px #39ff14'
        }}>
          جاري التحميل
        </p>
        
        {/* Animated dots */}
        <div style={{
          display: 'flex',
          gap: '6px',
          justifyContent: 'center'
        }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#39ff14',
                animation: `dotPulse 1.4s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
                boxShadow: '0 0 8px #39ff14'
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes electronOrbit0 {
          0% {
            transform: rotate(0deg) translateX(80px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(80px) rotate(-360deg);
          }
        }

        @keyframes electronOrbit1 {
          0% {
            transform: rotate(120deg) translateX(100px) rotate(-120deg);
          }
          100% {
            transform: rotate(480deg) translateX(100px) rotate(-480deg);
          }
        }

        @keyframes electronOrbit2 {
          0% {
            transform: rotate(240deg) translateX(120px) rotate(-240deg);
          }
          100% {
            transform: rotate(600deg) translateX(120px) rotate(-600deg);
          }
        }

        @keyframes pulseEnergy {
          0%, 100% {
            opacity: 0.3;
            stroke-width: 1;
          }
          50% {
            opacity: 0.8;
            stroke-width: 2;
          }
        }

        @keyframes fadeInOut {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes dotPulse {
          0%, 100% {
            transform: scale(0.8);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
