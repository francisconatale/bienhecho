import { describe, it, expect } from "vitest";
import { getBackUrl } from "./navigation";

describe("getBackUrl", () => {
  const JOB_ID = "job-123";
  const CLIENT_ID = "client-456";

  it("vuelve al detalle del trabajo cuando from=/tareas, preservando from", () => {
    expect(getBackUrl("/tareas", JOB_ID)).toBe(
      `/trabajos?id=${JOB_ID}&from=%2Ftareas`
    );
  });

  it("vuelve al detalle del trabajo cuando from=/trabajos, preservando from", () => {
    expect(getBackUrl("/trabajos", JOB_ID)).toBe(
      `/trabajos?id=${JOB_ID}&from=%2Ftrabajos`
    );
  });

  it("vuelve al detalle del trabajo cuando from=/clientes, preservando from y clienteId", () => {
    expect(getBackUrl("/clientes", JOB_ID, CLIENT_ID)).toBe(
      `/trabajos?id=${JOB_ID}&from=%2Fclientes&clienteId=${CLIENT_ID}`
    );
  });

  it("vuelve al detalle del trabajo cuando no hay from (deep link), sin params extra", () => {
    expect(getBackUrl(null, JOB_ID)).toBe(`/trabajos?id=${JOB_ID}`);
  });

  it("vuelve al detalle del trabajo con from cuando no hay clienteId", () => {
    expect(getBackUrl("/clientes", JOB_ID)).toBe(
      `/trabajos?id=${JOB_ID}&from=%2Fclientes`
    );
  });

  it("trata string vacío como null, sin from", () => {
    expect(getBackUrl("", JOB_ID)).toBe(`/trabajos?id=${JOB_ID}`);
  });
});
