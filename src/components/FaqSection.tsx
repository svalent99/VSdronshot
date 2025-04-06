
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "¿Dónde operamos?",
    answer: "Actualmente ofrecemos nuestros servicios en Buenos Aires (principalmente en zona norte-oeste) y en Córdoba. Sin embargo, estamos totalmente dispuestos a expandirnos y realizar proyectos en cualquier punto del país. Consultanos para coordinar trabajos en otras provincias. "
  },
  {
    question: "Costo de nuestros servicios",
    answer: "Los valores varian dependiendo del tipo de servicio, la duración del proyecto y la ubicación. Cada propuesta se adapta a las necesidades del cliente, garantizando calidad y resultados profesionales. Consultanos para recibir una cotización personalizada."
  },
  {
    question: "Tiempo de entrega del contenido",
    answer: "Entregamos el material final en un plazo estimado de 3 a 5 días hábiles, dependiendo del tipo y la complejidad del proyecto. Siempre buscamos garantizar una entrega rápida sin comprometer la calidad del contenido."
  }
];

const FaqSection = () => {
  return (
    <section className="w-full bg-black py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Preguntas Frecuentes</h2>
        
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-800">
              <AccordionTrigger className="text-lg py-5 text-left hover:no-underline font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 pb-5">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
