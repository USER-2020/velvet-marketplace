import { router } from '@inertiajs/react';
import { AlertTriangle, ChevronRight, Save } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { PasswordInput } from '../ui/PasswordInput';
import type { VelvetUser } from './types';

export function ProfilePanel({ user, balance, onBecomeCreator }: { user: VelvetUser; balance: number; onBecomeCreator: () => void }) {
    const [email, setEmail] = useState(user.email);
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const save = (event: FormEvent) => { event.preventDefault(); router.put('/account/credentials', { email, current_password: currentPassword, password, password_confirmation: passwordConfirmation }, { preserveScroll: true }); };
    const remove = (event: FormEvent) => { event.preventDefault(); if (!confirm('Esta acción eliminará tu cuenta de forma permanente. ¿Deseas continuar?')) return; router.delete('/account', { data: { current_password: currentPassword, confirmation } }); };
    return <section className="profile-view">
        <header className="profile-title"><div><p>CUENTA VELVET</p><h1>Mi perfil</h1></div>{user.role === 'user' && <button className="outline-button" onClick={onBecomeCreator}>Convertirme en creador <ChevronRight size={16}/></button>}</header>
        <article className="profile-card">
            <div className="profile-summary"><span className="profile-monogram large">{initials(user.name)}</span><div><p>CUENTA VELVET</p><h2>{user.name}</h2><small>{roleName(user.role)}</small></div></div>
            <div className="profile-information"><Info label="Correo electrónico" value={user.email}/><Info label="País" value={user.country ?? 'Sin registrar'}/><Info label="Velvet Coins" value={`${balance.toLocaleString('es-CO')} VC`}/></div>
            <form className="credentials-form" onSubmit={save}><h2>Cambiar credenciales</h2><label>Correo electrónico<input value={email} type="email" onChange={(event) => setEmail(event.target.value)} required/></label><label>Contraseña actual<PasswordInput value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required autoComplete="current-password"/></label><label>Nueva contraseña<PasswordInput value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password"/></label><label>Confirmar contraseña<PasswordInput value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} autoComplete="new-password"/></label><button className="violet-button" type="submit"><Save size={16}/> Guardar credenciales</button></form>
            <form className="danger-zone" onSubmit={remove}><div><AlertTriangle size={20}/><h2>Zona de peligro</h2></div><p>Eliminar la cuenta es permanente y no puede deshacerse.</p><label>Escribe <b>ELIMINAR</b> para confirmar<input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="ELIMINAR"/></label><button type="submit" disabled={confirmation !== 'ELIMINAR' || !currentPassword}>Eliminar mi cuenta <ChevronRight size={16}/></button></form>
        </article>
    </section>;
}
function Info({ label, value }: { label: string; value: string }) { return <div><small>{label}</small><strong>{value}</strong></div>; }
function initials(name: string) { return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase(); }
function roleName(role: string) { return ({ user: 'Usuario', creator: 'Creador', moderator: 'Moderador', admin: 'Administrador', super_admin: 'Super administrador' } as Record<string, string>)[role] ?? role; }
