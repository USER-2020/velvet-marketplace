import { Head, Link } from '@inertiajs/react';

type Log = { id: number; name: string | null; email: string | null; ipAddress: string; device: string; createdAt: string | null };

export default function SuperAdminLogs({ logs }: { logs: { data: Log[] } }) {
    return <><Head title="Logs de registro"/><main className="admin-page"><section className="admin-card"><Link className="text-button" href="/">← Dashboard</Link><p className="eyebrow">SUPER ADMIN</p><h1>Logs de registro</h1><p className="auth-copy">Altas de cuenta con IP y dispositivo de origen.</p><div className="log-table" role="table"><div className="log-row log-head" role="row"><span>Usuario</span><span>IP</span><span>Dispositivo</span><span>Fecha</span></div>{logs.data.map((log) => <div className="log-row" role="row" key={log.id}><span><strong>{log.name ?? 'Usuario eliminado'}</strong><small>{log.email}</small></span><span>{log.ipAddress}</span><span>{log.device}</span><span>{log.createdAt ? new Date(log.createdAt).toLocaleString('es-CO') : '—'}</span></div>)}</div>{logs.data.length === 0 && <p className="empty">Aún no hay registros.</p>}</section></main></>;
}
