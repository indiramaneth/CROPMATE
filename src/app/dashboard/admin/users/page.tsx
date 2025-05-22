import { getAllUsers } from "@/lib/actions/admin.actions";
import UsersManagementClient from "./components/users-management-client";

export default async function UsersManagementPage() {
  // Fetch all users using the server action
  const users = await getAllUsers();

  return <UsersManagementClient users={users} />;
}
