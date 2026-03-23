import Chip from "@mui/material/Chip";

export default function HeaderChip({
  type = null,
}: {
  type: "bundle" | "single" | "gift" | null;
}) {
  if (type === "bundle") {
    return (
      <Chip
        size="small"
        variant="filled"
        label="Bundle"
        color="primary"
        className="mt-[2px]"
      />
    );
  }
  if (type === "single") {
    return (
      <Chip
        size="small"
        variant="filled"
        label="Single"
        color="default"
        className="mt-[2px]"
      />
    );
  }
  if (type === "gift") {
    return (
      <Chip
        size="small"
        variant="filled"
        label="Gift"
        color="default"
        className="mt-[2px]"
      />
    );
  }

  return null;
}
