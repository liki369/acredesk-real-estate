"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  phone_number: z.string().min(10),
});

// --- PUBLIC USER SIGN IN ---
export async function loginUser(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const rawData = Object.fromEntries(formData.entries());
  
  const validated = LoginSchema.safeParse(rawData);
  if (!validated.success) return { error: "Invalid email or password format" };

  const email = validated.data.email.toLowerCase().trim();
  const password = validated.data.password;
  const supabaseAdmin = await createAdminClient();

  // Check if this email belongs to a CRM Admin
  const { data: adminCheck } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("email", email)
    .single();

  if (adminCheck && adminCheck.role === "superadmin") {
    return { 
      error: "This email is registered for the CRM Dashboard. Please use the CRM Sign In portal at /admin/login." 
    };
  }

  let { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error && (error.message.includes("Email not confirmed") || error.message.includes("Invalid login credentials"))) {
    const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
    const existingAuthUser = listData?.users?.find(u => u.email?.toLowerCase() === email);

    if (existingAuthUser && !existingAuthUser.email_confirmed_at) {
      await supabaseAdmin.auth.admin.updateUserById(existingAuthUser.id, { email_confirm: true });
      const retry = await supabase.auth.signInWithPassword({ email, password });
      authData = retry.data;
      error = retry.error;
    }
  }

  if (error || !authData?.user) {
    const { data: checkUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (!checkUser) {
      return { error: "No user account found for this email. Please sign up first." };
    }
    return { error: error?.message || "Invalid email or password." };
  }

  redirect("/");
}

// --- PUBLIC USER SIGN UP ---
export async function signupUser(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const rawData = Object.fromEntries(formData.entries());
  
  const validated = SignupSchema.safeParse(rawData);
  if (!validated.success) return { error: "Invalid input fields. Password must be at least 6 characters and 10 digit phone." };

  const email = validated.data.email.toLowerCase().trim();
  const password = validated.data.password;
  const phone_number = validated.data.phone_number;

  const supabaseAdmin = await createAdminClient();

  // Check if this email is already registered as CRM Admin
  const { data: adminCheck } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("email", email)
    .single();

  if (adminCheck && adminCheck.role === "superadmin") {
    return { 
      error: "This email is registered for the CRM Dashboard and cannot be used for the public user portal." 
    };
  }

  // Check if user already exists in auth
  const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
  const existingAuthUser = listData?.users?.find(u => u.email?.toLowerCase() === email);

  let userId: string;

  if (existingAuthUser) {
    userId = existingAuthUser.id;
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
      user_metadata: { phone_number, role: "client" }
    });
  } else {
    const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { phone_number, role: "client" }
    });

    if (createErr || !newUser.user) {
      return { error: createErr?.message || "Failed to create user account." };
    }
    userId = newUser.user.id;
  }

  // Register in users table as dealer (default role enum in DB for standard accounts)
  await supabaseAdmin.from("users").upsert({
    id: userId,
    email,
    role: "dealer",
    phone_number,
  });

  // Sign in to set session cookies
  const { error: signInErr } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInErr) {
    return { error: "Account created, but failed to log in automatically: " + signInErr.message };
  }

  redirect("/");
}

