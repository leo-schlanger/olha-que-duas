import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import WeeklySchedulePanel from "@/components/radio/WeeklySchedulePanel";

const SAMPLE = [
  { day: "Segunda", show: "Nutrição", times: ["12:00", "19:00"], iconUrl: "" },
  { day: "Terça", show: "Motivar", times: ["12:00"], iconUrl: "" },
  { day: "Quinta", show: "Companheiros de Caminhada", times: ["12:00"], iconUrl: "" },
];

describe("WeeklySchedulePanel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Quinta-feira 2026-04-16, 10h
    vi.setSystemTime(new Date(2026, 3, 16, 10, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("mostra skeleton enquanto loading", () => {
    const { container } = render(
      <WeeklySchedulePanel schedule={[]} loading={true} />
    );
    // Skeletons têm classe animate-pulse
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("auto-selecciona o dia de hoje quando disponível", () => {
    render(<WeeklySchedulePanel schedule={SAMPLE} loading={false} />);
    // Hoje é quinta → "Companheiros de Caminhada" deve aparecer
    expect(screen.getByText("Companheiros de Caminhada")).toBeInTheDocument();
    expect(screen.queryByText("Nutrição")).not.toBeInTheDocument();
  });

  it("respeita selecção manual após o utilizador clicar num dia", () => {
    render(<WeeklySchedulePanel schedule={SAMPLE} loading={false} />);
    // Clica em Segunda
    const segButton = screen.getByRole("button", { name: /Segunda/ });
    fireEvent.click(segButton);
    expect(screen.getByText("Nutrição")).toBeInTheDocument();

    // Avança o relógio para sexta-feira de manhã (cruza meia-noite)
    act(() => {
      vi.setSystemTime(new Date(2026, 3, 17, 8, 0, 0));
      vi.advanceTimersByTime(24 * 60 * 60 * 1000);
    });
    // Continua na Segunda porque utilizador escolheu manualmente
    expect(screen.getByText("Nutrição")).toBeInTheDocument();
  });

  it("auto-troca para o novo 'today' à meia-noite quando utilizador não escolheu", async () => {
    // Começa numa quinta — Companheiros deve estar seleccionado
    render(<WeeklySchedulePanel schedule={SAMPLE} loading={false} />);
    expect(screen.getByText("Companheiros de Caminhada")).toBeInTheDocument();

    // Avança para sexta-feira de manhã. Quando o setTimeout do useClockTick
    // dispara à meia-noite, recalcula `today` → não há sexta no SAMPLE → cai
    // para Segunda. Async + double-flush para deixar o useEffect de sync
    // do selectedDay correr (depende do re-render do tick).
    await act(async () => {
      vi.setSystemTime(new Date(2026, 3, 17, 0, 30, 0));
      vi.advanceTimersByTime(15 * 60 * 60 * 1000);
      await Promise.resolve();
    });
    // Cai para Segunda (primeiro disponível)
    expect(screen.getByText("Nutrição")).toBeInTheDocument();
  });

  it("mostra contagem de exibições quando há múltiplos programas no mesmo dia", () => {
    // programCount conta ScheduleItem por dia, não times de um único item
    const multi = [
      { day: "Quinta", show: "Programa A", times: ["10:00"], iconUrl: "" },
      { day: "Quinta", show: "Programa B", times: ["14:00"], iconUrl: "" },
      { day: "Quinta", show: "Programa C", times: ["18:00"], iconUrl: "" },
    ];
    render(<WeeklySchedulePanel schedule={multi} loading={false} />);
    const quiButton = screen.getByRole("button", { name: /Quinta/ });
    expect(quiButton).toHaveTextContent("3");
  });

  it("renderiza fallback de ícone quando iconUrl falha", () => {
    const withBrokenIcon = [
      { day: "Quinta", show: "Companheiros de Caminhada", times: ["12:00"], iconUrl: "https://broken.example.com/icon.png" },
    ];
    const { container } = render(
      <WeeklySchedulePanel schedule={withBrokenIcon} loading={false} />
    );
    const img = container.querySelector("img[alt='Companheiros de Caminhada']") as HTMLImageElement;
    expect(img).toBeTruthy();

    // Simula erro de carregamento
    fireEvent.error(img);

    // Img foi removida; fallback (svg do Lucide Footprints) deve aparecer
    expect(container.querySelector("img[alt='Companheiros de Caminhada']")).toBeNull();
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("usa fallback directo quando iconUrl é placehold.co", () => {
    const withPlaceholder = [
      { day: "Quinta", show: "Companheiros de Caminhada", times: ["12:00"], iconUrl: "https://placehold.co/40" },
    ];
    const { container } = render(
      <WeeklySchedulePanel schedule={withPlaceholder} loading={false} />
    );
    // Não renderiza img — vai directo para fallback svg
    expect(container.querySelector("img[alt='Companheiros de Caminhada']")).toBeNull();
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("mostra 'Selecione um dia' quando schedule vazio e não loading", () => {
    render(<WeeklySchedulePanel schedule={[]} loading={false} />);
    expect(screen.getByText(/Selecione um dia/)).toBeInTheDocument();
  });
});
