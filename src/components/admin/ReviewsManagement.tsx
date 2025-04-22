
import React, { useEffect } from 'react';
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Check, X, Trash2 } from "lucide-react";
import { useReviews, useApproveReview, useDeleteReview } from "@/hooks/useReviews";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const renderStars = (puntaje: number) => {
  const stars = [];
  for (let i = 0; i < puntaje; i++) {
    stars.push(<span key={i} className="text-yellow-500">★</span>);
  }
  return stars;
};

export const ReviewsManagement: React.FC<{ showPending?: boolean }> = ({ showPending = true }) => {
  const { data: allReviews, isLoading: reviewsLoading, error, refetch } = useReviews();
  const { mutate: approveReview, isLoading: isApproving } = useApproveReview();
  const { mutate: deleteReview, isLoading: isDeleting } = useDeleteReview();
  const queryClient = useQueryClient();
  
  // Filtrar reseñas basado en el estado de aprobación
  const reviews = showPending 
    ? allReviews?.filter(review => !review.aprobado) || []
    : allReviews?.filter(review => review.aprobado) || [];

  useEffect(() => {
    // Recargar reseñas cuando el componente se monta
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (error) {
      console.error("Error al cargar reseñas:", error);
      toast.error("Error al cargar las reseñas");
    }
  }, [error]);

  const handleReviewAction = (id: string, approve: boolean) => {
    console.log(`Processing review ${id}, approve=${approve}`);
    approveReview({ id, approve }, {
      onSuccess: () => {
        // Invalidar la caché y recargar los datos después de la acción
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['reviews'] });
          refetch();
        }, 500);
      }
    });
  };

  const handleDeleteReview = (id: string) => {
    deleteReview(id, {
      onSuccess: () => {
        // Invalidar la caché y recargar los datos después de eliminar
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['reviews'] });
          refetch();
        }, 500);
      }
    });
  };

  if (reviewsLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
        <p className="mt-4 text-gray-400">Cargando reseñas...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-zinc-800/50 rounded-lg">
        <p className="text-gray-400">
          {showPending 
            ? 'No hay reseñas pendientes de aprobación.'
            : 'No hay reseñas aprobadas para mostrar.'}
        </p>
        <Button 
          variant="outline" 
          className="mt-4 border-zinc-600 text-gray-300 hover:bg-zinc-700"
          onClick={() => refetch()}
        >
          Recargar
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
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
                    <Button
                      variant="success"
                      onClick={() => handleReviewAction(review.id, true)}
                      disabled={isApproving}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm flex items-center gap-1"
                    >
                      <Check size={14} /> Aprobar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReviewAction(review.id, false)}
                      disabled={isApproving}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm flex items-center gap-1"
                    >
                      <X size={14} /> Rechazar
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteReview(review.id)}
                    disabled={isDeleting}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Eliminar
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
