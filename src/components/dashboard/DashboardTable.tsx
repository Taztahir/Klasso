'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface DashboardTableWrapperProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}

export function DashboardTableWrapper({ title, description, action, children }: DashboardTableWrapperProps) {
    return (
        <Card className="border-2 border-brandBlack bg-white shadow-[4px_4px_0px_0px_rgba(13,14,20,1)] rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-brandBlack pb-4 bg-cream">
                <div>
                    <CardTitle className="text-lg font-black text-brandBlack">{title}</CardTitle>
                    {description && (
                        <CardDescription className="text-xs font-semibold text-brandBlack/60 mt-1">
                            {description}
                        </CardDescription>
                    )}
                </div>
                {action && <div className="shrink-0">{action}</div>}
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
                {children}
            </CardContent>
        </Card>
    );
}
