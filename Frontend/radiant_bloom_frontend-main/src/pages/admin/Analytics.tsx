import { Card } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { fetchAnalytics, selectSales, selectTopProducts, selectAnalyticsStatus, selectAnalyticsError } from "@/store/slices/analyticsSlice";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const Analytics = () => {
  const dispatch = useDispatch<AppDispatch>();
  const sales = useSelector(selectSales);
  const topProducts = useSelector(selectTopProducts);
  const status = useSelector(selectAnalyticsStatus);
  const error = useSelector(selectAnalyticsError);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAnalytics());
    }

    // Check screen size for responsiveness
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [dispatch, status]);

  const chartData = sales.map((s) => ({
    dateLabel: new Date(s.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    total: s.total,
  }));

  // Skeleton loader components
  const ChartSkeleton = () => (
    <div className="h-64 flex flex-col justify-between">
      <div className="flex justify-between items-end h-48">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="w-8 md:w-12 rounded-t-md" style={{ 
            height: `${Math.random() * 80 + 20}px` 
          }} />
        ))}
      </div>
      <div className="flex justify-between mt-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-8 md:w-12 rounded-md" />
        ))}
      </div>
    </div>
  );

  const ProductSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-6 h-6 rounded-full" />
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="text-right">
            <Skeleton className="h-4 w-16 mb-2 ml-auto" />
            <Skeleton className="h-3 w-12 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4 md:p-6 overflow-hidden">
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Sales Overview Card */}
        <Card className="p-4 md:p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Sales Overview</h3>
            <div className="text-xs bg-muted px-2 py-1 rounded-md">
              Last 7 days
            </div>
          </div>
          
          {status === "loading" ? (
            <ChartSkeleton />
          ) : status === "failed" ? (
            <div className="h-64 flex flex-col items-center justify-center text-destructive">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>{error}</p>
              <button 
                onClick={() => dispatch(fetchAnalytics())}
                className="mt-4 text-sm bg-primary text-primary-foreground py-2 px-4 rounded-md"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="h-64 overflow-hidden">
              <ChartContainer
                config={{ total: { label: "Sales", color: "hsl(var(--primary))" } }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={chartData} 
                    margin={{ 
                      left: isMobile ? 0 : 8, 
                      right: 8, 
                      top: 8, 
                      bottom: 8 
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="dateLabel" 
                      tickLine={false} 
                      axisLine={false}
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      interval={isMobile ? "preserveStartEnd" : 0}
                      tickMargin={8}
                    />
                    <YAxis 
                      width={isMobile ? 36 : 40} 
                      tickLine={false} 
                      axisLine={false}
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      tickFormatter={(value) => `Rs:${value}`}
                      tickCount={6}
                      domain={[0, 'dataMax + 10']}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent nameKey="total" labelKey="dateLabel" />}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="var(--color-total)" 
                      strokeWidth={2} 
                      dot={{ r: 4, fill: "var(--color-total)" }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}
        </Card>

        {/* Top Products Card */}
        <Card className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Top Products</h3>
            <div className="text-xs bg-muted px-2 py-1 rounded-md">
              By sales
            </div>
          </div>
          
          {status === "loading" ? (
            <ProductSkeleton />
          ) : status === "failed" ? (
            <div className="p-6 text-center text-destructive">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.slice(0, 5).map((p, i) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
                      {i + 1}
                    </span>
                    <div className="max-w-[140px] md:max-w-xs truncate">
                      <p className="font-medium text-sm truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{p.brand}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">Rs:{p.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{p.sales} sales</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Analytics;