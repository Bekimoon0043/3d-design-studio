import type { LocalUser } from '../../hooks/useAuth';

interface Props {
  user: LocalUser | null;
}

/** Local testing: shows guest badge only (no cloud sign-in). */
export default function AccountMenu({ user }: Props) {
  return (
    <div className="flex items-center gap-2 bg-panelLight border border-border rounded-full pl-1 pr-3 py-1">
      <span className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs text-white font-semibold">
        {user?.email?.[0]?.toUpperCase() ?? 'G'}
      </span>
      <span className="text-xs text-gray-300">Local (cache)</span>
    </div>
  );
}
