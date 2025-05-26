import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  CheckCircle2,
  XCircle,
  UserCircle,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDriverCommissions } from "@/lib/actions/admin-commission.actions";
import Link from "next/link";

export default async function DriverCommissionsPage() {
  const { driverCommissions, summary } = await getDriverCommissions();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-primary" />
          </span>
          Driver Commissions
        </h1>
        <p className="text-muted-foreground">
          Review and manage driver commission payments (2% of their earnings)
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Commissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(summary.totalCommissions)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              2% of driver earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Paid Commissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.totalPaidCommissions)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.paidRequests} payments received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Commissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(summary.totalPendingCommissions)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.pendingRequests} payments pending
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Commission Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Of driver earnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Commissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Commission Payments</CardTitle>
          <CardDescription>
            All commission payments from drivers (2% of their delivery earnings)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {driverCommissions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Crop</TableHead>
                    <TableHead>Driver Earnings</TableHead>
                    <TableHead>Commission (2%)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Proof</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {driverCommissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {commission.driverImage ? (
                            <div className="h-8 w-8 rounded-full overflow-hidden">
                              <Image
                                src={commission.driverImage}
                                alt={commission.driverName}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserCircle className="h-4 w-4 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">
                              {commission.driverName}
                            </div>
                            <Link
                              href={`/dashboard/admin/drivers/${commission.driverId}`}
                              className="text-xs text-primary hover:underline"
                            >
                              View Profile
                            </Link>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(commission.deliveryDate)}
                      </TableCell>
                      <TableCell>{commission.cropName}</TableCell>
                      <TableCell>
                        {formatCurrency(commission.driverEarnings)}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {formatCurrency(commission.adminCommission)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {commission.isPaid ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-600 border-green-200"
                          >
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Paid
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-orange-50 text-orange-600 border-orange-200"
                          >
                            <XCircle className="mr-1 h-3 w-3" /> Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {commission.paymentProof ? (
                          <Button size="sm" variant="outline" asChild>
                            <a
                              href={commission.paymentProof}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="mr-1 h-3 w-3" /> View
                              Slip
                            </a>
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            No proof
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No commission payments yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
