import { config } from "../config";

const BASE_URL = config.userServiceUrl;

type RegisterRole = "owner" | "employee" | "client";

export type AuthUser = {
  id: string;
  nome: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

function brDateToISO(date: string): string {
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`;
}

async function request<T>(url: string, options: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }

  if (!res.ok) {
    console.error("Erro na API:", url, res.status, body || text);
    const message =
      (body && (body.message || body.error || body.detail)) ||
      text ||
      `Erro ${res.status} ao chamar ${url}`;
    throw new Error(message);
  }

  return body as T;
}

export async function loginWithPassword(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/** REGISTRO por papel (owner/employee/client) */
export async function registerUser(input: {
  nome: string;
  email: string;
  senha: string;
  dataNascimentoBr: string;
  cpf: string;
  role: RegisterRole;
}): Promise<AuthUser> {
  const { nome, email, senha, dataNascimentoBr, cpf, role } = input;

  const payload = {
    nome,
    senha,
    email,
    data_nascimento: brDateToISO(dataNascimentoBr),
    cpf,
  };

  return request<AuthUser>(`/auth/register/${role}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** ESQUECI A SENHA */
export async function forgotPassword(input: {
  email: string;
  redirectUrl?: string;
}): Promise<{ message: string }> {
  const { email, redirectUrl } = input;

  return request<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(
      redirectUrl ? { email, redirectUrl } : { email }
    ),
  });
}

/** REDEFINIR SENHA */
export async function resetPassword(input: {
  token: string;
  newPassword: string;
}): Promise<{ message: string }> {
  return request<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/** MAGIC LINK */
export async function requestMagicLink(input: {
  email: string;
  redirectUrl?: string;
}) {
  const { email, redirectUrl } = input;
  return request<{ message: string }>("/auth/request-magic-link", {
    method: "POST",
    body: JSON.stringify(
      redirectUrl ? { email, redirectUrl } : { email }
    ),
  });
}

export async function authenticateMagicLink(input: {
  token: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/authenticate-magic-link", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/** CONFIRMAÇÃO DE E-MAIL */
export async function requestEmailConfirmationLink(input: {
  email: string;
}) {
  return request<{ message: string }>(
    "/email-confirmation/request-confirmation-link",
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );
}
