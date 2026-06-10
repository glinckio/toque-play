import { ChevronRight } from 'lucide-react';
import { Card, CardHeader } from '../ui';

const groups = [
  {
    title: 'Plataforma',
    items: [
      { k: 'Nome do app', v: 'ToquePlay' },
      { k: 'Domínio', v: 'app.toqueplay.com' },
      { k: 'Idioma padrão', v: 'Português (BR)' },
    ],
  },
  {
    title: 'Pagamentos',
    items: [
      { k: 'Provedor', v: 'Stripe (live)' },
      { k: 'Taxa da plataforma', v: '6%' },
      { k: 'Reembolso automático', v: 'Desativado' },
    ],
  },
  {
    title: 'Notificações',
    items: [
      { k: 'E-mail transacional', v: 'Resend' },
      { k: 'Push mobile', v: 'OneSignal' },
      { k: 'Webhooks', v: '3 ativos' },
    ],
  },
  {
    title: 'Moderação',
    items: [
      { k: 'Aprovação manual de torneios', v: 'Apenas iniciantes' },
      { k: 'Limite de denúncias para suspender', v: '3' },
      { k: 'Listas de bloqueio', v: '12 termos' },
    ],
  },
];

export function AdminSettings() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {groups.map((g) => (
        <Card key={g.title}>
          <CardHeader title={g.title} />
          <ul>
            {g.items.map((it) => (
              <li key={it.k} className="px-5 py-4 border-b border-[#F4EFFA] last:border-b-0 flex items-center gap-3">
                <div className="flex-1">
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#150A1F' }}>{it.k}</p>
                  <p style={{ fontSize: 12, color: '#6B5B7E' }}>{it.v}</p>
                </div>
                <ChevronRight size={16} color="#A89BBA" />
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
