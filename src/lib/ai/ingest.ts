import { extractText, getDocumentProxy } from "unpdf";

/* Extracción de texto desde distintos formatos que el usuario pueda subir.
   Todo local, sin APIs externas: PDF (unpdf), subtítulos (.srt/.vtt) y texto plano. */

const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB

export type IngestKind = "pdf" | "transcripcion" | "texto";

export function detectKind(filename: string): IngestKind {
  const ext = filename.toLowerCase().split(".").pop() ?? "";
  if (ext === "pdf") return "pdf";
  if (ext === "srt" || ext === "vtt" || ext === "txt" || ext === "md") return "transcripcion";
  return "texto";
}

/** Extrae texto legible de un archivo subido (PDF, subtítulos o texto plano). */
export async function extractTextFromFile(file: File): Promise<{ text: string; kind: IngestKind }> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("El archivo supera los 20 MB. Divide el libro o usa extractos más pequeños.");
  }

  const kind = detectKind(file.name);
  const buf = Buffer.from(await file.arrayBuffer());

  if (kind === "pdf") {
    const pdf = await getDocumentProxy(new Uint8Array(buf));
    const { text } = await extractText(pdf, { mergePages: true });
    return { text: normalizeExtracted(text), kind };
  }

  // .srt / .vtt / .txt / .md — decodificar y limpiar marcas de tiempo
  const raw = new TextDecoder("utf-8", { fatal: false }).decode(buf);
  const text = kind === "transcripcion" ? cleanSubtitles(raw) : raw;
  return { text: normalizeExtracted(text), kind };
}

/** Quita numeración de cues y timestamps de SRT/VTT, dejando solo las líneas habladas. */
export function cleanSubtitles(raw: string): string {
  return raw
    .replace(/^WEBVTT.*$/gim, "")
    .replace(/^\d+\s*$/gm, "")
    .replace(/-->.*$/gm, "")
    .replace(/<[^>]+>/g, "") // etiquetas <c>, <i>, etc.
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .join(" ");
}

function normalizeExtracted(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Trocea un texto largo en fragmentos de ~size caracteres con solape, para indexar en ai_knowledge. */
export function chunkText(text: string, size = 1200, overlap = 150): string[] {
  if (text.length <= size) return [text];
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + size, text.length);
    // cortar en un límite de palabra si es posible
    if (end < text.length) {
      const lastSpace = text.lastIndexOf(" ", end);
      if (lastSpace > start + size * 0.6) end = lastSpace;
    }
    const piece = text.slice(start, end).trim();
    if (piece) chunks.push(piece);
    if (end >= text.length) break;
    start = Math.max(end - overlap, start + 1);
  }
  return chunks;
}
