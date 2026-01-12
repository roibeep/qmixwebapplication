import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthSimpleLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthSimpleLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    {/* Logo */}
                    <div className="flex flex-col items-center gap-4">
                        <Link href={home()} className="flex items-center gap-2">
                            <img
                                src="/images/q-mix-logo.png"
                                alt="QMIX Concrete 2GO"
                                className="h-16 w-auto"
                            />
                        </Link>

                        {/* Title + Description */}
                        {(title || description) && (
                            <div className="space-y-1 text-center">
                                {title && (
                                    <h1 className="text-xl font-semibold">
                                        {title}
                                    </h1>
                                )}
                                {description && (
                                    <p className="text-sm text-muted-foreground">
                                        {description}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Page content */}
                    {children}
                </div>
            </div>
        </div>
    );
}
