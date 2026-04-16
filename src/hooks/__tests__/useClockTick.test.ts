import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useClockTick } from "@/hooks/useClockTick";

describe("useClockTick", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Fixar agora em 2026-04-16 10:00:00 local
    vi.setSystemTime(new Date(2026, 3, 16, 10, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("dispara tick exactamente na próxima fronteira", () => {
    const { result } = renderHook(() => useClockTick([12 * 60])); // próximo: 12:00
    expect(result.current).toBe(0);

    // Avança 2h - 100ms — ainda não cruzou
    act(() => {
      vi.advanceTimersByTime(2 * 60 * 60 * 1000 - 100);
    });
    expect(result.current).toBe(0);

    // Cruza fronteira (incluindo +500ms de margem)
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(1);
  });

  it("agenda próxima fronteira após disparar", () => {
    const { result } = renderHook(() => useClockTick([12 * 60, 18 * 60]));

    act(() => {
      vi.advanceTimersByTime(2 * 60 * 60 * 1000 + 1000); // 12:00
    });
    expect(result.current).toBe(1);

    act(() => {
      vi.advanceTimersByTime(6 * 60 * 60 * 1000); // 18:00
    });
    expect(result.current).toBe(2);
  });

  it("salta para amanhã quando todas as fronteiras hoje já passaram", () => {
    vi.setSystemTime(new Date(2026, 3, 16, 23, 0, 0));
    const { result } = renderHook(() => useClockTick([7 * 60, 12 * 60]));

    // 7:00 do dia seguinte = 8h depois (23h → 7h = 8h)
    act(() => {
      vi.advanceTimersByTime(8 * 60 * 60 * 1000 + 1000);
    });
    expect(result.current).toBe(1);
  });

  it("não agenda nada se boundaries vazio", () => {
    const { result } = renderHook(() => useClockTick([]));
    act(() => {
      vi.advanceTimersByTime(24 * 60 * 60 * 1000);
    });
    expect(result.current).toBe(0);
  });

  it("ignora fronteiras inválidas", () => {
    const { result } = renderHook(() =>
      useClockTick([12 * 60, NaN, -100, 9999])
    );
    act(() => {
      vi.advanceTimersByTime(2 * 60 * 60 * 1000 + 1000);
    });
    expect(result.current).toBe(1); // só dispara em 12:00
  });

  it("limpa timeout ao desmontar", () => {
    const { result, unmount } = renderHook(() => useClockTick([12 * 60]));
    unmount();
    act(() => {
      vi.advanceTimersByTime(5 * 60 * 60 * 1000);
    });
    expect(result.current).toBe(0);
  });

  it("deduplica fronteiras duplicadas", () => {
    const { result } = renderHook(() =>
      useClockTick([12 * 60, 12 * 60, 12 * 60])
    );
    act(() => {
      vi.advanceTimersByTime(2 * 60 * 60 * 1000 + 1000);
    });
    expect(result.current).toBe(1); // só uma vez
  });
});
