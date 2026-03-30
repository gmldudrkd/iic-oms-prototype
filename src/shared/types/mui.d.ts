import "@mui/material/styles";
import "@mui/material/Chip";

declare module "@mui/material/styles" {
  interface Palette {
    confirm: Palette["primary"];
    cancel: Palette["primary"];
    text: TypeText;
    shipment: Palette["primary"];
    storePickup: Palette["primary"];
  }

  interface PaletteOptions {
    confirm?: PaletteOptions["primary"];
    cancel?: PaletteOptions["primary"];
    text?: Partial<TypeText>;
    shipment?: PaletteOptions["primary"];
    storePickup?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    shipment: true;
    storePickup: true;
  }
}
