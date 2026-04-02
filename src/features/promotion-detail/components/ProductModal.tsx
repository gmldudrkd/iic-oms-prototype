"use client";

import { useState, useEffect, useCallback } from "react";

// ── Color tokens ──────────────────────────────────────────────────────────────
const C = {
  blue: "#D6006E",
  bluBg: "#FFF0F7",
  bluBd: "#F9A8D4",
  purple: "#5C4AE4",
  purBg: "#F0EFFE",
  purBd: "#C4B5FD",
  pink: "#1570EF",
  pinkBg: "#EFF8FF",
  pinkBd: "#B2DDFF",
  green: "#099250",
  greenBg: "#ECFDF5",
  greenBd: "#A9EFC5",
  dark: "#344054",
  dkBg: "#F2F4F7",
  dkBd: "#D0D5DD",
  gray: "#667085",
  grBg: "#F9FAFB",
  grBd: "#EAECF0",
};

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ModalProduct {
  id: string;
  sap: string;
  label: string;
  name: string;
  category?: string;
  img: string;
}

export interface ModalProductItem extends ModalProduct {
  type: "product";
  uid: number;
}

export interface ModalGroupItem {
  type: "group";
  id: string;
  name: string;
  condition: "AND" | "OR";
  products: ModalProduct[];
  color?: { bg: string; border: string; text: string; badge: string };
}

export type ModalItem = ModalProductItem | ModalGroupItem;
export type ConditionType = "AND" | "OR";

// ── Constants ─────────────────────────────────────────────────────────────────
const PRODUCTS: ModalProduct[] = [
  {
    id: "B0000001",
    sap: "SAP-10021",
    label: "RIBBON",
    name: "SHRY 240ml BLACK RIBBON_23",
    img: "🧃",
  },
  {
    id: "S0000003",
    sap: "SAP-10022",
    label: "GOLD",
    name: "SHRY 500ml GOLD EDITION",
    img: "🧴",
  },
  {
    id: "C0000012",
    sap: "SAP-20011",
    label: "GIFT",
    name: "Premium Gift Box Set A",
    img: "🎁",
  },
  {
    id: "C0000013",
    sap: "SAP-20012",
    label: "GIFT",
    name: "Premium Gift Box Set B",
    img: "🎀",
  },
  {
    id: "D0000021",
    sap: "SAP-10023",
    label: "MINI",
    name: "SHRY 120ml MINI PACK",
    img: "🥤",
  },
  {
    id: "E0000005",
    sap: "SAP-30001",
    label: "TEA",
    name: "Organic Green Tea 30T",
    img: "🍵",
  },
  {
    id: "E0000006",
    sap: "SAP-30002",
    label: "TEA",
    name: "Premium Black Tea 20T",
    img: "☕",
  },
  {
    id: "F0000030",
    sap: "SAP-40001",
    label: "HEALTH",
    name: "Wellness Supplement Pack",
    img: "💊",
  },
];

interface LabelDef {
  id: string;
  name: string;
  productIds: string[];
}

const LABELS: LabelDef[] = [
  {
    id: "LBL001",
    name: "Beverage",
    productIds: ["B0000001", "S0000003", "D0000021"],
  },
  { id: "LBL002", name: "Gift Set", productIds: ["C0000012", "C0000013"] },
  { id: "LBL003", name: "Tea & Coffee", productIds: ["E0000005", "E0000006"] },
  { id: "LBL004", name: "Health Food", productIds: ["F0000030"] },
  {
    id: "LBL005",
    name: "Premium Line",
    productIds: ["S0000003", "C0000012", "C0000013"],
  },
];

let gid = 1;
let uid = 1;
const ib: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: C.gray,
  fontSize: 12,
  padding: "0 2px",
};

// ── Shared Atoms ──────────────────────────────────────────────────────────────
function CondBadge({ type }: { type: ConditionType }) {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", margin: "2px 0 4px" }}
    >
      <span
        style={{
          display: "inline-flex",
          padding: "1px 8px",
          borderRadius: 4,
          fontSize: 10,
          fontWeight: 700,
          background: type === "AND" ? C.pinkBg : C.greenBg,
          color: type === "AND" ? C.pink : C.green,
          border: `1px solid ${type === "AND" ? C.pinkBd : C.greenBd}`,
        }}
      >
        {type}
      </span>
    </div>
  );
}

