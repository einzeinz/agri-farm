import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PiggyBank,
  ShoppingCart,
  Wallet,
  TrendingUp,
  Plus,
  LayoutDashboard,
  Receipt,
  Boxes,
  Menu,
  Bell,
  Settings,
  BarChart3,
  CircleDollarSign,
  Trash2,
  Moon,
  Sun,
  ArrowUpRight,
  ArrowDownRight,
  GripVertical,
  X,
  LogOut,
  LockKeyhole,
  Mail,
  ShieldCheck,
  LoaderCircle,
  UserRound,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { isSupabaseConfigured, supabase } from "./lib/supabaseClient";
import { loadAppState } from "./lib/supabaseAppState";
import { farmCrud } from "./lib/supabaseFarmCrud";

const STORAGE_KEY = "pig-farm-budget-dashboard-v5";
const MASTER_ORDER_KEY = "pig-farm-master-order-v1";
const SALE_TYPE_OPTIONS = [
  { value: "per_quantity", label: "Per Quantity" },
  { value: "per_kilo", label: "Per Kilo" },
];

const initialBahog = [
  { date: "2025-12-16", pamasahe: 0, vitamins: 200, preStarter: 1800, starter: 0, grower: 0, finisher: 0 },
  { date: "2025-12-23", pamasahe: 0, vitamins: 1230, preStarter: 0, starter: 1945, grower: 0, finisher: 0 },
  { date: "2025-12-30", pamasahe: 0, vitamins: 250, preStarter: 0, starter: 0, grower: 0, finisher: 0 },
  { date: "2025-12-31", pamasahe: 0, vitamins: 0, preStarter: 0, starter: 2040, grower: 0, finisher: 0 },
  { date: "2026-01-03", pamasahe: 0, vitamins: 600, preStarter: 0, starter: 0, grower: 0, finisher: 0 },
  { date: "2026-01-05", pamasahe: 0, vitamins: 0, preStarter: 0, starter: 1300, grower: 0, finisher: 0 },
  { date: "2026-01-07", pamasahe: 120, vitamins: 0, preStarter: 0, starter: 2160, grower: 0, finisher: 0 },
  { date: "2026-01-07", pamasahe: 0, vitamins: 0, preStarter: 0, starter: 19450, grower: 0, finisher: 0 },
  { date: "2026-01-24", pamasahe: 700, vitamins: 0, preStarter: 0, starter: 0, grower: 0, finisher: 0 },
  { date: "2026-01-27", pamasahe: 0, vitamins: 0, preStarter: 0, starter: 19450, grower: 0, finisher: 0 },
  { date: "2026-02-07", pamasahe: 0, vitamins: 0, preStarter: 0, starter: 0, grower: 26700, finisher: 0 },
  { date: "2026-02-22", pamasahe: 0, vitamins: 360, preStarter: 0, starter: 0, grower: 0, finisher: 0 },
  { date: "2026-02-24", pamasahe: 0, vitamins: 0, preStarter: 0, starter: 0, grower: 19580, finisher: 0 },
  { date: "2026-02-27", pamasahe: 0, vitamins: 1000, preStarter: 0, starter: 0, grower: 0, finisher: 0 },
  { date: "2026-03-04", pamasahe: 0, vitamins: 0, preStarter: 0, starter: 0, grower: 0, finisher: 11445 },
  { date: "2026-03-07", pamasahe: 0, vitamins: 1410, preStarter: 0, starter: 0, grower: 0, finisher: 24825 },
  { date: "2026-03-13", pamasahe: 0, vitamins: 910, preStarter: 0, starter: 0, grower: 0, finisher: 0 },
  { date: "2026-03-14", pamasahe: 0, vitamins: 582, preStarter: 0, starter: 0, grower: 0, finisher: 0 },
  { date: "2026-03-15", pamasahe: 0, vitamins: 410, preStarter: 0, starter: 0, grower: 8900, finisher: 0 },
  { date: "2026-03-18", pamasahe: 100, vitamins: 740, preStarter: 0, starter: 0, grower: 17800, finisher: 0 },
  { date: "2026-03-22", pamasahe: 0, vitamins: 595, preStarter: 0, starter: 0, grower: 0, finisher: 0 },
  { date: "2026-03-24", pamasahe: 100, vitamins: 0, preStarter: 0, starter: 0, grower: 5340, finisher: 4965 },
  { date: "2026-04-06", pamasahe: 0, vitamins: 0, preStarter: 0, starter: 0, grower: 8900, finisher: 0 },
];

const initialPiglets = [
  { piglets: 11, cost: 3800 },
  { piglets: 11, cost: 3900 },
  { piglets: 3, cost: 3500 },
  { piglets: 1, cost: 4000 },
];

const initialSales = [
  { name: "Pig 1", weight: 88, pricePerKg: 170 },
  { name: "Pig 2", weight: 81, pricePerKg: 170 },
  { name: "Pig 3", weight: 91, pricePerKg: 170 },
  { name: "Pig 4", weight: 85, pricePerKg: 170 },
  { name: "Pig 5", weight: 89, pricePerKg: 170 },
  { name: "Pig 6", weight: 92, pricePerKg: 170 },
  { name: "Pig 7", weight: 81, pricePerKg: 170 },
  { name: "Pig 8", weight: 84, pricePerKg: 170 },
  { name: "Pig 9", weight: 80, pricePerKg: 170 },
  { name: "Pig 10", weight: 80, pricePerKg: 170 },
  { name: "Pig 11", weight: 80, pricePerKg: 170 },
  { name: "Pig 12", weight: 80, pricePerKg: 170 },
  { name: "Pig 13", weight: 80, pricePerKg: 170 },
  { name: "Pig 14", weight: 80, pricePerKg: 170 },
  { name: "Pig 15", weight: 80, pricePerKg: 170 },
  { name: "Pig 16", weight: 80, pricePerKg: 170 },
  { name: "Pig 17", weight: 80, pricePerKg: 170 },
  { name: "Pig 18", weight: 85, pricePerKg: 170 },
  { name: "Pig 19", weight: 85, pricePerKg: 170 },
  { name: "Pig 20", weight: 85, pricePerKg: 170 },
  { name: "Pig 21", weight: 85, pricePerKg: 165 },
  { name: "Pig 22", weight: 85, pricePerKg: 165 },
  { name: "Pig 23", weight: 70, pricePerKg: 165 },
  { name: "Pig 24", weight: 70, pricePerKg: 165 },
  { name: "Pig 25", weight: 70, pricePerKg: 165 },
  { name: "Pig 26", weight: 70, pricePerKg: 165 },
];

const initialMisc = [
  { item: "Piglet pickup", amount: 1400 },
  { item: "Kurente", amount: 1500 },
  { item: "Tubig tubo", amount: 600 },
  { item: "Tinimbang sa first", amount: 800 },
];

const currency = (n) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 2 }).format(
    Number(n || 0)
  );

const flattenExpenses = (bahog, piglets, misc) => {
  const expenses = [];
  bahog.forEach(row => {
    if (row.pamasahe > 0) expenses.push({ id: Date.now() + Math.random(), date: row.date, category: 'Bahog', subcategory: 'Pamasahe', amount: row.pamasahe, remarks: '' });
    if (row.vitamins > 0) expenses.push({ id: Date.now() + Math.random(), date: row.date, category: 'Bahog', subcategory: 'Vitamins / Meds', amount: row.vitamins, remarks: '' });
    if (row.preStarter > 0) expenses.push({ id: Date.now() + Math.random(), date: row.date, category: 'Bahog', subcategory: 'Pre-Starter', amount: row.preStarter, remarks: '' });
    if (row.starter > 0) expenses.push({ id: Date.now() + Math.random(), date: row.date, category: 'Bahog', subcategory: 'Starter', amount: row.starter, remarks: '' });
    if (row.grower > 0) expenses.push({ id: Date.now() + Math.random(), date: row.date, category: 'Bahog', subcategory: 'Grower', amount: row.grower, remarks: '' });
    if (row.finisher > 0) expenses.push({ id: Date.now() + Math.random(), date: row.date, category: 'Bahog', subcategory: 'Finisher', amount: row.finisher, remarks: '' });
  });
  piglets.forEach(row => {
    expenses.push({ id: Date.now() + Math.random(), date: '', category: 'Piglets', subcategory: 'Purchase', amount: row.piglets * row.cost, remarks: `${row.piglets} piglets` });
  });
  misc.forEach(row => {
    expenses.push({ id: Date.now() + Math.random(), date: '', category: 'Misc', subcategory: row.item, amount: row.amount, remarks: '' });
  });
  return expenses;
};

const initialStore = {
  expenses: [],
  sales: [],
  pigPen: 0,
  alagaFee: 0,
  previousDeficit: 0,
};

const sanitizeEmptyFinanceRows = (state) => ({
  ...state,
  expenses: [],
  sales: [],
  pigPen: 0,
  alagaFee: 0,
  previousDeficit: 0,
});

const todayIso = () => new Date().toISOString().slice(0, 10);

const createExpenseDraft = () => ({
  farm_id: "",
  batch_id: "",
  expense_date: todayIso(),
  category_id: "",
  sub_category_id: "",
  item_id: "",
  partner_id: "",
  quantity: "",
  unit_id: "",
  unit_cost: "",
  total_amount: "",
  remarks: "",
});

const createSaleDraft = () => ({
  farm_id: "",
  batch_id: "",
  sale_date: todayIso(),
  item_id: "",
  partner_id: "",
  quantity: "",
  unit_id: "",
  unit_price: "",
  total_amount: "",
  remarks: "",
});

const createExpenseGridDraft = (masterData, fallbackFarmId = null, fallbackBatchId = null) => {
  const draft = createExpenseDraftFromMaster(masterData, fallbackFarmId, fallbackBatchId);
  return {
    ...draft,
    id: createTempId(),
    farm_name: "",
    farm_type_id: null,
    farm_type_name: "",
    batch_name: "",
    category: "",
    subcategory: "",
    item: "",
    partner: "",
    unit: "",
    total_amount: null,
  };
};

const createSaleGridDraft = (masterData, fallbackFarmId = null, fallbackBatchId = null) => {
  const draft = createSaleDraftFromMaster(masterData, fallbackFarmId, fallbackBatchId);
  return {
    ...draft,
    id: createTempId(),
    farm_name: "",
    farm_type_id: null,
    farm_type_name: "",
    batch_name: "",
    item: "",
    partner: "",
    unit: "",
    total_amount: null,
  };
};

const normalizeLabel = (value) => String(value || "").trim().toLowerCase();
const slugCode = (value, fallback = "item") =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || fallback;

