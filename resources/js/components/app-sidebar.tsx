import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    UsersRound,
    IdCard,
    Cuboid,
    Footprints,
    Archive,
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role || 'user';
    const userDepartment = auth.user?.department?.name;

    // ======== Main Nav (All Users) ========
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href:
                userRole === 'superadmin'
                    ? '/superadmin/dashboard'
                    : userRole === 'admin'
                    ? '/admin/dashboard'
                    : userRole === 'client'
                    ? '/client/dashboard'
                    : userRole === 'user'
                    ? '/user/dashboard'
                    : dashboard(),
            icon: LayoutGrid,
        },
    ];

    // ======== SuperAdmin Top Nav ========
    const superAdminTopNav: NavItem[] = [
        {
            title: 'Customer',
            icon: UsersRound,
            children: [
                { title: 'Manage Customer', href: '/superadmin/customers' },
            ],
        },
        {
            title: 'Records',
            icon: Cuboid,
            children: [
                { title: 'Project', href: '/superadmin/projects' },
                { title: 'Logs', href: '/superadmin/trackingdelivery' },
                { title: 'Transaction', href: '/superadmin/transactions' },
            ],
        },
        {
            title: 'Resources',
            icon: UsersRound,
            children: [
                { title: 'Item Design', href: '/superadmin/itemdesign' },
                { title: 'Equipment', href: '/superadmin/equipment' },
                { title: 'Employees', href: '/superadmin/employees' },
            ],
        },
    ];

    // ======== Admin User Footer Nav (near profile) ========
    const superAdminFooterNav: NavItem[] = [
        {
            title: 'Admin User',
            icon: IdCard,
            children: [
                { title: 'Manage Users', href: '/superadmin/users' },
                { title: 'Manage Department', href: '/superadmin/department' },
                { title: 'Reviews', href: '/superadmin/reviews' },
            ],
        },
    ];

    // ======== Other Roles ========
    const adminNavItems: NavItem[] = [
        { title: 'Users', href: '/admin/users', icon: UsersRound },
        { title: 'Departments', href: '/admin/department', icon: IdCard },
        { title: 'Projects', href: '/admin/projects', icon: Cuboid },
    ];

    const clientNavItems: NavItem[] = [
        { title: 'Manage Delivery', href: '/client/projects', icon: Cuboid },
        { title: 'Reviews', href: '/client/reviews', icon: Archive },
    ];

    const userProjectNavItems: NavItem[] = [
        { title: 'Manage Projects', href: '/user/projects', icon: Cuboid },
    ];

    // ======== Role-Based Top Nav ========
    let roleBasedTopNav: NavItem[] = [...mainNavItems];

    if (userRole === 'superadmin') {
        roleBasedTopNav = [...roleBasedTopNav, ...superAdminTopNav];
    } else if (userRole === 'admin') {
        roleBasedTopNav = [...roleBasedTopNav, ...adminNavItems];
    } else if (userRole === 'client') {
        roleBasedTopNav = [...roleBasedTopNav, ...clientNavItems];
    } else if (userRole === 'user' && userDepartment === 'PRD Department') {
        roleBasedTopNav = [...roleBasedTopNav, ...userProjectNavItems];
    }

    const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* ======== Scrollable Top Nav ======== */}
            <SidebarContent>
                <NavMain items={roleBasedTopNav} />
            </SidebarContent>

            {/* ======== Footer Nav near profile ======== */}
            <SidebarFooter className="flex flex-col gap-2">
                {userRole === 'superadmin' && <NavMain items={superAdminFooterNav} />}
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
