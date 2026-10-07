export type Section = 'home' | 'explore' | 'chat' | 'saved' | 'wallet' | 'profile' | 'admin-users' | 'admin-logs';

export type VelvetUser = {
    name: string;
    email: string;
    country: string | null;
    role: string;
    created_at?: string;
};

export type Creator = {
    name: string;
    handle: string;
    category: string;
    followers: string;
    tone: string;
};

export type CoinPackage = {
    name: string;
    coins: number;
    price: string;
    bonus: string;
    featured?: boolean;
};

export type AdminUser = { id: number; name: string; email: string; country: string | null; role: string; createdAt: string | null };
export type RegistrationLog = { id: number; name: string; email: string | null; action: string; eventType: string; routeName: string | null; statusCode: number; ipAddress: string | null; device: string | null; context: Record<string, string> | null; createdAt: string | null };
export type AdminData = { users: AdminUser[]; logs: RegistrationLog[] };
