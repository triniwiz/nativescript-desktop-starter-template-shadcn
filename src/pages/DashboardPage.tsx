import * as React from 'react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AreaChart,
  BarChart,
  ChartContainer,
  ChartLegend,
  ChartTable,
  formatNumber,
  type ChartConfig,
} from '@/components/ui/chart';

const stats = [
  { label: 'Total revenue', value: '$45,231.89', change: '+20.1% from last month' },
  { label: 'Subscriptions', value: '+2,350', change: '+180.1% from last month' },
  { label: 'Sales', value: '+12,234', change: '+19% from last month' },
  { label: 'Active now', value: '+573', change: '+201 since last hour' },
];

const sales = [
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+$1,999.00', initials: 'OM' },
  { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00', initials: 'JL' },
  { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+$299.00', initials: 'IN' },
  { name: 'William Kim', email: 'will@email.com', amount: '+$99.00', initials: 'WK' },
  { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '+$39.00', initials: 'SD' },
];

const statuses = ['Paid', 'Pending', 'Unpaid', 'Refunded'] as const;
const orders = Array.from({ length: 20 }, (_, i) => ({
  id: `INV${String(i + 1).padStart(3, '0')}`,
  customer: sales[i % sales.length].name,
  status: statuses[i % statuses.length],
  amount: `$${(((i * 37) % 450) + 50).toFixed(2)}`,
}));

const visitors = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
];

const visitorsConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' },
} satisfies ChartConfig;

const revenue = [
  { month: 'Jan', revenue: 18200 },
  { month: 'Feb', revenue: 21400 },
  { month: 'Mar', revenue: 19800 },
  { month: 'Apr', revenue: 26100 },
  { month: 'May', revenue: 31900 },
  { month: 'Jun', revenue: 45231 },
];

const revenueConfig = {
  revenue: { label: 'Revenue', color: 'var(--chart-1)' },
} satisfies ChartConfig;

const dollars = (value: number) => (value >= 1000 ? `$${formatNumber(value / 1000)}k` : `$${formatNumber(value)}`);

/** A chart with a Table tab beside it, for reading exact values. */
function ChartCard({
  title,
  description,
  children,
  table,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  table: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart">
          <TabsList>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
          <TabsContent value="chart" className="pt-2">
            {children}
          </TabsContent>
          <TabsContent value="table" className="pt-2">
            {table}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

const PAGE_SIZE = 5;

const statusVariant = {
  Paid: 'default',
  Pending: 'secondary',
  Unpaid: 'destructive',
  Refunded: 'outline',
} as const;

function Orders() {
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(orders.length / PAGE_SIZE);
  const rows = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>Recent orders from your store.</CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <div className="flex flex-1 flex-row p-2">
                  <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                </div>
                <TableCell className="text-right">{order.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setPage(Math.max(1, page - 1))} />
            </PaginationItem>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <PaginationItem key={n}>
                <PaginationLink isActive={n === page} onClick={() => setPage(n)}>
                  {n}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => setPage(Math.min(pageCount, page + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Here's what's happening with your store today.</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="gap-6 pt-2">
          {/* As many 220-wide columns as fit */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220,1fr))] gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="gap-2">
                <CardHeader>
                  <CardDescription>{stat.label}</CardDescription>
                  <span className="text-2xl font-bold text-card-foreground">{stat.value}</span>
                </CardHeader>
                <CardContent>
                  <span className="text-xs text-muted-foreground">{stat.change}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(320,1fr))] gap-4">
            <ChartCard
              title="Visitors"
              description="January – June 2026"
              table={<ChartTable config={visitorsConfig} data={visitors} xKey="month" xLabel="Month" />}
            >
              <ChartContainer config={visitorsConfig} className="h-56">
                <BarChart data={visitors} xKey="month" />
              </ChartContainer>
              <ChartLegend config={visitorsConfig} />
            </ChartCard>
            <ChartCard
              title="Revenue"
              description="Up 41.8% on May"
              table={
                <ChartTable
                  config={revenueConfig}
                  data={revenue}
                  xKey="month"
                  xLabel="Month"
                  valueFormatter={(v) => `$${formatNumber(v)}`}
                />
              }
            >
              <ChartContainer config={revenueConfig} className="h-56">
                <AreaChart data={revenue} xKey="month" valueFormatter={dollars} />
              </ChartContainer>
            </ChartCard>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent sales</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <ItemGroup>
                {sales.map((sale) => (
                  <Item key={sale.email} size="sm" className="px-0">
                    <ItemMedia>
                      <Avatar className="size-9">
                        <AvatarFallback>{sale.initials}</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{sale.name}</ItemTitle>
                      <ItemDescription>{sale.email}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <span className="text-sm font-medium text-foreground">{sale.amount}</span>
                    </ItemActions>
                  </Item>
                ))}
              </ItemGroup>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="pt-2">
          <Orders />
        </TabsContent>
      </Tabs>
    </>
  );
}
