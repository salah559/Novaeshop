import { useState, memo } from 'react';

interface ProductCardProps {
  product: any;
  index: number;
  onClick: (product: any) => void;
  onBuyNow: (product: any) => void;
}

function ProductCardComponent({ product, index, onClick, onBuyNow }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="card animate-fadeInUp"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        padding: 0,
        animationDelay: `${index * 0.05}s`,
        opacity: 0,
        cursor: 'pointer',
        transition: 'transform 0.2s ease'
      }}
      onClick={() => onClick(product)}
    >
      <div
        style={{
          width: '100%',
          height: 'clamp(160px, 30vw, 220px)',
          background: `linear-gradient(135deg, rgba(57, 255, 20, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Lazy load image */}
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />

        {/* Price Badge */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'linear-gradient(135deg, #39ff14, #ffd700)',
            color: '#000',
            padding: '8px 16px',
            borderRadius: 20,
            fontWeight: 700,
            fontSize: 'clamp(0.9em, 2.5vw, 1em)',
            boxShadow: '0 0 20px rgba(57, 255, 20, 0.5)'
          }}
        >
          {product.price} دج
        </div>

        {/* Category Badge */}
        {product.category && (
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#39ff14',
              padding: '6px 14px',
              borderRadius: 14,
              fontSize: '0.85em',
              border: '1px solid rgba(57, 255, 20, 0.4)',
              fontWeight: 500
            }}
          >
            {product.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          padding: 'clamp(16px, 3vw, 22px)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <h3
          style={{
            color: '#fff',
            marginBottom: 'clamp(8px, 2vw, 12px)',
            fontSize: 'clamp(1.05em, 3.5vw, 1.25em)',
            lineHeight: 1.4
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: 'clamp(0.9em, 2.5vw, 0.95em)',
            lineHeight: 1.7,
            flex: 1,
            marginBottom: 'clamp(14px, 3vw, 20px)'
          }}
        >
          {product.description?.substring(0, 100)}...
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onBuyNow(product);
          }}
          className="btn"
          style={{
            width: '100%',
            textAlign: 'center',
            padding: 'clamp(12px, 2vw, 16px)',
            fontSize: 'clamp(0.95em, 2.5vw, 1.05em)',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #39ff14, #ffd700)',
            color: '#000',
            fontWeight: 600,
            transition: 'all 0.3s ease'
          }}
        >
          💳 شراء الآن
        </button>
      </div>
    </div>
  );
}

export const ProductCard = memo(ProductCardComponent);
