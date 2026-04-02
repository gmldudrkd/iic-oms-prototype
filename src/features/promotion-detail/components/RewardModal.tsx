"use client";

import { useState, useEffect, useCallback } from "react";

import type { ModalProduct } from "@/features/promotion-detail/components/ProductModal";

// ── Color tokens ──────────────────────────────────────────────────────────────
const C = {
  blue: "#D6006E",
  bluBg: "#FFF0F7",
  bluBd: "#F9A8D4",
  dark: "#344054",
  dkBg: "#F2F4F7",
  dkBd: "#D0D5DD",
  gray: "#667085",
  grBg: "#F9FAFB",
  grBd: "#EAECF0",
};

// ── Types ─────────────────────────────────────────────────────────────────────
export interface RewardSelectedItem extends ModalProduct {
  uid: number;
}

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

let uidCounter = 1000;
const ib: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: C.gray,
  fontSize: 12,
  padding: "0 2px",
};

// ── RewardModal ───────────────────────────────────────────────────────────────
interface RewardModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selected: RewardSelectedItem[], isRandom: boolean) => void;
  initialSelected?: RewardSelectedItem[];
  initialRandom?: boolean;
}

export default function RewardModal({
  open,
  onClose,
  onConfirm,
  initialSelected = [],
  initialRandom = false,
}: RewardModalProps) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("SKU Code");
  const [selected, setSelected] =
    useState<RewardSelectedItem[]>(initialSelected);
  const [isRandom, setIsRandom] = useState(initialRandom);

  useEffect(() => {
    if (open) {
      setSelected(initialSelected);
      setIsRandom(initialRandom);
      setQuery("");
    }
  }, [open, initialSelected, initialRandom]);

  const filtered = PRODUCTS.filter((p) => {
    if (!query) return true;
    const q = query.toLowerCase();
    if (searchType === "SKU Code") return p.id.toLowerCase().includes(q);
    if (searchType === "SAP Code") return p.sap.toLowerCase().includes(q);
    if (searchType === "Product Name") return p.name.toLowerCase().includes(q);
    return true;
  });

  const isChecked = (id: string) => selected.some((s) => s.id === id);

  const toggleProduct = useCallback((p: ModalProduct) => {
    setSelected((prev) =>
      prev.find((s) => s.id === p.id)
        ? prev.filter((s) => s.id !== p.id)
        : [...prev, { uid: uidCounter++, ...p }],
    );
  }, []);

  const remove = useCallback((uid: number) => {
    setSelected((prev) => prev.filter((s) => s.uid !== uid));
  }, []);

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
          width: "min(820px,96vw)",
          height: "min(620px,92vh)",
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
              Add Reward Products
            </div>
            <div style={{ fontSize: 12, color: C.gray, marginTop: 2 }}>
              Select products to be given as rewards
            </div>
          </div>
          <button style={ib} onClick={onClose}>
            ✕
          </button>
        </div>
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Left — Search */}
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
                padding: "14px 16px 10px",
                borderBottom: `1px solid ${C.grBd}`,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.dark,
                  marginBottom: 8,
                }}
              >
                Product Search
              </div>
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
                      style={{ cursor: "pointer", color: C.gray, fontSize: 12 }}
                      onClick={() => setQuery("")}
                    >
                      ✕
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {filtered.map((p) => {
                const checked = isChecked(p.id);
                return (
                  <div
                    key={p.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 14px",
                      borderBottom: `1px solid ${C.grBd}`,
                      cursor: "pointer",
                      background: checked ? C.grBg : "#fff",
                    }}
                    onClick={() => toggleProduct(p)}
                  >
                    <div
                      style={{
                        width: 17,
                        height: 17,
                        borderRadius: 4,
                        border: checked ? "none" : `1.5px solid ${C.dkBd}`,
                        background: checked ? C.blue : "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {checked && (
                        <span
                          style={{
                            color: "#fff",
                            fontSize: 9,
                            fontWeight: 700,
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
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
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — Selected & Options */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            {/* Random toggle */}
            <div
              style={{
                padding: "12px 16px",
                borderBottom: `1px solid ${C.grBd}`,
                background: isRandom ? C.bluBg : C.grBg,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>
                    Random Reward
                  </div>
                  <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>
                    {isRandom
                      ? "One product will be randomly selected."
                      : "All selected products will be rewarded."}
                  </div>
                </div>
                <div
                  onClick={() => setIsRandom((p) => !p)}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    background: isRandom ? C.blue : C.dkBd,
                    cursor: "pointer",
                    position: "relative",
                    transition: "background 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#fff",
                      position: "absolute",
                      top: 3,
                      left: isRandom ? 23 : 3,
                      transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
              </div>
              {isRandom && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 10,
                    padding: "8px 12px",
                    background: "#fff",
                    border: `1px solid ${C.bluBd}`,
                    borderRadius: 8,
                  }}
                >
                  <span style={{ fontSize: 14 }}>🎲</span>
                  <span style={{ fontSize: 12, color: C.blue }}>
                    1 item will be randomly selected from the list below.
                  </span>
                </div>
              )}
            </div>

            {/* Selected list header */}
            <div
              style={{
                padding: "10px 16px 4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: C.dark }}>
                Selected Products
              </span>
              {selected.length > 0 && (
                <span style={{ fontSize: 11, color: C.gray }}>
                  {selected.length} item{selected.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Selected list */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 12px" }}>
              {selected.length === 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 160,
                  }}
                >
                  <div style={{ fontSize: 26, marginBottom: 6 }}>🎁</div>
                  <div style={{ fontSize: 12, color: C.gray }}>
                    Select reward products from the left
                  </div>
                </div>
              )}
              {selected.map((p, idx) => (
                <div
                  key={p.uid}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#fff",
                    border: `1px solid ${C.grBd}`,
                    borderRadius: 8,
                    padding: "8px 10px",
                    marginBottom: 5,
                  }}
                >
                  {isRandom && (
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: C.bluBg,
                        border: `1px solid ${C.bluBd}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: C.blue,
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </div>
                  )}
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
                    <div style={{ fontSize: 10, color: C.gray }}>{p.sap}</div>
                  </div>
                  <button style={ib} onClick={() => remove(p.uid)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
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
                {selected.length > 0
                  ? isRandom
                    ? `1 random from ${selected.length} items`
                    : `${selected.length} product${selected.length > 1 ? "s" : ""} will all be rewarded`
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
                  cursor: selected.length === 0 ? "not-allowed" : "pointer",
                  opacity: selected.length === 0 ? 0.4 : 1,
                }}
                disabled={selected.length === 0}
                onClick={() => onConfirm(selected, isRandom)}
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
