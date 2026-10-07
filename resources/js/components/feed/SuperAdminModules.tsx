import { router } from '@inertiajs/react';
import { FileText, Search, ShieldCheck, UsersRound, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { AdminData, AdminUser } from './types';

const roleLabels: Record<string, string> = { user: 'Usuario', creator: 'Creador', moderator: 'Moderador', admin: 'Administrador', super_admin: 'Super administrador' };
const roles = Object.keys(roleLabels);

export function AdminOverview({ data, onSection }: { data: AdminData; onSection: (section: 'admin-users' | 'admin-logs') => void }) {
    return <section className="admin-overview"><div className="admin-intro"><p>SUPER ADMINISTRACIÓN</p><h1>Centro de control</h1><span>Gestiona las cuentas y consulta la trazabilidad de registros de Velvet.</span></div><div className="admin-stat-grid"><article><UsersRound/><strong>{data.users.length}</strong><span>Usuarios recientes</span></article><article><FileText/><strong>{data.logs.length}</strong><span>Registros auditables</span></article><article><ShieldCheck/><strong>Activo</strong><span>Control de roles</span></article></div><div className="admin-module-grid"><button onClick={() => onSection('admin-users')}><UsersRound/><span><strong>Administrar usuarios</strong><small>Consulta cuentas y actualiza sus roles.</small></span></button><button onClick={() => onSection('admin-logs')}><FileText/><span><strong>Logs de registro</strong><small>IP, dispositivo y fecha de cada alta.</small></span></button></div></section>;
}

export function AdminUsers({ users }: { users: AdminUser[] }) {
    const updateRole = (user: AdminUser, role: string) => router.put(`/super-admin/users/${user.id}/role`, { role }, { preserveScroll: true });
    return <section className="admin-module"><div className="admin-intro"><p>SUPER ADMINISTRACIÓN</p><h1>Administrar usuarios</h1><span>Roles y datos de las últimas 50 cuentas registradas.</span></div><div className="admin-table"><div className="admin-row header"><span>Usuario</span><span>País</span><span>Registro</span><span>Rol</span></div>{users.map((user) => <div className="admin-row" key={user.id}><span><strong>{user.name}</strong><small>{user.email}</small></span><span>{user.country ?? '—'}</span><span>{formatDate(user.createdAt)}</span><label><select value={user.role} onChange={(event) => updateRole(user, event.target.value)} aria-label={`Cambiar rol de ${user.name}`}>{roles.map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}</select></label></div>)}</div></section>;
}

export function AdminLogs({ logs }: { logs: AdminData['logs'] }) {
    const [filters, setFilters] = useState({ query: '', type: '', status: '' });
    const filtered = useMemo(() => logs.filter((log) => {
        const text = `${log.name} ${log.email ?? ''} ${log.action} ${log.ipAddress ?? ''}`.toLowerCase();
        return (!filters.query || text.includes(filters.query.toLowerCase())) && (!filters.type || log.eventType === filters.type) && (!filters.status || String(log.statusCode) === filters.status);
    }), [logs, filters]);
    const clear = () => setFilters({ query: '', type: '', status: '' });
    return <section className="admin-module"><div className="admin-intro"><p>SUPER ADMINISTRACIÓN</p><h1>Auditoría de plataforma</h1><span>Acciones autenticadas, cambios administrativos, altas, bajas y operaciones de cuenta. Los secretos nunca se almacenan.</span></div><div className="audit-filters"><label><Search size={15}/><input value={filters.query} onChange={(event) => setFilters({ ...filters, query: event.target.value })} placeholder="Actor, acción o IP"/></label><select value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })}><option value="">Todas las acciones</option>{['authentication', 'account', 'administration', 'create', 'update', 'delete'].map((type) => <option key={type} value={type}>{eventLabel(type)}</option>)}</select><select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="">Todos los estados</option><option value="200">200 · Correcto</option><option value="302">302 · Redirección</option><option value="422">422 · Validación</option><option value="403">403 · Denegado</option></select><button onClick={clear}><X size={14}/> Limpiar</button></div><p className="audit-result">{filtered.length} evento{filtered.length === 1 ? '' : 's'} encontrado{filtered.length === 1 ? '' : 's'}.</p><div className="admin-table"><div className="admin-row header audit"><span>Actor / acción</span><span>Tipo</span><span>Origen</span><span>Estado</span><span>Fecha</span></div>{filtered.map((log) => <div className="admin-row audit" key={log.id}><span><strong>{log.name}</strong><small>{log.email ?? 'Visitante'} · {log.action}</small></span><span><b className={`audit-badge ${log.eventType}`}>{eventLabel(log.eventType)}</b></span><span><strong>{log.ipAddress ?? '—'}</strong><small>{log.device ?? '—'}</small></span><span><b className={`status-${Math.floor(log.statusCode / 100)}`}>{log.statusCode}</b></span><span>{formatDate(log.createdAt)}</span></div>)}</div></section>;
}
function formatDate(value: string | null) { return value ? new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—'; }
function eventLabel(type: string) { return ({ authentication: 'Autenticación', account: 'Cuenta', administration: 'Administración', create: 'Creación', update: 'Actualización', delete: 'Eliminación' } as Record<string, string>)[type] ?? type; }
