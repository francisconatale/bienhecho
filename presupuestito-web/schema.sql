


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."job_status" AS ENUM (
    'borrador',
    'presupuestado',
    'pagado'
);


ALTER TYPE "public"."job_status" OWNER TO "postgres";


CREATE TYPE "public"."task_priority" AS ENUM (
    'alta',
    'media',
    'baja'
);


ALTER TYPE "public"."task_priority" OWNER TO "postgres";


CREATE TYPE "public"."transaccion_origen" AS ENUM (
    'automático',
    'manual'
);


ALTER TYPE "public"."transaccion_origen" OWNER TO "postgres";


CREATE TYPE "public"."transaccion_tipo" AS ENUM (
    'cargo',
    'abono'
);


ALTER TYPE "public"."transaccion_tipo" OWNER TO "postgres";


CREATE TYPE "public"."visit_status" AS ENUM (
    'planificada',
    'realizada',
    'cancelada'
);


ALTER TYPE "public"."visit_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_trabajo_pagado"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_total_cobrado    DECIMAL(10,2);
    v_presupuesto      DECIMAL(10,2);
    v_total_materiales DECIMAL(10,2);
    v_estado           public.job_status;
BEGIN
    SELECT presupuesto, estado
    INTO v_presupuesto, v_estado
    FROM public.trabajos WHERE id = NEW.trabajo_id;

    IF v_estado = 'presupuestado' THEN
        SELECT COALESCE(SUM(monto_cobrado), 0) INTO v_total_cobrado
        FROM public.cobros WHERE trabajo_id = NEW.trabajo_id;

        SELECT COALESCE(SUM(subtotal), 0) INTO v_total_materiales
        FROM public.materiales WHERE trabajo_id = NEW.trabajo_id;

        IF v_total_cobrado >= (v_presupuesto + v_total_materiales) THEN
            UPDATE public.trabajos SET estado = 'pagado' WHERE id = NEW.trabajo_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."check_trabajo_pagado"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."emitir_transaccion_cobro"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_cliente_id      UUID;
    v_trabajo_titulo  TEXT;
    v_user_id         UUID;
BEGIN
    SELECT cliente_id, titulo, user_id
    INTO v_cliente_id, v_trabajo_titulo, v_user_id
    FROM public.trabajos WHERE id = NEW.trabajo_id;

    INSERT INTO public.transacciones
        (user_id, cliente_id, tipo, monto, concepto, fecha,
         referencia_trabajo_id, referencia_cobro_id, origen)
    VALUES
        (v_user_id, v_cliente_id, 'abono', NEW.monto_cobrado,
         'Cobro registrado: ' || v_trabajo_titulo, NEW.fecha_cobro,
         NEW.trabajo_id, NEW.id, 'automático');

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."emitir_transaccion_cobro"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."emitir_transaccion_presupuesto"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    IF OLD.estado = 'borrador' AND NEW.estado = 'presupuestado' THEN
        INSERT INTO public.transacciones
            (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, origen)
        VALUES
            (NEW.user_id, NEW.cliente_id, 'cargo', NEW.presupuesto,
             'Emisión de presupuesto: ' || NEW.titulo, CURRENT_DATE, NEW.id, 'automático');
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."emitir_transaccion_presupuesto"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.perfiles (id, nombre, email)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_trabajo_presupuesto"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE public.trabajos
        SET presupuesto = COALESCE((
            SELECT SUM(precio) FROM public.tareas
            WHERE trabajo_id = OLD.trabajo_id
        ), 0)
        WHERE id = OLD.trabajo_id;
        RETURN OLD;
    ELSE
        UPDATE public.trabajos
        SET presupuesto = COALESCE((
            SELECT SUM(precio) FROM public.tareas
            WHERE trabajo_id = NEW.trabajo_id
        ), 0)
        WHERE id = NEW.trabajo_id;
        RETURN NEW;
    END IF;
END;
$$;


ALTER FUNCTION "public"."update_trabajo_presupuesto"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."clientes" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "nombre" "text" NOT NULL,
    "telefono" "text",
    "email" "text",
    "direccion" "text" NOT NULL,
    "notas" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "user_id" "uuid"
);


ALTER TABLE "public"."clientes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cobros" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "trabajo_id" "uuid",
    "monto_cobrado" numeric(10,2) NOT NULL,
    "fecha_cobro" "date" NOT NULL,
    "forma_pago" "text",
    "notas" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "user_id" "uuid"
);


