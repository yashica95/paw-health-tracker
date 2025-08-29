import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simple client for Ontario CVO public registry
export async function searchOntarioVets(params: {
  name?: string;
  address?: string; // postal code
  status?: string;
  take?: number;
  skip?: number;
}) {
  const body = {
    searchBy: "0",
    name: params.name || "",
    status: params.status || "Active",
    address: params.address || "",
    species: "",
    language: "",
    specialtyType: "",
    take: params.take ?? 10,
    skip: params.skip ?? 0,
  };
  const res = await fetch("/cvo/registrant/search/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`CVO search failed (${res.status})`);
  const json = await res.json();
  // Normalize to { result: [...] }
  if (Array.isArray((json as any)?.result)) return json;
  if (Array.isArray((json as any)?.data)) return { result: (json as any).data };
  return { result: [] };
}

export async function fetchOntarioVetById(id: string) {
  const url = `/cvo/registrant/get/?id=${encodeURIComponent(id)}`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error(`CVO get failed (${res.status})`);
  return res.json();
}

export async function searchBCCVBC(name: string): Promise<any[]> {
  try {
    // Note: This is a basic implementation that would need to be enhanced
    // to handle the actual CVBC search API if they provide one
    // For now, we'll return a mock response structure
    console.log(`Searching BC CVBC for: ${name}`);
    
    // In a real implementation, you would:
    // 1. Make a request to CVBC's search endpoint
    // 2. Parse the HTML response (as shown in the component)
    // 3. Extract vet information from the table
    
    return [];
  } catch (error) {
    console.error('Error searching BC CVBC:', error);
    throw new Error('Failed to search BC CVBC registry');
  }
}