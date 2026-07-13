import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 lg:p-8">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Procurement shortcuts</h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    Jump straight into the three procurement forms from here.
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <Link
                                    href="/create-pr"
                                    className="group rounded-2xl border border-gray-200 bg-gray-50 p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50"
                                >
                                    <div className="text-sm font-medium uppercase tracking-wide text-indigo-600">
                                        Purchase Request
                                    </div>
                                    <div className="mt-2 text-base font-semibold text-gray-900 group-hover:text-indigo-900">
                                        Create or retrieve PR records
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        Open the Purchase Request form to start a new record or edit an existing one.
                                    </div>
                                </Link>

                                <Link
                                    href="/create-rfq"
                                    className="group rounded-2xl border border-gray-200 bg-gray-50 p-5 transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50"
                                >
                                    <div className="text-sm font-medium uppercase tracking-wide text-amber-700">
                                        Request for Quotation
                                    </div>
                                    <div className="mt-2 text-base font-semibold text-gray-900 group-hover:text-amber-900">
                                        Prepare the RFQ document
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        Generate the RFQ form and produce the downloadable PDF.
                                    </div>
                                </Link>

                                <Link
                                    href="/create-ppmp"
                                    className="group rounded-2xl border border-gray-200 bg-gray-50 p-5 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
                                >
                                    <div className="text-sm font-medium uppercase tracking-wide text-emerald-700">
                                        PPMP
                                    </div>
                                    <div className="mt-2 text-base font-semibold text-gray-900 group-hover:text-emerald-900">
                                        Create or retrieve PPMP records
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        Open the PPMP form to add, update, or download procurement plans.
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
