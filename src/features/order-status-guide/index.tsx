"use client";

import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";

/* ─── 공통 스타일 ─── */

const headerCellSx = {
  fontSize: "13px",
  fontWeight: 700,
  color: "#555",
  py: 1.5,
  px: 2,
  bgcolor: "#fafafa",
  borderBottom: "1px solid #e0e0e0",
};

const cellSx = {
  fontSize: "13px",
  py: 2.5,
  px: 2,
  borderBottom: "1px solid #e0e0e0",
  verticalAlign: "middle",
};

/* ─── 공통 컴포넌트 ─── */

const StatusChip = ({
  label,
  color,
}: {
  label: string;
  color: string;
}) => (
  <Chip
    label={label}
    size="small"
    sx={{
      bgcolor: color,
      color: "#fff",
      fontWeight: 600,
      fontSize: "12px",
      height: "26px",
      borderRadius: "13px",
    }}
  />
);

const ActionTag = ({ label }: { label: string }) => (
  <Box
    component="span"
    sx={{
      display: "inline-block",
      border: "1px solid #9e9e9e",
      borderRadius: "4px",
      px: 1,
      py: 0.25,
      fontSize: "12px",
      fontWeight: 500,
      color: "#424242",
      lineHeight: 1.4,
    }}
  >
    {label}
  </Box>
);

const Check = ({ note }: { note?: string }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    <Typography sx={{ fontSize: "16px", color: "#333" }}>✓</Typography>
    {note && (
      <Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
        {note}
      </Typography>
    )}
  </Box>
);

const XMark = ({ red }: { red?: boolean }) => (
  <Typography
    sx={{ fontSize: "14px", color: red ? "#E91E63" : "#bdbdbd", fontWeight: 500 }}
  >
    X
  </Typography>
);

const SectionHeader = ({
  title,
  color,
}: {
  title: string;
  color: string;
}) => (
  <Box
    sx={{
      bgcolor: color,
      color: "#fff",
      px: 3,
      py: 1.5,
      borderRadius: "8px 8px 0 0",
      fontSize: "18px",
      fontWeight: 700,
    }}
  >
    {title}
  </Box>
);

