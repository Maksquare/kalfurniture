"use client";

import { useProducts } from "@/context/ProductContext";
import { PiPackage, PiTag, PiMoney, PiChartLineUp } from "react-icons/pi";

export default function AdminDashboard() {
  const { products, isLoaded } = useProducts();

  if (!isLoaded) return <div className="p-10 font-secondary text-secondary/60">Loading Dashboard...</div>;

  const totalProducts = products.length;
  
  // Calculate average price
  const avgPrice = totalProducts > 0 
    ? products.reduce((acc, p) => acc + p.price, 0) / totalProducts
    : 0;

  // Count unique categories
  const categories = [...new Set(products.map(p => p.category))].length;

  const stats = [
    { title: "Total Products", value: totalProducts, icon: PiPackage },
    { title: "Categories", value: categories, icon: PiTag },
    { title: "Avg. Price", value: `${Math.round(avgPrice).toLocaleString()} ETB`, icon: PiMoney },
    { title: "Sales Growth", value: "+12.5%", icon: PiChartLineUp, highlight: true },
  ];

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="font-primary text-[32px] text-secondary leading-tight mb-2">
          Dashboard <em className="text-gold not-italic font-semibold">Overview</em>
        </h1>
        <p className="font-secondary text-[14px] text-secondary/60">
          Welcome back to the Sofazone Furniture admin panel.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-secondary/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.highlight ? 'bg-gold/10 text-gold' : 'bg-secondary/5 text-secondary/60'}`}>
                  <Icon className="text-2xl" />
                </div>
              </div>
              <h3 className="font-secondary text-[12px] font-bold tracking-widest uppercase text-secondary/50 mb-1">
                {stat.title}
              </h3>
              <p className="font-primary text-[28px] text-secondary font-medium">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-secondary/10 rounded-2xl p-8 shadow-sm">
        <h2 className="font-primary text-[24px] text-secondary mb-6">Recent Activity</h2>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-secondary/5 rounded-full flex items-center justify-center mb-4 text-secondary/40">
            <PiChartLineUp className="text-3xl" />
          </div>
          <p className="font-secondary text-[14px] text-secondary/60 max-w-sm">
            Activity tracking will be available when a database is connected. For now, head over to the Products tab to manage inventory.
          </p>
        </div>
      </div>
    </div>
  );
}
