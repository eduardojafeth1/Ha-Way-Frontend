export const API_URL = `http://${window.location.hostname}:3000`;

/**
 * Realiza una petición GET.
 */
export async function getJson(endpoint: string) {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || "Error al obtener los datos.");
  }
  return responseData;
}

/**
 * Realiza una petición POST enviando JSON.
 */
export async function postJson(endpoint: string, data: Record<string, any>) {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || "Error al realizar la solicitud.");
  }
  return responseData;
}

/**
 * Realiza una petición PUT enviando JSON.
 */
export async function putJson(endpoint: string, data: Record<string, any>) {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || "Error al actualizar los datos.");
  }
  return responseData;
}

/**
 * Realiza una petición POST enviando FormData (ideal para subida de archivos).
 */
export async function postFormData(endpoint: string, formData: FormData) {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || "Error al enviar los datos.");
  }
  return responseData;
}

/**
 * Realiza una petición PUT enviando FormData (ideal para subida de archivos).
 */
export async function putFormData(endpoint: string, formData: FormData) {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: formData,
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || "Error al enviar los datos.");
  }
  return responseData;
}

/**
 * Realiza una petición DELETE.
 */
export async function deleteJson(endpoint: string) {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "DELETE",
    headers,
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || "Error al eliminar los datos.");
  }
  return responseData;
}
export async function putFormData(endpoint: string, formData: FormData) {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: formData,
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || "Error al actualizar los datos.");
  }
  return responseData;
}
