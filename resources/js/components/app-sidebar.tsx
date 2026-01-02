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
import { BookOpen, Star, IdCard, Archive, Cuboid, UsersRound, LayoutGrid, Footprints } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
const {auth} = usePage().props;
const userRole = auth?.user?.role || 'user';
const userDepartment = auth.user?.department?.name;;

/* ======== All Users ======== */
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];
/* ======== Admin ======== */
const adminNavItems: NavItem[] = [
    {
        title: 'Users',
        href: '/admin/users',
        icon: UsersRound,
    },
];
const adminProjectNavItems: NavItem[] = [
    {
        title: 'Manage Projects',
        href: '/admin/projects',
        icon: Cuboid,
    },
];
const adminDepartmentNavItems: NavItem[] = [
    {
        title: 'Departments',
        href: '/admin/department',
        icon: IdCard,
    },
];
/* ======== Clients ======== */
const clientNavItems: NavItem[] = [
    {
        title: 'Manage Delivery',
        href: '/client/projects',
        icon: Star,
    },
];
const clientFormNavItems: NavItem[] = [
    {
        title: 'Reviews',
        href: '/client/reviews',
        icon: Archive,
    },
];
/* ======== SuperAdmin ======== */
const superAdminUserNavItems: NavItem[] = [
    {
        title: 'Manage Users',
        href: '/superadmin/users',
        icon: UsersRound,
    },
];
const superAdminNavItems: NavItem[] = [
    {
        title: 'Manage Department',
        href: '/superadmin/department',
        icon: IdCard,
    },
];
const superAdminProjectNavItems: NavItem[] = [
    {
        title: 'Manage Projects',
        href: '/superadmin/projects',
        icon: Cuboid,
    },
];
const superAdminTrackingNavItems: NavItem[] = [
    {
        title: 'Tracking Delivery',
        href: '/superadmin/trackingdelivery',
        icon: Footprints,
    },
];
const superAdminFormNavItems: NavItem[] = [
    {
        title: 'Reviews',
        href: '/superadmin/reviews',
        icon: Archive,
    },
];
/* ======== Users ======== */
const userProjectNavItems: NavItem[] = [
    {
        title: 'Manage Projects',
        href: '/user/projects',
        icon: Cuboid,
    },
];

    let roleBasedNavItems = [...mainNavItems];
    if(userRole === 'admin')
    {
        roleBasedNavItems = [...roleBasedNavItems,...adminNavItems,...adminDepartmentNavItems,...adminProjectNavItems];
    }
    if(userRole === 'client')
    {
        roleBasedNavItems = [...roleBasedNavItems,...clientNavItems,...clientFormNavItems];
    }
    if(userRole === 'user')
    {
        roleBasedNavItems = [...roleBasedNavItems,...userProjectNavItems];
    }
    if (userRole === 'user' && userDepartment === 'PRD Department') 
    {
        roleBasedNavItems = [...roleBasedNavItems,...userProjectNavItems];
    }
    if(userRole === 'superadmin')
    {
        roleBasedNavItems = [...roleBasedNavItems,...superAdminUserNavItems,...superAdminNavItems,...superAdminProjectNavItems,...superAdminFormNavItems];
    }
const footerNavItems: NavItem[] = [

];
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

            <SidebarContent>
                <NavMain items={roleBasedNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