ALTER TABLE "public"."cobros" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."materiales" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "trabajo_id" "uuid" NOT NULL,
    "nombre_material" "text" NOT NULL,
    "cantidad" numeric(10,2) NOT NULL,
    "precio_unitario" numeric(10,2) NOT NULL,
    "subtotal" numeric(10,2) NOT NULL,
    "comprado" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "user_id" "uuid"
);


ALTER TABLE "public"."materiales" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."perfiles" (
    "id" "uuid" NOT NULL,
    "nombre" "text" NOT NULL,
    "rubro" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "direccion" "text",
    "logo_path" "text",
    "cuit" "text",
    "matricula" "text"
);


ALTER TABLE "public"."perfiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tareas" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "trabajo_id" "uuid" NOT NULL,
    "descripcion" "text" NOT NULL,
    "precio" numeric(10,2),
    "completada" boolean DEFAULT false NOT NULL,
    "prioridad" "public"."task_priority",
    "fecha_vencimiento" "date",
    "orden" integer DEFAULT 0 NOT NULL,
    "user_id" "uuid",
    "cantidad" numeric DEFAULT 1,
    "precio_unitario" numeric
);


ALTER TABLE "public"."tareas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."task_photos" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "tarea_id" "uuid" NOT NULL,
    "url" "text" NOT NULL,
    "descripcion" "text",
    "orden" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "user_id" "uuid"
);


ALTER TABLE "public"."task_photos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trabajos" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "cliente_id" "uuid" NOT NULL,
    "titulo" "text" NOT NULL,
    "direccion" "text" NOT NULL,
    "descripcion" "text",
    "presupuesto" numeric(10,2) DEFAULT 0 NOT NULL,
    "estado" "public"."job_status" DEFAULT 'borrador'::"public"."job_status" NOT NULL,
    "fecha_inicio" "date",
    "fecha_fin_estimada" "date",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "user_id" "uuid"
);


ALTER TABLE "public"."trabajos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."transacciones" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "cliente_id" "uuid" NOT NULL,
    "tipo" "public"."transaccion_tipo" NOT NULL,
    "monto" numeric(10,2) NOT NULL,
    "concepto" "text" NOT NULL,
    "fecha" "date" NOT NULL,
    "referencia_trabajo_id" "uuid",
    "referencia_cobro_id" "uuid",
    "origen" "public"."transaccion_origen" DEFAULT 'automático'::"public"."transaccion_origen" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "user_id" "uuid"
);


ALTER TABLE "public"."transacciones" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."visita_tareas" (
    "visita_id" "uuid" NOT NULL,
    "tarea_id" "uuid" NOT NULL,
    "nota_progreso" "text"
);


ALTER TABLE "public"."visita_tareas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."visitas" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "trabajo_id" "uuid" NOT NULL,
    "fecha" "date" NOT NULL,
    "hora_inicio" time without time zone NOT NULL,
    "hora_fin" time without time zone,
    "notas" "text",
    "estado" "public"."visit_status" DEFAULT 'planificada'::"public"."visit_status" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "user_id" "uuid"
);


ALTER TABLE "public"."visitas" OWNER TO "postgres";


ALTER TABLE ONLY "public"."clientes"
    ADD CONSTRAINT "clientes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cobros"
    ADD CONSTRAINT "cobros_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."materiales"
    ADD CONSTRAINT "materiales_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."perfiles"
    ADD CONSTRAINT "perfiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tareas"
    ADD CONSTRAINT "tareas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."task_photos"
    ADD CONSTRAINT "task_photos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trabajos"
    ADD CONSTRAINT "trabajos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."transacciones"
    ADD CONSTRAINT "transacciones_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."visita_tareas"
    ADD CONSTRAINT "visita_tareas_pkey" PRIMARY KEY ("visita_id", "tarea_id");



ALTER TABLE ONLY "public"."visitas"
    ADD CONSTRAINT "visitas_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_clientes_user_id" ON "public"."clientes" USING "btree" ("user_id");



CREATE INDEX "idx_cobros_trabajo_id" ON "public"."cobros" USING "btree" ("trabajo_id");



CREATE INDEX "idx_cobros_user_id" ON "public"."cobros" USING "btree" ("user_id");



