import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const currentPath = usePage().url.split('?')[0];

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [showingSideMenu, setShowingSideMenu] = useState(false);
    const [showingDesktopSideMenu, setShowingDesktopSideMenu] = useState(true);
    const desktopSidebarRef = useRef(null);
    const mobileSidebarRef = useRef(null);

    const menuGroups = [
        {
            label: 'Overview',
            items: [{ href: '/dashboard', label: 'Dashboard' }],
        },
        {
            label: 'Market Analysis',
            items: [
                { href: '/mas/create', label: 'Create MA' },
                { href: '/mas', label: 'Manage MA' },
                { href: '/mas/completed', label: 'Completed MA' },
            ],
        },
        {
            label: 'Purchase Requests',
            items: [
                { href: '/create-pr', label: 'Create PR' },
                { href: '/prs', label: 'Manage PRs' },
            ],
        },
        {
            label: 'Quotations',
            items: [
                { href: '/create-rfq', label: 'Create RFQ' },
                { href: '/rfqs', label: 'Manage RFQs' },
            ],
        },
        {
            label: 'Procurement Plans',
            items: [
                { href: '/create-ppmp', label: 'Create PPMP' },
                { href: '/ppmps', label: 'Manage PPMPs' },
            ],
        },
    ];
    const adminLinks = user?.is_admin ? [{ href: '/users', label: 'Manage Users' }] : [];
    const desktopSidebarWidth = showingDesktopSideMenu ? 'lg:pl-72' : 'lg:pl-20';
    const desktopSidebarClass = showingDesktopSideMenu ? 'w-72' : 'w-20';

    const isActivePath = (href) => {
        if (href === '/mas') {
            return currentPath === '/mas' || currentPath.startsWith('/mas/') && !currentPath.startsWith('/mas/create');
        }

        return currentPath === href;
    };

    const sidebarLinkIcon = (href) => {
        if (href === '/dashboard') {
            return (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 11.5 12 4l8 7.5M6 10.5V20h12v-9.5" />
            );
        }

        if (href === '/mas/create' || href === '/mas' || href === '/mas/completed') {
            return (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 7h16M4 12h16M4 17h10M4 7l3 3 3-3M4 12l3 3 3-3" />
            );
        }

        if (href === '/create-pr' || href === '/prs') {
            return (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 6h10M8 10h10M8 14h10M8 18h10M5 6h.01M5 10h.01M5 14h.01M5 18h.01" />
            );
        }

        if (href === '/create-rfq' || href === '/rfqs') {
            return (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 6h10v12H7zM7 10h10M10 6v12" />
            );
        }

        if (href === '/create-ppmp' || href === '/ppmps') {
            return (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 7h12M6 12h12M6 17h12M6 7v10M12 7v10M18 7v10" />
            );
        }

        return (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 5v14m-7-7h14" />
        );
    };

    const renderSidebarLink = (item, compact = false, mobile = false) => (
        <Link
            key={item.href}
            href={item.href}
            title={item.label}
            onClick={mobile ? () => setShowingSideMenu(false) : undefined}
            className={`group flex items-center rounded-xl py-3 text-sm font-medium transition hover:bg-gray-100 hover:text-gray-900 ${isActivePath(item.href) ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} ${compact ? 'justify-center px-2' : 'gap-3 px-4'} ${mobile ? 'block' : ''}`}
        >
            {!mobile && (
                <svg className="h-5 w-5 shrink-0 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    {sidebarLinkIcon(item.href)}
                </svg>
            )}
            <span className={compact ? 'sr-only' : 'inline'}>{item.label}</span>
        </Link>
    );

    useEffect(() => {
        const handlePointerDown = (event) => {
            if (
                showingDesktopSideMenu &&
                desktopSidebarRef.current &&
                !desktopSidebarRef.current.contains(event.target)
            ) {
                setShowingDesktopSideMenu(false);
            }

            if (
                showingSideMenu &&
                mobileSidebarRef.current &&
                !mobileSidebarRef.current.contains(event.target)
            ) {
                setShowingSideMenu(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
        };
    }, [showingDesktopSideMenu, showingSideMenu]);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className={`border-b border-gray-100 bg-white transition-[padding] duration-200 ${desktopSidebarWidth}`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setShowingSideMenu((previousState) => !previousState)}
                                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 lg:hidden"
                                aria-label="Toggle procurement menu"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowingDesktopSideMenu((previousState) => !previousState)}
                                className="hidden items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 lg:inline-flex"
                                aria-label={showingDesktopSideMenu ? 'Collapse procurement sidebar' : 'Expand procurement sidebar'}
                            >
                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                                    {showingDesktopSideMenu ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l-5 5 5 5" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 5l5 5-5 5" />
                                    )}
                                </svg>
                            </button>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span>{user.name}</span>
                                                    {user?.is_admin && (
                                                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                                                            Admin
                                                        </span>
                                                    )}
                                                </span>

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="flex items-center gap-2 text-base font-medium text-gray-800">
                                <span>{user.name}</span>
                                {user?.is_admin && (
                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                                        Admin
                                    </span>
                                )}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {!showingDesktopSideMenu && (
                <button
                    type="button"
                    onMouseEnter={() => setShowingDesktopSideMenu(true)}
                    className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-4 cursor-pointer bg-transparent lg:block"
                    aria-label="Expand procurement sidebar"
                />
            )}

            <aside
                ref={desktopSidebarRef}
                onMouseLeave={() => setShowingDesktopSideMenu(false)}
                className={`fixed inset-y-0 left-0 z-30 hidden border-r border-gray-200 bg-white shadow-sm transition-[width] duration-200 lg:flex lg:flex-col ${desktopSidebarClass}`}
            >
                <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
                    <div className={`text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 ${showingDesktopSideMenu ? 'block' : 'sr-only'}`}>
                        Procurement Menu
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowingDesktopSideMenu((previousState) => !previousState)}
                        className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                        aria-label={showingDesktopSideMenu ? 'Collapse procurement sidebar' : 'Expand procurement sidebar'}
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            {showingDesktopSideMenu ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            )}
                        </svg>
                    </button>
                </div>

                <div className={`flex-1 overflow-y-auto py-4 ${showingDesktopSideMenu ? 'px-3' : 'px-2'}`}>
                    <div className="space-y-5">
                        {menuGroups.map((group) => (
                            <div key={group.label}>
                                <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                                    <span className={showingDesktopSideMenu ? 'inline' : 'sr-only'}>{group.label}</span>
                                </div>
                                <div className="space-y-1">
                                    {group.items.map((item) => renderSidebarLink(item, !showingDesktopSideMenu, false))}
                                </div>
                            </div>
                        ))}

                        {adminLinks.length > 0 && (
                            <div>
                                <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                                    <span className={showingDesktopSideMenu ? 'inline' : 'sr-only'}>Admin Tools</span>
                                </div>
                                <div className="space-y-1">
                                    {adminLinks.map((item) => renderSidebarLink(item, !showingDesktopSideMenu, false))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            <div
                ref={mobileSidebarRef}
                className={
                    (showingSideMenu ? 'translate-x-0' : '-translate-x-full') +
                    ' fixed inset-y-0 left-0 z-40 w-72 transform border-r border-gray-200 bg-white shadow-2xl transition-transform duration-200 ease-out lg:hidden'
                }
            >
                <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
                    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                        Procurement Menu
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowingSideMenu(false)}
                        className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                        aria-label="Close procurement menu"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="px-3 py-4">
                    <div className="space-y-5">
                        {menuGroups.map((group) => (
                            <div key={group.label}>
                                <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                                    {group.label}
                                </div>
                                <div className="space-y-1">
                                    {group.items.map((item) => renderSidebarLink(item, false, true))}
                                </div>
                            </div>
                        ))}

                        {adminLinks.length > 0 && (
                            <div>
                                <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                                    Admin Tools
                                </div>
                                <div className="space-y-1">
                                    {adminLinks.map((item) => renderSidebarLink(item, false, true))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showingSideMenu && (
                <button
                    type="button"
                    onClick={() => setShowingSideMenu(false)}
                    className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
                    aria-label="Close procurement menu overlay"
                />
            )}

            {header && (
                <header className={`bg-white shadow transition-[padding] duration-200 ${desktopSidebarWidth}`}>
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className={`transition-[padding] duration-200 ${desktopSidebarWidth}`}>{children}</main>
        </div>
    );
}
