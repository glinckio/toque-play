import { create } from 'zustand';

export type DialogVariant = 'success' | 'error' | 'warning' | 'info';

export interface DialogConfig {
  variant: DialogVariant;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger' | 'success';
  onConfirm?: () => void | Promise<void>;
  autoClose?: boolean;
}

interface DialogState {
  visible: boolean;
  config: DialogConfig | null;
  show: (config: DialogConfig) => void;
  hide: () => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  confirm: (config: Omit<DialogConfig, 'variant'>) => void;
}

export const useDialogStore = create<DialogState>()((set) => ({
  visible: false,
  config: null,

  show: (config) => set({ visible: true, config }),

  hide: () => set({ visible: false, config: null }),

  success: (message, title) =>
    set({
      visible: true,
      config: { variant: 'success', title: title ?? 'Sucesso', message, autoClose: true },
    }),

  error: (message, title) =>
    set({
      visible: true,
      config: { variant: 'error', title: title ?? 'Erro', message },
    }),

  warning: (message, title) =>
    set({
      visible: true,
      config: { variant: 'warning', title: title ?? 'Atenção', message },
    }),

  info: (message, title) =>
    set({
      visible: true,
      config: { variant: 'info', title: title ?? 'Informação', message },
    }),

  confirm: (config) =>
    set({
      visible: true,
      config: {
        variant: 'info',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmVariant: 'primary',
        ...config,
      },
    }),
}));
