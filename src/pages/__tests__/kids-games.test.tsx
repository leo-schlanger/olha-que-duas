import type { ReactElement } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeAll } from 'vitest';
import KidsGames from '../KidsGames';
import KidsQuiz from '../KidsQuiz';
import KidsMemory from '../KidsMemory';
import KidsPacman from '../KidsPacman';
import KidsSnake from '../KidsSnake';

vi.mock('@/hooks/useMetaTags', () => ({
  useMetaTags: () => undefined,
  getPageBreadcrumbJsonLd: () => ({}),
}));

beforeAll(() => {
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  vi.stubGlobal('IntersectionObserver', IO);

  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillRect: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    arc: vi.fn(),
    ellipse: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    roundRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    fillText: vi.fn(),
    createLinearGradient: () => ({ addColorStop: vi.fn() }),
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext;

  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
    return window.setTimeout(() => cb(16), 0) as unknown as number;
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id: number) => {
    window.clearTimeout(id);
  });
});

function wrap(ui: ReactElement, path: string) {
  return <MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>;
}

describe('Kids games experience', () => {
  it('hub shows branded game names, not Baby Shark', () => {
    render(wrap(<KidsGames />, '/kids/jogos'));
    expect(screen.getByRole('heading', { name: /vamos jogar no cantinho/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Quiz do Cantinho' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Memória das Duas' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Micro no Cantinho' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cobra Musical' })).toBeInTheDocument();
    expect(screen.queryByText(/baby shark/i)).not.toBeInTheDocument();
  });

  it('quiz renders a question and accepts an answer', () => {
    render(wrap(<KidsQuiz />, '/kids/jogos/quiz'));
    expect(screen.getByRole('heading', { name: 'Quiz do Cantinho' })).toBeInTheDocument();
    expect(screen.getByText(/pergunta 1 de/i)).toBeInTheDocument();
    const options = screen.getAllByRole('button').filter((b) => b.className.includes('rounded-2xl'));
    expect(options.length).toBeGreaterThanOrEqual(4);
    fireEvent.click(options[0]);
    expect(screen.getByText(/acertaste|não era essa/i)).toBeInTheDocument();
  });

  it('memory renders the cantinho deck', () => {
    render(wrap(<KidsMemory />, '/kids/jogos/memoria'));
    expect(screen.getByRole('heading', { name: 'Memória das Duas' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /carta virada/i }).length).toBeGreaterThanOrEqual(12);
  });

  it('micro adventure shows branded start overlay', () => {
    render(wrap(<KidsPacman />, '/kids/jogos/pacman'));
    expect(screen.getAllByText('Micro no Cantinho').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Começar' })).toBeInTheDocument();
    expect(screen.queryByText(/baby shark/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Começar' }));
    expect(screen.getByRole('button', { name: 'Pausa' })).toBeInTheDocument();
  });

  it('cobra musical starts from the cantinho overlay', () => {
    render(wrap(<KidsSnake />, '/kids/jogos/snake'));
    expect(screen.getAllByText('Cobra Musical').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Começar' }));
    expect(screen.getByText(/notas:/i)).toBeInTheDocument();
  });
});
