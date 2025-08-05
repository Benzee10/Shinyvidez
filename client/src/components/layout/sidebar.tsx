import { Link, useLocation } from "wouter";
import { Home, TrendingUp, Clock, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/recent", label: "Recent", icon: Clock },
  { href: "/favorites", label: "Favorites", icon: Heart },
];

const categories = [
  { name: "Technology", slug: "technology" },
  { name: "Education", slug: "education" },
  { name: "Entertainment", slug: "entertainment" },
  { name: "Photography", slug: "photography" },
  { name: "Cooking", slug: "cooking" },
  { name: "Fitness", slug: "fitness" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <nav className="flex-1 px-4 py-6 space-y-2">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-red-500 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Categories */}
        <div className="pt-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Categories
          </h3>
          <div className="mt-2 space-y-1">
            {categories.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`}>
                <div
                  className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  data-testid={`category-${category.slug}`}
                >
                  # {category.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}
