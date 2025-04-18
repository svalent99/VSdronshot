
import React from 'react';
import { toast } from "sonner";

interface Review {
  id: number;
  name: string;
  username: string;
  body: string;
  img: string;
  rating: number;
}

interface PendingReviewsProps {
  reviews: Review[];
  onReviewAction: (id: number, approve: boolean) => void;
}

const PendingReviews: React.FC<PendingReviewsProps> = ({ reviews, onReviewAction }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Reseñas Pendientes de Aprobación</h2>
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-zinc-800/50 rounded-lg">
          <p className="text-gray-400">No hay reseñas pendientes de aprobación.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h3 className="font-bold">{review.name}</h3>
                    <p className="text-gray-400 text-sm">{review.username}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onReviewAction(review.id, true)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => onReviewAction(review.id, false)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
              <div className="mt-3 max-w-full overflow-hidden">
                <p className="break-words whitespace-pre-wrap">{review.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingReviews;
