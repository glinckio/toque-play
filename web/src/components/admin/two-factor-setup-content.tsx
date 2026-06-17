"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldCheck, ShieldOff, QrCode, Copy, Check } from "lucide-react";
import { toast } from "sonner";

type Status = { enabled: boolean; hasBackupCodes: boolean };
type Setup = { secret: string; otpauthUri: string; qrDataUrl: string };

export function TwoFactorSetupContent() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const [setup, setSetup] = useState<Setup | null>(null);
  const [verifyToken, setVerifyToken] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [copied, setCopied] = useState(false);
  const [disabling, setDisabling] = useState(false);

  async function loadStatus() {
    setLoadingStatus(true);
    try {
      const res = await fetch("/api/proxy/me/2fa/status", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch {
      // noop
    } finally {
      setLoadingStatus(false);
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  async function startSetup() {
    try {
      const res = await fetch("/api/proxy/me/2fa/setup", {
        method: "POST",
      });
      if (!res.ok) {
        toast.error("Falha ao iniciar configuração 2FA");
        return;
      }
      const data = (await res.json()) as Setup;
      setSetup(data);
    } catch {
      toast.error("Falha ao iniciar configuração 2FA");
    }
  }

  async function confirmSetup() {
    if (!setup) return;
    setVerifying(true);
    try {
      const res = await fetch("/api/proxy/me/2fa/verify-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: setup.secret, token: verifyToken.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body?.message ?? "Código inválido");
        return;
      }
      const data = await res.json();
      setBackupCodes(data.backupCodes ?? []);
      setSetup(null);
      setVerifyToken("");
      await loadStatus();
      toast.success("2FA ativado!");
    } finally {
      setVerifying(false);
    }
  }

  async function disable() {
    if (!confirm("Desativar 2FA? Sua conta ficará menos protegida.")) return;
    setDisabling(true);
    try {
      const res = await fetch("/api/proxy/me/2fa/disable", { method: "POST" });
      if (!res.ok) {
        toast.error("Falha ao desativar 2FA");
        return;
      }
      await loadStatus();
      toast.success("2FA desativado");
    } finally {
      setDisabling(false);
    }
  }

  function copyBackupCodes() {
    if (!backupCodes) return;
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loadingStatus) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div
        className="rounded-2xl border p-6"
        style={{
          borderColor: status?.enabled ? "rgb(220 252 231)" : "rgb(254 226 226)",
          background: status?.enabled
            ? "linear-gradient(135deg,rgba(31,184,122,0.05),rgba(31,184,122,0.02))"
            : "linear-gradient(135deg,rgba(224,69,69,0.05),rgba(224,69,69,0.02))",
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="size-10 rounded-xl flex items-center justify-center"
            style={{
              background: status?.enabled ? "rgb(31,184,122,0.1)" : "rgb(224,69,69,0.1)",
            }}
          >
            {status?.enabled ? (
              <ShieldCheck size={20} className="text-success-fg" />
            ) : (
              <ShieldOff size={20} className="text-danger-fg" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-display text-lg text-ink-900">
              {status?.enabled ? "2FA ativo" : "2FA desativado"}
            </p>
            <p className="text-xs text-ink-500 mt-1">
              {status?.enabled
                ? "Sua conta exige um código TOTP ou de backup no login."
                : "Recomendado para administradores. Ative para proteger sua conta."}
            </p>
          </div>
          {!status?.enabled && !setup && (
            <button
              onClick={startSetup}
              className="h-10 px-4 rounded-xl text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg,#6D2EC0,#4A1F87)" }}
            >
              Ativar 2FA
            </button>
          )}
          {status?.enabled && (
            <button
              onClick={disable}
              disabled={disabling}
              className="h-10 px-4 rounded-xl text-danger-fg font-bold text-sm border border-danger-fg/30 hover:bg-danger-bg disabled:opacity-60"
            >
              {disabling ? "Desativando..." : "Desativar"}
            </button>
          )}
        </div>
      </div>

      {setup && (
        <div className="bg-white rounded-2xl border border-brand-100 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <QrCode size={18} className="text-brand-500" />
            <h2 className="font-display text-base text-ink-900">
              Escaneie o QR code
            </h2>
          </div>
          <p className="text-xs text-ink-500">
            Use um app autenticador (Google Authenticator, Authy, 1Password)
            para escanear o código abaixo. Depois digite os 6 dígitos gerados.
          </p>
          <div className="flex justify-center py-2 bg-page rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={setup.qrDataUrl}
              alt="QR code para configurar 2FA"
              className="size-48"
            />
          </div>
          <details className="text-xs">
            <summary className="cursor-pointer text-ink-500">
              Ou informe a chave manualmente
            </summary>
            <code className="block mt-2 p-2 bg-page rounded-lg break-all">
              {setup.secret}
            </code>
          </details>
          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-ink-500">
              Código de verificação
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={verifyToken}
              onChange={(e) =>
                setVerifyToken(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              className="mt-1.5 w-full h-11 px-3 rounded-xl border border-brand-100 bg-page text-ink-900 tracking-widest text-center font-mono outline-none focus:border-brand-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSetup(null);
                setVerifyToken("");
              }}
              className="flex-1 h-11 rounded-xl border border-brand-100 text-ink-700 font-semibold text-sm hover:bg-page"
            >
              Cancelar
            </button>
            <button
              onClick={confirmSetup}
              disabled={verifyToken.length !== 6 || verifying}
              className="flex-1 h-11 rounded-xl text-white font-bold text-sm disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#6D2EC0,#4A1F87)" }}
            >
              {verifying ? "Verificando..." : "Ativar"}
            </button>
          </div>
        </div>
      )}

      {backupCodes && backupCodes.length > 0 && (
        <div className="bg-white rounded-2xl border border-warning-fg/30 p-6 space-y-3">
          <div>
            <h2 className="font-display text-base text-ink-900">
              Códigos de backup
            </h2>
            <p className="text-xs text-ink-500 mt-1">
              Guarde em local seguro. Cada código pode ser usado uma única vez
              caso você perca acesso ao app autenticador.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 p-4 bg-page rounded-xl font-mono text-sm">
            {backupCodes.map((c) => (
              <span key={c} className="text-ink-900 tracking-wider">
                {c}
              </span>
            ))}
          </div>
          <button
            onClick={copyBackupCodes}
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-500 hover:text-brand-700"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copiado!" : "Copiar todos"}
          </button>
        </div>
      )}
    </div>
  );
}
