import { useEffect, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAnalytics, selectAnalyticsError, selectAnalyticsStatus, selectSales, selectTopProducts } from "@/store/slices/analyticsSlice";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#f97316", "#22c55e", "#60a5fa", "#e879f9", "#f59e0b"]; // matches elegant theme accents

const Analytics = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAnalyticsStatus);
  const error = useAppSelector(selectAnalyticsError);
  const sales = useAppSelector(selectSales);
  const topProducts = useAppSelector(selectTopProducts);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAnalytics());
    }
  }, [dispatch, status]);

  const salesChartData = useMemo(
    () =>
      sales.map((s) => ({
        date: new Date(s.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        total: s.total,
      })),
    [sales]
  );

  const topProductsBarData = useMemo(
    () => topProducts.map((p) => ({ name: p.name.split(" ").slice(0, 2).join(" "), sales: p.sales })),
    [topProducts]
  );

  const pieData = useMemo(
    () => topProducts.map((p) => ({ name: p.name, value: p.sales })),
    [topProducts]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Analytics Overview</h1>
          <p className="text-muted-foreground mt-1">Sales performance, top products, and trends</p>
        </div>

        {/* Status / Error */}
        {status === "loading" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="h-[360px] animate-pulse" />
            <Card className="h-[360px] animate-pulse" />
            <Card className="h-[360px] animate-pulse" />
          </div>
        )}
        {status === "failed" && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Failed to load analytics</CardTitle>
              <CardDescription className="text-destructive">{error}</CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
          {/* Sales Overview - Line Chart */}
          <Card className="2xl:col-span-2">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Last 12 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  total: { label: "Sales", color: "hsl(var(--secondary))" },
                  date: { label: "Date" },
                }}
                className="h-[320px]"
              >
                <LineChart data={salesChartData} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="total" labelKey="date" />} />
                  <Line type="monotone" dataKey="total" stroke="var(--color-total)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Top Products - List */}
          <Card>
            <CardHeader>
              <CardTitle>Top-Selling Products</CardTitle>
              <CardDescription>By units sold</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((p, idx) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <Badge variant="secondary">#{idx + 1}</Badge>
                        <span>{p.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{p.brand}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{p.sales.toLocaleString()} sold</div>
                      <div className="text-sm text-muted-foreground">Rs:{p.price.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart - Top Products */}
          <Card className="2xl:col-span-2">
            <CardHeader>
              <CardTitle>Top Products (Bar)</CardTitle>
              <CardDescription>Sales per product</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sales: { label: "Units Sold", color: "hsl(var(--secondary))" },
                  name: { label: "Product" },
                }}
                className="h-[320px]"
              >
                <BarChart data={topProductsBarData} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="sales" labelKey="name" />} />
                  <Bar dataKey="sales" fill="var(--color-sales)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Pie Chart - Sales Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Breakdown</CardTitle>
              <CardDescription>Share by product</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent />} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;