CREATE INDEX "idx_materiales_trabajo_id" ON "public"."materiales" USING "btree" ("trabajo_id");



CREATE INDEX "idx_materiales_user_id" ON "public"."materiales" USING "btree" ("user_id");



CREATE INDEX "idx_tareas_trabajo_id" ON "public"."tareas" USING "btree" ("trabajo_id");



CREATE INDEX "idx_tareas_user_id" ON "public"."tareas" USING "btree" ("user_id");



CREATE INDEX "idx_task_photos_tarea_id" ON "public"."task_photos" USING "btree" ("tarea_id");



CREATE INDEX "idx_task_photos_user_id" ON "public"."task_photos" USING "btree" ("user_id");



CREATE INDEX "idx_trabajos_cliente_id" ON "public"."trabajos" USING "btree" ("cliente_id");



CREATE INDEX "idx_trabajos_user_id" ON "public"."trabajos" USING "btree" ("user_id");



CREATE INDEX "idx_transacciones_cliente_id" ON "public"."transacciones" USING "btree" ("cliente_id");



CREATE INDEX "idx_transacciones_user_id" ON "public"."transacciones" USING "btree" ("user_id");



CREATE INDEX "idx_visitas_trabajo_id" ON "public"."visitas" USING "btree" ("trabajo_id");



CREATE INDEX "idx_visitas_user_id" ON "public"."visitas" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "on_cobro_insert" AFTER INSERT ON "public"."cobros" FOR EACH ROW EXECUTE FUNCTION "public"."emitir_transaccion_cobro"();



CREATE OR REPLACE TRIGGER "on_cobro_insert_check_pagado" AFTER INSERT OR UPDATE ON "public"."cobros" FOR EACH ROW EXECUTE FUNCTION "public"."check_trabajo_pagado"();



CREATE OR REPLACE TRIGGER "on_tarea_change_update_presupuesto" AFTER INSERT OR DELETE OR UPDATE OF "precio" ON "public"."tareas" FOR EACH ROW EXECUTE FUNCTION "public"."update_trabajo_presupuesto"();



CREATE OR REPLACE TRIGGER "on_trabajo_estado_presupuestado" AFTER UPDATE OF "estado" ON "public"."trabajos" FOR EACH ROW EXECUTE FUNCTION "public"."emitir_transaccion_presupuesto"();



ALTER TABLE ONLY "public"."clientes"
    ADD CONSTRAINT "clientes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."cobros"
    ADD CONSTRAINT "cobros_trabajo_id_fkey" FOREIGN KEY ("trabajo_id") REFERENCES "public"."trabajos"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."cobros"
    ADD CONSTRAINT "cobros_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."materiales"
    ADD CONSTRAINT "materiales_trabajo_id_fkey" FOREIGN KEY ("trabajo_id") REFERENCES "public"."trabajos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."materiales"
    ADD CONSTRAINT "materiales_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."perfiles"
    ADD CONSTRAINT "perfiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tareas"
    ADD CONSTRAINT "tareas_trabajo_id_fkey" FOREIGN KEY ("trabajo_id") REFERENCES "public"."trabajos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tareas"
    ADD CONSTRAINT "tareas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."task_photos"
    ADD CONSTRAINT "task_photos_tarea_id_fkey" FOREIGN KEY ("tarea_id") REFERENCES "public"."tareas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."task_photos"
    ADD CONSTRAINT "task_photos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."trabajos"
    ADD CONSTRAINT "trabajos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trabajos"
    ADD CONSTRAINT "trabajos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."transacciones"
    ADD CONSTRAINT "transacciones_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."transacciones"
    ADD CONSTRAINT "transacciones_referencia_cobro_id_fkey" FOREIGN KEY ("referencia_cobro_id") REFERENCES "public"."cobros"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."transacciones"
    ADD CONSTRAINT "transacciones_referencia_trabajo_id_fkey" FOREIGN KEY ("referencia_trabajo_id") REFERENCES "public"."trabajos"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."transacciones"
    ADD CONSTRAINT "transacciones_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."visita_tareas"
    ADD CONSTRAINT "visita_tareas_tarea_id_fkey" FOREIGN KEY ("tarea_id") REFERENCES "public"."tareas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."visita_tareas"
    ADD CONSTRAINT "visita_tareas_visita_id_fkey" FOREIGN KEY ("visita_id") REFERENCES "public"."visitas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."visitas"
    ADD CONSTRAINT "visitas_trabajo_id_fkey" FOREIGN KEY ("trabajo_id") REFERENCES "public"."trabajos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."visitas"
    ADD CONSTRAINT "visitas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



