import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { ExploreFeed, HomeFeed, RightRail, WalletView } from '../components/feed/FeedHome';
import { FeedSidebar, FeedTopbar, MobileFeedNav, MobileTopbar } from '../components/feed/FeedNavigation';
import { ProfilePanel } from '../components/feed/ProfilePanel';
import { AdminLogs, AdminOverview, AdminUsers } from '../components/feed/SuperAdminModules';
import type { AdminData, CoinPackage, Creator, Section, VelvetUser } from '../components/feed/types';

type Props = { user: VelvetUser; creators: Creator[]; packages: CoinPackage[]; admin: AdminData | null };

export default function Marketplace({ user, creators, packages, admin }: Props) {
    const [section, setSection] = useState<Section>('home');
    const [search, setSearch] = useState('');
    const [balance, setBalance] = useState(1250);
    const recharge = (amount: number) => setBalance((current) => Math.max(0, current + amount));
    const becomeCreator = () => router.post('/become-creator', {}, { preserveScroll: true });

    return <><Head title="Para ti"/>
        <main className="social-shell">
            <FeedSidebar active={section} onChange={setSection} user={user} balance={balance} onBecomeCreator={becomeCreator}/>
            <MobileTopbar active={section} onChange={setSection} user={user} balance={balance} onBecomeCreator={becomeCreator}/>
            <section className="feed-main" aria-live="polite">
                {section !== 'profile' && <FeedTopbar onSearch={setSearch}/>} 
                {section === 'home' && <>{user.role === 'super_admin' && admin && <AdminOverview data={admin} onSection={setSection}/>}<HomeFeed creators={creators} packages={packages} balance={balance} onRecharge={recharge} search={search}/></>} 
                {section === 'explore' && <ExploreFeed creators={creators} search={search}/>} 
                {section === 'wallet' && <WalletView packages={packages} balance={balance} onRecharge={recharge}/>} 
                {section === 'profile' && <ProfilePanel user={user} balance={balance} onBecomeCreator={becomeCreator}/>} 
                {section === 'admin-users' && admin && <AdminUsers users={admin.users}/>} 
                {section === 'admin-logs' && admin && <AdminLogs logs={admin.logs}/>} 
                {(section === 'chat' || section === 'saved') && <EmptyState type={section}/>} 
            </section>
            <RightRail creators={creators} packages={packages} balance={balance} onRecharge={recharge} user={user} onBecomeCreator={becomeCreator}/>
            <MobileFeedNav active={section} onChange={setSection}/>
        </main>
    </>;
}

function EmptyState({ type }: { type: 'chat' | 'saved' }) {
    return <section className="empty-state"><p>{type === 'chat' ? 'MENSAJES' : 'GUARDADOS'}</p><h1>{type === 'chat' ? 'Tus conversaciones' : 'Tu selección privada'}</h1><span>{type === 'chat' ? 'Cuando inicies una conversación con una creadora, aparecerá aquí.' : 'Guarda perfiles y publicaciones para volver a verlas cuando quieras.'}</span></section>;
}
