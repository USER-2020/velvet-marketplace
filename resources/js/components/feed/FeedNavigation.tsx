import { Bell, Bookmark, ChevronRight, CirclePlus, Compass, Cog, FileText, House, LogOut, Menu, MessageCircle, Search, ShieldCheck, UserRound, UsersRound, WalletCards, X } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import type { Section, VelvetUser } from './types';

type Props = { active: Section; onChange: (section: Section) => void; user: VelvetUser; balance: number; onBecomeCreator?: () => void };

const items: Array<{ key: Section; label: string; icon: typeof House }> = [
    { key: 'home', label: 'Inicio', icon: House },
    { key: 'explore', label: 'Explorar', icon: Compass },
    { key: 'chat', label: 'Chat', icon: MessageCircle },
    { key: 'saved', label: 'Guardados', icon: Bookmark },
];

export function FeedSidebar({ active, onChange, user, balance, onBecomeCreator }: Props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const close = (event: MouseEvent) => { if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false); };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);
    return <aside className="feed-sidebar">
        <a className="feed-brand" href="/" aria-label="Velvet, inicio"><span>THE</span>VELVET<small>AI MODELS MARKETPLACE</small></a>
        <nav className="feed-nav" aria-label="Navegación principal">
            {items.map(({ key, label, icon: Icon }) => <button key={key} className={active === key ? 'is-active' : ''} onClick={() => onChange(key)}><Icon /><span>{label}</span>{key === 'chat' && <b>3</b>}</button>)}
            {user.role === 'super_admin' && <div className="admin-nav-group"><small><ShieldCheck size={12}/> Super administración</small><button className={active === 'admin-users' ? 'is-active' : ''} onClick={() => onChange('admin-users')}><UsersRound/><span>Usuarios</span></button><button className={active === 'admin-logs' ? 'is-active' : ''} onClick={() => onChange('admin-logs')}><FileText/><span>Logs</span></button></div>}
        </nav>
        <button className="sidebar-wallet" onClick={() => onChange('wallet')}>
            <span className="coin-mark">V</span><span><small>Tu saldo</small><strong>{balance.toLocaleString('es-CO')} VC</strong></span><ChevronRight />
        </button>
        <div className="profile-menu" ref={menuRef}>
            {menuOpen && <div className="profile-dropdown" role="menu">
                <button role="menuitem" onClick={() => { onChange('profile'); setMenuOpen(false); }}><UserRound size={16}/> Mi perfil</button>
                <button role="menuitem" onClick={() => { onChange('profile'); setMenuOpen(false); }}><Cog size={16}/> Configuración</button>
                {user.role === 'user' && <button role="menuitem" className="creator-menu-action" onClick={() => { onBecomeCreator?.(); setMenuOpen(false); }}><CirclePlus size={16}/> Convertirme en creador</button>}
                <hr/>
                <button role="menuitem" className="logout-action" onClick={() => router.post('/logout')}><LogOut size={16}/> Cerrar sesión</button>
            </div>}
            <button className="sidebar-profile" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-haspopup="menu">
                <span className="profile-monogram">{initials(user.name)}</span><span><strong>{user.name}</strong><small>{roleLabel(user.role)}</small></span><Cog className="profile-cog" size={17}/>
            </button>
        </div>
    </aside>;
}

export function FeedTopbar({ onSearch }: { onSearch: (value: string) => void }) {
    return <header className="feed-topbar"><label className="feed-search"><Search size={20}/><input onChange={(event) => onSearch(event.target.value)} placeholder="Buscar creadoras, publicaciones o etiquetas…" aria-label="Buscar" /></label><button className="notification-button" aria-label="Notificaciones"><Bell size={20}/><i /></button></header>;
}

export function MobileFeedNav({ active, onChange }: Pick<Props, 'active' | 'onChange'>) {
    const [visible, setVisible] = useState(true);
    const lastPosition = useRef(0);
    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        const onScroll = () => {
            const next = window.scrollY;
            const delta = next - lastPosition.current;
            if (next < 48 || delta < -3) setVisible(true);
            if (delta > 7 && next > 72) setVisible(false);
            lastPosition.current = next;
            if (idleTimer.current) clearTimeout(idleTimer.current);
            idleTimer.current = setTimeout(() => setVisible(true), 550);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => { window.removeEventListener('scroll', onScroll); if (idleTimer.current) clearTimeout(idleTimer.current); };
    }, []);
    const nav = [{ key: 'home' as Section, label: 'Inicio', icon: House }, { key: 'explore' as Section, label: 'Explorar', icon: Compass }, { key: 'wallet' as Section, label: 'Coins', icon: WalletCards }, { key: 'chat' as Section, label: 'Chat', icon: MessageCircle }, { key: 'profile' as Section, label: 'Perfil', icon: UserRound }];
    return <nav className={`feed-mobile-nav ${visible ? 'is-visible' : ''}`} aria-label="Navegación móvil">{nav.map(({ key, label, icon: Icon }) => <button key={key} className={active === key ? 'is-active' : ''} onClick={() => onChange(key)}>{key === 'wallet' ? <span className="mobile-create"><CirclePlus /></span> : <Icon />}<small>{label}</small></button>)}</nav>;
}

export function MobileTopbar({ active, onChange, user, balance, onBecomeCreator }: Props) {
    const [open, setOpen] = useState(false);
    const mobileItems = [...items, ...(user.role === 'super_admin' ? [{ key: 'admin-users' as Section, label: 'Usuarios', icon: UsersRound }, { key: 'admin-logs' as Section, label: 'Logs', icon: FileText }] : [])];
    const select = (section: Section) => { onChange(section); setOpen(false); };
    return <><header className="mobile-topbar"><button className="mobile-menu-toggle" onClick={() => setOpen(true)} aria-label="Abrir menú"><Menu /></button><button className="mobile-wallet" onClick={() => select('wallet')}><span className="coin-mark">V</span><span><small>Velvet Coins</small><strong>{balance.toLocaleString('es-CO')} VC</strong></span><ChevronRight size={16}/></button></header>{open && <div className="mobile-drawer-layer" role="presentation" onClick={() => setOpen(false)}><aside className="mobile-drawer" role="dialog" aria-label="Menú principal" onClick={(event) => event.stopPropagation()}><header><a className="mobile-brand" href="/"><small>THE</small>VELVET</a><button onClick={() => setOpen(false)} aria-label="Cerrar menú"><X /></button></header><nav>{mobileItems.map(({ key, label, icon: Icon }) => <button key={key} className={active === key ? 'is-active' : ''} onClick={() => select(key)}><Icon/><span>{label}</span></button>)}<button onClick={() => select('profile')}><UserRound/><span>Mi perfil</span></button>{user.role === 'user' && <button className="drawer-creator" onClick={() => { onBecomeCreator?.(); setOpen(false); }}><CirclePlus/><span>Convertirme en creador</span></button>}</nav><button className="drawer-logout" onClick={() => router.post('/logout')}><LogOut/> Cerrar sesión</button></aside></div>}</>;
}

function initials(name: string) { return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase(); }
function roleLabel(role: string) { return ({ user: 'Usuario', creator: 'Creador', moderator: 'Moderador', admin: 'Administrador', super_admin: 'Super administrador' } as Record<string, string>)[role] ?? role; }
