
import React from 'react';
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { useReviews, useApproveReview, useDeleteReview, Review } from "@/hooks/useReviews";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const renderStars = (puntaje: number) => {
  const stars = [];
  for (let i = 0; i < puntaje; i++) {
    stars.push(<span key={i} className="text-yellow-500">★</span>);
  }
  return stars;
};

export const ReviewsManagement: React.FC<{ showPending?: boolean }> = ({ showPending = true }) => {
  const { data: allReviews, isLoading: reviewsLoading } = useReviews();
  const { mutate: approveReview } = useApproveReview();
  const { mutate: deleteReview } = useDeleteReview();
  const queryClient = useQueryClient();
  
  const reviews = showPending 
    ? allReviews?.filter(review => !review.aprobado) || []
    : allReviews?.filter(review => review.aprobado) || [];

  const handleReviewAction = (id: string, approve: boolean) => {
    console.log(`Processing review ${id}, approve=${approve}`);
    approveReview({ id, approve }, {
      onSuccess: () => {
        if (approve) {
          toast.success('Reseña aprobada y publicada');
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
          }, 500);
        } else {
          toast.error('Reseña rechazada');
        }
      },
      onError: (error) => {
        console.error("Error processing review:", error);
        toast.error('Hubo un error al procesar la reseña');
      }
    });
  };

  const handleDeleteReview = (id: string) => {
    deleteReview(id, {
      onSuccess: () => {
        toast.success('Reseña eliminada correctamente');
      },
      onError: () => {
        toast.error('Error al eliminar la reseña');
      }
    });
  };

  if (reviewsLoading) {
    return <div className="text-center py-8">Cargando reseñas...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-zinc-800/50 rounded-lg">
        <p className="text-gray-400">
          {showPending 
            ? 'No hay reseñas pendientes de aprobación.'
            : 'No hay reseñas aprobadas para mostrar.'}
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Calificación</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Contenido</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.map((review) => (
          <TableRow key={review.id}>
            <TableCell className="font-medium">{review.nombre_cliente}</TableCell>
            <TableCell>
              <div className="flex">{renderStars(review.puntaje)}</div>
            </TableCell>
            <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="max-w-md truncate">{review.contenido}</div>
            </TableCell>
            <TableCell className="text-right">
              {showPending ? (
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleReviewAction(review.id, true)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm flex items-center gap-1"
                  >
                    <Check size={14} /> Aprobar
                  </button>
                  <button
                    onClick={() => handleReviewAction(review.id, false)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm flex items-center gap-1"
                  >
                    <X size={14} /> Rechazar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                >
                  Eliminar
                </button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
