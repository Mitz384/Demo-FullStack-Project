const baseAPIUser = "http://localhost:8080/users";

export async function login(fields) {
  const response = await fetch(`${baseAPIUser}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fields),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json(); // Trả về { token }
}

export async function register(fields) {
  const response = await fetch(`${baseAPIUser}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fields),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const { token } = await response.json();
  localStorage.removeItem("accessToken");
  localStorage.setItem("accessToken", token);
  window.location.replace("/profile");
}

export async function getUserProfile() {
  const response = await fetch(`${baseAPIUser}/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export async function logout() {
  const response = await fetch(`${baseAPIUser}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  localStorage.removeItem("accessToken");
  window.location.replace("/?logout=true");
}