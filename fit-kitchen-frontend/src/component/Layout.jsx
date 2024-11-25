import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Layout({ children }) {
    const { currentUser, logout } = useAuth();
    const location = useLocation();

    const navigation = [
        { name: 'Home', href: '/', current: location.pathname === '/' },
        { name: 'About', href: '/about', current: location.pathname === '/about' },
        { name: 'Coming Soon', href: '/coming-soon', current: location.pathname === '/coming-soon' },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Disclosure as="nav" className="bg-white shadow">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 justify-between">
                                <div className="flex">
                                    <div className="flex flex-shrink-0 items-center">
                                        <img
                                            className="h-8 w-auto"
                                            src="/logo.svg"
                                            alt="FitKitchen"
                                        />
                                    </div>
                                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                className={classNames(
                                                    item.current
                                                        ? 'border-blue-500 text-gray-900'
                                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                                    'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                                    {currentUser ? (
                                        <Menu as="div" className="relative ml-3">
                                            <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                                <span className="sr-only">Open user menu</span>
                                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                    {currentUser.username.charAt(0).toUpperCase()}
                                                </div>
                                            </Menu.Button>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-200"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={logout}
                                                                className={classNames(
                                                                    active ? 'bg-gray-100' : '',
                                                                    'block px-4 py-2 text-sm text-gray-700 w-full text-left'
                                                                )}
                                                            >
                                                                Sign out
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    ) : (
                                        <Link
                                            to="/login"
                                            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                        >
                                            Sign in
                                        </Link>
                                    )}
                                </div>

                                <div className="-mr-2 flex items-center sm:hidden">
                                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="sm:hidden">
                            <div className="space-y-1 pb-3 pt-2">
                                {navigation.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as={Link}
                                        to={item.href}
                                        className={classNames(
                                            item.current
                                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700',
                                            'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                                        )}
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 pb-3 pt-4">
                                {currentUser ? (
                                    <div className="space-y-1">
                                        <div className="px-4 py-2">
                                            <p className="text-base font-medium text-gray-800">{currentUser.username}</p>
                                            <p className="text-sm font-medium text-gray-500">{currentUser.email}</p>
                                        </div>
                                        <Disclosure.Button
                                            as="button"
                                            onClick={logout}
                                            className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                        >
                                            Sign out
                                        </Disclosure.Button>
                                    </div>
                                ) : (
                                    <div className="px-4">
                                        <Link
                                            to="/login"
                                            className="flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-blue-500"
                                        >
                                            Sign in
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>

            <main className="py-10">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}