import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  Users,
  Leaf,
  ShoppingBag,
  Truck,
  Activity,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAdminDashboardStats } from "@/lib/actions/admin.actions";

export default async function AdminDashboard() {
  // Fetch dashboard data using the server action
  const dashboardData = await getAdminDashboardStats();

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Download Reports</Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalUsers}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="flex gap-1 items-center text-green-500">
                <ArrowUpRight className="h-3 w-3" />
                <span>12%</span>
              </div>
              <span className="ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalCrops}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="flex gap-1 items-center text-green-500">
                <ArrowUpRight className="h-3 w-3" />
                <span>8%</span>
              </div>
              <span className="ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.totalOrders}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="flex gap-1 items-center text-green-500">
                <ArrowUpRight className="h-3 w-3" />
                <span>19%</span>
              </div>
              <span className="ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.totalDeliveries}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="flex gap-1 items-center text-green-500">
                <ArrowUpRight className="h-3 w-3" />
                <span>10%</span>
              </div>
              <span className="ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="crops">Crops</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* User Distribution Card */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown of users by role</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span>Customers</span>
                      </div>
                      <span className="font-semibold">
                        {dashboardData.customerCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>Farmers</span>
                      </div>
                      <span className="font-semibold">
                        {dashboardData.farmerCount}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        <span>Drivers</span>
                      </div>
                      <span className="font-semibold">
                        {dashboardData.driverCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        <span>Admins</span>
                      </div>
                      <span className="font-semibold">
                        {dashboardData.adminCount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Link href="/dashboard/admin/users">
                    <Button variant="outline" size="sm" className="gap-1">
                      View All Users
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Activity Overview */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
                <CardDescription>
                  Platform activity in the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        New User Registrations
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {dashboardData.weeklyActivity.newUsers} new users this
                        week
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        New Orders
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {dashboardData.weeklyActivity.newOrders} new orders this
                        week
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Leaf className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        New Crops Listed
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {dashboardData.weeklyActivity.newCrops} new crops this
                        week
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Completed Deliveries
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {dashboardData.weeklyActivity.completedDeliveries}{" "}
                        deliveries completed this week
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Monthly Orders</CardTitle>
                <CardDescription>
                  Order volume trends for the past year
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] flex items-end justify-between gap-2">
                  {dashboardData.chartData.orders.map((value, i) => {
                    const maxValue = Math.max(
                      ...dashboardData.chartData.orders
                    );
                    const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    return (
                      <div
                        key={i}
                        className="bg-primary/10 hover:bg-primary/20 rounded-t w-full transition-all"
                        style={{ height: `${height}%` }}
                      ></div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Crops Listed</CardTitle>
                <CardDescription>
                  New crops listed over the past year
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] flex items-end justify-between gap-2">
                  {dashboardData.chartData.crops.map((value, i) => {
                    const maxValue = Math.max(...dashboardData.chartData.crops);
                    const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    return (
                      <div
                        key={i}
                        className="bg-green-500/10 hover:bg-green-500/20 rounded-t w-full transition-all"
                        style={{ height: `${height}%` }}
                      ></div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Access */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Manage Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  View, edit, and manage all platform users
                </p>
                <Link href="/dashboard/admin/users">
                  <Button className="w-full" variant="outline">
                    Go to Users
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Manage Crops
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  View and manage all crop listings on the platform
                </p>
                <Link href="/dashboard/admin/crops">
                  <Button className="w-full" variant="outline">
                    Go to Crops
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Manage Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  View and manage all customer orders
                </p>
                <Link href="/dashboard/admin/orders">
                  <Button className="w-full" variant="outline">
                    Go to Orders
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Manage Deliveries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  View and manage all platform deliveries
                </p>
                <Link href="/dashboard/admin/deliveries">
                  <Button className="w-full" variant="outline">
                    Go to Deliveries
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Activity</CardTitle>
              <CardDescription>
                The most recent user registrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View full user details and management in the Users section
              </p>
              <div className="flex justify-end">
                <Link href="/dashboard/admin/users">
                  <Button>Go to Users Management</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crops" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Latest Crop Listings</CardTitle>
              <CardDescription>
                The most recently listed crops on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData.recentCrops.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentCrops.map((crop) => (
                    <div
                      key={crop.id}
                      className="flex justify-between items-center p-3 border rounded-md"
                    >
                      <div>
                        <p className="font-medium">{crop.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Listed by: {crop.farmer.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recent crop listings found
                </p>
              )}
              <div className="flex justify-end mt-4">
                <Link href="/dashboard/admin/crops">
                  <Button>Go to Crops Management</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                The most recent orders placed on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center p-3 border rounded-md"
                    >
                      <div>
                        <p className="font-medium">{order.crop.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Ordered by: {order.buyer.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recent orders found
                </p>
              )}
              <div className="flex justify-end mt-4">
                <Link href="/dashboard/admin/orders">
                  <Button>Go to Orders Management</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