// --- CRM ADMIN SIGN IN ---
export async function loginAdmin(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const rawData = Object.fromEntries(formData.entries());
  
  const validated = LoginSchema.safeParse(rawData);
  if (!validated.success) return { error: "Invalid email or password format" };

  const email = validated.data.email.toLowerCase().trim();
  const password = validated.data.password;
  const supabaseAdmin = await createAdminClient();

  // Check if this email belongs to a Public Client User
  const { data: clientCheck } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("email", email)
    .single();

  if (clientCheck && clientCheck.role !== "superadmin") {
    return { 
      error: "This email is registered for the public user portal and cannot access the CRM Dashboard." 
    };
  }

  let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // Auto-confirm email if unconfirmed
  if (authError && (authError.message.includes("Email not confirmed") || authError.message.includes("Invalid login credentials"))) {
    const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
    const existingAuthUser = listData?.users?.find(u => u.email?.toLowerCase() === email);

    if (existingAuthUser && !existingAuthUser.email_confirmed_at) {
      await supabaseAdmin.auth.admin.updateUserById(existingAuthUser.id, { email_confirm: true });
      const retry = await supabase.auth.signInWithPassword({ email, password });
      authData = retry.data;
      authError = retry.error;
    }
  }

  if (authError || !authData?.user) {
    const { data: checkUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (!checkUser) {
      return { error: "No CRM account found for this email. Please sign up first at /admin/signup." };
    }
    return { error: authError?.message || "Invalid credentials." };
  }

  // Ensure role in users table is superadmin
  const { data: userRecord } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (!userRecord || userRecord.role !== "superadmin") {
    await supabase.auth.signOut();
    return { error: "Access Denied: This account does not have CRM Admin privileges." };
  }

  redirect("/admin/dashboard");
}

// --- CRM ADMIN SIGN UP ---
export async function signupAdmin(prevState: any, formData: FormData) {
  const supabase = await createClient();
  await supabase.auth.signOut(); // Ensure clean session

  const rawData = Object.fromEntries(formData.entries());
  
  const validated = SignupSchema.safeParse(rawData);
  if (!validated.success) return { error: "Invalid input fields. Password must be at least 6 characters and 10 digit phone." };

  const email = validated.data.email.toLowerCase().trim();
  const password = validated.data.password;
  const phone_number = validated.data.phone_number;

  const supabaseAdmin = await createAdminClient();

  // Check if this email is already registered as a Public Client
  const { data: clientCheck } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("email", email)
    .single();

  if (clientCheck && clientCheck.role !== "superadmin") {
    return { 
      error: "This email is registered for the public user portal and cannot be used for CRM Dashboard access." 
    };
  }

  // Check if user already exists in auth
  const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
  const existingAuthUser = listData?.users?.find(u => u.email?.toLowerCase() === email);

  let userId: string;

  if (existingAuthUser) {
    userId = existingAuthUser.id;
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
      user_metadata: { phone_number, role: "admin" }
    });
  } else {
    const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { phone_number, role: "admin" }
    });

    if (createErr || !newUser.user) {
      return { error: createErr?.message || "Failed to create CRM admin account." };
    }
    userId = newUser.user.id;
  }

  // Register in users table as superadmin
  const { error: dbErr } = await supabaseAdmin.from("users").upsert({
    id: userId,
    email,
    role: "superadmin",
    phone_number,
  });

  if (dbErr) {
    return { error: "Database error creating admin profile: " + dbErr.message };
  }

  // Sign in the user to set session cookies
  const { error: signInErr } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInErr) {
    return { error: "Account created, but failed to log in automatically: " + signInErr.message };
  }

  redirect("/admin/dashboard");
}

export async function logoutUser() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// --- FORGOT PASSWORD & OTP RESET ---
export async function requestPasswordResetOTP(identifier: string, isAdminPortal: boolean) {
  if (!identifier || identifier.trim().length === 0) {
    return { error: "Please enter your registered email address or phone number." };
  }

  const cleanInput = identifier.trim().toLowerCase();
  const supabaseAdmin = await createAdminClient();

  // Search by email or phone number in users table
  const { data: users, error } = await supabaseAdmin
    .from("users")
    .select("id, email, phone_number, role")
    .or(`email.eq.${cleanInput},phone_number.eq.${cleanInput}`);

  if (error || !users || users.length === 0) {
    // Search auth users directly as fallback
    const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
    const foundAuth = listData?.users?.find(
      u => u.email?.toLowerCase() === cleanInput || u.phone === cleanInput || u.user_metadata?.phone_number === cleanInput
    );

    if (!foundAuth) {
      return { error: "No registered account found matching that email or phone number." };
    }

    // Check role in DB if available
    const { data: userRole } = await supabaseAdmin
      .from("users")
      .select("role, phone_number")
      .eq("id", foundAuth.id)
      .single();

    const isSuperadmin = userRole?.role === "superadmin" || foundAuth.user_metadata?.role === "admin";
    const phone = userRole?.phone_number || foundAuth.phone || foundAuth.user_metadata?.phone_number || "Registered Phone";

    if (isAdminPortal && !isSuperadmin) {
      return { error: "This account is registered for the Public Portal. Please use the public user forgot password page at /forgot-password." };
    }
    if (!isAdminPortal && isSuperadmin) {
      return { error: "This account is a CRM Admin account. Please use the CRM Admin forgot password page at /admin/forgot-password." };
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    return {
      success: true,
      userId: foundAuth.id,
      email: foundAuth.email,
      phone: phone,
      otp: generatedOtp,
      message: `Verification OTP code generated for registered phone ending in ${phone.slice(-4) || '****'}.`
    };
  }

  const user = users[0];

  // Validate Portal Isolation
  if (isAdminPortal && user.role !== "superadmin") {
    return { error: "This account is registered for the Public Portal. Please use the public user forgot password page at /forgot-password." };
  }
  if (!isAdminPortal && user.role === "superadmin") {
    return { error: "This account is a CRM Admin account. Please use the CRM Admin forgot password page at /admin/forgot-password." };
  }

  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

  return {
    success: true,
    userId: user.id,
    email: user.email,
    phone: user.phone_number,
    otp: generatedOtp,
    message: `Verification OTP sent to registered phone ${user.phone_number}.`
  };
}

export async function resetUserPasswordWithOTP(userId: string, newPassword: string) {
  if (!newPassword || newPassword.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  const supabaseAdmin = await createAdminClient();

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword,
    email_confirm: true,
  });

  if (error) {
    return { error: "Failed to update password: " + error.message };
  }

  return { success: true, message: "Password updated successfully! You can now log in with your new password." };
}