const isUuid = (value) =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const toNumberOrNull = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const createTempId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? `draft-${crypto.randomUUID()}`
    : `draft-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const isDraftId = (value) => typeof value === "string" && value.startsWith("draft-");

const mapExpenseRowFromDb = (row, masterData) => {
  const farm = masterData.farms.find((item) => item.id === row.farm_id);
  const farmType = masterData.farmTypes.find((item) => item.id === farm?.farm_type_id);
  const batch = masterData.batches.find((item) => item.id === row.batch_id);
  const category = masterData.categories.find((item) => item.id === row.category_id);
  const subCategory = masterData.subCategories.find((item) => item.id === row.sub_category_id);
  const item = masterData.items.find((entry) => entry.id === row.item_id);
  const partner = masterData.partners.find((entry) => entry.id === row.partner_id);
  const unit = masterData.units.find((entry) => entry.id === row.unit_id);

  return {
    id: row.id,
    farm_id: row.farm_id || null,
    batch_id: row.batch_id || null,
    date: row.expense_date || "",
    farm_name: farm?.name || "",
    farm_type_id: farm?.farm_type_id || null,
    farm_type_name: farmType?.name || "",
    batch_name: batch?.name || "",
    category_id: row.category_id || null,
    sub_category_id: row.sub_category_id || null,
    item_id: row.item_id || null,
    partner_id: row.partner_id || null,
    unit_id: row.unit_id || null,
    quantity: row.quantity ?? null,
    unit_cost: row.unit_cost ?? null,
    total_amount: row.total_amount ?? null,
    category: category?.name || category?.code || "",
    subcategory: subCategory?.name || subCategory?.code || "",
    item: item?.name || item?.code || "",
    partner: partner?.name || "",
    unit: unit?.name || unit?.code || "",
    remarks: row.remarks || "",
  };
};

const mapSaleRowFromDb = (row, masterData) => {
  const farm = masterData.farms.find((item) => item.id === row.farm_id);
  const farmType = masterData.farmTypes.find((item) => item.id === farm?.farm_type_id);
  const batch = masterData.batches.find((item) => item.id === row.batch_id);
  return {
    id: row.id,
    farm_id: row.farm_id || null,
    batch_id: row.batch_id || null,
    date: row.sale_date || todayIso(),
    farm_name: farm?.name || "",
    farm_type_id: farm?.farm_type_id || null,
    farm_type_name: farmType?.name || "",
    batch_name: batch?.name || "",
    item_id: row.item_id || null,
    partner_id: row.partner_id || null,
    unit_id: row.unit_id || null,
    remarks: row.remarks || "",
    quantity: row.quantity ?? null,
    unit_price: row.unit_price ?? null,
    pricePerKg: row.unit_price ?? null,
    total_amount: row.total_amount ?? null,
  };
};

const mapBatchRowFromDb = (row, masterData) => {
  const farm = masterData.farms.find((item) => item.id === row.farm_id);
  const farmType = masterData.farmTypes.find((item) => item.id === farm?.farm_type_id);
  return {
    id: row.id,
    farm_id: row.farm_id || null,
    farm_name: farm?.name || "",
    farm_type_id: farm?.farm_type_id || null,
    farm_type_name: farmType?.name || "",
    name: row.name || "",
    status: row.status || "active",
    start_date: row.start_date || "",
    end_date: row.end_date || "",
  };
};

const getCategoryById = (masterData, categoryId) =>
  masterData.categories.find((item) => item.id === categoryId) || null;

const getSubCategoryById = (masterData, subCategoryId) =>
  masterData.subCategories.find((item) => item.id === subCategoryId) || null;

const getItemById = (masterData, itemId) =>
  masterData.items.find((item) => item.id === itemId) || null;

const getPartnerById = (masterData, partnerId) =>
  masterData.partners.find((item) => item.id === partnerId) || null;

const getUnitById = (masterData, unitId) =>
  masterData.units.find((item) => item.id === unitId) || null;

const getFarmById = (masterData, farmId) =>
  masterData.farms.find((item) => item.id === farmId) || null;

const getBatchById = (masterData, batchId) =>
  masterData.batches.find((item) => item.id === batchId) || null;

const getFarmTypeById = (masterData, farmTypeId) =>
  masterData.farmTypes.find((item) => item.id === farmTypeId) || null;

const getSaleTypeLabel = (value) =>
  SALE_TYPE_OPTIONS.find((option) => option.value === value)?.label || "Per Kilo";

const getSaleTypeKey = (value) => (value === "per_quantity" ? "quantity" : "kilo");

const getSaleTypeByFarmId = (masterData, farmId) => {
  const farm = getFarmById(masterData, farmId);
  return getFarmTypeById(masterData, farm?.farm_type_id)?.sale_type || "per_kilo";
};

const getFarmsByFarmType = (masterData, farmTypeId) =>
  masterData.farms.filter((farm) => !farmTypeId || farm.farm_type_id === farmTypeId);

const getBatchesByFarm = (masterData, farmId) =>
  masterData.batches.filter((batch) => !farmId || batch.farm_id === farmId);

const getBatchSortValue = (batch) => {
  const startTime = batch?.start_date ? Date.parse(batch.start_date) : Number.NEGATIVE_INFINITY;
  const endTime = batch?.end_date ? Date.parse(batch.end_date) : Number.NEGATIVE_INFINITY;
  const createdTime = batch?.created_at ? Date.parse(batch.created_at) : Number.NEGATIVE_INFINITY;
  return Math.max(startTime, endTime, createdTime);
};

const getLatestBatchForFarm = (masterData, farmId) => {
  const batches = getBatchesByFarm(masterData, farmId);
  if (!batches.length) return null;
  return [...batches].sort((a, b) => {
    const diff = getBatchSortValue(b) - getBatchSortValue(a);
    if (diff !== 0) return diff;
    return String(b.name || "").localeCompare(String(a.name || ""));
  })[0];
};

const getDefaultFarmId = (masterData, fallbackFarmId = null) => masterData.farms[0]?.id || fallbackFarmId || "";

const getDefaultBatchId = (masterData, farmId, fallbackBatchId = null) =>
  getLatestBatchForFarm(masterData, farmId)?.id || (!farmId ? fallbackBatchId || "" : "");

const orderByStoredIds = (items, orderedIds = []) => {
  const orderIndex = new Map(orderedIds.map((id, index) => [id, index]));
  return [...items].sort((a, b) => {
    const aIndex = orderIndex.has(a.id) ? orderIndex.get(a.id) : Number.POSITIVE_INFINITY;
    const bIndex = orderIndex.has(b.id) ? orderIndex.get(b.id) : Number.POSITIVE_INFINITY;
    if (aIndex !== bIndex) return aIndex - bIndex;
    return String(a.name || "").localeCompare(String(b.name || ""));
  });
};

const moveIdBefore = (orderedIds, sourceId, targetId) => {
  const next = orderedIds.filter((id) => id !== sourceId);
  const targetIndex = next.indexOf(targetId);
  if (targetIndex < 0) {
    next.push(sourceId);
    return next;
  }
  next.splice(targetIndex, 0, sourceId);
  return next;
};

const createExpenseDraftFromMaster = (masterData, fallbackFarmId = null, fallbackBatchId = null) => {
  const farm_id = getDefaultFarmId(masterData, fallbackFarmId);
  return {
    ...createExpenseDraft(),
    farm_id,
    batch_id: getDefaultBatchId(masterData, farm_id, fallbackBatchId),
    category_id: masterData.categories[0]?.id || "",
    sub_category_id: masterData.subCategories[0]?.id || "",
    item_id: masterData.items[0]?.id || "",
    partner_id: masterData.partners[0]?.id || "",
    unit_id: masterData.units[0]?.id || "",
  };
};

const createSaleDraftFromMaster = (masterData, fallbackFarmId = null, fallbackBatchId = null) => {
  const farm_id = getDefaultFarmId(masterData, fallbackFarmId);
  return {
    ...createSaleDraft(),
    farm_id,
    batch_id: getDefaultBatchId(masterData, farm_id, fallbackBatchId),
    item_id: masterData.items[0]?.id || "",
    partner_id: masterData.partners[0]?.id || "",
    unit_id: masterData.units[0]?.id || "",
  };
};

const getExpenseAmount = (row) => {
  const quantity = Number(row?.quantity ?? row?.amount_qty ?? 0);
  const unitCost = Number(row?.unit_cost ?? row?.amount ?? 0);
  const computed = quantity * unitCost;
  const stored = Number(row?.total_amount ?? 0);
  return computed > 0 ? computed : stored > 0 ? stored : unitCost;
};
const getSaleQuantity = (row) => toNumberOrNull(row?.quantity) ?? 0;
const getSaleUnitPrice = (row) => toNumberOrNull(row?.unit_price) ?? toNumberOrNull(row?.pricePerKg) ?? 0;
const getSaleAmount = (row) => {
  const quantity = getSaleQuantity(row);
  const unitPrice = getSaleUnitPrice(row);
  const computed = quantity * unitPrice;
  const stored = Number(row?.total_amount ?? 0);
  return computed > 0 ? computed : stored > 0 ? stored : unitPrice;
};

const getExpenseGroup = (row, masterData) => {
  if (row?.category) return row.category;
  const category = getCategoryById(masterData, row?.category_id);
  const categoryCode = normalizeLabel(category?.code);
  if (categoryCode === "feed") return "Bahog";
  if (categoryCode === "stock_purchase") return "Piglets";
  if (categoryCode === "misc") return "Misc";
  return category?.name || "";
};

const getExpenseSubGroup = (row, masterData) => {
  if (row?.subcategory) return row.subcategory;
  const subCategory = getSubCategoryById(masterData, row?.sub_category_id);
  return subCategory?.name || subCategory?.code || "";
};

const getExpenseLabel = (row, masterData) => {
  const item = getItemById(masterData, row?.item_id);
  const partner = getPartnerById(masterData, row?.partner_id);
  const unit = getUnitById(masterData, row?.unit_id);
  return {
    category: getExpenseGroup(row, masterData),
    subcategory: getExpenseSubGroup(row, masterData),
    item: item?.name || item?.code || row?.item || "",
    partner: partner?.name || row?.partner || "",
    unit: unit?.name || unit?.code || row?.unit || "",
  };
};

const getSaleLabel = (row, masterData) => {
  const item = getItemById(masterData, row?.item_id);
  const partner = getPartnerById(masterData, row?.partner_id);
  const unit = getUnitById(masterData, row?.unit_id);
  const batch = getBatchById(masterData, row?.batch_id);
  const farm = getFarmById(masterData, row?.farm_id);
  const farmType = getFarmTypeById(masterData, row?.farm_type_id || farm?.farm_type_id);
  return {
    farm: farm?.name || row?.farm_name || "",
    farmType: farmType?.name || row?.farm_type_name || "",
    batch: batch?.name || row?.batch_name || "",
    item: item?.name || item?.code || row?.item || row?.name || "",
    partner: partner?.name || row?.partner || "",
    unit: unit?.name || unit?.code || row?.unit || "",
  };
};

const buildExpensePayload = (row, masterData, farmId, batchId) => {
  const farm = masterData.farms.find((item) => item.id === row.farm_id) || getFarmById(masterData, farmId);
  const resolvedFarmId = farm?.id || farmId || getDefaultFarmId(masterData);
  const category =
    masterData.categories.find((item) => item.id === row.category_id) ||
    masterData.categories.find((item) => normalizeLabel(item.name) === normalizeLabel(row.category)) ||
    masterData.categories.find((item) => normalizeLabel(item.code) === normalizeLabel(row.category));

  const subCategory =
    masterData.subCategories.find((item) => item.id === row.sub_category_id) ||
    masterData.subCategories.find(
      (item) =>
        item.category_id === category?.id &&
        (normalizeLabel(item.name) === normalizeLabel(row.subcategory) ||
          normalizeLabel(item.code) === normalizeLabel(row.subcategory))
    ) ||
    masterData.subCategories.find(
      (item) => normalizeLabel(item.name) === normalizeLabel(row.subcategory) || normalizeLabel(item.code) === normalizeLabel(row.subcategory)
    );

  const item = masterData.items.find((entry) => entry.id === row.item_id);
  const partner = masterData.partners.find((entry) => entry.id === row.partner_id);
  const unit = masterData.units.find((entry) => entry.id === row.unit_id);
  const batch = masterData.batches.find((entry) => entry.id === row.batch_id) || masterData.batches.find((entry) => entry.id === batchId);

  return {
    id: row.id,
    farm_id: resolvedFarmId || null,
    batch_id: batch?.id || row.batch_id || batchId || getDefaultBatchId(masterData, resolvedFarmId) || null,
    expense_date: row.date || row.expense_date || todayIso(),
    category_id: category?.id || masterData.categories[0]?.id || null,
    sub_category_id: subCategory?.id || null,
    quantity: toNumberOrNull(row.quantity) ?? 1,
    unit_id: unit?.id || null,
    unit_cost: toNumberOrNull(row.unit_cost ?? row.amount) ?? 0,
    total_amount:
      toNumberOrNull(row.total_amount) ??
      (toNumberOrNull(row.quantity) ?? 1) * (toNumberOrNull(row.unit_cost ?? row.amount) ?? 0),
    remarks: row.remarks || null,
    item_id: item?.id || null,
    partner_id: partner?.id || null,
  };
};

const buildSalePayload = (row, masterData, farmId, batchId) => {
  const farm = masterData.farms.find((item) => item.id === row.farm_id) || getFarmById(masterData, farmId);
  const resolvedFarmId = farm?.id || farmId || getDefaultFarmId(masterData);
  const batch = masterData.batches.find((entry) => entry.id === row.batch_id) || masterData.batches.find((entry) => entry.id === batchId);
  const quantity = getSaleQuantity(row);
  const unitPrice = getSaleUnitPrice(row);
  const totalAmount = quantity * unitPrice;

  return {
    id: row.id,
    farm_id: resolvedFarmId || null,
    batch_id: batch?.id || row.batch_id || batchId || getDefaultBatchId(masterData, resolvedFarmId) || null,
    sale_date: row.date || row.sale_date || todayIso(),
    item_id: row.item_id || null,
    partner_id: row.partner_id || null,
    quantity,
    unit_id: row.unit_id || null,
    unit_price: unitPrice,
    total_amount: totalAmount || null,
    remarks: row.remarks || row.name || null,
  };
};

function NumberCell({ value, onChange }) {
  return <Input type="number" value={value ?? ""} onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))} className="h-9 min-w-[88px] rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900" />;
}

function TextCell({ value, onChange, placeholder }) {
  return <Input type="text" value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="h-9 min-w-[120px] rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900" />;
}

function DateCell({ value, onChange }) {
  return <Input type="date" value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="h-9 min-w-[140px] rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900" />;
}

function SelectCell({ value, onChange, children }) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className="h-9 min-w-[130px] rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
    >
      {children}
    </select>
  );
}

function FieldGroup({ label, hint, className = "", children }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{label}</p>
      {children}
    </div>
  );
}

function Modal({ open, title, description, onClose, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
            {description ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
          </div>
          <Button variant="ghost" size="icon" className="rounded-2xl" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer ? <div className="border-t border-slate-200 px-6 py-4 dark:border-slate-800">{footer}</div> : null}
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, trend, color = "slate" }) {
  const colors = {
    green: "from-emerald-500 to-emerald-600",
    red: "from-rose-500 to-rose-600",
    blue: "from-blue-500 to-blue-600",
    orange: "from-amber-500 to-amber-600",
    slate: "from-slate-700 to-slate-900",
  };

  return (
    <Card className={`rounded-3xl border-0 text-white shadow-sm bg-gradient-to-br ${colors[color]}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm opacity-80">{title}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
            {trend !== undefined && (
              <div className="mt-1 flex items-center gap-1 text-xs opacity-80">
                {Number(trend) >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(Number(trend)).toFixed(1)}%
              </div>
            )}
          </div>
          <div className="rounded-2xl bg-white/20 p-3"><Icon className="h-5 w-5" /></div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatMiniCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
      </div>
      <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function ShellNavItem({ icon: Icon, label, active = false, onClick }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition ${active ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"}`}>
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function AuthScreen({ form, loading, error, notice, onSubmit, onFormChange }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_32%),linear-gradient(135deg,_#f8fafc_0%,_#eff6ff_48%,_#ecfeff_100%)] text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.08fr,0.92fr]">
        <div className="flex flex-col justify-between gap-10 px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-white shadow-lg shadow-slate-900/20 dark:bg-white dark:text-slate-900">
              <PiggyBank className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">Agri Business Tracker</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Supabase-powered farm finance</p>
            </div>
          </div>

          <div className="max-w-2xl space-y-6">
            <Badge className="rounded-full border-0 bg-white/80 px-3 py-1 text-slate-700 shadow-sm backdrop-blur dark:bg-slate-900/80 dark:text-slate-200">
              Supabase Auth
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Sign in to manage your farm finances securely.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
                Use your Supabase account to unlock the dashboard, master data, expenses, and sales records tied to your farm workspace.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
                <LockKeyhole className="h-5 w-5 text-emerald-600" />
                <p className="mt-3 text-sm font-medium">Session-based login</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Supabase keeps users signed in safely.</p>
              </div>
              <div className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <p className="mt-3 text-sm font-medium">RLS-ready access</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your auth token is sent with every request.</p>
              </div>
              <div className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
                <UserRound className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                <p className="mt-3 text-sm font-medium">Workspace bound</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Each login can map to a separate farm owner.</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Tip: use the same email and password assigned in Supabase Auth.
          </p>
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
          <Card className="w-full max-w-md rounded-[2rem] border-slate-200 bg-white/95 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
            <CardHeader className="space-y-3">
              <Badge className="w-fit rounded-full border-0 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                Protected access
              </Badge>
              <CardTitle className="text-2xl tracking-tight">Welcome back</CardTitle>
              <CardDescription>Use your email and password to unlock the farm dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(event) => onFormChange({ email: event.target.value })}
                    placeholder="name@example.com"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(event) => onFormChange({ password: event.target.value })}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>

                {error ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200">
                    {error}
                  </div>
                ) : null}

                {notice ? (
                  <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-200">
                    {notice}
                  </div>
                ) : null}

                <Button type="submit" className="h-11 w-full rounded-2xl" disabled={loading}>
                  {loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Sign in
                </Button>
              </form>

              <div className="mt-5 flex items-center justify-end gap-3">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function PigFarmBudgetDashboard() {
  const [store, setStore] = useState(initialStore);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured());
  const [authUser, setAuthUser] = useState(null);
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authNotice, setAuthNotice] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [dark, setDark] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [farmId, setFarmId] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [masterData, setMasterData] = useState({ farmTypes: [], farms: [], batches: [], units: [], categories: [], subCategories: [], items: [], partners: [] });
  const [expenseRows, setExpenseRows] = useState([]);
  const [saleRows, setSaleRows] = useState([]);
  const [masterLoading, setMasterLoading] = useState(false);
  const [masterError, setMasterError] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState("");
  const [mastersSection, setMastersSection] = useState("structure");
  const [mastersBatchFarmFilterId, setMastersBatchFarmFilterId] = useState("");
  const [mastersCategoryFilterId, setMastersCategoryFilterId] = useState("");
  const [mastersOrder, setMastersOrder] = useState(() => {
    try {
      const savedOrder = localStorage.getItem(MASTER_ORDER_KEY);
      if (!savedOrder) return { categories: [], subCategories: [] };
      const parsed = JSON.parse(savedOrder);
      return {
        categories: Array.isArray(parsed?.categories) ? parsed.categories : [],
        subCategories: Array.isArray(parsed?.subCategories) ? parsed.subCategories : [],
      };
    } catch {
      return { categories: [], subCategories: [] };
    }
  });
  const [mastersDragState, setMastersDragState] = useState({ kind: "", id: "" });
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [saleDialogOpen, setSaleDialogOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState(createExpenseDraft);
  const [saleForm, setSaleForm] = useState(createSaleDraft);
  const [farmTypeForm, setFarmTypeForm] = useState({ name: "", sale_type: "per_kilo" });
  const [farmForm, setFarmForm] = useState({ farm_type_id: "", name: "", location: "", notes: "" });
  const [batchForm, setBatchForm] = useState({
    farm_id: "",
    name: "",
    status: "active",
    start_date: todayIso(),
    end_date: "",
  });
  const [categoryForm, setCategoryForm] = useState({ name: "", category_group: "" });
  const [subCategoryForm, setSubCategoryForm] = useState({ category_id: "", name: "" });
  const [reportFarmTypeId, setReportFarmTypeId] = useState("");
  const [reportFarmId, setReportFarmId] = useState("");
  const [reportBatchId, setReportBatchId] = useState("");
  const authEnabled = isSupabaseConfigured();
  const recordWritesEnabled = authEnabled;
  const recordWriteMessage = "Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY before adding records.";

  useEffect(() => {
    if (!authEnabled || !supabase) {
      setAuthReady(true);
      return;
    }

    let cancelled = false;

    const syncSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (cancelled) return;
      if (error) {
        setAuthError(error.message || "Failed to load the Supabase session.");
      }
      setAuthUser(data.session?.user ?? null);
      setAuthReady(true);
    };

    syncSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      setAuthUser(session?.user ?? null);
      setAuthError("");
      setAuthNotice("");
      setAuthReady(true);
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [authEnabled]);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      if (authEnabled) {
        if (!authUser) {
          if (!cancelled) {
            setStore(initialStore);
            setExpenseRows([]);
            setSaleRows([]);
            setFarmId(null);
            setHydrated(false);
          }
          return;
        }

        try {
          const remote = await loadAppState();
          if (cancelled) return;

          if (remote?.state) {
            setStore(sanitizeEmptyFinanceRows({ ...initialStore, ...remote.state }));
            setFarmId(remote.farmId);
            setHydrated(true);
            return;
          }

          if (remote?.farmId) {
            setFarmId(remote.farmId);
          }

          setStore(initialStore);
          setHydrated(true);
          return;
        } catch {
        if (cancelled) return;
        setHydrated(false);
          return;
        }
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        if (!cancelled) {
          setHydrated(true);
        }
        return;
      }

      try {
        const parsed = JSON.parse(saved);
        if (!cancelled && (parsed?.expenses || parsed?.sales)) {
          setStore(sanitizeEmptyFinanceRows({ ...initialStore, ...parsed }));
        }
      } catch {
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    };

    hydrate();

    return () => {
      cancelled = true;
    };
  }, [authEnabled, authUser]);

  useEffect(() => {
    try {
      localStorage.setItem(MASTER_ORDER_KEY, JSON.stringify(mastersOrder));
    } catch {
      // Ignore storage failures.
    }
  }, [mastersOrder]);

  useEffect(() => {
    if (!authEnabled || !authUser) return;

    let cancelled = false;
    const loadMasterTables = async () => {
      setMasterLoading(true);
      setMasterError("");
      try {
        const [farmTypes, farms, batches, units, categories, subCategories, items, partners] = await Promise.all([
          farmCrud.listFarmTypes(),
          farmCrud.listFarms(),
          farmCrud.listBatches(),
          farmCrud.listUnits(),
          farmCrud.listCategories(),
          farmCrud.listSubCategories(),
          farmCrud.listItems(),
          farmCrud.listPartners(),
        ]);
        if (cancelled) return;

        const nextMasterData = {
          farmTypes: farmTypes ?? [],
          farms: farms ?? [],
          batches: batches ?? [],
          units: units ?? [],
          categories: categories ?? [],
          subCategories: subCategories ?? [],
          items: items ?? [],
          partners: partners ?? [],
        };
        syncMasterOrderState(nextMasterData);
        setExpenseForm((current) => ({
          ...createExpenseDraftFromMaster(nextMasterData, current.farm_id, current.batch_id),
          ...current,
          farm_id: current.farm_id || getDefaultFarmId(nextMasterData, farms?.[0]?.id || ""),
          batch_id: current.batch_id || getDefaultBatchId(nextMasterData, current.farm_id || getDefaultFarmId(nextMasterData, farms?.[0]?.id || ""), batches?.[0]?.id || ""),
          category_id: current.category_id || categories?.[0]?.id || "",
          sub_category_id: current.sub_category_id || subCategories?.[0]?.id || "",
          item_id: current.item_id || items?.[0]?.id || "",
          partner_id: current.partner_id || partners?.[0]?.id || "",
          unit_id: current.unit_id || units?.[0]?.id || "",
        }));
        setSaleForm((current) => ({
          ...createSaleDraftFromMaster(nextMasterData, current.farm_id, current.batch_id),
          ...current,
          farm_id: current.farm_id || getDefaultFarmId(nextMasterData, farms?.[0]?.id || ""),
          batch_id: current.batch_id || getDefaultBatchId(nextMasterData, current.farm_id || getDefaultFarmId(nextMasterData, farms?.[0]?.id || ""), batches?.[0]?.id || ""),
          item_id: current.item_id || items?.[0]?.id || "",
          partner_id: current.partner_id || partners?.[0]?.id || "",
          unit_id: current.unit_id || units?.[0]?.id || "",
        }));
        setSubCategoryForm((current) => ({
          ...current,
          category_id: current.category_id || categories?.[0]?.id || "",
        }));
        setFarmForm((current) => ({
          ...current,
          farm_type_id: current.farm_type_id || farmTypes?.[0]?.id || "",
        }));
    setBatchForm((current) => ({
      ...current,
      farm_id: current.farm_id || farms?.[0]?.id || "",
    }));
      } catch (error) {
        if (!cancelled) {
          setMasterError(error.message || "Failed to load master tables.");
        }
      } finally {
        if (!cancelled) {
          setMasterLoading(false);
        }
      }
    };

    loadMasterTables();
    return () => {
      cancelled = true;
    };
  }, [authEnabled, authUser]);

  useEffect(() => {
    if (!authEnabled || !authUser) return;

    let cancelled = false;
    const loadFinanceRows = async () => {
      setTableLoading(true);
      setTableError("");
      try {
        const [expensesRows, salesRows] = await Promise.all([
          farmCrud.listExpenses(),
          farmCrud.listSales(),
        ]);
        if (cancelled) return;
        const snapshot = {
          farmTypes: masterData.farmTypes ?? [],
          farms: masterData.farms ?? [],
          batches: masterData.batches ?? [],
          units: masterData.units ?? [],
          categories: masterData.categories ?? [],
          subCategories: masterData.subCategories ?? [],
          items: masterData.items ?? [],
          partners: masterData.partners ?? [],
        };
        setExpenseRows((expensesRows ?? []).map((row) => mapExpenseRowFromDb(row, snapshot)));
        setSaleRows((salesRows ?? []).map((row) => mapSaleRowFromDb(row, snapshot)));
      } catch (error) {
        if (!cancelled) {
          setTableError(error.message || "Failed to load Supabase rows.");
        }
      } finally {
        if (!cancelled) {
          setTableLoading(false);
        }
      }
    };

    loadFinanceRows();
    return () => {
      cancelled = true;
    };
  }, [authEnabled, authUser, masterData]);

  useEffect(() => {
    if (activePage === "masters" && !isSupabaseConfigured()) {
      setMasterError("Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to manage master tables.");
    }
  }, [activePage]);

  useEffect(() => {
    if (authEnabled && !authUser) return;
    if (!hydrated) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [authEnabled, authUser, store, farmId, hydrated]);

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    if (!supabase) return;

    const email = authForm.email.trim();
    const password = authForm.password;

    if (!email || !password) {
      setAuthError("Enter both an email and password.");
      return;
    }

    setAuthSubmitting(true);
    setAuthError("");
    setAuthNotice("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setAuthNotice("Signed in. Loading your dashboard...");
    } catch (error) {
      setAuthError(error.message || "Authentication failed.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    setAuthError("");
    setAuthNotice("");
    await supabase.auth.signOut();
  };

  const expenses = isSupabaseConfigured() ? expenseRows : store.expenses ?? [];
  const sales = isSupabaseConfigured() ? saleRows : store.sales ?? [];
  const pigPen = store.pigPen ?? 0;
  const alagaFee = store.alagaFee ?? 0;
  const previousDeficit = store.previousDeficit ?? 0;
  const defaultCategoryId = masterData.categories[0]?.id || null;
  const defaultFarmId = getDefaultFarmId(masterData, farmId);
  const defaultBatchId = getDefaultBatchId(masterData, defaultFarmId);

  const bahogTotals = useMemo(() => {
    const bahogExpenses = expenses.filter((row) => getExpenseGroup(row, masterData) === "Bahog");
    const feedSubNames = ["Pamasahe", "Vitamins / Meds", "Vitamins", "Pre-Starter", "Starter", "Grower", "Finisher"];
    return {
      pamasahe: bahogExpenses.filter((row) => feedSubNames.includes(getExpenseSubGroup(row, masterData)) && /pamasahe/i.test(getExpenseSubGroup(row, masterData))).reduce((sum, row) => sum + getExpenseAmount(row), 0),
      vitamins: bahogExpenses.filter((row) => /vitamin/i.test(getExpenseSubGroup(row, masterData))).reduce((sum, row) => sum + getExpenseAmount(row), 0),
      preStarter: bahogExpenses.filter((row) => /pre[- ]?starter/i.test(getExpenseSubGroup(row, masterData))).reduce((sum, row) => sum + getExpenseAmount(row), 0),
      starter: bahogExpenses.filter((row) => /^starter$/i.test(getExpenseSubGroup(row, masterData))).reduce((sum, row) => sum + getExpenseAmount(row), 0),
      grower: bahogExpenses.filter((row) => /^grower$/i.test(getExpenseSubGroup(row, masterData))).reduce((sum, row) => sum + getExpenseAmount(row), 0),
      finisher: bahogExpenses.filter((row) => /^finisher$/i.test(getExpenseSubGroup(row, masterData))).reduce((sum, row) => sum + getExpenseAmount(row), 0),
      grandTotal: bahogExpenses.reduce((sum, row) => sum + getExpenseAmount(row), 0)
    };
  }, [expenses, masterData]);

  const totalExpenseAmount = useMemo(
    () => expenses.reduce((sum, row) => sum + getExpenseAmount(row), 0),
    [expenses]
  );
  const pigletTotal = useMemo(() => expenses.filter((row) => getExpenseGroup(row, masterData) === "Piglets").reduce((sum, row) => sum + getExpenseAmount(row), 0), [expenses, masterData]);
  const miscTotal = useMemo(() => expenses.filter((row) => getExpenseGroup(row, masterData) === "Misc").reduce((sum, row) => sum + getExpenseAmount(row), 0), [expenses, masterData]);
  const actualExpenses = totalExpenseAmount;
  const otherExpenses = previousDeficit + pigPen + alagaFee;
  const overallCost = actualExpenses + otherExpenses;
  const salesRows = useMemo(() => sales.map((row) => ({ ...row, sale: getSaleAmount(row), ...getSaleLabel(row, masterData) })), [sales, masterData]);
  const totalWeight = salesRows.reduce((sum, row) => sum + (Number(row.quantity) || 0), 0);
  const totalSale = salesRows.reduce((sum, row) => sum + getSaleAmount(row), 0);
  const net = totalSale - overallCost;
  const profitTrend = overallCost > 0 ? (net / overallCost) * 100 : 0;

  const reportFarm = getFarmById(masterData, reportFarmId);
  const reportBatchOptions = reportFarm
    ? getBatchesByFarm(masterData, reportFarm.id)
    : reportFarmTypeId
      ? masterData.batches.filter((batch) => getFarmById(masterData, batch.farm_id)?.farm_type_id === reportFarmTypeId)
      : masterData.batches;

  const matchesReportFilters = (row) => {
    const rowFarm = getFarmById(masterData, row?.farm_id);
    const rowFarmTypeId = row?.farm_type_id || rowFarm?.farm_type_id || "";
    if (reportFarmTypeId && rowFarmTypeId !== reportFarmTypeId) return false;
    if (reportFarmId && row?.farm_id !== reportFarmId) return false;
    if (reportBatchId && row?.batch_id !== reportBatchId) return false;
    return true;
  };

  const reportExpenses = useMemo(() => expenses.filter(matchesReportFilters), [expenses, reportFarmTypeId, reportFarmId, reportBatchId, masterData]);
  const reportSales = useMemo(() => sales.filter(matchesReportFilters), [sales, reportFarmTypeId, reportFarmId, reportBatchId, masterData]);
  const reportExpenseTotal = reportExpenses.reduce((sum, row) => sum + getExpenseAmount(row), 0);
  const reportSaleTotal = reportSales.reduce((sum, row) => sum + getSaleAmount(row), 0);
  const reportNet = reportSaleTotal - reportExpenseTotal;
  const reportBatchBreakdown = useMemo(() => {
    const batches = reportBatchId ? masterData.batches.filter((batch) => batch.id === reportBatchId) : reportBatchOptions;

    return batches.map((batch) => {
      const batchExpenses = reportExpenses.filter((row) => row.batch_id === batch.id);
      const batchSales = reportSales.filter((row) => row.batch_id === batch.id);
      const expenseTotal = batchExpenses.reduce((sum, row) => sum + getExpenseAmount(row), 0);
      const saleTotal = batchSales.reduce((sum, row) => sum + getSaleAmount(row), 0);
      return {
        batch,
        expenseTotal,
        saleTotal,
        net: saleTotal - expenseTotal,
        expenseCount: batchExpenses.length,
        saleCount: batchSales.length,
      };
    });
  }, [masterData.batches, reportBatchId, reportBatchOptions, reportExpenses, reportSales]);
  const reportBatchChartData = reportBatchBreakdown.map((entry) => ({
    name: entry.batch.name,
    saleTotal: entry.saleTotal,
    expenseTotal: entry.expenseTotal,
  }));

  const expenseCategoryChartData = useMemo(() => {
    const totals = new Map();
    reportExpenses.forEach((row) => {
      const label = getExpenseGroup(row, masterData) || "Uncategorized";
      totals.set(label, (totals.get(label) || 0) + getExpenseAmount(row));
    });
    return [...totals.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [reportExpenses, masterData]);

  const orderedCategories = useMemo(
    () => orderByStoredIds(masterData.categories, mastersOrder.categories),
    [masterData.categories, mastersOrder.categories]
  );
  const orderedSubCategories = useMemo(
    () => orderByStoredIds(masterData.subCategories, mastersOrder.subCategories),
    [masterData.subCategories, mastersOrder.subCategories]
  );

  const syncMasterOrderState = (nextMasterData) => {
    const nextCategories = orderByStoredIds(nextMasterData.categories, mastersOrder.categories);
    const nextSubCategories = orderByStoredIds(nextMasterData.subCategories, mastersOrder.subCategories);
    setMasterData({
      ...nextMasterData,
      categories: nextCategories,
      subCategories: nextSubCategories,
    });
    setMastersOrder((current) => ({
      categories: nextCategories.map((item) => item.id),
      subCategories: nextSubCategories.map((item) => item.id),
    }));
  };

  const handleCategoryDragStart = (categoryId) => {
    setMastersDragState({ kind: "category", id: categoryId });
  };

  const handleCategoryDrop = (targetCategoryId) => {
    if (mastersDragState.kind !== "category" || !mastersDragState.id || mastersDragState.id === targetCategoryId) {
      setMastersDragState({ kind: "", id: "" });
      return;
    }
    setMastersOrder((current) => ({
      ...current,
      categories: moveIdBefore(current.categories.length ? current.categories : masterData.categories.map((item) => item.id), mastersDragState.id, targetCategoryId),
    }));
    setMastersDragState({ kind: "", id: "" });
  };

  const handleSubCategoryDragStart = (subCategoryId) => {
    setMastersDragState({ kind: "subCategory", id: subCategoryId });
  };

  const handleSubCategoryDrop = (targetSubCategoryId) => {
    if (mastersDragState.kind !== "subCategory" || !mastersDragState.id || mastersDragState.id === targetSubCategoryId) {
      setMastersDragState({ kind: "", id: "" });
      return;
    }
    setMastersOrder((current) => ({
      ...current,
      subCategories: moveIdBefore(
        current.subCategories.length ? current.subCategories : masterData.subCategories.map((item) => item.id),
        mastersDragState.id,
        targetSubCategoryId
      ),
    }));
    setMastersDragState({ kind: "", id: "" });
  };

  const masterSections = [
    { id: "structure", label: "Farm Structure", description: "Farm types, farms, batches" },
    { id: "reference", label: "Reference Tables", description: "Categories and subcategories" },
  ];

  const expenseChartData = [
    { name: "Sales", value: totalSale, color: "#10b981" },
    { name: "Cost", value: overallCost, color: "#ef4444" },
  ];

  const feedCategoryChartData = [
    { name: "Pamasahe", value: bahogTotals.pamasahe },
    { name: "Vitamins", value: bahogTotals.vitamins },
    { name: "Pre", value: bahogTotals.preStarter },
    { name: "Starter", value: bahogTotals.starter },
    { name: "Grower", value: bahogTotals.grower },
    { name: "Finisher", value: bahogTotals.finisher },
  ];

  const sortedExpenses = useMemo(
    () =>
      expenses
        .map((row, originalIndex) => ({ row, originalIndex }))
        .sort(
          (a, b) =>
            Number(Boolean(isDraftId(a.row.id))) - Number(Boolean(isDraftId(b.row.id))) ||
            (a.row.date || a.row.expense_date || "").localeCompare(b.row.date || b.row.expense_date || "") ||
            getExpenseGroup(a.row, masterData).localeCompare(getExpenseGroup(b.row, masterData))
        ),
    [expenses, masterData]
  );

  const sortedSalesRows = useMemo(
    () =>
      sales
        .map((row, originalIndex) => ({ row, originalIndex }))
        .sort(
          (a, b) =>
            Number(Boolean(isDraftId(a.row.id))) - Number(Boolean(isDraftId(b.row.id))) ||
            (a.row.date || a.row.sale_date || "").localeCompare(b.row.date || b.row.sale_date || "") ||
            String(getSaleLabel(a.row, masterData).batch || "").localeCompare(String(getSaleLabel(b.row, masterData).batch || ""))
        ),
    [sales, masterData]
  );

  const visibleSalesRows = useMemo(
    () => sortedSalesRows.filter(({ row }) => matchesReportFilters(row)),
    [sortedSalesRows, reportFarmTypeId, reportFarmId, reportBatchId, masterData]
  );
  const visibleExpenseRows = useMemo(
    () => sortedExpenses.filter(({ row }) => matchesReportFilters(row)),
    [sortedExpenses, reportFarmTypeId, reportFarmId, reportBatchId, masterData]
  );
  const visibleSalesTotal = visibleSalesRows.reduce((sum, row) => sum + getSaleAmount(row), 0);
  const visibleSalesWeight = visibleSalesRows.reduce((sum, row) => sum + (Number(row.quantity) || 0), 0);
  const visibleExpenseTotal = visibleExpenseRows.reduce((sum, { row }) => sum + getExpenseAmount(row), 0);

  const salesQuantityHeader = useMemo(() => {
    const saleTypeSet = new Set(
      sortedSalesRows
        .filter(({ row }) => matchesReportFilters(row))
        .map(({ row }) => getSaleTypeByFarmId(masterData, row.farm_id))
    );
    if (saleTypeSet.size === 1) {
      return saleTypeSet.has("per_quantity") ? "Qty" : "Kgs";
    }
    return "Qty / Kgs";
  }, [sortedSalesRows, masterData, reportFarmTypeId, reportFarmId, reportBatchId]);

  const salesPriceHeader = useMemo(() => {
    const saleTypeSet = new Set(
      sortedSalesRows
        .filter(({ row }) => matchesReportFilters(row))
        .map(({ row }) => getSaleTypeByFarmId(masterData, row.farm_id))
    );
    if (saleTypeSet.size === 1) {
      return saleTypeSet.has("per_quantity") ? "Price / Unit" : "Price / Kg";
    }
    return "Price";
  }, [sortedSalesRows, masterData, reportFarmTypeId, reportFarmId, reportBatchId]);

  const saleFormQuantityLabel = getSaleTypeByFarmId(masterData, saleForm.farm_id || defaultFarmId) === "per_quantity" ? "Qty" : "Kgs";
  const saleFormPriceLabel = getSaleTypeByFarmId(masterData, saleForm.farm_id || defaultFarmId) === "per_quantity" ? "Price / Unit" : "Price / Kg";

  const pieColors = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444", "#14b8a6"];
  const refreshFinanceRows = async () => {
    if (!isSupabaseConfigured()) return;
    const [freshExpenses, freshSales] = await Promise.all([farmCrud.listExpenses(), farmCrud.listSales()]);
    const snapshot = {
      farmTypes: masterData.farmTypes ?? [],
      farms: masterData.farms ?? [],
      batches: masterData.batches ?? [],
      units: masterData.units ?? [],
      categories: masterData.categories ?? [],
      subCategories: masterData.subCategories ?? [],
      items: masterData.items ?? [],
      partners: masterData.partners ?? [],
    };
    setExpenseRows((freshExpenses ?? []).map((row) => mapExpenseRowFromDb(row, snapshot)));
    setSaleRows((freshSales ?? []).map((row) => mapSaleRowFromDb(row, snapshot)));
  };

  const syncExpenseSelection = (nextRow) => {
    const farm = getFarmById(masterData, nextRow.farm_id) || getFarmById(masterData, defaultFarmId);
    const farmBatches = getBatchesByFarm(masterData, farm?.id);
    const nextBatch = farmBatches.find((batch) => batch.id === nextRow.batch_id) || getLatestBatchForFarm(masterData, farm?.id);
    return {
      ...nextRow,
      farm_id: farm?.id || "",
      batch_id: nextBatch?.id || "",
    };
  };

  const syncSaleSelection = (nextRow) => {
    const farm = getFarmById(masterData, nextRow.farm_id) || getFarmById(masterData, defaultFarmId);
    const farmBatches = getBatchesByFarm(masterData, farm?.id);
    const nextBatch = farmBatches.find((batch) => batch.id === nextRow.batch_id) || getLatestBatchForFarm(masterData, farm?.id);
    return {
      ...nextRow,
      farm_id: farm?.id || "",
      batch_id: nextBatch?.id || "",
    };
  };

  const updateExpense = async (index, key, value) => {
    const row = expenses[index];
    if (!row?.id) return;
    const nextRow = syncExpenseSelection({
      ...row,
      [key]: value,
      ...(key === "date" ? { expense_date: value } : null),
    });
    nextRow.total_amount = getExpenseAmount(nextRow);
    setExpenseRows((current) => current.map((currentRow, currentIndex) => (currentIndex === index ? nextRow : currentRow)));
    if (!isUuid(row.id)) {
      return;
    }
    const payload = buildExpensePayload(nextRow, masterData, defaultFarmId, defaultBatchId);
    setTableError("");
    try {
      await farmCrud.updateExpense(row.id, payload);
    } catch (error) {
      setTableError(error.message || "Failed to update expense row.");
    }
  };

  const updateSale = async (index, key, value) => {
    const row = sales[index];
    if (!row?.id) return;
    const nextRow = syncSaleSelection({
      ...row,
      [key]: value,
      ...(key === "pricePerKg" ? { unit_price: value } : null),
      ...(key === "unit_price" ? { pricePerKg: value } : null),
      ...(key === "date" ? { sale_date: value } : null),
    });
    nextRow.total_amount = getSaleAmount(nextRow);
    setSaleRows((current) => current.map((currentRow, currentIndex) => (currentIndex === index ? nextRow : currentRow)));
    if (!isUuid(row.id)) {
      return;
    }
    const payload = buildSalePayload(nextRow, masterData, defaultFarmId, defaultBatchId);
    setTableError("");
    try {
      await farmCrud.updateSale(row.id, payload);
    } catch (error) {
      setTableError(error.message || "Failed to update sale row.");
    }
  };

  const appendExpenseDrafts = (count = 1) => {
    setExpenseRows((current) => [
      ...Array.from({ length: count }, () => createExpenseGridDraft(masterData, defaultFarmId, defaultBatchId)),
      ...current,
    ]);
  };

  const appendSaleDrafts = (count = 1) => {
    setSaleRows((current) => [
      ...Array.from({ length: count }, () => createSaleGridDraft(masterData, defaultFarmId, defaultBatchId)),
      ...current,
    ]);
  };

  const saveExpenseGridRow = async (index) => {
    const row = expenses[index];
    if (!row?.id || !isDraftId(row.id)) return;
    if (!recordWritesEnabled) {
      setTableError(recordWriteMessage);
      return;
    }
    const normalizedRow = {
      ...row,
      date: row.date || row.expense_date || todayIso(),
      expense_date: row.expense_date || row.date || todayIso(),
    };
    const payload = buildExpensePayload(normalizedRow, masterData, defaultFarmId, defaultBatchId);
    if (!payload.farm_id || !payload.batch_id) {
      setTableError("Select a farm and batch before saving the expense.");
      return;
    }
    setTableError("");
    try {
      const created = await farmCrud.createExpense(payload);
      const snapshot = {
        farmTypes: masterData.farmTypes ?? [],
        farms: masterData.farms ?? [],
        batches: masterData.batches ?? [],
        units: masterData.units ?? [],
        categories: masterData.categories ?? [],
        subCategories: masterData.subCategories ?? [],
        items: masterData.items ?? [],
        partners: masterData.partners ?? [],
      };
      const savedRow = mapExpenseRowFromDb(created, snapshot);
      setExpenseRows((current) => current.map((currentRow, currentIndex) => (currentIndex === index ? savedRow : currentRow)));
      if (isSupabaseConfigured()) {
        await refreshFinanceRows();
      }
    } catch (error) {
      setTableError(error.message || "Failed to create expense row.");
    }
  };

  const saveSaleGridRow = async (index) => {
    const row = sales[index];
    if (!row?.id || !isDraftId(row.id)) return;
    if (!recordWritesEnabled) {
      setTableError(recordWriteMessage);
      return;
    }
    const normalizedRow = {
      ...row,
      date: row.date || row.sale_date || todayIso(),
      sale_date: row.sale_date || row.date || todayIso(),
      unit_price: row.unit_price ?? row.pricePerKg ?? null,
      pricePerKg: row.pricePerKg ?? row.unit_price ?? null,
    };
    const payload = buildSalePayload(normalizedRow, masterData, defaultFarmId, defaultBatchId);
    if (!payload.farm_id || !payload.batch_id) {
      setTableError("Select a farm and batch before saving the sale.");
      return;
    }
    setTableError("");
    try {
      const created = await farmCrud.createSale(payload);
      const snapshot = {
        farmTypes: masterData.farmTypes ?? [],
        farms: masterData.farms ?? [],
        batches: masterData.batches ?? [],
        units: masterData.units ?? [],
        categories: masterData.categories ?? [],
        subCategories: masterData.subCategories ?? [],
        items: masterData.items ?? [],
        partners: masterData.partners ?? [],
      };
      const savedRow = mapSaleRowFromDb(created, snapshot);
      setSaleRows((current) => current.map((currentRow, currentIndex) => (currentIndex === index ? savedRow : currentRow)));
      if (isSupabaseConfigured()) {
        await refreshFinanceRows();
      }
    } catch (error) {
      setTableError(error.message || "Failed to create sale row.");
    }
  };

  const discardExpenseGridRow = (index) => {
    setExpenseRows((current) => current.filter((_, currentIndex) => currentIndex !== index));
  };

  const discardSaleGridRow = (index) => {
    setSaleRows((current) => current.filter((_, currentIndex) => currentIndex !== index));
  };

  const updateField = (field, value) => setStore((current) => ({ ...current, [field]: value }));

  const addExpenseRow = async () => {
    if (!recordWritesEnabled) {
      setTableError(recordWriteMessage);
      return;
    }
    if (!defaultCategoryId) {
      setTableError("Add a category first before creating expense rows.");
      return;
    }
    const payload = buildExpensePayload(expenseForm, masterData, defaultFarmId, defaultBatchId);
    if (!payload.farm_id || !payload.batch_id) {
      setTableError("Select a farm and batch before saving the expense.");
      return;
    }
    setTableError("");
    try {
      await farmCrud.createExpense(payload);
      setExpenseForm(createExpenseDraftFromMaster(masterData, payload.farm_id, payload.batch_id));
      setExpenseDialogOpen(false);
      await refreshFinanceRows();
    } catch (error) {
      setTableError(error.message || "Failed to create expense row.");
    }
  };

  const addSaleRow = async () => {
    if (!recordWritesEnabled) {
      setTableError(recordWriteMessage);
      return;
    }
    const payload = buildSalePayload(saleForm, masterData, defaultFarmId, defaultBatchId);
    if (!payload.farm_id || !payload.batch_id) {
      setTableError("Select a farm and batch before saving the sale.");
      return;
    }
    setTableError("");
    try {
      await farmCrud.createSale(payload);
      setSaleForm(createSaleDraftFromMaster(masterData, payload.farm_id, payload.batch_id));
      setSaleDialogOpen(false);
      await refreshFinanceRows();
    } catch (error) {
      setTableError(error.message || "Failed to create sale row.");
    }
  };

  const deleteExpenseRow = async (index) => {
    const row = expenses[index];
    if (!row?.id) return;
    if (!isUuid(row.id)) {
      setExpenseRows((current) => current.filter((_, currentIndex) => currentIndex !== index));
      return;
    }
    setTableError("");
    try {
      await farmCrud.deleteExpense(row.id);
      await refreshFinanceRows();
    } catch (error) {
      setTableError(error.message || "Failed to delete expense row.");
    }
  };

  const deleteSaleRow = async (index) => {
    const row = sales[index];
    if (!row?.id) return;
    if (!isUuid(row.id)) {
      setSaleRows((current) => current.filter((_, currentIndex) => currentIndex !== index));
      return;
    }
    setTableError("");
    try {
      await farmCrud.deleteSale(row.id);
      await refreshFinanceRows();
    } catch (error) {
      setTableError(error.message || "Failed to delete sale row.");
    }
  };

  const refreshMasters = async () => {
    const [farmTypes, farms, batches, units, categories, subCategories, items, partners] = await Promise.all([
      farmCrud.listFarmTypes(),
      farmCrud.listFarms(),
      farmCrud.listBatches(),
      farmCrud.listUnits(),
      farmCrud.listCategories(),
      farmCrud.listSubCategories(),
      farmCrud.listItems(),
      farmCrud.listPartners(),
    ]);
    const nextMasterData = {
      farmTypes: farmTypes ?? [],
      farms: farms ?? [],
      batches: batches ?? [],
      units: units ?? [],
      categories: categories ?? [],
      subCategories: subCategories ?? [],
      items: items ?? [],
      partners: partners ?? [],
    };
    syncMasterOrderState(nextMasterData);
    setExpenseForm((current) => ({
      ...current,
      farm_id:
        current.farm_id && nextMasterData.farms.some((farm) => farm.id === current.farm_id)
          ? current.farm_id
          : getDefaultFarmId(nextMasterData),
      batch_id:
        current.batch_id &&
        nextMasterData.batches.some(
          (batch) => batch.id === current.batch_id && batch.farm_id === (current.farm_id || getDefaultFarmId(nextMasterData))
        )
          ? current.batch_id
          : getDefaultBatchId(nextMasterData, current.farm_id || getDefaultFarmId(nextMasterData)),
      category_id: current.category_id || nextMasterData.categories[0]?.id || "",
      sub_category_id: current.sub_category_id || nextMasterData.subCategories[0]?.id || "",
      item_id: current.item_id || nextMasterData.items[0]?.id || "",
      partner_id: current.partner_id || nextMasterData.partners[0]?.id || "",
      unit_id: current.unit_id || nextMasterData.units[0]?.id || "",
    }));
    setSaleForm((current) => ({
      ...current,
      farm_id:
        current.farm_id && nextMasterData.farms.some((farm) => farm.id === current.farm_id)
          ? current.farm_id
          : getDefaultFarmId(nextMasterData),
      batch_id:
        current.batch_id &&
        nextMasterData.batches.some(
          (batch) => batch.id === current.batch_id && batch.farm_id === (current.farm_id || getDefaultFarmId(nextMasterData))
        )
          ? current.batch_id
          : getDefaultBatchId(nextMasterData, current.farm_id || getDefaultFarmId(nextMasterData)),
      item_id: current.item_id || nextMasterData.items[0]?.id || "",
      partner_id: current.partner_id || nextMasterData.partners[0]?.id || "",
      unit_id: current.unit_id || nextMasterData.units[0]?.id || "",
    }));
    setFarmForm((current) => ({
      ...current,
      farm_type_id: current.farm_type_id || farmTypes?.[0]?.id || "",
    }));
    setBatchForm((current) => ({
      ...current,
      farm_id: current.farm_id || farms?.[0]?.id || "",
    }));
    setSubCategoryForm((current) => ({
      ...current,
      category_id: current.category_id || categories?.[0]?.id || "",
    }));
  };

  const handleCreateFarmType = async (event) => {
    event.preventDefault();
    if (!recordWritesEnabled) {
      setMasterError(recordWriteMessage);
      return;
    }
    if (!farmTypeForm.name) return;
    try {
      await farmCrud.createFarmType({
        name: farmTypeForm.name.trim(),
        code: slugCode(farmTypeForm.name, "farm_type"),
        sale_type: farmTypeForm.sale_type || "per_kilo",
      });
      setFarmTypeForm({ name: "", sale_type: "per_kilo" });
      await refreshMasters();
    } catch (error) {
      setMasterError(error.message || "Failed to save farm type.");
    }
  };

  const handleDeleteFarmType = async (id) => {
    try {
      await farmCrud.deleteFarmType(id);
      await refreshMasters();
    } catch (error) {
      setMasterError(error.message || "Failed to delete farm type.");
    }
  };

  const handleCreateFarm = async (event) => {
    event.preventDefault();
    if (!recordWritesEnabled) {
      setMasterError(recordWriteMessage);
      return;
    }
    if (!farmForm.farm_type_id || !farmForm.name) return;
    try {
      await farmCrud.createFarm({
        farm_type_id: farmForm.farm_type_id,
        name: farmForm.name.trim(),
        location: farmForm.location.trim() || null,
        notes: farmForm.notes.trim() || null,
        ...(authUser?.id ? { created_by: authUser.id } : {}),
      });
      setFarmForm({
        farm_type_id: farmForm.farm_type_id,
        name: "",
        location: "",
        notes: "",
      });
      await refreshMasters();
    } catch (error) {
      setMasterError(error.message || "Failed to save farm.");
    }
  };

  const handleDeleteFarm = async (id) => {
    try {
      await farmCrud.deleteFarm(id);
      await refreshMasters();
    } catch (error) {
      setMasterError(error.message || "Failed to delete farm.");
    }
  };

  const handleCreateBatch = async (event) => {
    event.preventDefault();
    if (!recordWritesEnabled) {
      setMasterError(recordWriteMessage);
      return;
    }
    if (!batchForm.farm_id || !batchForm.name) return;
    try {
      await farmCrud.createBatch({
        farm_id: batchForm.farm_id,
        name: batchForm.name.trim(),
        status: batchForm.status || "active",
        start_date: batchForm.start_date || null,
        end_date: batchForm.end_date || null,
      });
      setBatchForm({
        ...batchForm,
        name: "",
      });
      await refreshMasters();
    } catch (error) {
      setMasterError(error.message || "Failed to save batch.");
    }
  };

  const handleDeleteBatch = async (id) => {
    try {
      await farmCrud.deleteBatch(id);
      await refreshMasters();
    } catch (error) {
      setMasterError(error.message || "Failed to delete batch.");
    }
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    if (!recordWritesEnabled) {
      setMasterError(recordWriteMessage);
      return;
    }
    if (!categoryForm.name) return;
    await farmCrud.createCategory({
      name: categoryForm.name.trim(),
      code: slugCode(categoryForm.name, "category"),
      category_group: categoryForm.category_group.trim() || null,
    });
    setCategoryForm({ name: "", category_group: "" });
    await refreshMasters();
  };

  const handleDeleteCategory = async (id) => {
    if (mastersCategoryFilterId === id) {
      setMastersCategoryFilterId("");
    }
    await farmCrud.deleteCategory(id);
    await refreshMasters();
  };

  const handleCreateSubCategory = async (event) => {
    event.preventDefault();
    if (!recordWritesEnabled) {
      setMasterError(recordWriteMessage);
      return;
    }
    const categoryId = subCategoryForm.category_id || mastersCategoryFilterId;
    if (!categoryId || !subCategoryForm.name) return;
    await farmCrud.createSubCategory({
      category_id: categoryId,
      name: subCategoryForm.name.trim(),
      code: slugCode(subCategoryForm.name, "sub_category"),
    });
    setSubCategoryForm((current) => ({ ...current, name: "" }));
    await refreshMasters();
  };

  const handleDeleteSubCategory = async (id) => {
    await farmCrud.deleteSubCategory(id);
    await refreshMasters();
  };

  const exportJson = () => {
    const payload = { exportedAt: new Date().toISOString(), ...store };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pig-farm-data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === "object") {
        setStore(sanitizeEmptyFinanceRows({ ...initialStore, ...parsed }));
      }
    } finally {
      event.target.value = "";
    }
  };

  if (authEnabled && !authReady) {
    return (
      <div className={dark ? "dark" : ""}>
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 text-slate-900 dark:bg-slate-950 dark:text-white">
          <Card className="w-full max-w-md rounded-3xl border-slate-200 bg-white/90 shadow-xl dark:border-slate-800 dark:bg-slate-950/90">
            <CardContent className="flex flex-col items-center justify-center gap-4 p-8 text-center">
              <LoaderCircle className="h-8 w-8 animate-spin text-emerald-600" />
              <div>
                <p className="text-lg font-semibold">Connecting to Supabase</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Checking your login session now.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (authEnabled && !authUser) {
    return (
      <div className={dark ? "dark" : ""}>
        <AuthScreen
          form={authForm}
          loading={authSubmitting}
          error={authError}
          notice={authNotice}
          onSubmit={handleAuthSubmit}
          onFormChange={(patch) => {
            setAuthForm((current) => ({ ...current, ...patch }));
            setAuthError("");
          }}
        />
      </div>
    );
  }

  if (authEnabled && authUser && !hydrated) {
    return (
      <div className={dark ? "dark" : ""}>
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 text-slate-900 dark:bg-slate-950 dark:text-white">
          <Card className="w-full max-w-md rounded-3xl border-slate-200 bg-white/90 shadow-xl dark:border-slate-800 dark:bg-slate-950/90">
            <CardContent className="flex flex-col items-center justify-center gap-4 p-8 text-center">
              <LoaderCircle className="h-8 w-8 animate-spin text-emerald-600" />
              <div>
                <p className="text-lg font-semibold">Loading your farm data</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">We are hydrating your Supabase workspace now.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-white dark:bg-slate-950">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-5 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900"><PiggyBank className="h-5 w-5" /></div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Agri Business Tracker</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Farm budget tracker</p>
        </div>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <p className="px-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Workspace</p>
            <ShellNavItem icon={LayoutDashboard} label="Dashboard" active={activePage === "dashboard"} onClick={() => setActivePage("dashboard")} />
            <ShellNavItem icon={Receipt} label="Expenses" active={activePage === "expenses"} onClick={() => setActivePage("expenses")} />
            <ShellNavItem icon={CircleDollarSign} label="Sales" active={activePage === "sales"} onClick={() => setActivePage("sales")} />
            <ShellNavItem icon={BarChart3} label="Reports" active={activePage === "reports"} onClick={() => setActivePage("reports")} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white">
        <div className="flex min-h-screen">
          <aside className="hidden w-72 border-r border-slate-200 bg-white lg:block dark:border-slate-800 dark:bg-slate-950">{sidebar}</aside>
          {sidebarOpen && <div className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden" onClick={() => setSidebarOpen(false)}><div className="h-full w-72 bg-white dark:bg-slate-950" onClick={(e) => e.stopPropagation()}>{sidebar}</div></div>}

          <main className="flex-1">
            <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
              <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" className="rounded-2xl lg:hidden" onClick={() => setSidebarOpen(true)}><Menu className="h-5 w-5" /></Button>
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Agri Business Tracker</h1>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  {authUser?.email ? (
                    <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300 md:flex">
                      <Mail className="h-4 w-4" />
                      <span className="max-w-[180px] truncate">{authUser.email}</span>
                    </div>
                  ) : null}
                  <Button variant="outline" size="icon" className="rounded-2xl" onClick={() => setDark((d) => !d)}>{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</Button>
                  <Button variant="outline" size="icon" className="rounded-2xl"><Bell className="h-4 w-4" /></Button>
                  {authEnabled ? (
                    <Button variant="outline" className="rounded-2xl" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  ) : null}
                  <Button variant="outline" size="icon" className="rounded-2xl" onClick={() => setActivePage("masters")}><Settings className="h-4 w-4" /></Button>
                </div>
              </div>
            </header>

            <div className="space-y-6 p-4 sm:p-6">
              {!recordWritesEnabled ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                  Read-only mode: set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> before adding records.
                </div>
              ) : null}

              {activePage === "dashboard" && (
                <>
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-semibold">Overview</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Quick snapshot of your farm performance</p>
                      </div>
                    </div>
                    <Card className="rounded-3xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                      <CardHeader>
                        <CardTitle className="text-base">Report Filters</CardTitle>
                        <CardDescription>Filter the dashboard by farm type, farm, and batch.</CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-3 md:grid-cols-4">
                        <SelectCell
                          value={reportFarmTypeId}
                          onChange={(value) => {
                            setReportFarmTypeId(value || "");
                            setReportFarmId("");
                            setReportBatchId("");
                          }}
                        >
                          <option value="">All farm types</option>
                          {masterData.farmTypes.map((farmType) => (
                            <option key={farmType.id} value={farmType.id}>
                              {farmType.name}
                            </option>
                          ))}
                        </SelectCell>
                        <SelectCell
                          value={reportFarmId}
                          onChange={(value) => {
                            setReportFarmId(value || "");
                            setReportBatchId("");
                          }}
                        >
                          <option value="">All farms</option>
                          {getFarmsByFarmType(masterData, reportFarmTypeId).map((farm) => (
                            <option key={farm.id} value={farm.id}>
                              {farm.name}
                            </option>
                          ))}
                        </SelectCell>
                        <SelectCell value={reportBatchId} onChange={(value) => setReportBatchId(value || "")}>
                          <option value="">All batches</option>
                          {reportBatchOptions.map((batch) => (
                            <option key={batch.id} value={batch.id}>
                              {batch.name}
                            </option>
                          ))}
                        </SelectCell>
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-2xl"
                          onClick={() => {
                            setReportFarmTypeId("");
                            setReportFarmId("");
                            setReportBatchId("");
                          }}
                        >
                          Clear Filters
                        </Button>
                      </CardContent>
                    </Card>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <SummaryCard title="Net Profit" value={currency(reportNet)} icon={PiggyBank} trend={reportExpenseTotal > 0 ? (reportNet / reportExpenseTotal) * 100 : 0} color={reportNet >= 0 ? "green" : "red"} />
                      <SummaryCard title="Total Sales" value={currency(reportSaleTotal)} icon={TrendingUp} color="blue" />
                      <SummaryCard title="Total Cost" value={currency(reportExpenseTotal + otherExpenses)} icon={Wallet} color="red" />
                      <SummaryCard title="Total Expenses" value={currency(reportExpenseTotal)} icon={ShoppingCart} color="orange" />
                    </div>
                    <div className="grid gap-4 xl:grid-cols-2">
                      <Card className="rounded-3xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                        <CardHeader><CardTitle>Financial Flow</CardTitle><CardDescription>Sales vs cost overview</CardDescription></CardHeader>
                        <CardContent><div className="h-64"><ResponsiveContainer><BarChart data={[{ name: "Sales", value: reportSaleTotal, color: "#10b981" }, { name: "Expenses", value: reportExpenseTotal, color: "#ef4444" }]}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip formatter={(v) => currency(v)} /><Bar dataKey="value" radius={[10,10,0,0]}>{[{ name: "Sales", value: reportSaleTotal, color: "#10b981" }, { name: "Expenses", value: reportExpenseTotal, color: "#ef4444" }].map((entry, i) => <Cell key={i} fill={entry.color} />)}</Bar></BarChart></ResponsiveContainer></div></CardContent>
                      </Card>
                      <Card className="rounded-3xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                        <CardHeader><CardTitle>Expenses per Category</CardTitle><CardDescription>Filtered expense composition by category</CardDescription></CardHeader>
                        <CardContent><div className="h-64"><ResponsiveContainer><PieChart><Pie data={expenseCategoryChartData} dataKey="value" nameKey="name" outerRadius={95} innerRadius={50} paddingAngle={3}>{expenseCategoryChartData.map((entry, i) => <Cell key={entry.name} fill={pieColors[i % pieColors.length]} />)}</Pie><Tooltip formatter={(v) => currency(v)} /><Legend /></PieChart></ResponsiveContainer></div></CardContent>
                      </Card>
                    </div>
                  </section>
                </>
              )}

              {activePage !== "dashboard" && (
                <section className="space-y-4">
                  <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {activePage === "sales"
                          ? "Sales"
                          : activePage === "expenses"
                            ? "Expenses"
                            : activePage === "reports"
                              ? "Reports"
                              : "Masters"}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {activePage === "sales"
                          ? "Record pig sales and calculate totals."
                          : activePage === "expenses"
                            ? "Record operating costs in one place."
                            : activePage === "reports"
                              ? "Filter reporting by farm type, farm, and batch."
                            : "Maintain generic master tables for all farm types."}
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => setActivePage("dashboard")} className="rounded-2xl">
                      Back to Dashboard
                    </Button>
                  </div>

                  {(tableError || (activePage === "masters" && masterError)) && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
                      {tableError || masterError}
                    </div>
                  )}

                  {tableLoading && (activePage === "sales" || activePage === "expenses") && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                      Loading Supabase rows...
                    </div>
                  )}

                  {activePage === "masters" && (
                    <>
                      <div className="grid gap-3 md:grid-cols-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Farm Types</p>
                          <p className="mt-2 text-lg font-semibold">{masterData.farmTypes.length}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Farms</p>
                          <p className="mt-2 text-lg font-semibold">{masterData.farms.length}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Batches</p>
                          <p className="mt-2 text-lg font-semibold">{masterData.batches.length}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Categories</p>
                          <p className="mt-2 text-lg font-semibold">{masterData.categories.length}</p>
                        </div>
                      </div>

                      {masterError && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
                          {masterError}
                        </div>
                      )}

                      <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
                        <Card className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                          <CardHeader>
                            <CardTitle className="text-base">Masters Menu</CardTitle>
                            <CardDescription>Pick a section to keep the page focused.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {masterSections.map((section) => (
                              <button
                                key={section.id}
                                type="button"
                                onClick={() => setMastersSection(section.id)}
                                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                                  mastersSection === section.id
                                    ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900"
                                }`}
                              >
                                <p className="text-sm font-semibold">{section.label}</p>
                                <p className="text-xs opacity-75">{section.description}</p>
                              </button>
                            ))}
                          </CardContent>
                        </Card>

                        <div className="space-y-4">
                          {masterLoading ? (
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                              Loading master tables...
                            </div>
                          ) : (
                            <>
                              {mastersSection === "structure" && (
                                <div className="grid gap-4 xl:grid-cols-2">
                                  <Card className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                                    <CardHeader>
                                      <CardTitle className="text-base">Farm Types</CardTitle>
                                      <CardDescription>Top-level farm groups like Pig, Chicken, or Fish.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <form className="grid gap-3" onSubmit={handleCreateFarmType}>
                                        <Input value={farmTypeForm.name} onChange={(e) => setFarmTypeForm((current) => ({ ...current, name: e.target.value }))} placeholder="Farm type name" />
                                        <select
                                          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                                          value={farmTypeForm.sale_type}
                                          onChange={(e) => setFarmTypeForm((current) => ({ ...current, sale_type: e.target.value }))}
                                        >
                                          {SALE_TYPE_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                              {option.label}
                                            </option>
                                          ))}
                                        </select>
                                        <Button type="submit" className="w-fit rounded-2xl" disabled={!recordWritesEnabled}>Add Farm Type</Button>
                                      </form>
                                      <div className="space-y-2">
                                        {masterData.farmTypes.map((farmType) => (
                                          <div key={farmType.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                            <div>
                                              <p className="font-medium">{farmType.name}</p>
                                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {getSaleTypeLabel(farmType.sale_type)}
                                              </p>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => handleDeleteFarmType(farmType.id)}>
                                              Delete
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                                    <CardHeader>
                                      <CardTitle className="text-base">Farms</CardTitle>
                                      <CardDescription>Each farm belongs to a farm type and can hold many batches.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <form className="grid gap-3" onSubmit={handleCreateFarm}>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                          <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" value={farmForm.farm_type_id} onChange={(e) => setFarmForm((current) => ({ ...current, farm_type_id: e.target.value }))}>
                                            <option value="">Select farm type</option>
                                            {masterData.farmTypes.map((farmType) => (
                                              <option key={farmType.id} value={farmType.id}>{farmType.name}</option>
                                            ))}
                                          </select>
                                          <Input value={farmForm.name} onChange={(e) => setFarmForm((current) => ({ ...current, name: e.target.value }))} placeholder="Farm name" />
                                        </div>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                          <Input value={farmForm.location} onChange={(e) => setFarmForm((current) => ({ ...current, location: e.target.value }))} placeholder="Location" />
                                          <Input value={farmForm.notes} onChange={(e) => setFarmForm((current) => ({ ...current, notes: e.target.value }))} placeholder="Notes" />
                                        </div>
                                        <Button type="submit" className="w-fit rounded-2xl" disabled={!recordWritesEnabled}>Add Farm</Button>
                                      </form>
                                      <div className="space-y-2">
                                        {masterData.farms.map((farm) => {
                                          const farmType = masterData.farmTypes.find((item) => item.id === farm.farm_type_id);
                                          return (
                                            <div key={farm.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                              <div>
                                                <p className="font-medium">{farm.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                  {farmType?.name || "No farm type"}{farm.location ? ` · ${farm.location}` : ""}
                                                </p>
                                              </div>
                                              <Button variant="ghost" size="sm" onClick={() => handleDeleteFarm(farm.id)}>
                                                Delete
                                              </Button>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-950 xl:col-span-2">
                                    <CardHeader>
                                      <CardTitle className="text-base">Batches</CardTitle>
                                      <CardDescription>Track multiple production cycles inside each farm.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                                        <select
                                          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                                          value={mastersBatchFarmFilterId}
                                          onChange={(e) => setMastersBatchFarmFilterId(e.target.value)}
                                        >
                                          <option value="">All farms</option>
                                          {masterData.farms.map((farm) => (
                                            <option key={farm.id} value={farm.id}>
                                              {farm.name}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                      <form className="grid gap-3" onSubmit={handleCreateBatch}>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                          <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" value={batchForm.farm_id} onChange={(e) => setBatchForm((current) => ({ ...current, farm_id: e.target.value }))}>
                                            <option value="">Select farm</option>
                                            {masterData.farms.map((farm) => (
                                              <option key={farm.id} value={farm.id}>{farm.name}</option>
                                            ))}
                                          </select>
                                          <Input value={batchForm.name} onChange={(e) => setBatchForm((current) => ({ ...current, name: e.target.value }))} placeholder="Batch name" />
                                          <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" value={batchForm.status} onChange={(e) => setBatchForm((current) => ({ ...current, status: e.target.value }))}>
                                            <option value="active">Active</option>
                                            <option value="closed">Closed</option>
                                            <option value="draft">Draft</option>
                                          </select>
                                        </div>
                                        <Button type="submit" className="w-fit rounded-2xl" disabled={!recordWritesEnabled}>Add Batch</Button>
                                      </form>
                                      <div className="space-y-2">
                                        {masterData.batches
                                          .filter((batch) => !mastersBatchFarmFilterId || batch.farm_id === mastersBatchFarmFilterId)
                                          .map((batch) => {
                                          const farm = masterData.farms.find((item) => item.id === batch.farm_id);
                                          return (
                                            <div key={batch.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                              <div>
                                                <p className="font-medium">{batch.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                  {farm?.name || "Unassigned"}{batch.status ? ` · ${batch.status}` : ""}
                                                </p>
                                              </div>
                                              <Button variant="ghost" size="sm" onClick={() => handleDeleteBatch(batch.id)}>
                                                Delete
                                              </Button>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}

                              {mastersSection === "reference" && (
                                <div className="grid gap-4 xl:grid-cols-2">
                                  <Card className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                                    <CardHeader className="flex flex-row items-start justify-between gap-3">
                                      <div>
                                        <CardTitle className="text-base">Categories</CardTitle>
                                        <CardDescription>Click a category to filter the subcategories beside it.</CardDescription>
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl"
                                        type="button"
                                        onClick={() => setMastersCategoryFilterId("")}
                                      >
                                        Show all
                                      </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <form className="grid gap-3" onSubmit={handleCreateCategory}>
                                        <Input value={categoryForm.name} onChange={(e) => setCategoryForm((current) => ({ ...current, name: e.target.value }))} placeholder="Category name" />
                                        <Input value={categoryForm.category_group} onChange={(e) => setCategoryForm((current) => ({ ...current, category_group: e.target.value }))} placeholder="Group" />
                                        <Button type="submit" className="w-fit rounded-2xl" disabled={!recordWritesEnabled}>Add Category</Button>
                                      </form>
                                      <div className="space-y-2">
                                        {orderedCategories.map((category) => {
                                          const isActive = mastersCategoryFilterId === category.id;
                                          const linkedSubCount = masterData.subCategories.filter((sub) => sub.category_id === category.id).length;
                                          return (
                                            <div
                                              key={category.id}
                                              role="button"
                                              tabIndex={0}
                                              onClick={() => {
                                                setMastersCategoryFilterId(category.id);
                                                setSubCategoryForm((current) => ({ ...current, category_id: category.id }));
                                              }}
                                              draggable
                                              onDragStart={() => handleCategoryDragStart(category.id)}
                                              onDragOver={(event) => event.preventDefault()}
                                              onDrop={() => handleCategoryDrop(category.id)}
                                              onDragEnd={() => setMastersDragState({ kind: "", id: "" })}
                                              onKeyDown={(event) => {
                                                if (event.key === "Enter" || event.key === " ") {
                                                  event.preventDefault();
                                                  setMastersCategoryFilterId(category.id);
                                                  setSubCategoryForm((current) => ({ ...current, category_id: category.id }));
                                                }
                                              }}
                                              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition cursor-move ${
                                                isActive
                                                  ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                                                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700 dark:hover:bg-slate-900"
                                              } ${mastersDragState.kind === "category" && mastersDragState.id === category.id ? "opacity-60" : ""}`}
                                            >
                                              <div className="flex items-center gap-3">
                                                <GripVertical className={`h-4 w-4 ${isActive ? "text-white/70 dark:text-slate-500" : "text-slate-400 dark:text-slate-500"}`} />
                                                <div>
                                                  <p className="font-medium">{category.name}</p>
                                                  <p className={`text-xs ${isActive ? "text-white/70 dark:text-slate-600" : "text-slate-500 dark:text-slate-400"}`}>
                                                    {category.category_group ? category.category_group : "No group"} · {linkedSubCount} subcategories
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className={`rounded-xl ${isActive ? "text-white hover:bg-white/10 dark:text-slate-900" : ""}`}
                                                  onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleDeleteCategory(category.id);
                                                  }}
                                                >
                                                  Delete
                                                </Button>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                                    <CardHeader className="flex flex-row items-start justify-between gap-3">
                                      <div>
                                        <CardTitle className="text-base">Subcategories</CardTitle>
                                        <CardDescription>
                                          {mastersCategoryFilterId
                                            ? "Showing only subcategories linked to the selected category."
                                            : "All subcategories are shown. Click a category to narrow the list."}
                                        </CardDescription>
                                      </div>
                                      {mastersCategoryFilterId ? (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="rounded-xl"
                                          type="button"
                                          onClick={() => setMastersCategoryFilterId("")}
                                        >
                                          Clear filter
                                        </Button>
                                      ) : null}
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <form className="grid gap-3" onSubmit={handleCreateSubCategory}>
                                        <select
                                          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                                          value={subCategoryForm.category_id || mastersCategoryFilterId}
                                          onChange={(e) =>
                                            setSubCategoryForm((current) => ({
                                              ...current,
                                              category_id: e.target.value,
                                            }))
                                          }
                                        >
                                          <option value="">Select category</option>
                                          {masterData.categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                              {category.name}
                                            </option>
                                          ))}
                                        </select>
                                        <Input value={subCategoryForm.name} onChange={(e) => setSubCategoryForm((current) => ({ ...current, name: e.target.value }))} placeholder="Subcategory name" />
                                        <Button type="submit" className="w-fit rounded-2xl" disabled={!recordWritesEnabled}>Add Subcategory</Button>
                                      </form>
                                      <div className="space-y-2">
                                        {orderedSubCategories
                                          .filter((subCategory) => !mastersCategoryFilterId || subCategory.category_id === mastersCategoryFilterId)
                                          .map((subCategory) => {
                                            const category = masterData.categories.find((item) => item.id === subCategory.category_id);
                                            const isFiltered = mastersCategoryFilterId && subCategory.category_id === mastersCategoryFilterId;
                                            return (
                                              <div
                                                key={subCategory.id}
                                                draggable
                                                onDragStart={() => handleSubCategoryDragStart(subCategory.id)}
                                                onDragOver={(event) => event.preventDefault()}
                                                onDrop={() => handleSubCategoryDrop(subCategory.id)}
                                                onDragEnd={() => setMastersDragState({ kind: "", id: "" })}
                                                className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition cursor-move ${
                                                  isFiltered
                                                    ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/20"
                                                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
                                                } ${mastersDragState.kind === "subCategory" && mastersDragState.id === subCategory.id ? "opacity-60" : ""}`}
                                              >
                                                <div className="flex items-center gap-3">
                                                  <GripVertical className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                                  <div>
                                                    <p className="font-medium">{subCategory.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                      {category?.name || "Unassigned"}
                                                    </p>
                                                  </div>
                                                </div>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteSubCategory(subCategory.id)}>
                                                  Delete
                                                </Button>
                                              </div>
                                            );
                                          })}
                                        {!orderedSubCategories.filter((subCategory) => !mastersCategoryFilterId || subCategory.category_id === mastersCategoryFilterId).length ? (
                                          <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                            No subcategories match the current filter.
                                          </p>
                                        ) : null}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {activePage === "reports" && (
                    <>
                      <div className="grid gap-3 md:grid-cols-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Sales in Scope</p>
                          <p className="mt-2 text-lg font-semibold">{currency(reportSaleTotal)}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Expenses in Scope</p>
                          <p className="mt-2 text-lg font-semibold">{currency(reportExpenseTotal)}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Net in Scope</p>
                          <p className="mt-2 text-lg font-semibold">{currency(reportNet)}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Batches in Scope</p>
                          <p className="mt-2 text-lg font-semibold">
                            {reportBatchId ? 1 : reportBatchOptions.length}
                          </p>
                        </div>
                      </div>

                      <Card className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                        <CardHeader>
                          <CardTitle className="text-base">Report Filters</CardTitle>
                          <CardDescription>Filter the dashboard by farm type, farm, and batch.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 md:grid-cols-4">
                          <SelectCell
                            value={reportFarmTypeId}
                            onChange={(value) => {
                              setReportFarmTypeId(value || "");
                              setReportFarmId("");
                              setReportBatchId("");
                            }}
                          >
                            <option value="">All farm types</option>
                            {masterData.farmTypes.map((farmType) => (
                              <option key={farmType.id} value={farmType.id}>
                                {farmType.name}
                              </option>
                            ))}
                          </SelectCell>
                          <SelectCell
                            value={reportFarmId}
                            onChange={(value) => {
                              setReportFarmId(value || "");
                              setReportBatchId("");
                            }}
                          >
                            <option value="">All farms</option>
                            {getFarmsByFarmType(masterData, reportFarmTypeId).map((farm) => (
                              <option key={farm.id} value={farm.id}>
                                {farm.name}
                              </option>
                            ))}
                          </SelectCell>
                          <SelectCell value={reportBatchId} onChange={(value) => setReportBatchId(value || "")}>
                            <option value="">All batches</option>
                            {reportBatchOptions.map((batch) => (
                              <option key={batch.id} value={batch.id}>
                                {batch.name}
                              </option>
                            ))}
                          </SelectCell>
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-2xl"
                            onClick={() => {
                              setReportFarmTypeId("");
                              setReportFarmId("");
                              setReportBatchId("");
                            }}
                          >
                            Clear Filters
                          </Button>
                        </CardContent>
                      </Card>

                      <div className="grid gap-4 xl:grid-cols-2">
                        <Card className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                          <CardHeader>
                            <CardTitle className="text-base">Batch Summary</CardTitle>
                            <CardDescription>Totals grouped by batch for the selected scope.</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="h-72">
                              <ResponsiveContainer>
                                <BarChart data={reportBatchChartData}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" hide />
                                  <YAxis />
                                  <Tooltip formatter={(v) => currency(v)} />
                                  <Legend />
                                  <Bar dataKey="saleTotal" name="Sales" fill="#10b981" radius={[10, 10, 0, 0]} />
                                  <Bar dataKey="expenseTotal" name="Expenses" fill="#ef4444" radius={[10, 10, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Batch</TableHead>
                                    <TableHead>Farm</TableHead>
                                    <TableHead>Sales</TableHead>
                                    <TableHead>Expenses</TableHead>
                                    <TableHead>Net</TableHead>
                                  </TableRow>
                                </TableHeader>
                              <TableBody>
                                {reportBatchBreakdown.map(({ batch, saleTotal, expenseTotal, net }) => (
                                  <TableRow key={batch.id}>
                                      <TableCell>{batch.name}</TableCell>
                                      <TableCell>{getFarmById(masterData, batch.farm_id)?.name || ""}</TableCell>
                                      <TableCell>{currency(saleTotal)}</TableCell>
                                      <TableCell>{currency(expenseTotal)}</TableCell>
                                      <TableCell className={net >= 0 ? "text-emerald-600" : "text-rose-600"}>{currency(net)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                          <CardHeader>
                            <CardTitle className="text-base">Filtered Rows</CardTitle>
                            <CardDescription>Use this to inspect the exact transactions behind the totals.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-3">
                              <div>
                                <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Sales</p>
                                <div className="space-y-2">
                                  {reportSales.slice(0, 5).map((row) => (
                                    <div key={row.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                      <div>
                                        <p className="font-medium">{getSaleLabel(row, masterData).item || "Sale"}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                          {row.date} · {row.farm_name || ""} {row.batch_name ? `· ${row.batch_name}` : ""}
                                        </p>
                                      </div>
                                      <p className="font-semibold">{currency(getSaleAmount(row))}</p>
                                    </div>
                                  ))}
                                  {!reportSales.length && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400">No sales match the current filters.</p>
                                  )}
                                </div>
                              </div>

                              <div>
                                <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Expenses</p>
                                <div className="space-y-2">
                                  {reportExpenses.slice(0, 5).map((row) => (
                                    <div key={row.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                      <div>
                                        <p className="font-medium">{getExpenseLabel(row, masterData).subcategory || getExpenseLabel(row, masterData).category || "Expense"}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                          {row.date} · {row.farm_name || ""} {row.batch_name ? `· ${row.batch_name}` : ""}
                                        </p>
                                      </div>
                                      <p className="font-semibold">{currency(getExpenseAmount(row))}</p>
                                    </div>
                                  ))}
                                  {!reportExpenses.length && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400">No expenses match the current filters.</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}

                  {activePage === "sales" && (
                    <>
                      <Card className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                        <CardHeader>
                          <CardTitle className="text-base">Report Filters</CardTitle>
                          <CardDescription>Filter sales by farm type, farm, and batch.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 md:grid-cols-4">
                          <SelectCell
                            value={reportFarmTypeId}
                            onChange={(value) => {
                              setReportFarmTypeId(value || "");
                              setReportFarmId("");
                              setReportBatchId("");
                            }}
                          >
                            <option value="">All farm types</option>
                            {masterData.farmTypes.map((farmType) => (
                              <option key={farmType.id} value={farmType.id}>
                                {farmType.name}
                              </option>
                            ))}
                          </SelectCell>
                          <SelectCell
                            value={reportFarmId}
                            onChange={(value) => {
                              setReportFarmId(value || "");
                              setReportBatchId("");
                            }}
                          >
                            <option value="">All farms</option>
                            {getFarmsByFarmType(masterData, reportFarmTypeId).map((farm) => (
                              <option key={farm.id} value={farm.id}>
                                {farm.name}
                              </option>
                            ))}
                          </SelectCell>
                          <SelectCell value={reportBatchId} onChange={(value) => setReportBatchId(value || "")}>
                            <option value="">All batches</option>
                            {reportBatchOptions.map((batch) => (
                              <option key={batch.id} value={batch.id}>
                                {batch.name}
                              </option>
                            ))}
                          </SelectCell>
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-2xl"
                            onClick={() => {
                              setReportFarmTypeId("");
                              setReportFarmId("");
                              setReportBatchId("");
                            }}
                          >
                            Clear Filters
                          </Button>
                        </CardContent>
                      </Card>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Total Sales</p>
                          <p className="mt-2 text-lg font-semibold">{currency(visibleSalesTotal)}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Total Weight</p>
                          <p className="mt-2 text-lg font-semibold">{visibleSalesWeight} kg</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Profit</p>
                          <p className="mt-2 text-lg font-semibold">{currency(visibleSalesTotal - (visibleExpenseTotal + otherExpenses))}</p>
                        </div>
                      </div>

                      <Card className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                        <CardHeader className="flex flex-row items-center justify-between gap-3">
                          <div>
                            <CardTitle className="text-base">Sales Table</CardTitle>
                            <CardDescription>Update the rows below as needed.</CardDescription>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Button variant="outline" onClick={() => appendSaleDrafts(1)} className="rounded-2xl" type="button" disabled={!recordWritesEnabled}>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Row
                            </Button>
                            <Button onClick={() => setSaleDialogOpen(true)} className="rounded-2xl" type="button" disabled={!recordWritesEnabled}>
                              New Sale
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="w-full">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Farm</TableHead>
                                  <TableHead>Batch</TableHead>
                                  <TableHead>{salesQuantityHeader}</TableHead>
                                  <TableHead>{salesPriceHeader}</TableHead>
                                  <TableHead>Total</TableHead>
                                  <TableHead>Remarks</TableHead>
                                  <TableHead className="w-[72px]">Action</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {visibleSalesRows.map(({ row, originalIndex }) => (
                                  <TableRow key={row.id}>
                                    <TableCell><DateCell value={row.date} onChange={(v) => updateSale(originalIndex, "date", v)} /></TableCell>
                                    <TableCell>
                                      <SelectCell value={row.farm_id || ""} onChange={(v) => updateSale(originalIndex, "farm_id", v)}>
                                        <option value="">Farm</option>
                                        {masterData.farms.map((farm) => (
                                          <option key={farm.id} value={farm.id}>
                                            {farm.name}
                                          </option>
                                        ))}
                                      </SelectCell>
                                    </TableCell>
                                    <TableCell>
                                      <SelectCell value={row.batch_id || ""} onChange={(v) => updateSale(originalIndex, "batch_id", v)}>
                                        <option value="">Batch</option>
                                        {getBatchesByFarm(masterData, row.farm_id || defaultFarmId).map((batch) => (
                                          <option key={batch.id} value={batch.id}>
                                            {batch.name}
                                          </option>
                                        ))}
                                      </SelectCell>
                                    </TableCell>
                                    <TableCell><NumberCell value={row.quantity} onChange={(v) => updateSale(originalIndex, "quantity", v)} /></TableCell>
                                    <TableCell><NumberCell value={row.pricePerKg ?? row.unit_price ?? null} onChange={(v) => updateSale(originalIndex, "pricePerKg", v)} /></TableCell>
                                    <TableCell className="font-medium">
                                      {row.total_amount == null && row.quantity == null && row.pricePerKg == null && row.unit_price == null ? "" : currency(getSaleAmount(row))}
                                    </TableCell>
                                    <TableCell><TextCell value={row.remarks || row.name || ""} onChange={(v) => updateSale(originalIndex, "remarks", v)} placeholder="Remarks" /></TableCell>
                                    <TableCell>
                                      {isDraftId(row.id) ? (
                                        <div className="flex items-center gap-2">
                                          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => saveSaleGridRow(originalIndex)} type="button" disabled={!recordWritesEnabled}>
                                            Save
                                          </Button>
                                          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => discardSaleGridRow(originalIndex)} type="button">
                                            <Trash2 className="h-4 w-4 text-slate-500" />
                                          </Button>
                                        </div>
                                      ) : (
                                        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => deleteSaleRow(originalIndex)} type="button">
                                          <Trash2 className="h-4 w-4 text-slate-500" />
                                        </Button>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </ScrollArea>
                          <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-sm dark:border-slate-800">
                            <span className="font-medium">Total</span>
                            <span className="font-semibold">{currency(visibleSalesTotal)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {activePage === "expenses" && (
                    <>
                      <Card className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                        <CardHeader>
                          <CardTitle className="text-base">Report Filters</CardTitle>
                          <CardDescription>Filter expenses by farm type, farm, and batch.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 md:grid-cols-4">
                          <SelectCell
                            value={reportFarmTypeId}
                            onChange={(value) => {
                              setReportFarmTypeId(value || "");
                              setReportFarmId("");
                              setReportBatchId("");
                            }}
                          >
                            <option value="">All farm types</option>
                            {masterData.farmTypes.map((farmType) => (
                              <option key={farmType.id} value={farmType.id}>
                                {farmType.name}
                              </option>
                            ))}
                          </SelectCell>
                          <SelectCell
                            value={reportFarmId}
                            onChange={(value) => {
                              setReportFarmId(value || "");
                              setReportBatchId("");
                            }}
                          >
                            <option value="">All farms</option>
                            {getFarmsByFarmType(masterData, reportFarmTypeId).map((farm) => (
                              <option key={farm.id} value={farm.id}>
                                {farm.name}
                              </option>
                            ))}
                          </SelectCell>
                          <SelectCell value={reportBatchId} onChange={(value) => setReportBatchId(value || "")}>
                            <option value="">All batches</option>
                            {reportBatchOptions.map((batch) => (
                              <option key={batch.id} value={batch.id}>
                                {batch.name}
                              </option>
                            ))}
                          </SelectCell>
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-2xl"
                            onClick={() => {
                              setReportFarmTypeId("");
                              setReportFarmId("");
                              setReportBatchId("");
                            }}
                          >
                            Clear Filters
                          </Button>
                        </CardContent>
                      </Card>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Total Expenses</p>
                          <p className="mt-2 text-lg font-semibold">{currency(visibleExpenseTotal)}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Other Expenses</p>
                          <p className="mt-2 text-lg font-semibold">{currency(otherExpenses)}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Total Cost</p>
                          <p className="mt-2 text-lg font-semibold">{currency(visibleExpenseTotal + otherExpenses)}</p>
                        </div>
                      </div>

                      <Card className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                        <CardHeader className="flex flex-row items-center justify-between gap-3">
                          <div>
                            <CardTitle className="text-base">Expenses Table</CardTitle>
                            <CardDescription>Track feed, piglets, and other costs.</CardDescription>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Button variant="outline" onClick={() => appendExpenseDrafts(1)} className="rounded-2xl" type="button" disabled={!recordWritesEnabled}>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Row
                            </Button>
                            <Button onClick={() => setExpenseDialogOpen(true)} className="rounded-2xl" type="button" disabled={!recordWritesEnabled}>
                              New Expense
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="w-full">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Farm</TableHead>
                                  <TableHead>Batch</TableHead>
                                  <TableHead>Category</TableHead>
                                  <TableHead>Subcategory</TableHead>
                                  <TableHead>Qty</TableHead>
                                  <TableHead>Unit Cost</TableHead>
                                  <TableHead>Total</TableHead>
                                  <TableHead>Remarks</TableHead>
                                  <TableHead className="w-[72px]">Action</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {visibleExpenseRows.map(({ row, originalIndex }) => (
                                  <TableRow key={row.id}>
                                    <TableCell><DateCell value={row.date} onChange={(v) => updateExpense(originalIndex, "date", v)} /></TableCell>
                                    <TableCell>
                                      <SelectCell value={row.farm_id || ""} onChange={(v) => updateExpense(originalIndex, "farm_id", v)}>
                                        <option value="">Farm</option>
                                        {masterData.farms.map((farm) => (
                                          <option key={farm.id} value={farm.id}>
                                            {farm.name}
                                          </option>
                                        ))}
                                      </SelectCell>
                                    </TableCell>
                                    <TableCell>
                                      <SelectCell value={row.batch_id || ""} onChange={(v) => updateExpense(originalIndex, "batch_id", v)}>
                                        <option value="">Batch</option>
                                        {getBatchesByFarm(masterData, row.farm_id || defaultFarmId).map((batch) => (
                                          <option key={batch.id} value={batch.id}>
                                            {batch.name}
                                          </option>
                                        ))}
                                      </SelectCell>
                                    </TableCell>
                                    <TableCell>
                                      <SelectCell value={row.category_id || ""} onChange={(v) => updateExpense(originalIndex, "category_id", v)}>
                                        <option value="">Category</option>
                                        {masterData.categories.map((category) => (
                                          <option key={category.id} value={category.id}>
                                            {category.name}
                                          </option>
                                        ))}
                                      </SelectCell>
                                    </TableCell>
                                    <TableCell>
                                      <SelectCell value={row.sub_category_id || ""} onChange={(v) => updateExpense(originalIndex, "sub_category_id", v)}>
                                        <option value="">Subcategory</option>
                                        {masterData.subCategories
                                          .filter((sub) => !row.category_id || sub.category_id === row.category_id)
                                          .map((sub) => (
                                            <option key={sub.id} value={sub.id}>
                                              {sub.name}
                                            </option>
                                          ))}
                                      </SelectCell>
                                    </TableCell>
                                    <TableCell><NumberCell value={row.quantity} onChange={(v) => updateExpense(originalIndex, "quantity", v)} /></TableCell>
                                    <TableCell><NumberCell value={row.unit_cost ?? row.amount ?? null} onChange={(v) => updateExpense(originalIndex, "unit_cost", v)} /></TableCell>
                                    <TableCell className="font-medium">
                                      {row.total_amount == null && row.quantity == null && row.unit_cost == null && row.amount == null ? "" : currency(getExpenseAmount(row))}
                                    </TableCell>
                                    <TableCell><TextCell value={row.remarks} onChange={(v) => updateExpense(originalIndex, "remarks", v)} placeholder="Remarks" /></TableCell>
                                    <TableCell>
                                      {isDraftId(row.id) ? (
                                        <div className="flex items-center gap-2">
                                          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => saveExpenseGridRow(originalIndex)} type="button" disabled={!recordWritesEnabled}>
                                            Save
                                          </Button>
                                          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => discardExpenseGridRow(originalIndex)} type="button">
                                            <Trash2 className="h-4 w-4 text-slate-500" />
                                          </Button>
                                        </div>
                                      ) : (
                                        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => deleteExpenseRow(originalIndex)} type="button">
                                          <Trash2 className="h-4 w-4 text-slate-500" />
                                        </Button>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </section>
              )}

              <Modal
                open={expenseDialogOpen}
                title="New Expense"
                description=""
                onClose={() => setExpenseDialogOpen(false)}
                footer={
                  <div className="flex items-center justify-end gap-3">
                    <Button variant="outline" type="button" className="rounded-2xl" onClick={() => setExpenseDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" form="expense-create-form" className="rounded-2xl" disabled={!recordWritesEnabled}>
                      Save Expense
                    </Button>
                  </div>
                }
              >
                <form
                  id="expense-create-form"
                  className="space-y-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    addExpenseRow();
                  }}
                >
                  <div className="grid gap-5 xl:grid-cols-[1.4fr,0.9fr]">
                    <div className="space-y-5">
                      <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                        <div className="grid gap-4 md:grid-cols-2">
                          <FieldGroup label="Farm" hint="Required">
                            <SelectCell
                              value={expenseForm.farm_id}
                              onChange={(value) =>
                                setExpenseForm((current) => ({
                                  ...current,
                                  farm_id: value,
                                  batch_id: getDefaultBatchId(masterData, value),
                                }))
                              }
                            >
                              <option value="">Select farm</option>
                              {masterData.farms.map((farm) => (
                                <option key={farm.id} value={farm.id}>
                                  {farm.name}
                                </option>
                              ))}
                            </SelectCell>
                          </FieldGroup>
                          <FieldGroup label="Batch" hint="Required">
                            <SelectCell
                              value={expenseForm.batch_id}
                              onChange={(value) => setExpenseForm((current) => ({ ...current, batch_id: value }))}
                            >
                              <option value="">Select batch</option>
                              {getBatchesByFarm(masterData, expenseForm.farm_id || defaultFarmId).map((batch) => (
                                <option key={batch.id} value={batch.id}>
                                  {batch.name}
                                </option>
                              ))}
                            </SelectCell>
                          </FieldGroup>
                          <FieldGroup label="Date" hint="Required" className="md:col-span-2">
                            <DateCell value={expenseForm.expense_date} onChange={(value) => setExpenseForm((current) => ({ ...current, expense_date: value }))} />
                          </FieldGroup>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        <div className="grid gap-4 md:grid-cols-2">
                          <FieldGroup label="Category" hint="Required">
                            <SelectCell
                              value={expenseForm.category_id}
                              onChange={(value) =>
                                setExpenseForm((current) => ({
                                  ...current,
                                  category_id: value,
                                  sub_category_id: masterData.subCategories.find((sub) => sub.category_id === value)?.id || "",
                                }))
                              }
                            >
                              <option value="">Select category</option>
                              {masterData.categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </SelectCell>
                          </FieldGroup>
                          <FieldGroup label="Subcategory" hint="Optional">
                            <SelectCell
                              value={expenseForm.sub_category_id}
                              onChange={(value) => setExpenseForm((current) => ({ ...current, sub_category_id: value }))}
                            >
                              <option value="">Select subcategory</option>
                              {masterData.subCategories
                                .filter((sub) => !expenseForm.category_id || sub.category_id === expenseForm.category_id)
                                .map((sub) => (
                                  <option key={sub.id} value={sub.id}>
                                    {sub.name}
                                  </option>
                                ))}
                            </SelectCell>
                          </FieldGroup>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-50">
                        <div className="mt-3 flex items-end justify-between gap-4">
                          <p className="text-2xl font-semibold">{currency(Number(expenseForm.quantity || 0) * Number(expenseForm.unit_cost || 0))}</p>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        <div className="grid gap-4">
                          <FieldGroup label="Quantity" hint="Required">
                            <Input
                              type="number"
                              min="0"
                              value={expenseForm.quantity}
                              onChange={(event) => setExpenseForm((current) => ({ ...current, quantity: Number(event.target.value || 0) }))}
                              placeholder="Quantity"
                            />
                          </FieldGroup>
                          <FieldGroup label="Unit Cost" hint="Required">
                            <Input
                              type="number"
                              min="0"
                              value={expenseForm.unit_cost}
                              onChange={(event) =>
                                setExpenseForm((current) => ({
                                  ...current,
                                  unit_cost: Number(event.target.value || 0),
                                }))
                              }
                              placeholder="Unit cost"
                            />
                          </FieldGroup>
                          <FieldGroup label="Remarks" hint="Optional">
                            <Input
                              value={expenseForm.remarks}
                              onChange={(event) => setExpenseForm((current) => ({ ...current, remarks: event.target.value }))}
                              placeholder="Add a short note"
                            />
                          </FieldGroup>
                          <FieldGroup label="Total" hint="Read only">
                            <Input
                              value={currency(Number(expenseForm.quantity || 0) * Number(expenseForm.unit_cost || 0))}
                              readOnly
                              className="bg-slate-50 font-semibold text-slate-900 dark:bg-slate-900 dark:text-white"
                            />
                          </FieldGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </Modal>

              <Modal
                open={saleDialogOpen}
                title="New Sale"
                description=""
                onClose={() => setSaleDialogOpen(false)}
                footer={
                  <div className="flex items-center justify-end gap-3">
                    <Button variant="outline" type="button" className="rounded-2xl" onClick={() => setSaleDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" form="sale-create-form" className="rounded-2xl" disabled={!recordWritesEnabled}>
                      Save Sale
                    </Button>
                  </div>
                }
              >
                <form
                  id="sale-create-form"
                  className="space-y-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    addSaleRow();
                  }}
                >
                  <div className="grid gap-5 xl:grid-cols-[1.4fr,0.9fr]">
                    <div className="space-y-5">
                      <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                        <div className="grid gap-4 md:grid-cols-2">
                          <FieldGroup label="Farm" hint="Required">
                            <SelectCell
                              value={saleForm.farm_id}
                              onChange={(value) =>
                                setSaleForm((current) => ({
                                  ...current,
                                  farm_id: value,
                                  batch_id: getDefaultBatchId(masterData, value),
                                }))
                              }
                            >
                              <option value="">Select farm</option>
                              {masterData.farms.map((farm) => (
                                <option key={farm.id} value={farm.id}>
                                  {farm.name}
                                </option>
                              ))}
                            </SelectCell>
                          </FieldGroup>
                          <FieldGroup label="Batch" hint="Required">
                            <SelectCell
                              value={saleForm.batch_id}
                              onChange={(value) => setSaleForm((current) => ({ ...current, batch_id: value }))}
                            >
                              <option value="">Select batch</option>
                              {getBatchesByFarm(masterData, saleForm.farm_id || defaultFarmId).map((batch) => (
                                <option key={batch.id} value={batch.id}>
                                  {batch.name}
                                </option>
                              ))}
                            </SelectCell>
                          </FieldGroup>
                          <FieldGroup label="Date" hint="Required" className="md:col-span-2">
                            <DateCell value={saleForm.sale_date} onChange={(value) => setSaleForm((current) => ({ ...current, sale_date: value }))} />
                          </FieldGroup>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        <div className="grid gap-4 md:grid-cols-2">
                          <FieldGroup label={saleFormQuantityLabel} hint="Required">
                            <Input
                              type="number"
                              min="0"
                              value={saleForm.quantity}
                              onChange={(event) => setSaleForm((current) => ({ ...current, quantity: Number(event.target.value || 0) }))}
                              placeholder="Quantity"
                            />
                          </FieldGroup>
                          <FieldGroup label={saleFormPriceLabel} hint="Required">
                            <Input
                              type="number"
                              min="0"
                              value={saleForm.unit_price}
                              onChange={(event) => setSaleForm((current) => ({ ...current, unit_price: Number(event.target.value || 0) }))}
                              placeholder={saleFormPriceLabel}
                            />
                          </FieldGroup>
                          <FieldGroup label="Remarks" hint="Optional" className="md:col-span-2">
                            <Input
                              value={saleForm.remarks}
                              onChange={(event) => setSaleForm((current) => ({ ...current, remarks: event.target.value }))}
                              placeholder="Add a short note"
                            />
                          </FieldGroup>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="rounded-3xl border border-blue-200 bg-blue-50 p-4 text-blue-950 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/20 dark:text-blue-50">
                        <div className="mt-3 flex items-end justify-between gap-4">
                          <p className="text-2xl font-semibold">{currency(Number(saleForm.quantity || 0) * Number(saleForm.unit_price || 0))}</p>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        <FieldGroup label="Total" hint="Read only">
                          <Input
                            value={currency(Number(saleForm.quantity || 0) * Number(saleForm.unit_price || 0))}
                            readOnly
                            className="bg-slate-50 font-semibold text-slate-900 dark:bg-slate-900 dark:text-white"
                          />
                        </FieldGroup>
                      </div>
                    </div>
                  </div>
                </form>
              </Modal>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
