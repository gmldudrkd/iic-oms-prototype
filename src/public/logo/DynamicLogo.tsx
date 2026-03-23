// import IICLogoBlack from "@/public/logo/iic/IICLogoBlack";

export default function DynamicLogo({ logoType }: { logoType: string }) {
  switch (logoType) {
    case "iic":
    default:
      return <></>;
    // return <IICLogoBlack />;
  }
}
