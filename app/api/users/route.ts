// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import { hashPassword } from "@/lib/auth";
// import type { ApiResponse } from "@/types";

// // GET: Lấy danh sách tất cả users
// export async function GET(req: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user?.role !== "ADMIN") {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" } as ApiResponse,
//         { status: 403 },
//       );
//     }

//     const users = await prisma.user.findMany({
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         role: true,
//         createdAt: true,
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Lấy danh sách tài khoản thành công",
//         data: users,
//       } as ApiResponse,
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error("GET /api/users:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal server error" } as ApiResponse,
//       { status: 500 },
//     );
//   }
// }

// // POST: Tạo tài khoản mới
// export async function POST(req: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user?.role !== "ADMIN") {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" } as ApiResponse,
//         { status: 403 },
//       );
//     }

//     const body = await req.json();
//     const { email, name, password, role } = body;

//     // Validation
//     if (!email || !password || !role) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Email, password và role là bắt buộc",
//         } as ApiResponse,
//         { status: 400 },
//       );
//     }

//     // Check email exists
//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { success: false, message: "Email đã được sử dụng" } as ApiResponse,
//         { status: 400 },
//       );
//     }

//     // Hash password
//     const hashedPassword = await hashPassword(password);

//     // Create user
//     const newUser = await prisma.user.create({
//       data: {
//         email,
//         name: name || "",
//         password: hashedPassword,
//         role,
//       },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         role: true,
//         createdAt: true,
//       },
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Tài khoản đã được tạo thành công",
//         data: newUser,
//       } as ApiResponse,
//       { status: 201 },
//     );
//   } catch (error) {
//     console.error("POST /api/users:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal server error" } as ApiResponse,
//       { status: 500 },
//     );
//   }
// }
