import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const currentPath = usePage().url.split('?')[0];

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [showingSideMenu, setShowingSideMenu] = useState(false);

    const procurementLinks = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/create-pr', label: 'Create PR' },
        { href: '/create-rfq', label: 'Create RFQ' },
        { href: '/rfqs', label: 'Manage RFQs' },
        { href: '/create-ppmp', label: 'Create PPMP' },
        { href: '/prs', label: 'Manage PRs' },
        { href: '/ppmps', label: 'Manage PPMPs' },
    ];
    const adminLinks = user?.is_admin ? [{ href: '/users', label: 'Manage Users' }] : [];

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white lg:pl-72">
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

            <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-gray-200 bg-white shadow-sm lg:flex lg:flex-col">
                <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
                    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                        Procurement Menu
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-4">
                    <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                        Quick Links
                    </div>
                    <div className="space-y-1">
                        {procurementLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-gray-100 hover:text-gray-900 ${currentPath === item.href ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {adminLinks.length > 0 && (
                        <>
                            <div className="mb-3 mt-6 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                                Admin Tools
                            </div>
                            <div className="space-y-1">
                                {adminLinks.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`block rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-gray-100 hover:text-gray-900 ${currentPath === item.href ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </aside>

            <div
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
                    <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                        Quick Links
                    </div>
                    <div className="space-y-1">
                        {procurementLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setShowingSideMenu(false)}
                                className={`block rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-gray-100 hover:text-gray-900 ${currentPath === item.href ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {adminLinks.length > 0 && (
                        <>
                            <div className="mb-3 mt-6 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                                Admin Tools
                            </div>
                            <div className="space-y-1">
                                {adminLinks.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setShowingSideMenu(false)}
                                        className={`block rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-gray-100 hover:text-gray-900 ${currentPath === item.href ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
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
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="lg:pl-72">{children}</main>
        </div>
    );
}
