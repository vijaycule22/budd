import { NextRequest, NextResponse } from "next/server";

// Mock user database - in production, use a real database
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@studybuddy.com",
    role: "admin",
    status: "active",
    lastActive: new Date().toISOString(),
    documentsProcessed: 25,
    createdAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@studybuddy.com",
    role: "user",
    status: "active",
    lastActive: new Date().toISOString(),
    documentsProcessed: 12,
    createdAt: new Date("2024-01-05").toISOString(),
  },
  {
    id: "3",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    status: "inactive",
    lastActive: new Date("2024-01-10").toISOString(),
    documentsProcessed: 8,
    createdAt: new Date("2024-01-10").toISOString(),
  },
];

export async function GET() {
  try {
    // In production, add proper authentication here
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // In production, add proper authentication here
    const body = await request.json();
    const { action, userId, userData } = body;

    switch (action) {
      case "create":
        const newUser = {
          id: Date.now().toString(),
          ...userData,
          status: "active",
          lastActive: new Date().toISOString(),
          documentsProcessed: 0,
          createdAt: new Date().toISOString(),
        };
        users.push(newUser);
        return NextResponse.json({ user: newUser });

      case "update":
        const userIndex = users.findIndex((u) => u.id === userId);
        if (userIndex === -1) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }
        users[userIndex] = { ...users[userIndex], ...userData };
        return NextResponse.json({ user: users[userIndex] });

      case "delete":
        const deleteIndex = users.findIndex((u) => u.id === userId);
        if (deleteIndex === -1) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }
        const deletedUser = users.splice(deleteIndex, 1)[0];
        return NextResponse.json({ user: deletedUser });

      case "toggleStatus":
        const toggleIndex = users.findIndex((u) => u.id === userId);
        if (toggleIndex === -1) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }
        users[toggleIndex].status =
          users[toggleIndex].status === "active" ? "inactive" : "active";
        return NextResponse.json({ user: users[toggleIndex] });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error managing users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
