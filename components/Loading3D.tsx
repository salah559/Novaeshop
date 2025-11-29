export default function Loading3D() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgba(5, 7, 8, 1) 0%, rgba(20, 10, 30, 0.5) 100%)',
      perspective: '1000px'
    }}>
      {/* 3D Rotating Cube */}
      <div style={{
        position: 'relative',
        width: '120px',
        height: '120px',
        marginBottom: 40,
        perspective: '1200px'
      }}>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          animation: 'rotate3d 4s infinite linear',
          top: 0,
          left: 0
        }}>
          {/* Cube faces */}
          {[
            { transform: 'translateZ(60px)', color: '#39ff14' },
            { transform: 'rotateY(180deg) translateZ(60px)', color: '#ffd700' },
            { transform: 'rotateY(90deg) translateZ(60px)', color: '#00ff88' },
            { transform: 'rotateY(-90deg) translateZ(60px)', color: '#ff00ff' },
            { transform: 'rotateX(90deg) translateZ(60px)', color: '#00ffff' },
            { transform: 'rotateX(-90deg) translateZ(60px)', color: '#ff6b9d' }
          ].map((face, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '120px',
                height: '120px',
                background: `linear-gradient(135deg, ${face.color} 0%, rgba(255,255,255,0.1) 100%)`,
                border: `2px solid ${face.color}`,
                opacity: 0.8,
                transform: face.transform,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                boxShadow: `0 0 30px ${face.color}80`,
                backdropFilter: 'blur(10px)'
              }}
            />
          ))}
        </div>
      </div>

      {/* Animated Particles */}
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, #39ff14, #ffd700)`,
              animation: `orbit 3s infinite linear`,
              animationDelay: `${i * 1}s`,
              left: '50%',
              top: '50%',
              marginLeft: '-4px',
              marginTop: '-4px',
              boxShadow: '0 0 10px #39ff14'
            }}
          />
        ))}
      </div>

      {/* Loading Text */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        marginTop: 60,
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: 'clamp(1.2em, 3vw, 1.5em)',
          color: '#39ff14',
          fontWeight: 700,
          letterSpacing: '2px',
          margin: 0,
          marginBottom: 10,
          animation: 'fadeInOut 2s infinite'
        }}>
          جاري التحميل
        </p>
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center'
        }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #39ff14, #ffd700)',
                animation: `bounce 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
                boxShadow: '0 0 10px #39ff14'
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes rotate3d {
          0% {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
          }
        }

        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(80px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(80px) rotate(-360deg);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-15px);
            opacity: 0.6;
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
      `}</style>
    </div>
  );
}
