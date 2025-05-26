"use client";

import { useState } from "react";
import { UploadCloud, Info } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { submitDriverAdminPayment } from "@/lib/actions/driver-earnings.actions";
import { toast } from "sonner";

type AdminBankDetails = {
  accountName: string;
  accountNumber: string;
  bankName: string;
  branch?: string;
};

type PendingPayment = {
  id: string;
  deliveryId: string;
  date: Date;
  amount: number;
  earnings: number;
  isPaid: boolean;
  paymentProof?: string | null;
};

interface AdminCommissionCardProps {
  totalCommission: number;
  unpaidCommission: number;
  adminBankDetails: AdminBankDetails;
  pendingPayments: PendingPayment[];
}

export default function AdminCommissionCard({
  totalCommission,
  unpaidCommission,
  adminBankDetails,
  pendingPayments,
}: AdminCommissionCardProps) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null
  );
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handlePaymentSubmit = async (requestId: string) => {
    if (!file) {
      toast.error("Please select a bank slip to upload");
      return;
    }

    setIsUploading(true);
    try {
      await submitDriverAdminPayment(requestId, file);
      toast.success("Payment proof submitted successfully");

      // Reset form state
      setFile(null);
      setSelectedPaymentId(null);

      // Refresh page to show updated status
      window.location.reload();
    } catch (error) {
      console.error("Error uploading payment proof:", error);
      toast.error("Failed to submit payment proof");
    } finally {
      setIsUploading(false);
    }
  };

  const renderActionButton = (payment: PendingPayment) => {
    if (payment.isPaid) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(payment.paymentProof!, "_blank")}
          disabled={!payment.paymentProof}
        >
          View Slip
        </Button>
      );
    }

    if (selectedPaymentId === payment.id) {
      return (
        <div className="flex flex-col gap-2 items-end">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedPaymentId(null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => handlePaymentSubmit(payment.id)}
              disabled={!file || isUploading}
            >
              {isUploading ? "Uploading..." : "Submit"}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <Button
        variant="default"
        size="sm"
        onClick={() => setSelectedPaymentId(payment.id)}
      >
        <UploadCloud className="h-4 w-4 mr-1" />
        Upload Slip
      </Button>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center">
            <Info className="h-4 w-4 text-orange-600" />
          </span>
          Admin Commission
        </CardTitle>
        <CardDescription>
          Platform fee (2% of your earnings) to be transferred to admin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 p-4 border rounded-md">
            <div className="text-sm text-muted-foreground mb-1">
              Total Commission
            </div>
            <div className="text-xl font-semibold">
              {formatCurrency(totalCommission)}
            </div>
          </div>
          <div className="flex-1 p-4 border rounded-md bg-orange-50">
            <div className="text-sm text-muted-foreground mb-1">
              Unpaid Commission
            </div>
            <div className="text-xl font-semibold text-orange-600">
              {formatCurrency(unpaidCommission)}
            </div>
          </div>
        </div>

        {unpaidCommission > 0 && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription>
              Please transfer the commission amount to the admin bank account
              and upload the bank slip as proof.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <h3 className="font-medium">Admin Bank Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium">Bank Name:</div>
            <div>{adminBankDetails.bankName}</div>
            <div className="font-medium">Account Name:</div>
            <div>{adminBankDetails.accountName}</div>
            <div className="font-medium">Account Number:</div>
            <div>{adminBankDetails.accountNumber}</div>
            {adminBankDetails.branch && (
              <>
                <div className="font-medium">Branch:</div>
                <div>{adminBankDetails.branch}</div>
              </>
            )}
          </div>
        </div>

        {pendingPayments.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Pending Payments</h3>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Commission (2%)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.date)}</TableCell>
                      <TableCell>{formatCurrency(payment.earnings)}</TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>
                        {payment.isPaid ? (
                          <span className="text-green-600 font-medium">
                            Paid
                          </span>
                        ) : (
                          <span className="text-orange-600 font-medium">
                            Pending
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {renderActionButton(payment)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
