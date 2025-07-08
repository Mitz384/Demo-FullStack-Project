const baseAPIUser = "http://localhost:8080/users";

export async function login(fields) {
  const res = await fetch(`${baseAPIUser}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fields),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json(); // Trả về { token }
}
