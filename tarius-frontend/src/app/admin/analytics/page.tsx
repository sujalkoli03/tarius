// Filename: src/app/admin/analytics/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [clicks, setClicks] = useState<any[]>([]);

  // Tarius Brand Colors for Charts
  const COLORS = ['#5c6b51', '#c8b99a', '#a8a29e', '#1f211c', '#57534e', '#d4cebe'];

  useEffect(() => {
    fetchClickData();
  }, []);

  const fetchClickData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('LinkClickEvent')
      .select('*')
      .order('clickedAt', { ascending: false });

    if (error) {
      console.error('Error fetching click data:', error);
    } else {
      setClicks(data || []);
    }
    setLoading(false);
  };

  const exportToCSV = () => {
    if (clicks.length === 0) {
      alert("No click data available to export.");
      return;
    }
    
    const headers = ["Event ID", "Product Name", "Store Name", "URL", "Date Clicked"];
    const rows = clicks.map(click => [
      click.id, 
      "\"" + click.productName + "\"", 
      "\"" + click.storeName + "\"", 
      "\"" + click.url + "\"", 
      new Date(click.clickedAt).toLocaleString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tarius_partner_clicks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- DATA PROCESSORS ---

  // 1. Clicks by Platform (Pie Chart)
  const processPlatformShare = () => {
    const storeMap: Record<string, number> = {};
    clicks.forEach(click => {
      const store = click.storeName || 'Unknown';
      if (!storeMap[store]) storeMap[store] = 0;
      storeMap[store]++;
    });
    return Object.keys(storeMap).map(store => ({
      name: store,
      value: storeMap[store]
    })).sort((a, b) => b.value - a.value);
  };

  // 2. Most Clicked Products (Bar Chart)
  const processTopProducts = () => {
    const productMap: Record<string, number> = {};
    clicks.forEach(click => {
      const prod = click.productName || 'Unknown Product';
      if (!productMap[prod]) productMap[prod] = 0;
      productMap[prod]++;
    });
    return Object.keys(productMap).map(prod => ({
      name: prod,
      clicks: productMap[prod]
    })).sort((a, b) => b.clicks - a.clicks).slice(0, 5); // Top 5
  };

  // 3. Clicks by Product & Platform (Stacked Bar)
  const processHeatmap = () => {
    const heatMap: Record<string, Record<string, number>> = {};
    const allStores = new Set<string>();

    clicks.forEach(click => {
      const prod = click.productName || 'Unknown';
      const store = click.storeName || 'Unknown';
      allStores.add(store);

      if (!heatMap[prod]) heatMap[prod] = {};
      if (!heatMap[prod][store]) heatMap[prod][store] = 0;
      heatMap[prod][store]++;
    });

    const formattedData = Object.keys(heatMap).map(prod => {
      const entry: any = { name: prod };
      Array.from(allStores).forEach(store => {
        entry[store] = heatMap[prod][store] || 0;
      });
      return entry;
    });

    return {
      data: formattedData,
      stores: Array.from(allStores)
    };
  };

  // 4. Clicks by Day (Line Chart)
  const processTimeIntent = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayMap = { 'Sunday': 0, 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0, 'Friday': 0, 'Saturday': 0 };
    
    clicks.forEach(click => {
      const date = new Date(click.clickedAt);
      const dayName = days[date.getDay()];
      dayMap[dayName as keyof typeof dayMap]++;
    });

    return Object.keys(dayMap).map(day => ({
      day: day.substring(0, 3), // Sun, Mon, Tue...
      clicks: dayMap[day as keyof typeof dayMap]
    }));
  };

  // 5. Recent Clicks (Last 24 Hours Surges)
  const processVelocity = () => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    
    const recentClicks = clicks.filter(c => new Date(c.clickedAt) >= twentyFourHoursAgo);
    
    const velocityMap: Record<string, { store: string, count: number }> = {};
    recentClicks.forEach(click => {
      const key = click.productName + "|" + click.storeName;
      if (!velocityMap[key]) {
        velocityMap[key] = { store: click.storeName, count: 0 };
      }
      velocityMap[key].count++;
    });

    return Object.keys(velocityMap).map(key => {
      const prodName = key.split("|")[0];
      return {
        productName: prodName,
        storeName: velocityMap[key].store,
        count: velocityMap[key].count
      };
    }).sort((a, b) => b.count - a.count); 
  };


  // --- KPI CALCULATIONS ---
  const totalClicks = clicks.length;
  const platformData = processPlatformShare();
  const topPlatform = platformData.length > 0 ? platformData[0].name : 'N/A';
  const heatmapResult = processHeatmap();
  const velocityData = processVelocity();
  const activeSurges = velocityData.filter(v => v.count > 0).length; // Products clicked in last 24h

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="w-10 h-10 rounded-full border-2 border-[var(--tarius-border)] border-t-[var(--tarius-olive)] animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--tarius-graphite)]">
            Loading Analytics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-[var(--tarius-graphite)] pb-24">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[var(--tarius-border)] pb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--tarius-olive)] mb-3">
            Partner Link Tracking
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-[var(--tarius-graphite)]">
            Analytics Dashboard
          </h1>
        </div>
        <button
          onClick={exportToCSV}
          className="px-6 py-3 border border-[var(--tarius-olive)] text-[var(--tarius-olive)] text-[10px] uppercase tracking-widest bg-white hover:bg-[var(--tarius-olive)] hover:text-white transition-all rounded-sm shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Export Click Data (CSV)
        </button>
      </div>

      {/* KPI Stat Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border border-[var(--tarius-border)] p-6 rounded-sm shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-[var(--tarius-graphite)]"></div>
          <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-2">Total Clicks</p>
          <p className="font-display text-4xl text-[var(--tarius-graphite)]">{totalClicks}</p>
        </div>
        <div className="bg-white border border-[var(--tarius-border)] p-6 rounded-sm shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-[var(--tarius-olive)]"></div>
          <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-2">Top Platform</p>
          <p className="font-display text-4xl text-[var(--tarius-graphite)]">{topPlatform}</p>
        </div>
        <div className="bg-white border border-[var(--tarius-border)] p-6 rounded-sm shadow-sm relative overflow-hidden">
          <div className={"absolute top-0 right-0 w-2 h-full " + (activeSurges > 0 ? "bg-amber-500" : "bg-stone-300")}></div>
          <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-2">Recent Activity (24H)</p>
          <p className="font-display text-4xl text-[var(--tarius-graphite)]">{activeSurges}</p>
        </div>
      </div>

      {/* Charts Grid - Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Clicks by Platform (Pie Chart) */}
        <div className="bg-white border border-[var(--tarius-border)] p-8 rounded-sm shadow-sm">
          <h3 className="font-display text-2xl text-[var(--tarius-graphite)] mb-2">Clicks by Platform</h3>
          <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-6 border-b border-[var(--tarius-border)] pb-2">Traffic Share Percentage</p>
          <div className="h-[300px] w-full">
            {clicks.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={"cell-" + index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1f211c', borderColor: '#1f211c', color: '#fff', fontSize: '12px', borderRadius: '4px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-stone-400 text-sm">No click data available</div>
            )}
          </div>
        </div>

        {/* Most Clicked Products (Bar Chart) */}
        <div className="bg-white border border-[var(--tarius-border)] p-8 rounded-sm shadow-sm">
          <h3 className="font-display text-2xl text-[var(--tarius-graphite)] mb-2">Most Clicked Products</h3>
          <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-6 border-b border-[var(--tarius-border)] pb-2">Top 5 Products</p>
          <div className="h-[300px] w-full">
            {clicks.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processTopProducts()} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" horizontal={false} />
                  <XAxis type="number" stroke="#a8a29e" fontSize={10} />
                  <YAxis dataKey="name" type="category" stroke="#a8a29e" fontSize={10} width={100} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f5f5f4' }}
                    contentStyle={{ backgroundColor: '#1f211c', borderColor: '#c8b99a', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="clicks" fill="#c8b99a" radius={[0, 4, 4, 0]}>
                    {processTopProducts().map((entry, index) => (
                      <Cell key={"cell-" + index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-stone-400 text-sm">No click data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Grid - Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Clicks by Product & Platform (Stacked Bar) */}
        <div className="bg-white border border-[var(--tarius-border)] p-8 rounded-sm shadow-sm">
          <h3 className="font-display text-2xl text-[var(--tarius-graphite)] mb-2">Clicks by Product & Platform</h3>
          <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-6 border-b border-[var(--tarius-border)] pb-2">Detailed Breakdown</p>
          <div className="h-[300px] w-full">
            {clicks.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={heatmapResult.data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                  <XAxis dataKey="name" stroke="#a8a29e" fontSize={10} tickMargin={10} />
                  <YAxis stroke="#a8a29e" fontSize={10} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f5f5f4' }}
                    contentStyle={{ backgroundColor: '#1f211c', borderColor: '#c8b99a', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  {heatmapResult.stores.map((store, index) => (
                    <Bar key={store} dataKey={store} stackId="a" fill={COLORS[index % COLORS.length]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-stone-400 text-sm">No click data available</div>
            )}
          </div>
        </div>

        {/* Clicks by Day (Line Chart) */}
        <div className="bg-white border border-[var(--tarius-border)] p-8 rounded-sm shadow-sm">
          <h3 className="font-display text-2xl text-[var(--tarius-graphite)] mb-2">Clicks by Day</h3>
          <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-6 border-b border-[var(--tarius-border)] pb-2">Weekly Traffic Trends</p>
          <div className="h-[300px] w-full">
            {clicks.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processTimeIntent()} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                  <XAxis dataKey="day" stroke="#a8a29e" fontSize={10} tickMargin={10} />
                  <YAxis stroke="#a8a29e" fontSize={10} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1f211c', borderColor: '#c8b99a', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#c8b99a' }}
                  />
                  <Line type="monotone" dataKey="clicks" stroke="#5c6b51" strokeWidth={3} dot={{ r: 4, fill: '#5c6b51' }} activeDot={{ r: 6, fill: '#c8b99a' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-stone-400 text-sm">No click data available</div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Row - Recent Clicks */}
      <div className="bg-white border border-[var(--tarius-border)] p-8 rounded-sm shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-2xl text-[var(--tarius-graphite)]">Recent Clicks (Last 24 Hours)</h3>
          {activeSurges > 0 && (
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          )}
        </div>
        <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-6 border-b border-[var(--tarius-border)] pb-2">Latest Activity Breakdown</p>
        
        <div className="overflow-y-auto max-h-[300px] pr-2">
          {velocityData.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="pb-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal border-b border-[var(--tarius-border)]">Product</th>
                  <th className="pb-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal border-b border-[var(--tarius-border)]">Platform</th>
                  <th className="pb-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal border-b border-[var(--tarius-border)] text-right">Click Count</th>
                </tr>
              </thead>
              <tbody>
                {velocityData.map((item, index) => (
                  <tr key={index} className="hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-0">
                    <td className="py-4">
                      <p className="text-sm font-medium text-[var(--tarius-graphite)]">{item.productName}</p>
                    </td>
                    <td className="py-4 text-xs text-stone-500">
                      <span className="px-2 py-1 bg-stone-100 border border-stone-200 rounded text-stone-600">
                        {item.storeName}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <span className={"px-3 py-1 rounded-sm text-xs font-bold " + (item.count > 10 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}>
                        {item.count} Clicks
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex h-32 items-center justify-center flex-col gap-3">
              <span className="w-10 h-10 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </span>
              <p className="text-sm text-stone-500">No clicks recorded in the last 24 hours.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}