import { useState } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

interface ProductPreviewProps {
  product: Product;
  onClose: () => void;
  onBuyNow: () => void;
}

export function ProductPreview({ product, onClose, onBuyNow }: ProductPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(5, 7, 8, 0.95) 0%, rgba(10, 15, 20, 0.95) 100%)',
          border: '2px solid rgba(57, 255, 20, 0.2)',
          borderRadius: '16px',
          padding: 'clamp(25px, 5vw, 40px)',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          animation: 'scaleIn 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'rgba(255, 107, 107, 0.1)',
            border: 'none',
            color: '#ff6b6b',
            fontSize: '24px',
            cursor: 'pointer',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            transition: 'all 0.2s ease'
          }}
        >
          ✕
        </button>

        {/* Product Image */}
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              width: '100%',
              height: '250px',
              objectFit: 'cover',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '1px solid rgba(57, 255, 20, 0.2)'
            }}
          />
        )}

        {/* Product Details */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}
          >
            <h2 style={{ margin: 0, fontSize: 'clamp(1.6em, 3vw, 2em)', color: '#39ff14' }}>
              {product.name}
            </h2>
            <span
              style={{
                background: 'rgba(57, 255, 20, 0.2)',
                color: '#39ff14',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 500
              }}
            >
              {product.category}
            </span>
          </div>

          <p
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: 1.8,
              marginBottom: '20px',
              fontSize: 'clamp(0.95rem, 2vw, 1rem)'
            }}
          >
            {product.description}
          </p>

          {/* Price */}
          <div
            style={{
              background: 'rgba(57, 255, 20, 0.1)',
              border: '1px solid rgba(57, 255, 20, 0.3)',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '24px',
              textAlign: 'center'
            }}
          >
            <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>السعر</span>
            <div style={{ fontSize: 'clamp(1.8em, 4vw, 2.2em)', color: '#ffd700', fontWeight: 700 }}>
              {product.price} دج
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onBuyNow}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '14px',
                background: 'linear-gradient(135deg, #39ff14 0%, #ffd700 100%)',
                border: 'none',
                color: '#000',
                fontWeight: 700,
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                transition: 'all 0.3s ease',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              {isLoading ? 'جاري الانتقال...' : '💳 شراء الآن'}
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(57, 255, 20, 0.2)',
                color: '#39ff14',
                fontWeight: 600,
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                transition: 'all 0.3s ease'
              }}
            >
              إغلاق
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes scaleIn {
            from {
              transform: scale(0.9);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
