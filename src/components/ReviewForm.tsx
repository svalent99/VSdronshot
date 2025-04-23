
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitReview } from "@/hooks/useReviews";

interface ReviewFormProps {
  onSubmitSuccess?: () => void;
}

const ReviewForm = ({ onSubmitSuccess }: ReviewFormProps) => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const submitReview = useSubmitReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      return;
    }

    submitReview.mutate(
      { name: name.trim(), comment: comment.trim() },
      {
        onSuccess: () => {
          setName("");
          setComment("");
          
          if (onSubmitSuccess) {
            onSubmitSuccess();
          }
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Nombre
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-zinc-700/50 border-zinc-600"
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Comentario
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          className="bg-zinc-700/50 border-zinc-600"
          placeholder="Escribe tu experiencia"
          rows={4}
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={submitReview.isPending}
      >
        {submitReview.isPending ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2 inline-block"></div>
            Enviando...
          </>
        ) : (
          "Enviar Reseña"
        )}
      </Button>
    </form>
  );
};

export default ReviewForm;
