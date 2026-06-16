"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { api, type Paginated } from "@/lib/api/client";
import { BannerPicker } from "./banner-picker";
import { GhostButton, PrimaryButton } from "./ui";
import { Combobox } from "./combobox";
import { CepInput } from "./cep-input";

const STEPS = ["Básico", "Estrutura", "Categoria", "Mídia", "Revisão"] as const;

interface Organizer {
  id: string;
  name: string;
  email: string;
}

interface FormState {
  name: string;
  description: string;
  ownerId: string;
  city: string;
  state: string;
  date: string;
  modality: "BEACH" | "COURT";
  eventType: "SINGLE" | "CIRCUIT";
  bracketType: "SINGLE_ELIMINATION" | "DOUBLE_ELIMINATION" | "ROUND_ROBIN" | "GROUPS_THEN_ELIMINATION";
  type: "MALE" | "FEMALE" | "MIX";
  format: "PAIR" | "QUARTET" | "SEXTET";
  bestOfSets: number;
  tiebreakScore: number;
  minMembers: number;
  maxMembers: number;
  price: number;
  imageUrl: string | null;
  isPublished: boolean;
}

const initial: FormState = {
  name: "",
  description: "",
  ownerId: "",
  city: "",
  state: "",
  date: "",
  modality: "BEACH",
  eventType: "SINGLE",
  bracketType: "SINGLE_ELIMINATION",
  type: "MALE",
  format: "PAIR",
  bestOfSets: 3,
  tiebreakScore: 15,
  minMembers: 2,
  maxMembers: 2,
  price: 0,
  imageUrl: null,
  isPublished: false,
};