function CondToggle({
  value,
  onChange,
}: {
  value: ConditionType;
  onChange: (v: ConditionType) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        background: C.dkBg,
        borderRadius: 6,
        padding: 2,
        gap: 1,
      }}
    >
      {(["AND", "OR"] as const).map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          style={{
            padding: "2px 9px",
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            background:
              value === c ? (c === "AND" ? C.pink : C.green) : "transparent",
            color: value === c ? "#fff" : C.gray,
          }}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

// ── ProductModal (TriggerModal) ───────────────────────────────────────────────
interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (items: ModalItem[], topCond: ConditionType) => void;
  initialItems?: ModalItem[];
  initialTopCond?: ConditionType;
  title?: string;
}

export default function ProductModal({
  open,
  onClose,
  onConfirm,
  initialItems = [],
  initialTopCond = "OR",
  title = "Add Trigger Products",
}: ProductModalProps) {
  const [selMode, setSelMode] = useState<"product" | "label">("product");
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("SKU Code");
  const [items, setItems] = useState<ModalItem[]>(initialItems);
  const [topCond, setTopCond] = useState<ConditionType>(initialTopCond);
  const [checkedUids, setCheckedUids] = useState<Set<number>>(new Set());
  const [groupMode, setGroupMode] = useState(false);
  const [expandedLabels, setExpandedLabels] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) {
      setItems(initialItems);
      setTopCond(initialTopCond);
      setQuery("");
      setCheckedUids(new Set());
      setGroupMode(false);
      setSelMode("product");
      setExpandedLabels(new Set());
    }
  }, [open, initialItems, initialTopCond]);

  const allCount = items.reduce(
    (s, i) => s + (i.type === "group" ? i.products.length : 1),
    0,
  );

  const filteredProducts = PRODUCTS.filter((p) => {
    if (!query) return true;
    const q = query.toLowerCase();
    if (searchType === "SKU Code") return p.id.toLowerCase().includes(q);
    if (searchType === "SAP Code") return p.sap.toLowerCase().includes(q);
    if (searchType === "Product Name") return p.name.toLowerCase().includes(q);
    return true;
  });
  const filteredLabels = LABELS.filter(
    (l) => !query || l.name.toLowerCase().includes(query.toLowerCase()),
  );

  const addProduct = useCallback((p: ModalProduct) => {
    setItems((prev) => [...prev, { type: "product", uid: uid++, ...p }]);
  }, []);

  const addLabel = useCallback((label: LabelDef) => {
    const prods = label.productIds
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter(Boolean) as ModalProduct[];
    setItems((prev) => [
      ...prev,
      ...prods.map((p) => ({ type: "product" as const, uid: uid++, ...p })),
    ]);
  }, []);

  const removeItem = useCallback(
    (idx: number) => {
      const item = items[idx];
      if (item.type === "group") {
        setItems((prev) => [
          ...prev.slice(0, idx),
          ...item.products.map((p) => ({
            type: "product" as const,
            uid: uid++,
            ...p,
          })),
          ...prev.slice(idx + 1),
        ]);
      } else {
        setItems((prev) => prev.filter((_, i) => i !== idx));
      }
      setCheckedUids(new Set());
    },
    [items],
  );

  const removeFromGroup = useCallback(
    (gIdx: number, pid: string) => {
      const g = items[gIdx] as ModalGroupItem;
      const prods = g.products.filter((p) => p.id !== pid);
      if (prods.length <= 1) {
        setItems((prev) => [
          ...prev.slice(0, gIdx),
          ...prods.map((p) => ({ type: "product" as const, uid: uid++, ...p })),
          ...prev.slice(gIdx + 1),
        ]);
      } else {
        setItems((prev) =>
          prev.map((item, i) =>
            i === gIdx ? { ...item, products: prods } : item,
          ),
        );
      }
    },
    [items],
  );

  const toggleCheck = useCallback((u: number) => {
    setCheckedUids((prev) => {
      const n = new Set(prev);
      n.has(u) ? n.delete(u) : n.add(u);
      return n;
    });
  }, []);

  const makeGroup = useCallback(() => {
    if (checkedUids.size < 2) return;
    const name = `Group ${String.fromCharCode(64 + gid)}`;
    gid++;
    const prods = items.filter(
      (i): i is ModalProductItem =>
        i.type === "product" && checkedUids.has(i.uid),
    );
    const group: ModalGroupItem = {
      type: "group",
      id: `g${gid}`,
      name,
      condition: "OR",
      products: prods,
    };
    setItems((prev) => {
      const remaining = prev.filter(
        (i) =>
          i.type !== "product" || !checkedUids.has((i as ModalProductItem).uid),
      );
      const firstIdx = prev.findIndex(
        (i) =>
          i.type === "product" && checkedUids.has((i as ModalProductItem).uid),
      );
      return [
        ...remaining.slice(0, firstIdx),
        group,
        ...remaining.slice(firstIdx),
      ];
    });
    setCheckedUids(new Set());
    setGroupMode(false);
  }, [checkedUids, items]);

  const setGroupCond = useCallback((id: string, cond: ConditionType) => {
    setItems((prev) =>
      prev.map((i) =>
        i.type === "group" && i.id === id ? { ...i, condition: cond } : i,
      ),
    );
  }, []);

  const individualItems = items.filter(
    (i): i is ModalProductItem => i.type === "product",
  );

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(16,24,40,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          width: "min(900px,96vw)",
          height: "min(680px,92vh)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: `1px solid ${C.grBd}`,
          }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.dark }}>
              {title}
            </div>
            <div style={{ fontSize: 12, color: C.gray, marginTop: 2 }}>
              Between all items: <strong>AND / OR</strong> · Inside each group:{" "}
              <strong>AND / OR</strong>
            </div>
          </div>
          <button style={ib} onClick={onClose}>
            ✕
          </button>
        </div>
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* LEFT */}
          <div
            style={{
              width: 300,
              minWidth: 300,
              display: "flex",
              flexDirection: "column",
              borderRight: `1px solid ${C.grBd}`,
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                borderBottom: `1px solid ${C.grBd}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  background: C.dkBg,
                  borderRadius: 7,
                  padding: 2,
                  gap: 1,
                  marginBottom: 10,
                }}
              >
                {(
                  [
                    ["product", "By Product"],
                    ["label", "By Label"],
                  ] as const
                ).map(([m, l]) => (
                  <button
                    key={m}
                    onClick={() => {
                      setSelMode(m as "product" | "label");
                      setQuery("");
                      setSearchType("SKU Code");
                    }}
                    style={{
                      flex: 1,
                      padding: "6px 0",
                      borderRadius: 5,
                      fontSize: 12,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      background: selMode === m ? "#fff" : "transparent",
                      color: selMode === m ? C.dark : C.gray,
                      boxShadow:
                        selMode === m ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {selMode === "product" ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: `1px solid ${C.dkBd}`,
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <select
                    value={searchType}
                    onChange={(e) => {
                      setSearchType(e.target.value);
                      setQuery("");
                    }}
                    style={{
                      border: "none",
                      borderRight: `1px solid ${C.dkBd}`,
                      outline: "none",
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.dark,
                      background: C.grBg,
                      padding: "0 8px",
                      height: 36,
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    {["SKU Code", "SAP Code", "Product Name"].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flex: 1,
                      padding: "0 10px",
                    }}
                  >
                    <input
                      style={{
                        border: "none",
                        outline: "none",
                        fontSize: 12,
                        flex: 1,
                        color: C.dark,
                        background: "transparent",
                        height: 36,
                      }}
                      placeholder={`Search by ${searchType}...`}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                      <span
                        style={{
                          cursor: "pointer",
                          color: C.gray,
                          fontSize: 12,
                        }}
                        onClick={() => setQuery("")}
                      >
                        ✕
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: `1px solid ${C.dkBd}`,
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flex: 1,
                      padding: "0 10px",
                    }}
                  >
                    <input
                      style={{
                        border: "none",
                        outline: "none",
                        fontSize: 12,
                        flex: 1,
                        color: C.dark,
                        background: "transparent",
                        height: 36,
                      }}
                      placeholder="Search label name..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                      <span
                        style={{
                          cursor: "pointer",
                          color: C.gray,
                          fontSize: 12,
                        }}
                        onClick={() => setQuery("")}
                      >
                        ✕
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {selMode === "product" &&
                filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 14px",
                      borderBottom: `1px solid ${C.grBd}`,
                      cursor: "pointer",
                    }}
                    onClick={() => addProduct(p)}
                  >
                    <div
                      style={{
                        fontSize: 18,
                        width: 30,
                        height: 30,
                        background: C.dkBg,
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {p.img}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 500,
                          color: C.dark,
                          fontSize: 12,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {p.name}
                      </div>
                      <div
                        style={{ color: C.gray, fontSize: 10, marginTop: 1 }}
                      >
                        {p.sap}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: C.gray,
                        flexShrink: 0,
                      }}
                    >
                      + Add
                    </span>
                  </div>
                ))}
              {selMode === "label" &&
                filteredLabels.map((label) => {
                  const expanded = expandedLabels.has(label.id);
                  const prods = label.productIds
                    .map((id) => PRODUCTS.find((p) => p.id === id))
                    .filter(Boolean) as ModalProduct[];
                  return (
                    <div
                      key={label.id}
                      style={{ borderBottom: `1px solid ${C.grBd}` }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "10px 14px",
                        }}
                      >
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: C.purple,
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 600,
                              color: C.dark,
                              fontSize: 13,
                            }}
                          >
                            {label.name}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              marginTop: 2,
                            }}
                          >
                            <span style={{ fontSize: 11, color: C.gray }}>
                              {label.productIds.length} products
                            </span>
                            <span
                              onClick={() =>
                                setExpandedLabels((prev) => {
                                  const n = new Set(prev);
                                  n.has(label.id)
                                    ? n.delete(label.id)
                                    : n.add(label.id);
                                  return n;
                                })
                              }
                              style={{
                                fontSize: 11,
                                color: C.purple,
                                cursor: "pointer",
                                fontWeight: 500,
                              }}
                            >
                              {expanded ? "▲ collapse" : "▼ expand"}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => addLabel(label)}
                          style={{
                            padding: "4px 12px",
                            fontSize: 11,
                            fontWeight: 600,
                            border: "none",
                            borderRadius: 6,
                            background: C.gray,
                            color: "#fff",
                            cursor: "pointer",
                            flexShrink: 0,
                          }}
                        >
                          + Add all
                        </button>
                      </div>
                      {expanded && (
                        <div
                          style={{
                            background: C.grBg,
                            borderTop: `1px solid ${C.grBd}`,
                            padding: "6px 14px 8px 28px",
                          }}
                        >
                          {prods.map((p) => (
                            <div
                              key={p.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "4px 0",
                                borderBottom: `1px dashed ${C.grBd}`,
                              }}
                            >
                              <span style={{ fontSize: 14 }}>{p.img}</span>
                              <div>
                                <div
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 500,
                                    color: C.dark,
                                  }}
                                >
                                  {p.name}
                                </div>
                                <div style={{ fontSize: 10, color: C.gray }}>
                                  {p.sap}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* RIGHT */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                borderBottom: `1px solid ${C.grBd}`,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>
                Selected{" "}
                {allCount > 0 && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: C.gray,
                      marginLeft: 6,
                    }}
                  >
                    {allCount} products · {items.length} items
                  </span>
                )}
              </div>
              {items.length > 1 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: C.gray }}>
                    Condition between items
                  </span>
                  <CondToggle value={topCond} onChange={setTopCond} />
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 16px",
                background: C.grBg,
                borderBottom: `1px solid ${C.grBd}`,
              }}
            >
              {!groupMode ? (
                <>
                  <button
                    onClick={() => {
                      setGroupMode(true);
                      setCheckedUids(new Set());
                    }}
                    disabled={individualItems.length < 2}
                    style={{
                      padding: "4px 10px",
                      fontSize: 11,
                      fontWeight: 500,
                      border: `1px solid ${C.dkBd}`,
                      borderRadius: 6,
                      background: "#fff",
                      cursor:
                        individualItems.length < 2 ? "not-allowed" : "pointer",
                      color: individualItems.length < 2 ? C.dkBd : C.dark,
                    }}
                  >
                    Group items
                  </button>
                  <span style={{ fontSize: 11, color: C.gray }}>
                    Select individual products to group
                  </span>
                </>
              ) : (
                <>
                  <span
                    style={{ fontSize: 11, color: C.dark, fontWeight: 500 }}
                  >
                    Select products to group
                  </span>
                  <span
                    style={{ fontSize: 11, color: C.purple, marginLeft: 4 }}
                  >
                    {checkedUids.size} selected
                  </span>
                  <div style={{ flex: 1 }} />
                  <button
                    onClick={makeGroup}
                    disabled={checkedUids.size < 2}
                    style={{
                      padding: "4px 10px",
                      fontSize: 11,
                      fontWeight: 600,
                      border: "none",
                      borderRadius: 6,
                      background: checkedUids.size >= 2 ? C.purple : C.dkBg,
                      color: checkedUids.size >= 2 ? "#fff" : C.gray,
                      cursor: checkedUids.size >= 2 ? "pointer" : "not-allowed",
                      marginRight: 6,
                    }}
                  >
                    Create Group
                  </button>
                  <button
                    onClick={() => {
                      setGroupMode(false);
                      setCheckedUids(new Set());
                    }}
                    style={{
                      padding: "4px 10px",
                      fontSize: 11,
                      border: `1px solid ${C.dkBd}`,
                      borderRadius: 6,
                      background: "#fff",
                      cursor: "pointer",
                      color: C.gray,
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "10px 16px" }}>
              {items.length === 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 200,
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 6 }}>📦</div>
                  <div style={{ fontSize: 12, color: C.gray }}>
                    Add products or labels from the left panel
                  </div>
                </div>
              )}
              {items.map((item, idx) => (
                <div
                  key={
                    item.type === "group"
                      ? item.id
                      : (item as ModalProductItem).uid
                  }
                >
                  {idx > 0 && <CondBadge type={topCond} />}
                  {item.type === "product" && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        background: "#fff",
                        border: checkedUids.has(item.uid)
                          ? `1.5px solid ${C.purple}`
                          : `1px solid ${C.grBd}`,
                        borderRadius: 8,
                        padding: "7px 9px",
                        cursor: groupMode ? "pointer" : "default",
                        marginBottom: 2,
                      }}
                      onClick={() => groupMode && toggleCheck(item.uid)}
                    >
                      {groupMode && (
                        <div
                          style={{
                            width: 15,
                            height: 15,
                            borderRadius: 3,
                            border: checkedUids.has(item.uid)
                              ? "none"
                              : `1.5px solid ${C.dkBd}`,
                            background: checkedUids.has(item.uid)
                              ? C.purple
                              : "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {checkedUids.has(item.uid) && (
                            <span
                              style={{
                                color: "#fff",
                                fontSize: 8,
                                fontWeight: 700,
                              }}
                            >
                              ✓
                            </span>
                          )}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: 16,
                          width: 28,
                          height: 28,
                          background: C.dkBg,
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {item.img}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 500,
                            color: C.dark,
                            fontSize: 12,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.name}
                        </div>
                        <div style={{ fontSize: 10, color: C.gray }}>
                          {item.sap}
                        </div>
                      </div>
                      {!groupMode && (
                        <button style={ib} onClick={() => removeItem(idx)}>
                          ✕
                        </button>
                      )}
                    </div>
                  )}
                  {item.type === "group" && (
                    <div
                      style={{
                        background: C.grBg,
                        border: `1.5px solid ${C.dkBd}`,
                        borderRadius: 9,
                        marginBottom: 2,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "8px 10px",
                          borderBottom: `1px solid ${C.grBd}`,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#fff",
                            background: C.dark,
                            padding: "2px 9px",
                            borderRadius: 20,
                            flexShrink: 0,
                          }}
                        >
                          {item.name}
                        </span>
                        <span style={{ fontSize: 11, color: C.gray }}>
                          {item.products.length} products
                        </span>
                        {item.products.length > 1 && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <span style={{ fontSize: 10, color: C.gray }}>
                              inside:
                            </span>
                            <CondToggle
                              value={item.condition}
                              onChange={(c) => setGroupCond(item.id, c)}
                            />
                          </div>
                        )}
                        <div style={{ flex: 1 }} />
                        <button
                          style={{ ...ib, fontSize: 11 }}
                          onClick={() => removeItem(idx)}
                        >
                          Ungroup ✕
                        </button>
                      </div>
                      <div style={{ padding: "6px 10px 8px" }}>
                        {item.products.map((p, pi) => (
                          <div key={p.id}>
                            {pi > 0 && <CondBadge type={item.condition} />}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                                background: "#fff",
                                border: `1px solid ${C.grBd}`,
                                borderRadius: 6,
                                padding: "5px 8px",
                              }}
                            >
                              <span style={{ fontSize: 14 }}>{p.img}</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                  style={{
                                    fontWeight: 500,
                                    color: C.dark,
                                    fontSize: 11,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {p.name}
                                </div>
                                <div style={{ fontSize: 10, color: C.gray }}>
                                  {p.sap}
                                </div>
                              </div>
                              <button
                                style={ib}
                                onClick={() => removeFromGroup(idx, p.id)}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {allCount > 0 && (
              <div
                style={{
                  margin: "0 16px 10px",
                  background: C.grBg,
                  border: `1px solid ${C.grBd}`,
                  borderRadius: 8,
                  padding: "10px 14px",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.gray,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  Summary
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  {items.map((item, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      {idx > 0 && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: topCond === "AND" ? C.pink : C.green,
                            background:
                              topCond === "AND" ? C.pinkBg : C.greenBg,
                            border: `1px solid ${topCond === "AND" ? C.pinkBd : C.greenBd}`,
                            borderRadius: 4,
                            padding: "1px 6px",
                          }}
                        >
                          {topCond}
                        </span>
                      )}
                      {item.type === "product" && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                            background: C.dkBg,
                            border: `1px solid ${C.dkBd}`,
                            borderRadius: 5,
                            padding: "2px 8px",
                            color: C.dark,
                            fontWeight: 500,
                            fontSize: 11,
                          }}
                        >
                          <span>{item.img}</span>
                          <span
                            style={{
                              maxWidth: 90,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.name}
                          </span>
                        </span>
                      )}
                      {item.type === "group" && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                            background: C.dkBg,
                            border: `1px solid ${C.dkBd}`,
                            borderRadius: 5,
                            padding: "2px 8px",
                            color: C.dark,
                            fontWeight: 500,
                            fontSize: 11,
                          }}
                        >
                          <span style={{ fontSize: 9, fontWeight: 700 }}>
                            {item.name}
                          </span>
                          <span style={{ color: C.gray }}>
                            ({item.products.length})
                          </span>
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 20px",
                borderTop: `1px solid ${C.grBd}`,
              }}
            >
              <span style={{ flex: 1, fontSize: 11, color: C.gray }}>
                {allCount > 0
                  ? `${allCount} product${allCount > 1 ? "s" : ""} selected`
                  : "No products selected"}
              </span>
              <button
                style={{
                  padding: "7px 18px",
                  fontSize: 13,
                  fontWeight: 500,
                  border: `1px solid ${C.dkBd}`,
                  borderRadius: 8,
                  background: "#fff",
                  color: C.dark,
                  cursor: "pointer",
                }}
                onClick={onClose}
              >
                Close
              </button>
              <button
                style={{
                  padding: "7px 18px",
                  fontSize: 13,
                  fontWeight: 600,
                  border: "none",
                  borderRadius: 8,
                  background: C.gray,
                  color: "#fff",
                  cursor: allCount === 0 ? "not-allowed" : "pointer",
                  opacity: allCount === 0 ? 0.4 : 1,
                }}
                disabled={allCount === 0}
                onClick={() => onConfirm(items, topCond)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
