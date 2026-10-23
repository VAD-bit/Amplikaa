-- 0008: Ingesta de documentos (PDF/libros), transcripciones (video) y bitácora de actividad
-- Añade metadatos a ai_knowledge para saber el origen de cada fragmento.

alter table amplikaa.ai_knowledge
  add column if not exists tipo text not null default 'texto',
  add column if not exists origen text,
  add column if not exists chunk_idx integer;

comment on column amplikaa.ai_knowledge.tipo is 'texto | pdf | transcripcion | actividad | qa';
comment on column amplikaa.ai_knowledge.origen is 'Nombre del archivo o fuente (p. ej. libro.pdf, video.srt, "bitácora")';
comment on column amplikaa.ai_knowledge.chunk_idx is 'Orden del fragmento dentro de un documento multi-chunk';

create index if not exists ai_knowledge_tipo_idx on amplikaa.ai_knowledge (tipo);

-- Backfill: las filas Q: son pares supervisados; el resto, texto plano
update amplikaa.ai_knowledge set tipo = 'qa' where titulo like 'Q: %' and tipo = 'texto';
