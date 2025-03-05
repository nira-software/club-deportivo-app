import NavItem from '@/lib/entities/nav-item';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/_auth-option';

const navMain: NavItem[] = [
  {
    title: 'Dashboard',
    url: '#',
    icon: 'Home',
    isActive: true,
    items: [
      {
        title: 'Inicio',
        url: '/secure/dashboard',
      },
    ],
  },
  {
    title: 'Atletas',
    url: '#',
    icon: 'SquareTerminal',
    items: [
      {
        title: 'Registro',
        url: '/secure/athlete/add',
      },
      {
        title: 'Consultar',
        url: '/secure/athlete',
      },
    ],
  },
  {
    title: 'Models',
    url: '#',
    icon: 'Bot',
    items: [
      {
        title: 'Genesis',
        url: '#',
      },
      {
        title: 'Explorer',
        url: '#',
      },
      {
        title: 'Quantum',
        url: '#',
      },
    ],
  },
  {
    title: 'Documentation',
    url: '#',
    icon: 'BookOpen',
    items: [
      {
        title: 'Introduction',
        url: '#',
      },
      {
        title: 'Get Started',
        url: '#',
      },
      {
        title: 'Tutorials',
        url: '#',
      },
      {
        title: 'Changelog',
        url: '#',
      },
    ],
  },
  {
    title: 'Settings',
    url: '#',
    icon: 'Settings2',
    items: [
      {
        title: 'General',
        url: '#',
      },
      {
        title: 'Team',
        url: '#',
      },
      {
        title: 'Billing',
        url: '#',
      },
      {
        title: 'Limits',
        url: '#',
      },
    ],
  },
];

export async function GET(): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(navMain, { status: 200 });
}
