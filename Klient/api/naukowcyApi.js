
export async function listNaukowcy(request, filter = "all") {
  const url =
    filter === "all"
      ? "/naukowcy"
      : `/naukowcy?aktywny=${encodeURIComponent(filter)}`;

  return await request(url, "GET");
}


export function getNaukowiec(request, id) {
  return request(`/naukowcy/${id}`, { method: "GET" });
}

export function createNaukowiec(request, payload) {
  return request(`/naukowcy`, { method: "POST", body: JSON.stringify(payload) });
}

export function updateNaukowiec(request, id, payload) {
  return request(`/naukowcy/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}

export function deleteNaukowiec(request, id) {
  return request(`/naukowcy/${id}`, { method: "DELETE" });
}
