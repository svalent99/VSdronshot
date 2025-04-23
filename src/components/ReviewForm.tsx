
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReviewFormProps {
  onSubmitSuccess?: () => void;
}

const ReviewForm = ({ onSubmitSuccess }: ReviewFormProps) => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("reviews").insert({
        name: name.trim(),
        comment: comment.trim(),
      });

      if (error) throw error;

      toast.success("¡Gracias por su reseña! Será revisada antes de ser publicada.");
      setName("");
      setComment("");
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Hubo un error al enviar su reseña. Por favor intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
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
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enviando..." : "Enviar Reseña"}
      </Button>
    </form>
  );
};

export default ReviewForm;
