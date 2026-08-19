import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

function Stars({ rating, size = 16, onRate }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={onRate ? () => onRate(star) : undefined}
          style={{
            fontSize: `${size}px`,
            color: star <= rating ? '#FF5A00' : '#E5E9ED',
            cursor: onRate ? 'pointer' : 'default',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { user, token } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching product:', err);
        setLoading(false);
      });
  }, [id]);

  const loadReviews = () => {
    fetch(`${API_URL}/api/reviews/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews);
        setAvgRating(Number(data.average));
        setReviewCount(data.count);
      })
      .catch((err) => console.error('Error fetching reviews:', err));
  };

  useEffect(() => {
    loadReviews();
  }, [id]);

  if (loading)
    return (
      <div style={{ backgroundColor: '#F4F6F8', minHeight: '100vh', padding: '40px' }}>
        <p style={{ color: '#5C7186' }}>Loading...</p>
      </div>
    );
  if (!product)
    return (
      <div style={{ backgroundColor: '#F4F6F8', minHeight: '100vh', padding: '40px' }}>
        <p style={{ color: '#5C7186' }}>Product not found.</p>
      </div>
    );

  const handleAddToCart = () => {
    addToCart(product);
    showToast(`${product.name} added to cart`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (myRating === 0) {
      showToast('Please select a star rating');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/reviews/product/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: myRating, comment: myComment }),
      });
      if (!res.ok) throw new Error('Failed to submit review');
      showToast('Review submitted, thank you!');
      setMyRating(0);
      setMyComment('');
      loadReviews();
    } catch (err) {
      console.error(err);
      showToast('Something went wrong submitting your review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#F4F6F8', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
        <Link to="/" style={{ color: '#0B2A4A', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          &larr; Back to products
        </Link>

        <div
          style={{
            marginTop: '20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '28px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            display: 'flex',
            gap: '32px',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              flex: '1 1 300px',
              maxWidth: '380px',
              aspectRatio: '1 / 1',
              borderRadius: '10px',
              overflow: 'hidden',
              backgroundColor: '#F4F6F8',
            }}
          >
            <img
              src={product.image_url}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ flex: '1 1 280px' }}>
            {product.category && (
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: '#F4F6F8',
                  color: '#5C7186',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '4px 12px',
                  borderRadius: '999px',
                  marginBottom: '10px',
                }}
              >
                {product.category}
              </span>
            )}
            <h1 style={{ margin: '0 0 8px', fontSize: '26px', color: '#0B2A4A', fontWeight: 700 }}>
              {product.name}
            </h1>

            {/* Average rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Stars rating={Math.round(avgRating)} />
              <span style={{ fontSize: '13px', color: '#5C7186' }}>
                {reviewCount > 0 ? `${avgRating} (${reviewCount} review${reviewCount > 1 ? 's' : ''})` : 'No reviews yet'}
              </span>
            </div>

            <p style={{ color: '#5C7186', lineHeight: 1.6, marginBottom: '18px' }}>
              {product.description}
            </p>
            <p style={{ fontSize: '30px', fontWeight: 700, color: '#FF5A00', margin: '0 0 8px' }}>
              Rs. {product.price}
            </p>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: product.stock > 0 ? '#1B8A5A' : '#D93636',
                marginBottom: '22px',
              }}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              style={{
                padding: '13px 32px',
                backgroundColor: product.stock === 0 ? '#C9CED4' : '#FF5A00',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 700,
              }}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Reviews section */}
        <div
          style={{
            marginTop: '20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '28px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <h2 style={{ color: '#0B2A4A', fontSize: '20px', margin: '0 0 20px' }}>
            Customer Reviews
          </h2>

          {user ? (
            <form
              onSubmit={handleSubmitReview}
              style={{ backgroundColor: '#F4F6F8', borderRadius: '10px', padding: '18px', marginBottom: '24px' }}
            >
              <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#0B2A4A', fontSize: '14px' }}>
                Write a review
              </p>
              <div style={{ marginBottom: '10px' }}>
                <Stars rating={myRating} size={22} onRate={setMyRating} />
              </div>
              <textarea
                value={myComment}
                onChange={(e) => setMyComment(e.target.value)}
                placeholder="Share your thoughts about this product (optional)"
                rows="3"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #E5E9ED',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  marginBottom: '10px',
                }}
              />
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '10px 22px',
                  backgroundColor: '#FF5A00',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '14px',
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <p style={{ color: '#5C7186', fontSize: '14px', marginBottom: '24px' }}>
              <Link to="/login" style={{ color: '#FF5A00', fontWeight: 600 }}>Login</Link> to write a review.
            </p>
          )}

          {reviews.length === 0 ? (
            <p style={{ color: '#5C7186', fontSize: '14px' }}>No reviews yet — be the first!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} style={{ borderBottom: '1px solid #E5E9ED', padding: '14px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ color: '#0B2A4A', fontSize: '14px' }}>{review.user_name}</strong>
                  <span style={{ fontSize: '12px', color: '#5C7186' }}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <Stars rating={review.rating} size={14} />
                {review.comment && (
                  <p style={{ color: '#5C7186', fontSize: '14px', marginTop: '6px' }}>{review.comment}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;