const TableDivider = ({ color }: { color: string }) => (
  <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
    <Box sx={{ width: 32, height: 4, bgcolor: color, borderRadius: 2 }} />
  </Box>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   1. Order Status Guide
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function OrderStatusTable() {
  const rows: {
    status: string;
    chipColor: string;
    desc: string;
    descAction?: string;
    editRecipient: boolean;
    entireCancel: boolean;
    itemCancel: boolean;
    itemCancelNote?: string;
    qtyCancel: boolean;
    qtyCancelNote?: string;
    claimable: string;
    claimableSub?: string;
  }[] = [
    {
      status: "Pending",
      chipColor: "#2196F3",
      desc: "Stock not assigned",
      editRecipient: true,
      entireCancel: true,
      itemCancel: true,
      qtyCancel: true,
      claimable: "Order Cancel",
    },
    {
      status: "Collected",
      chipColor: "#2196F3",
      desc: "Stock not assigned",
      editRecipient: true,
      entireCancel: true,
      itemCancel: true,
      qtyCancel: true,
      claimable: "Order Cancel",
    },
    {
      status: "Partly Confirmed",
      chipColor: "#2196F3",
      desc: "Partially allocated stock",
      descAction: "Request Partial Shipment",
      editRecipient: true,
      entireCancel: true,
      itemCancel: true,
      qtyCancel: true,
      claimable: "Order Cancel",
    },
    {
      status: "Partial Shipment Requested",
      chipColor: "#2196F3",
      desc: "Partially requested for shipment",
      editRecipient: false,
      entireCancel: false,
      itemCancel: true,
      itemCancelNote: "(Only unshipped)",
      qtyCancel: true,
      qtyCancelNote: "(Only unshipped)",
      claimable: "Order Cancel",
      claimableSub: "(Only unshipped)",
    },
    {
      status: "Shipment Requested",
      chipColor: "#2196F3",
      desc: "Fully shipped out",
      editRecipient: false,
      entireCancel: false,
      itemCancel: false,
      qtyCancel: false,
      claimable: "Order Return,\nOrder Exchange",
      claimableSub: "(Only shipped)",
    },
    {
      status: "Completed",
      chipColor: "#2196F3",
      desc: "All non-canceled shipments delivered",
      editRecipient: false,
      entireCancel: false,
      itemCancel: false,
      qtyCancel: false,
      claimable: "Order Return,\nOrder Exchange",
    },
    {
      status: "Canceled",
      chipColor: "#2196F3",
      desc: "Order canceled. Auto Refunded",
      editRecipient: false,
      entireCancel: false,
      itemCancel: false,
      qtyCancel: false,
      claimable: "",
    },
  ];

  return (
    <TableContainer sx={{ borderRadius: "8px", border: "1px solid #e0e0e0" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ ...headerCellSx, minWidth: 140 }}>
              Order Status
            </TableCell>
            <TableCell sx={{ ...headerCellSx, minWidth: 220 }}>
              Status Description
            </TableCell>
            <TableCell sx={{ ...headerCellSx, minWidth: 100 }}>
              Edit Recipient
              <br />
              Info
            </TableCell>
            <TableCell sx={headerCellSx} align="center">
              <Box>Order Cancel</Box>
              <Box sx={{ fontSize: "11px", color: "#999", mt: 0.25 }}>
                Entire Cancel
              </Box>
            </TableCell>
            <TableCell sx={headerCellSx} align="center">
              <Box sx={{ visibility: "hidden" }}>Order Cancel</Box>
              <Box sx={{ fontSize: "11px", color: "#999", mt: 0.25 }}>
                Item Cancel
              </Box>
            </TableCell>
            <TableCell sx={headerCellSx} align="center">
              <Box sx={{ visibility: "hidden" }}>Order Cancel</Box>
              <Box sx={{ fontSize: "11px", color: "#999", mt: 0.25 }}>
                Qty Cancel
              </Box>
            </TableCell>
            <TableCell sx={{ ...headerCellSx, minWidth: 130 }}>
              Claimable Type
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.status}>
              <TableCell sx={cellSx}>
                <StatusChip label={row.status} color={row.chipColor} />
              </TableCell>
              <TableCell sx={cellSx}>
                <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                  {row.desc}
                </Typography>
                {row.descAction && (
                  <Box sx={{ mt: 0.5 }}>
                    <ActionTag label={row.descAction} />{" "}
                    <Typography
                      component="span"
                      sx={{ fontSize: "12px", fontWeight: 500 }}
                    >
                      Available
                    </Typography>
                  </Box>
                )}
              </TableCell>
              <TableCell sx={cellSx}>
                {row.editRecipient ? <Check /> : <XMark />}
              </TableCell>
              <TableCell sx={cellSx} align="center">
                {row.entireCancel ? <Check /> : <XMark />}
              </TableCell>
              <TableCell sx={cellSx} align="center">
                {row.itemCancel ? (
                  <Check note={row.itemCancelNote} />
                ) : (
                  <XMark />
                )}
              </TableCell>
              <TableCell sx={cellSx} align="center">
                {row.qtyCancel ? (
                  <Check note={row.qtyCancelNote} />
                ) : (
                  <XMark />
                )}
              </TableCell>
              <TableCell sx={cellSx}>
                {row.claimable ? (
                  <>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 600,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {row.claimable}
                    </Typography>
                    {row.claimableSub && (
                      <Typography sx={{ fontSize: "11px", color: "#999" }}>
                        {row.claimableSub}
                      </Typography>
                    )}
                  </>
                ) : (
                  <XMark />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function OrderShipmentStatusTable() {
  const rows: {
    status: string;
    desc: string;
    descActions?: string[];
    cancel: boolean;
    cancelNote?: string;
    claimable: string;
  }[] = [
    {
      status: "Picking Requested",
      desc: "Shipment instruction sent to WMS.",
      descActions: ["Cancel Shipment"],
      cancel: true,
      cancelNote: "(WMS Confirm needed)",
      claimable: "Shipment Cancel",
    },
    {
      status: "Picking Rejected",
      desc: "Picking failed due to insufficient stock",
      descActions: ["Re-Ship", "Cancel Order"],
      cancel: true,
      claimable: "Shipment Cancel",
    },
    {
      status: "Picked",
      desc: "Picking assigned and completed",
      cancel: false,
      claimable: "",
    },
    {
      status: "Packed",
      desc: "Packing assigned and completed",
      cancel: false,
      claimable: "",
    },
    {
      status: "Shipped",
      desc: "Shipped out",
      cancel: false,
      claimable: "Order Return, Order Exchange",
    },
    {
      status: "Lost",
      desc: "Lost in Transit",
      cancel: false,
      claimable: "Force Refund, Reshipment",
    },
    {
      status: "Delivered",
      desc: "Delivery completed",
      cancel: false,
      claimable: "Order Return, Order Exchange",
    },
    {
      status: "Canceled",
      desc: "Shipment canceled",
      cancel: false,
      claimable: "",
    },
  ];

  return (
    <TableContainer sx={{ borderRadius: "8px", border: "1px solid #e0e0e0" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ ...headerCellSx, minWidth: 160 }}>
              Shipment Status
            </TableCell>
            <TableCell sx={{ ...headerCellSx, minWidth: 280 }}>
              Status Description
            </TableCell>
            <TableCell sx={{ ...headerCellSx, minWidth: 180 }}>
              Shipment Cancel
            </TableCell>
            <TableCell sx={{ ...headerCellSx, minWidth: 200 }}>
              Claimable Type
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.status}>
              <TableCell sx={cellSx}>
                <StatusChip label={row.status} color="#E91E63" />
              </TableCell>
              <TableCell sx={cellSx}>
                <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                  {row.desc}
                </Typography>
                {row.descActions && (
                  <Box
                    sx={{
                      mt: 0.5,
                      display: "flex",
                      gap: 0.5,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {row.descActions.map((action, idx) => (
                      <React.Fragment key={action}>
                        <ActionTag label={action} />
                        {idx < (row.descActions?.length ?? 0) - 1 && (
                          <Typography
                            component="span"
                            sx={{ fontSize: "12px" }}
                          >
                            ,
                          </Typography>
                        )}
                      </React.Fragment>
                    ))}
                    <Typography
                      component="span"
                      sx={{ fontSize: "12px", fontWeight: 500 }}
                    >
                      {" "}
                      Available
                    </Typography>
                  </Box>
                )}
              </TableCell>
              <TableCell sx={cellSx}>
                {row.cancel ? <Check note={row.cancelNote} /> : <XMark />}
              </TableCell>
              <TableCell sx={cellSx}>
                {row.claimable ? (
                  <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                    {row.claimable}
                  </Typography>
                ) : (
                  <XMark />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function StorePickupStatusTable() {
  const rows: {
    status: string;
    desc: string;
    descAction?: string;
    cancel: boolean;
    claimable: string;
  }[] = [
    {
      status: "Pickup Requested",
      desc: "Shipment from warehouse to store has been completed.",
      cancel: true,
      claimable: "Order Cancel",
    },
    {
      status: "Shipped",
      desc: "Shipment from warehouse to store has been completed.",
      descAction: "Cancel Order",
      cancel: true,
      claimable: "Order Cancel",
    },
    {
      status: "Prepared",
      desc: "Received at store — ready for customer pickup.",
      cancel: true,
      claimable: "Order Cancel",
    },
    {
      status: "Completed",
      desc: "Customer pickup completed at the store.",
      cancel: false,
      claimable: "",
    },
    {
      status: "Canceled",
      desc: "Store Pickup canceled",
      cancel: false,
      claimable: "",
    },
  ];

  return (
    <TableContainer sx={{ borderRadius: "8px", border: "1px solid #e0e0e0" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ ...headerCellSx, minWidth: 160 }}>
              Store Pickup Status
            </TableCell>
            <TableCell sx={{ ...headerCellSx, minWidth: 300 }}>
              Status Description
            </TableCell>
            <TableCell sx={{ ...headerCellSx, minWidth: 160 }}>
              Store Pickup Cancel
            </TableCell>
            <TableCell sx={{ ...headerCellSx, minWidth: 200 }}>
              Claimable Type
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.status}>
              <TableCell sx={cellSx}>
                <StatusChip label={row.status} color="#9C27B0" />
              </TableCell>
              <TableCell sx={cellSx}>
                <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                  {row.desc}
                </Typography>
                {row.descAction && (
                  <Box sx={{ mt: 0.5 }}>
                    <ActionTag label={row.descAction} />{" "}
                    <Typography
                      component="span"
                      sx={{ fontSize: "12px", fontWeight: 500 }}
                    >
                      Available
                    </Typography>
                  </Box>
                )}
              </TableCell>
              <TableCell sx={cellSx}>
                {row.cancel ? <Check /> : <XMark />}
              </TableCell>
              <TableCell sx={cellSx}>
                {row.claimable ? (
                  <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                    {row.claimable}
                  </Typography>
                ) : (
                  <XMark />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   2. Return Status Guide
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function ReturnStatusTable() {
  const rows: {
    status: string;
    desc: string;
    descAction?: string;
    cancel: boolean;
    refundable: string;
  }[] = [
    {
      status: "Pending",
      desc: "Return scheduled for pickup",
      descAction: "Pickup Request",
      cancel: true,
      refundable: "",
    },
    {
      status: "Pickup Requested",
      desc: "Return pickup instruction sent",
      cancel: true,
      refundable: "",
    },
    {
      status: "Pickup Ongoing",
      desc: "Return pickup in progress",
      cancel: true,
      refundable: "",
    },
    {
      status: "Received",
      desc: "Return received and grading completed.",
      cancel: true,
      refundable: "Auto Refund on Grading",
    },
    {
      status: "Refunded",
      desc: "Return completed and refund processed.",
      cancel: false,
      refundable: "Already Refunded",
    },
    {
      status: "Canceled",
      desc: "Return canceled",
      cancel: false,
      refundable: "",
    },
  ];

  return (
    <TableContainer sx={{ borderRadius: "8px", border: "1px solid #e0e0e0" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ ...headerCellSx, minWidth: 160 }}>
              Status
            </TableCell>
            <TableCell sx={{ ...headerCellSx, minWidth: 300 }}>
              Status Description
            </TableCell>
            <TableCell sx={{ ...headerCellSx, minWidth: 140 }}>
              Return Cancel
            </TableCell>
            <TableCell sx={{ ...headerCellSx, minWidth: 200 }}>
              Refundable
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.status}>
              <TableCell sx={cellSx}>
                <StatusChip label={row.status} color="#FF9800" />
              </TableCell>
              <TableCell sx={cellSx}>
                <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                  {row.desc}
                </Typography>
                {row.descAction && (
                  <Box sx={{ mt: 0.5 }}>
                    <ActionTag label={row.descAction} />{" "}
                    <Typography
                      component="span"
                      sx={{ fontSize: "12px", fontWeight: 500 }}
                    >
                      Available
                    </Typography>
                  </Box>
                )}
              </TableCell>
              <TableCell sx={cellSx}>
                {row.cancel ? <Check /> : <XMark />}
              </TableCell>
              <TableCell sx={cellSx}>
                {row.refundable ? (
                  <Typography sx={{ fontSize: "13px", color: "#757575" }}>
                    {row.refundable}
                  </Typography>
                ) : (
                  <XMark />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   3. Exchange Status Guide
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function ExchangeStatusTable() {
  const rows: {
    status: string;
    desc: string;
    cancel: boolean;
    cancelRed?: boolean;
    refundable: string;
  }[] = [
    { status: "Pending", desc: "Exchange scheduled for pickup", cancel: true, refundable: "" },
    { status: "Pickup Requested", desc: "Exchange pickup instruction sent", cancel: true, refundable: "" },
    { status: "Pickup Ongoing", desc: "Exchange pickup in progress", cancel: true, refundable: "" },
    { status: "Received", desc: "Exchange received (pending grading)", cancel: true, refundable: "" },
    { status: "Inspected", desc: "Exchange grading completed.", cancel: false, cancelRed: true, refundable: "" },
    { status: "Shipment Requested", desc: "Resend shipment requested", cancel: false, cancelRed: true, refundable: "" },
    { status: "Exchanged", desc: "Resend shipment completed", cancel: false, refundable: "" },
    { status: "Canceled", desc: "Exchange canceled", cancel: false, refundable: "" },
  ];

  return (
    <TableContainer sx={{ borderRadius: "8px", border: "1px solid #e0e0e0" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ ...headerCellSx, minWidth: 160 }}>
              Status
            </TableCell>
            <TableCell sx={{ ...headerCellSx, minWidth: 300 }}>
              Status Description
            </TableCell>
            <TableCell sx={{ ...headerCellSx, minWidth: 140 }}>
              Exchange Cancel
            </TableCell>
            <TableCell sx={{ ...headerCellSx, minWidth: 200 }}>
              Refundable
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.status}>
              <TableCell sx={cellSx}>
                <StatusChip label={row.status} color="#4CAF50" />
              </TableCell>
              <TableCell sx={cellSx}>
                <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                  {row.desc}
                </Typography>
              </TableCell>
              <TableCell sx={cellSx}>
                {row.cancel ? <Check /> : <XMark red={row.cancelRed} />}
              </TableCell>
              <TableCell sx={cellSx}>
                <XMark />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function ExchangeShipmentStatusTable() {
  const rows: {
    status: string;
    desc: string;
    descAction?: string;
  }[] = [
    { status: "Picking Requested", desc: "Shipment instruction sent to WMS." },
    { status: "Picking Rejected", desc: "Picking failed due to insufficient stock", descAction: "Request Shipment" },
    { status: "Picked", desc: "Picking assigned and completed" },
    { status: "Packed", desc: "Packing assigned and completed" },
    { status: "Shipped", desc: "Shipped out" },
    { status: "Delivered", desc: "Delivery completed" },
    { status: "Canceled", desc: "Shipment canceled" },
  ];

  return (
    <TableContainer sx={{ borderRadius: "8px", border: "1px solid #e0e0e0" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ ...headerCellSx, minWidth: 160 }}>
              Shipment Status
            </TableCell>
            <TableCell sx={{ ...headerCellSx, minWidth: 300 }}>
              Status Description
            </TableCell>
            <TableCell sx={{ ...headerCellSx, minWidth: 140 }}>
              Shipment Cancel
            </TableCell>
            <TableCell sx={{ ...headerCellSx, minWidth: 200 }}>
              Claimable Type
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.status}>
              <TableCell sx={cellSx}>
                <Chip
                  label={row.status}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    fontSize: "12px",
                    height: "26px",
                    borderRadius: "13px",
                    borderColor: "#757575",
                    color: "#424242",
                  }}
                />
              </TableCell>
              <TableCell sx={cellSx}>
                <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                  {row.desc}
                </Typography>
                {row.descAction && (
                  <Box sx={{ mt: 0.5 }}>
                    <ActionTag label={row.descAction} />
                  </Box>
                )}
              </TableCell>
              <TableCell sx={cellSx}>
                <XMark />
              </TableCell>
              <TableCell sx={cellSx}>
                <XMark />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   4. Reshipment Status Guide
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function ReshipmentStatusTable() {
  const rows: {
    status: string;
    desc: string;
    descActions?: string[];
    cancel: boolean;
    cancelNote?: string;
    claimable: string;
  }[] = [
    {
      status: "Picking Requested",
      desc: "Shipment instruction sent to WMS.",
      descActions: ["Cancel Shipment"],
      cancel: true,
      cancelNote: "(WMS Confirm needed)",
      claimable: "Shipment Cancel",
    },
    {
      status: "Picking Rejected",
      desc: "Picking failed due to insufficient stock",
      descActions: ["Re-Ship", "Cancel Order"],
      cancel: true,
      claimable: "Shipment Cancel",
    },
    {
      status: "Picked",
      desc: "Picking assigned and completed",
      cancel: false,
      claimable: "",
    },
    {
      status: "Packed",
      desc: "Packing assigned and completed",
      cancel: false,
      claimable: "",
    },
    {
      status: "Shipped",
      desc: "Shipped out",
      cancel: false,
      claimable: "Order Return, Order Exchange",
    },
    {
      status: "Lost",
      desc: "Lost in Transit",
      cancel: false,
      claimable: "Force Refund, Reshipment",
    },
    {
      status: "Delivered",
      desc: "Delivery completed",
      cancel: false,
      claimable: "Order Return, Order Exchange",
    },
    {
      status: "Canceled",
      desc: "Shipment canceled",
      cancel: false,
      claimable: "",
    },
  ];

  return (
    <TableContainer sx={{ borderRadius: "8px", border: "1px solid #e0e0e0" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ ...headerCellSx, minWidth: 160 }}>
              Shipment Status
            </TableCell>
            <TableCell sx={{ ...headerCellSx, minWidth: 300 }}>
              Status Description
            </TableCell>
            <TableCell sx={{ ...headerCellSx, minWidth: 180 }}>
              Shipment Cancel
            </TableCell>
            <TableCell sx={{ ...headerCellSx, minWidth: 200 }}>
              Claimable Type
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.status}>
              <TableCell sx={cellSx}>
                <StatusChip label={row.status} color="#E91E63" />
              </TableCell>
              <TableCell sx={cellSx}>
                <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                  {row.desc}
                </Typography>
                {row.descActions && (
                  <Box
                    sx={{
                      mt: 0.5,
                      display: "flex",
                      gap: 0.5,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {row.descActions.map((action, idx) => (
                      <React.Fragment key={action}>
                        <ActionTag label={action} />
                        {idx < (row.descActions?.length ?? 0) - 1 && (
                          <Typography
                            component="span"
                            sx={{ fontSize: "12px" }}
                          >
                            ,
                          </Typography>
                        )}
                      </React.Fragment>
                    ))}
                    <Typography
                      component="span"
                      sx={{ fontSize: "12px", fontWeight: 500 }}
                    >
                      {" "}
                      Available
                    </Typography>
                  </Box>
                )}
              </TableCell>
              <TableCell sx={cellSx}>
                {row.cancel ? <Check note={row.cancelNote} /> : <XMark />}
              </TableCell>
              <TableCell sx={cellSx}>
                {row.claimable ? (
                  <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                    {row.claimable}
                  </Typography>
                ) : (
                  <XMark />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Main Component
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function OrderStatusGuide() {
  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto", pb: 8 }}>
      {/* Order Status Guide */}
      <Box>
        <SectionHeader title="Order Status Guide" color="#2196F3" />
        <Box
          sx={{
            border: "1px solid #e0e0e0",
            borderTop: 0,
            borderRadius: "0 0 8px 8px",
            bgcolor: "#fff",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          <OrderStatusTable />
          <TableDivider color="#E91E63" />
          <OrderShipmentStatusTable />
          <TableDivider color="#E91E63" />
          <StorePickupStatusTable />
        </Box>
      </Box>

      {/* Return Status Guide */}
      <Box sx={{ mt: 5 }}>
        <SectionHeader title="Return Status Guide" color="#2196F3" />
        <Box
          sx={{
            border: "1px solid #e0e0e0",
            borderTop: 0,
            borderRadius: "0 0 8px 8px",
            bgcolor: "#fff",
            p: 3,
          }}
        >
          <ReturnStatusTable />
        </Box>
      </Box>

      {/* Exchange Status Guide */}
      <Box sx={{ mt: 5 }}>
        <SectionHeader title="Exchange Status Guide" color="#2196F3" />
        <Box
          sx={{
            border: "1px solid #e0e0e0",
            borderTop: 0,
            borderRadius: "0 0 8px 8px",
            bgcolor: "#fff",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <ExchangeStatusTable />
          <ExchangeShipmentStatusTable />
        </Box>
      </Box>

      {/* Reshipment Status Guide */}
      <Box sx={{ mt: 5 }}>
        <SectionHeader title="Reshipment Status Guide" color="#2196F3" />
        <Box
          sx={{
            border: "1px solid #e0e0e0",
            borderTop: 0,
            borderRadius: "0 0 8px 8px",
            bgcolor: "#fff",
            p: 3,
          }}
        >
          <ReshipmentStatusTable />
        </Box>
      </Box>
    </Box>
  );
}
