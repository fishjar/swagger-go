import request from '@/utils/request';

const modelKey = "role";

export async function findOne(params) {
  return request(`/server/api/${modelKey}`, {
    params,
  });
}
export async function findOrCreate(data) {
  return request(`/server/api/${modelKey}`, {
    method: 'POST',
    data,
  });
}
export async function findAndCountAll(params) {
  return request(`/server/api/${modelKey}s`, {
    params,
  });
}
export async function singleCreate(data) {
  return request(`/server/api/${modelKey}s`, {
    method: 'POST',
    data,
  });
}
export async function bulkUpdate(ids, data) {
  return request(`/server/api/${modelKey}s`, {
    method: 'PATCH',
    params: { id: ids },
    data,
  });
}
export async function bulkDestroy(ids) {
  return request(`/server/api/${modelKey}s`, {
    method: 'DELETE',
    params: { id: ids },
  });
}
export async function findByPk(id) {
  return request(`/server/api/${modelKey}s/${id}`, {
    params,
  });
}
export async function updateByPk(id, data) {
  return request(`/server/api/${modelKey}s/${id}`, {
    method: 'PATCH',
    data,
  });
}
export async function destroyByPk(id) {
  return request(`/server/api/${modelKey}s/${id}`, {
    method: 'DELETE',
  });
}
export async function bulkCreate(data) {
  return request(`/server/api/${modelKey}s/multiple`, {
    method: 'POST',
    data,
  });
}
