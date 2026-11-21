import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook para fazer scroll automático para elementos com hash na URL
 * Exemplo: /#sobre vai fazer scroll para o elemento com id="sobre"
 */
export const HASH_SEEK_TRIES = 30;

export function useHashScroll() {
  const location = useLocation();

  useEffect(() => {
    // Se tem hash na URL
    if (location.hash) {
      // Remove o # do início
      const elementId = location.hash.slice(1);

      // Procura de 100 em 100 ms até ~3 s: secções lazy (ex. #app dentro do player)
      // só existem quando o chunk chega.
      let tries = 0;
      let timer = 0;
      const seek = () => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (++tries < HASH_SEEK_TRIES) {
          timer = window.setTimeout(seek, 100);
        }
      };
      timer = window.setTimeout(seek, 100);
      return () => window.clearTimeout(timer);
    } else {
      // Se não tem hash, volta ao topo (já no topo: nada, evita um layout forçado no arranque)
      if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);
}
