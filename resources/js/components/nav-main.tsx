import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Fragment } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    const isActive = (href: string) => {
        return page.url.startsWith(resolveUrl(href));
    };

    return (
        <SidebarGroup className="px-2 py-0">

            <SidebarMenu>
                {items.map((item) => {
                    const hasChildren = Array.isArray(item.children) && item.children.length > 0;

                    /* ======================
                       Parent with children
                    ====================== */
                    if (hasChildren) {
                        const parentActive = item.children!.some(
                            (child) => child.href && isActive(child.href),
                        );

                        return (
                            <Fragment key={item.title}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        isActive={parentActive}
                                        tooltip={{ children: item.title }}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                {/* Children */}
                                {item.children!.map((child) => (
                                    <SidebarMenuItem
                                        key={child.title}
                                        className="ml-6"
                                    >
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive(child.href!)}
                                            tooltip={{ children: child.title }}
                                        >
                                            <Link href={child.href!}>
                                                {child.icon && <child.icon />}
                                                <span>{child.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </Fragment>
                        );
                    }

                    /* ======================
                       Single menu item
                    ====================== */
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive(item.href!)}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href!} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
