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
                    ? '/client/projects' // Client goes straight to projects
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
                { title: 'Transaction', href: '/superadmin/transactions' },
                { title: 'Logs', href: '/superadmin/trackingdelivery' },
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

    // ======== SuperAdmin User Footer Nav (near profile) ========
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

    // ======== Admin Top Nav ========
    const AdminTopNav: NavItem[] = [
        {
            title: 'Customer',
            icon: UsersRound,
            children: [
                { title: 'Manage Customer', href: '/admin/customers' },
            ],
        },
        {
            title: 'Records',
            icon: Cuboid,
            children: [
                { title: 'Transaction', href: '/admin/projects' },
                { title: 'Logs', href: '/admin/trackingdelivery' },
            ],
        },
        {
            title: 'Resources',
            icon: UsersRound,
            children: [
                { title: 'Item Design', href: '/admin/itemdesign' },
                { title: 'Equipment', href: '/admin/equipment' },
                { title: 'Employees', href: '/admin/employees' },
            ],
        },
    ];

    // ======== Admin User Footer Nav (near profile) ========
    const AdminFooterNav: NavItem[] = [
        {
            title: 'Admin User',
            icon: IdCard,
            children: [
                { title: 'Manage Users', href: '/admin/users' },
                { title: 'Manage Department', href: '/admin/department' },
                { title: 'Reviews', href: '/admin/reviews' },
            ],
        },
    ];

    // ======== Client Top Nav (Records Section) ========
    const clientTopNav: NavItem[] = [
        {
            title: 'Records',
            icon: Cuboid,
            children: [
                { title: 'Transaction', href: '/client/projects' },
            ],
        },
    ];

    // ======== User PRD Top Nav (Records Section) ========
    const userPRDTopNav: NavItem[] = [
        {
            title: 'Records',
            icon: Cuboid,
            children: [
                { title: 'Transaction', href: '/user/projects' },
            ],
        },
    ];

    // ======== Role-Based Top Nav ========
    let roleBasedTopNav: NavItem[] = [...mainNavItems];

    if (userRole === 'superadmin') {
        roleBasedTopNav = [...roleBasedTopNav, ...superAdminTopNav];
    } else if (userRole === 'admin') {
        roleBasedTopNav = [...roleBasedTopNav, ...AdminTopNav];
    } else if (userRole === 'client') {
        roleBasedTopNav = [...roleBasedTopNav, ...clientTopNav]; // Use Records section
    } else if (userRole === 'user' && userDepartment === 'PRD Department') {
        roleBasedTopNav = [...roleBasedTopNav, ...userPRDTopNav];
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
                {userRole === 'admin' && <NavMain items={AdminFooterNav} />}
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}