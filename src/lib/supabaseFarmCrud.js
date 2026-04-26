import { supabaseRequest } from "./supabaseRest";

const firstRow = (rows) => (Array.isArray(rows) ? rows[0] ?? null : rows ?? null);

const buildSelectPath = (table, select = "*", filters = [], orderBy = null) => {
  const params = new URLSearchParams();
  params.set("select", select);
  filters.forEach((filter) => {
    params.append(filter.key, filter.value);
  });
  if (orderBy?.column) {
    params.set("order", `${orderBy.column}.${orderBy.direction || "asc"}`);
  }
  return `/rest/v1/${table}?${params.toString()}`;
};

const eq = (column, value) => ({ key: column, value: `eq.${value}` });

async function listRows(table, { select = "*", filters = [], orderBy = null } = {}) {
  return supabaseRequest(buildSelectPath(table, select, filters, orderBy));
}

async function createRow(table, values) {
  const { id: _ignoredId, ...payload } = values || {};
  return firstRow(
    await supabaseRequest(`/rest/v1/${table}`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  );
}

async function updateRow(table, id, values) {
  const { id: _ignoredId, ...payload } = values || {};
  return firstRow(
    await supabaseRequest(`/rest/v1/${table}?id=eq.${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  );
}

async function deleteRow(table, id) {
  return supabaseRequest(`/rest/v1/${table}?id=eq.${id}`, {
    method: "DELETE",
  });
}

export const farmCrud = {
  listFarmTypes: () =>
    listRows("farm_types", {
      orderBy: { column: "name", direction: "asc" },
    }),
  createFarmType: (values) => createRow("farm_types", values),
  updateFarmType: (id, values) => updateRow("farm_types", id, values),
  deleteFarmType: (id) => deleteRow("farm_types", id),

  listFarms: () =>
    listRows("farms", {
      select: "id,name,farm_type_id,location,notes,created_by,is_active,created_at,updated_at,farm_types(id,name,code)",
      orderBy: { column: "created_at", direction: "desc" },
    }),
  createFarm: (values) => createRow("farms", values),
  updateFarm: (id, values) => updateRow("farms", id, values),
  deleteFarm: (id) => deleteRow("farms", id),

  listUnits: () =>
    listRows("units", {
      orderBy: { column: "name", direction: "asc" },
    }),
  createUnit: (values) => createRow("units", values),
  updateUnit: (id, values) => updateRow("units", id, values),
  deleteUnit: (id) => deleteRow("units", id),

  listCategories: (farmTypeId = null) =>
    listRows("categories", {
      filters: farmTypeId ? [eq("farm_type_id", farmTypeId)] : [],
      orderBy: { column: "name", direction: "asc" },
    }),
  createCategory: (values) => createRow("categories", values),
  updateCategory: (id, values) => updateRow("categories", id, values),
  deleteCategory: (id) => deleteRow("categories", id),

  listSubCategories: (categoryId = null) =>
    listRows("sub_categories", {
      filters: categoryId ? [eq("category_id", categoryId)] : [],
      orderBy: { column: "name", direction: "asc" },
    }),
  createSubCategory: (values) => createRow("sub_categories", values),
  updateSubCategory: (id, values) => updateRow("sub_categories", id, values),
  deleteSubCategory: (id) => deleteRow("sub_categories", id),

  listItems: (farmTypeId = null) =>
    listRows("items", {
      filters: farmTypeId ? [eq("farm_type_id", farmTypeId)] : [],
      orderBy: { column: "name", direction: "asc" },
    }),
  createItem: (values) => createRow("items", values),
  updateItem: (id, values) => updateRow("items", id, values),
  deleteItem: (id) => deleteRow("items", id),

  listBatches: (farmId = null) =>
    listRows("batches", {
      filters: farmId ? [eq("farm_id", farmId)] : [],
      orderBy: { column: "start_date", direction: "desc" },
    }),
  createBatch: (values) => createRow("batches", values),
  updateBatch: (id, values) => updateRow("batches", id, values),
  deleteBatch: (id) => deleteRow("batches", id),

  listBatchMetrics: (batchId = null) =>
    listRows("batch_metrics", {
      filters: batchId ? [eq("batch_id", batchId)] : [],
      orderBy: { column: "metric_date", direction: "desc" },
    }),
  createBatchMetric: (values) => createRow("batch_metrics", values),
  updateBatchMetric: (id, values) => updateRow("batch_metrics", id, values),
  deleteBatchMetric: (id) => deleteRow("batch_metrics", id),

  listExpenses: (farmId = null) =>
    listRows("expenses", {
      filters: farmId ? [eq("farm_id", farmId)] : [],
      orderBy: { column: "expense_date", direction: "desc" },
    }),
  createExpense: (values) => createRow("expenses", values),
  updateExpense: (id, values) => updateRow("expenses", id, values),
  deleteExpense: (id) => deleteRow("expenses", id),

  listSales: (farmId = null) =>
    listRows("sales", {
      filters: farmId ? [eq("farm_id", farmId)] : [],
      orderBy: { column: "sale_date", direction: "desc" },
    }),
  createSale: (values) => createRow("sales", values),
  updateSale: (id, values) => updateRow("sales", id, values),
  deleteSale: (id) => deleteRow("sales", id),

  listPartners: () =>
    listRows("partners", {
      orderBy: { column: "name", direction: "asc" },
    }),
  createPartner: (values) => createRow("partners", values),
  updatePartner: (id, values) => updateRow("partners", id, values),
  deletePartner: (id) => deleteRow("partners", id),
};

export { listRows, createRow, updateRow, deleteRow };