export function TournamentWizard() {
  const router = useRouter();
  const qc = useQueryClient();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const organizers = useQuery({
    queryKey: ["admin", "users", "organizers"],
    queryFn: () => api.get<Paginated<Organizer>>("admin/users", { limit: 100 }),
  });
  const organizerList = (organizers.data?.data ?? []).filter(
    (u) => u.email.endsWith("@toqueplay.com") || u.email.includes("organizador"),
  );
  // se filtro falhar (emails variados), mostra todos
  const list = organizerList.length > 0 ? organizerList : organizers.data?.data ?? [];

  const createMut = useMutation({
    mutationFn: () => {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        imageUrl: form.imageUrl || undefined,
        ownerId: form.ownerId,
        eventType: form.eventType,
        status: form.isPublished ? "PUBLISHED" : "DRAFT",
        isPublished: form.isPublished,
        category: {
          type: form.type,
          format: form.format,
          modality: form.modality,
          minMembers: form.minMembers,
          maxMembers: form.maxMembers,
          bestOfSets: form.bestOfSets,
          tiebreakScore: form.tiebreakScore,
          registrationPrice: form.price,
          bracketType: form.bracketType,
        },
        stage: {
          name: "Etapa Única",
          date: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
          maxTeams: 16,
          city: form.city || undefined,
          state: form.state || undefined,
        },
      };
      return api.post<{ id: string }>("admin/tournaments", payload);
    },
    onSuccess: (created) => {
      toast.success("Torneio criado");
      qc.invalidateQueries({ queryKey: ["admin", "tournaments"] });
      router.push(`/tournaments/${created.id}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const canNext =
    (step === 0 && form.name && form.ownerId && form.date) ||
    step === 1 ||
    step === 2 ||
    step === 3;

  function next() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else createMut.mutate();
  }
  function prev() {
    if (step === 0) router.push("/tournaments");
    else setStep((s) => s - 1);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Stepper steps={STEPS as unknown as string[]} current={step} />

      {step === 0 && (
        <Card title="Identificação">
          <Field label="Nome" required>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Descrição">
            <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Organizador" required>
            <Combobox
              value={form.ownerId}
              onChange={(v) => set("ownerId", v)}
              placeholder="Buscar organizador…"
              searchPlaceholder="Digite nome ou email…"
              options={list.map((u) => ({ value: u.id, label: u.name, hint: u.email }))}
            />
          </Field>
          <CepInput
            onAddressFound={(addr) => {
              set("city", addr.city);
              set("state", addr.state);
            }}
          />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Cidade">
              <input value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls} />
            </Field>
            <Field label="UF">
              <input value={form.state} onChange={(e) => set("state", e.target.value.toUpperCase().slice(0, 2))} className={inputCls} />
            </Field>
          </div>
          <Field label="Data de início" required>
            <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCls} />
          </Field>
        </Card>
      )}

      {step === 1 && (
        <Card title="Estrutura">
          <Field label="Modalidade">
            <Pills value={form.modality} onChange={(v) => set("modality", v)} options={[{ k: "BEACH", l: "Praia" }, { k: "COURT", l: "Quadra" }]} />
          </Field>
          <Field label="Tipo de evento">
            <Pills value={form.eventType} onChange={(v) => set("eventType", v)} options={[{ k: "SINGLE", l: "Único" }, { k: "CIRCUIT", l: "Circuito" }]} />
          </Field>
          <Field label="Chaveamento">
            <div className="space-y-2">
              {[
                { k: "SINGLE_ELIMINATION", l: "Eliminatória simples" },
                { k: "DOUBLE_ELIMINATION", l: "Dupla eliminação" },
                { k: "ROUND_ROBIN", l: "Pontos corridos" },
                { k: "GROUPS_THEN_ELIMINATION", l: "Grupos + Mata-mata" },
              ].map((o) => (
                <button
                  key={o.k}
                  type="button"
                  onClick={() => set("bracketType", o.k as FormState["bracketType"])}
                  className={`w-full text-left rounded-xl px-4 py-3 border ${form.bracketType === o.k ? "bg-brand-50 border-brand-500" : "bg-white border-brand-100"}`}
                >
                  <span className="text-sm font-semibold text-ink-900">{o.l}</span>
                </button>
              ))}
            </div>
          </Field>
        </Card>
      )}

      {step === 2 && (
        <Card title="Categoria">
          <Field label="Tipo (gênero)">
            <Pills value={form.type} onChange={(v) => set("type", v)} options={[{ k: "MALE", l: "Masculino" }, { k: "FEMALE", l: "Feminino" }, { k: "MIX", l: "Misto" }]} />
          </Field>
          <Field label="Formato">
            <Pills value={form.format} onChange={(v) => set("format", v)} options={[{ k: "PAIR", l: "Dupla" }, { k: "QUARTET", l: "Quarteto" }, { k: "SEXTET", l: "Sexteto" }]} />
          </Field>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Field label="Mín. membros">
              <input type="number" value={form.minMembers} onChange={(e) => set("minMembers", Number(e.target.value))} className={inputCls} />
            </Field>
            <Field label="Máx. membros">
              <input type="number" value={form.maxMembers} onChange={(e) => set("maxMembers", Number(e.target.value))} className={inputCls} />
            </Field>
            <Field label="Melhor de">
              <input type="number" value={form.bestOfSets} onChange={(e) => set("bestOfSets", Number(e.target.value))} className={inputCls} />
            </Field>
            <Field label="Tiebreak">
              <input type="number" value={form.tiebreakScore} onChange={(e) => set("tiebreakScore", Number(e.target.value))} className={inputCls} />
            </Field>
          </div>
          <Field label="Preço inscrição (BRL)">
            <input type="number" step="0.01" value={form.price} onChange={(e) => set("price", Number(e.target.value))} className={inputCls} />
          </Field>
        </Card>
      )}

      {step === 3 && (
        <Card title="Mídia">
          <BannerPicker value={form.imageUrl} onChange={(url) => set("imageUrl", url)} />
          <Field label="Publicar imediatamente">
            <button
              type="button"
              onClick={() => set("isPublished", !form.isPublished)}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.isPublished ? "bg-brand-500" : "bg-brand-100"}`}
            >
              <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${form.isPublished ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </Field>
        </Card>
      )}

      {step === 4 && (
        <Card title="Revisão">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <Row k="Nome" v={form.name || "—"} />
            <Row k="Organizador" v={list.find((u) => u.id === form.ownerId)?.name ?? "—"} />
            <Row k="Cidade/UF" v={`${form.city || "—"}/${form.state || "—"}`} />
            <Row k="Data" v={form.date || "—"} />
            <Row k="Modalidade" v={form.modality === "BEACH" ? "Praia" : "Quadra"} />
            <Row k="Evento" v={form.eventType === "SINGLE" ? "Único" : "Circuito"} />
            <Row k="Chaveamento" v={form.bracketType.replace(/_/g, " ")} />
            <Row k="Categoria" v={`${form.type}/${form.format}`} />
            <Row k="Membros" v={`${form.minMembers}-${form.maxMembers}`} />
            <Row k="Sets" v={String(form.bestOfSets)} />
            <Row k="Preço" v={`R$ ${form.price}`} />
            <Row k="Status" v={form.isPublished ? "Publicado" : "Rascunho"} />
          </div>
          {form.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.imageUrl} alt="banner" className="mt-4 w-full h-32 object-cover rounded-xl" />
          )}
        </Card>
      )}

      <div className="flex justify-between gap-2 sticky bottom-0 bg-page/80 backdrop-blur py-3">
        <GhostButton onClick={prev}>{step === 0 ? "Cancelar" : "Voltar"}</GhostButton>
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-500">
            Etapa {step + 1} de {STEPS.length}
          </span>
          <PrimaryButton
            onClick={next}
            disabled={createMut.isPending || (step === STEPS.length - 1 && !form.name)}
            icon={
              createMut.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : step === STEPS.length - 1 ? (
                <Save size={14} />
              ) : undefined
            }
          >
            {step === STEPS.length - 1 ? "Criar torneio" : "Avançar"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full h-10 px-3 rounded-xl bg-page border border-brand-100 focus:border-brand-500 outline-none text-sm text-ink-900";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-brand-100">
      <div className="px-5 py-4 border-b border-hairline">
        <p className="font-display text-sm text-ink-900">{title.toUpperCase()}</p>
      </div>
      <div className="p-5 space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wider font-semibold text-ink-500 mb-1.5">
        {label} {required && <span className="text-danger">*</span>}
      </span>
      {children}
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-hairline pb-1.5">
      <span className="text-xs text-ink-500">{k}</span>
      <span className="font-semibold text-ink-900 text-right">{v}</span>
    </div>
  );
}

function Pills({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: any) => void;
  options: { k: string; l: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.k}
          type="button"
          onClick={() => onChange(o.k)}
          className={`px-4 py-2 rounded-full text-xs font-semibold ${
            value === o.k ? "bg-brand-500 text-white" : "bg-white text-ink-700 border border-brand-100"
          }`}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}

function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2 shrink-0">
          <div
            className={`size-7 rounded-full flex items-center justify-center text-xs font-bold ${
              i < current ? "bg-brand-500 text-white" : i === current ? "bg-brand-700 text-white" : "bg-brand-100 text-ink-500"
            }`}
          >
            {i < current ? "✓" : i + 1}
          </div>
          <span className={`text-xs font-semibold ${i === current ? "text-ink-900" : "text-ink-500"}`}>{s}</span>
          {i < steps.length - 1 && <div className="w-6 h-px bg-brand-100" />}
        </div>
      ))}
    </div>
  );
}
