"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  Users,
  Filter,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { deleteUser, editUser } from "@/lib/actions/admin.actions";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Create a schema for user editing
const editUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  role: z.enum(["CUSTOMER", "FARMER", "DRIVER", "ADMIN"]),
  address: z.string().min(10, "Address must be at least 10 characters"),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  bankName: z.string().optional(),
});

// Define the props type
interface UsersManagementClientProps {
  users: any[];
}

export default function UsersManagementClient({
  users,
}: UsersManagementClientProps) {
  const router = useRouter();
  // State for filtering and sorting
  const [filterValue, setFilterValue] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Setup form for editing users
  const form = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "CUSTOMER",
      address: "",
      accountName: "",
      accountNumber: "",
      bankName: "",
    },
  });

  // Filter and sort users
  const filteredUsers = users
    .filter((user) => {
      // Text filter - check name and email
      const matchesText =
        filterValue === "" ||
        user.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        user.email.toLowerCase().includes(filterValue.toLowerCase());

      // Role filter
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

      return matchesText && matchesRole;
    })
    .sort((a, b) => {
      // Handle sorting based on column
      if (sortColumn === "createdAt") {
        return sortDirection === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortColumn === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortColumn === "role") {
        return sortDirection === "asc"
          ? a.role.localeCompare(b.role)
          : b.role.localeCompare(a.role);
      }
      return 0;
    });

  // Toggle sort direction when clicking a column header
  const toggleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // View user details
  const viewUserDetails = (user: any) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  // Edit user
  const openEditDialog = (user: any) => {
    setSelectedUser(user);

    // Set form default values based on selected user
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address || "",
      accountName: user.bankDetails?.accountName || "",
      accountNumber: user.bankDetails?.accountNumber || "",
      bankName: user.bankDetails?.bankName || "",
    });

    setIsEditDialogOpen(true);
  };

  // Delete user dialog
  const openDeleteDialog = (user: any) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);
    try {
      const result = await deleteUser(selectedUser.id);

      if (result.success) {
        toast.success("User deleted successfully");
        setIsDeleteDialogOpen(false);
        router.refresh(); // Refresh the page to update the user list
      } else {
        toast.error("Failed to delete user", {
          description: result.message,
        });
      }
    } catch (error: any) {
      toast.error("Failed to delete user", {
        description: error.message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle user edit submission
  const onSubmitEdit = async (values: z.infer<typeof editUserSchema>) => {
    if (!selectedUser) return;

    setIsEditing(true);
    try {
      // Prepare data for the editUser function
      const userData: any = {
        name: values.name,
        email: values.email,
        role: values.role,
        address: values.address,
      };

      // Only include bank details if the user is a farmer or becoming a farmer
      if (values.role === "FARMER") {
        userData.bankDetails = {
          accountName: values.accountName,
          accountNumber: values.accountNumber,
          bankName: values.bankName,
        };
      }

      const result = await editUser(selectedUser.id, userData);

      if (result.success) {
        toast.success("User updated successfully");
        setIsEditDialogOpen(false);
        router.refresh(); // Refresh the page to update the user list
      } else {
        toast.error("Failed to update user", {
          description: result.message,
        });
      }
    } catch (error: any) {
      toast.error("Failed to update user", {
        description: error.message,
      });
    } finally {
      setIsEditing(false);
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "CUSTOMER":
        return "bg-blue-100 text-blue-800";
      case "FARMER":
        return "bg-green-100 text-green-800";
      case "DRIVER":
        return "bg-yellow-100 text-yellow-800";
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date for display
  const formatDate = (date: string) => {
    return format(new Date(date), "PPP");
  };

  // Watch the current role value in the form
  const currentRole = form.watch("role");

  return (
    <div className="space-y-6 p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage all users registered on the platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Export Users</Button>
          <Button>Add New User</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              All Users
            </div>
          </CardTitle>
          <CardDescription>
            A total of {users.length} users registered on the platform
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
            <div className="flex flex-1 items-center relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-10 max-w-xs"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Filter:
                </span>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                  <SelectItem value="FARMER">Farmer</SelectItem>
                  <SelectItem value="DRIVER">Driver</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => toggleSort("name")}
                    >
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => toggleSort("role")}
                    >
                      Role
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => toggleSort("createdAt")}
                    >
                      Registered
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${getRoleBadgeColor(
                            user.role
                          )} hover:${getRoleBadgeColor(user.role)}`}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => viewUserDetails(user)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openEditDialog(user)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit user
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(user)}
                              className="text-destructive focus:bg-destructive/10"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete user
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No users found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the user
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  User ID
                </p>
                <p className="text-sm">{selectedUser.id}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Name
                </p>
                <p className="text-sm">{selectedUser.name}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-sm">{selectedUser.email}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Role
                </p>
                <p className="text-sm">
                  <Badge className={getRoleBadgeColor(selectedUser.role)}>
                    {selectedUser.role}
                  </Badge>
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Address
                </p>
                <p className="text-sm">
                  {selectedUser.address || "Not provided"}
                </p>
              </div>

              {selectedUser.role === "FARMER" && selectedUser.bankDetails && (
                <>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Bank Details
                    </p>
                    <div className="text-xs space-y-1 bg-muted p-2 rounded-md">
                      <p>
                        <span className="font-medium">Account Name:</span>{" "}
                        {selectedUser.bankDetails.accountName}
                      </p>
                      <p>
                        <span className="font-medium">Account Number:</span>{" "}
                        {selectedUser.bankDetails.accountNumber}
                      </p>
                      <p>
                        <span className="font-medium">Bank Name:</span>{" "}
                        {selectedUser.bankDetails.bankName}
                      </p>
                      {selectedUser.bankDetails.branch && (
                        <p>
                          <span className="font-medium">Branch:</span>{" "}
                          {selectedUser.bankDetails.branch}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Registration Date
                </p>
                <p className="text-sm">{formatDate(selectedUser.createdAt)}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setIsViewDialogOpen(false);
                if (selectedUser) openEditDialog(selectedUser);
              }}
            >
              Edit User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user&apos;s information
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitEdit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CUSTOMER">Customer</SelectItem>
                          <SelectItem value="FARMER">Farmer</SelectItem>
                          <SelectItem value="DRIVER">Driver</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Bank Details - Show only if role is FARMER */}
              {currentRole === "FARMER" && (
                <>
                  <div className="bg-muted/50 p-3 rounded-md mt-2">
                    <h3 className="text-sm font-medium mb-2">Bank Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="accountName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Account Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="accountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Account Number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-4">
                      <FormField
                        control={form.control}
                        name="bankName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Bank Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </>
              )}

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isEditing}>
                  {isEditing ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  You are about to delete user:{" "}
                  <span className="font-medium">{selectedUser.name}</span> (
                  {selectedUser.email})
                </AlertDescription>
              </Alert>

              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-medium">User Details:</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedUser.name}
                  </li>
                  <li>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedUser.email}
                  </li>
                  <li>
                    <span className="font-medium">Role:</span>{" "}
                    {selectedUser.role}
                  </li>
                  <li>
                    <span className="font-medium">Registered:</span>{" "}
                    {formatDate(selectedUser.createdAt)}
                  </li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6 flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
