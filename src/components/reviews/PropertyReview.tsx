
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, StarOff, Send, Edit } from 'lucide-react';

interface PropertyReviewProps {
  propertyId: string;
  onReviewAdded?: () => void;
}

export interface ReviewType {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
}

const PropertyReview = ({ propertyId, onReviewAdded }: PropertyReviewProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState<ReviewType[]>([]);

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to submit a review",
        variant: "destructive",
      });
      return;
    }
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would send this to Supabase
      // This is a mock implementation for now
      const newReview = {
        id: `review-${Date.now()}`,
        user_id: user.id,
        user_name: user.email?.split('@')[0] || 'Anonymous',
        rating,
        comment,
        created_at: new Date().toISOString(),
      };
      
      // Mock update - in real implementation we would save to Supabase
      setReviews([newReview, ...reviews]);
      setRating(0);
      setComment('');
      
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!"
      });
      
      if (onReviewAdded) onReviewAdded();
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Review Form */}
      {user && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <p className="mr-3 text-sm font-medium">Your Rating:</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRatingChange(value)}
                      className="focus:outline-none"
                    >
                      {value <= rating ? (
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <Star className="w-5 h-5 text-gray-300" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this property..."
                className="w-full resize-none"
                rows={4}
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting || rating === 0}
              className="flex items-center"
            >
              <Send className="mr-2 w-4 h-4" />
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Reviews</h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <StarOff className="mx-auto h-12 w-12 text-gray-300 mb-2" />
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={review.user_avatar} />
                      <AvatarFallback className="bg-estate-secondary text-white">
                        {review.user_name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.user_name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                
                {user && user.id === review.user_id && (
                  <div className="flex justify-end mt-2">
                    <Button variant="ghost" size="sm" className="text-estate-secondary">
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyReview;
