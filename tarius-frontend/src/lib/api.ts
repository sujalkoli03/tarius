const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getBackendHealth() {
  const response = await fetch(`${API_URL}/api/health`);

  if (!response.ok) {
    throw new Error("Failed to connect to TARIUS backend");
  }

  return response.json();
}

export interface SubmitContactResponse {
  success: boolean;
  message: string;
}

export async function submitContactForm(
  formData: FormData
): Promise<SubmitContactResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error(
      "Unable to connect to the TARIUS server. Please try again later."
    );
  }

  let data: SubmitContactResponse;

  try {
    data = (await response.json()) as SubmitContactResponse;
  } catch {
    throw new Error(
      "The TARIUS server returned an unexpected response. Please try again later."
    );
  }

  if (!response.ok) {
    throw new Error(data.message || "Unable to submit your inquiry. Please try again.");
  }

  return data;
}