CREATE POLICY "Users manage their own clientes" ON "public"."clientes" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users manage their own cobros" ON "public"."cobros" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users manage their own materiales" ON "public"."materiales" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users manage their own profile" ON "public"."perfiles" USING (("auth"."uid"() = "id"));



CREATE POLICY "Users manage their own tareas" ON "public"."tareas" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users manage their own task_photos" ON "public"."task_photos" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users manage their own trabajos" ON "public"."trabajos" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users manage their own transacciones" ON "public"."transacciones" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users manage their own visita_tareas" ON "public"."visita_tareas" USING ((EXISTS ( SELECT 1
   FROM "public"."visitas"
  WHERE (("visitas"."id" = "visita_tareas"."visita_id") AND ("visitas"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users manage their own visitas" ON "public"."visitas" USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."clientes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cobros" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."materiales" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."perfiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tareas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."task_photos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trabajos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."transacciones" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "usuarios_su_perfil" ON "public"."perfiles" USING (("id" = "auth"."uid"()));



ALTER TABLE "public"."visita_tareas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."visitas" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."check_trabajo_pagado"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_trabajo_pagado"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_trabajo_pagado"() TO "service_role";



GRANT ALL ON FUNCTION "public"."emitir_transaccion_cobro"() TO "anon";
GRANT ALL ON FUNCTION "public"."emitir_transaccion_cobro"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."emitir_transaccion_cobro"() TO "service_role";



GRANT ALL ON FUNCTION "public"."emitir_transaccion_presupuesto"() TO "anon";
GRANT ALL ON FUNCTION "public"."emitir_transaccion_presupuesto"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."emitir_transaccion_presupuesto"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_trabajo_presupuesto"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_trabajo_presupuesto"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_trabajo_presupuesto"() TO "service_role";


















GRANT ALL ON TABLE "public"."clientes" TO "anon";
GRANT ALL ON TABLE "public"."clientes" TO "authenticated";
GRANT ALL ON TABLE "public"."clientes" TO "service_role";



GRANT ALL ON TABLE "public"."cobros" TO "anon";
GRANT ALL ON TABLE "public"."cobros" TO "authenticated";
GRANT ALL ON TABLE "public"."cobros" TO "service_role";



GRANT ALL ON TABLE "public"."materiales" TO "anon";
GRANT ALL ON TABLE "public"."materiales" TO "authenticated";
GRANT ALL ON TABLE "public"."materiales" TO "service_role";



GRANT ALL ON TABLE "public"."perfiles" TO "anon";
GRANT ALL ON TABLE "public"."perfiles" TO "authenticated";
GRANT ALL ON TABLE "public"."perfiles" TO "service_role";



GRANT ALL ON TABLE "public"."tareas" TO "anon";
GRANT ALL ON TABLE "public"."tareas" TO "authenticated";
GRANT ALL ON TABLE "public"."tareas" TO "service_role";



GRANT ALL ON TABLE "public"."task_photos" TO "anon";
GRANT ALL ON TABLE "public"."task_photos" TO "authenticated";
GRANT ALL ON TABLE "public"."task_photos" TO "service_role";



GRANT ALL ON TABLE "public"."trabajos" TO "anon";
GRANT ALL ON TABLE "public"."trabajos" TO "authenticated";
GRANT ALL ON TABLE "public"."trabajos" TO "service_role";



GRANT ALL ON TABLE "public"."transacciones" TO "anon";
GRANT ALL ON TABLE "public"."transacciones" TO "authenticated";
GRANT ALL ON TABLE "public"."transacciones" TO "service_role";



GRANT ALL ON TABLE "public"."visita_tareas" TO "anon";
GRANT ALL ON TABLE "public"."visita_tareas" TO "authenticated";
GRANT ALL ON TABLE "public"."visita_tareas" TO "service_role";



GRANT ALL ON TABLE "public"."visitas" TO "anon";
GRANT ALL ON TABLE "public"."visitas" TO "authenticated";
GRANT ALL ON TABLE "public"."visitas" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































