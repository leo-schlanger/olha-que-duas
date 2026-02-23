import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook para fazer scroll automático para elementos com hash na URL
 * Exemplo: /#sobre vai fazer scroll para o elemento com id="sobre"
 */
export function useHashScroll() {
  const location = useLocation();

  useEffect(() => {
    // Se tem hash na URL
    if (location.hash) {
      // Remove o # do início
      const elementId = location.hash.slice(1);

      // Pequeno delay para garantir que o DOM está renderizado
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          // Scroll suave para o elemento
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Se não tem hash, volta ao topo
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);
}
