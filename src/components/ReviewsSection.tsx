import React from "react";
import { useReviews } from "@/hooks/useReviews";

interface ReviewsSectionProps {
  isAdmin?: boolean; // Add isAdmin prop
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ isAdmin = false }) => {
  const { data: reviews, isLoading, error } = useReviews();

  if (isLoading) {
    return <p>Loading reviews...</p>;
  }

  if (error) {
    return <p>Error loading reviews.</p>;
  }

  if (!reviews || reviews.length === 0) {
    return <p>No reviews available.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <div>
                <h3 className="font-bold">{review.nombre_cliente}</h3>
                <p className="text-gray-400 text-sm">Puntaje: {review.puntaje}</p>
              </div>
            </div>
          </div>
          <div className="mt-3 max-w-full overflow-hidden">
            <p className="break-words whitespace-pre-wrap">{review.contenido}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsSection;
