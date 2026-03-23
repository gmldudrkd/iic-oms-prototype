export const productMasterFieldsNF: {
  label: string;
  key: string;
  subLabel?: string;
}[][] = [
  [
    { label: "SKU Code", key: "skuCode" },
    { label: "Collection Name", key: "collectionName" },
  ],
  [
    { label: "SAP Code", key: "sapCode" },
    { label: "Color", key: "color" },
  ],
  [
    { label: "SAP Name", key: "sapName" },
    { label: "Material", key: "material" },
  ],
  [
    { label: "Category", key: "category" },
    { label: "Size", key: "sizeMm", subLabel: "mm" },
  ],
  [
    { label: "Model Code", key: "modelCode" },
    { label: `Net Weight`, key: "netWeight", subLabel: "g" },
  ],
  [
    { label: "Model Name", key: "modelName" },
    { label: "Country of Origin", key: "countryOfOrigin" },
  ],
  [
    { label: "UPC Code", key: "upcCode" },
    { label: "Series Name", key: "lineName" },
  ],
  [
    { label: "HS Code", key: "hsCode" },
    { label: "Operational Status", key: "operationalStatus" },
  ],
  [
    { label: "Release Date", key: "releaseDate" },
    { label: "Sales Grade", key: "salesGrade" },
  ],
  [
    { label: "Season", key: "season" },
    { label: "Design Grade", key: "designGrade" },
  ],
  [{ label: "Capacity", key: "capacity", subLabel: "Capacity Unit" }],
  [{ label: "Care Instructions", key: "careInstructionsKo", subLabel: "KO" }],
  [{ label: "Care Instructions", key: "careInstructionsEn", subLabel: "EN" }],
];

export const productMasterFieldsAT: {
  label: string;
  key: string;
  subLabel?: string;
}[][] = [
  [
    { label: "SAP Code", key: "sapCode" },
    { label: "Collection Name", key: "collectionName" },
  ],
  [
    { label: "SAP Name", key: "sapName" },
    { label: "Color", key: "color" },
  ],
  [
    { label: "Category", key: "category" },
    { label: "Visual Texture", key: "visualTexture" },
  ],
  [
    { label: "Model Code", key: "modelCode" },
    { label: "Fit", key: "size" },
  ],
  [
    { label: "Model Name", key: "modelName" },
    { label: "Size (mm)", key: "mmSize" },
  ],
  [
    { label: "UPC Code", key: "upcCode" },
    { label: "Net Weight (g)", key: "netWeight" },
  ],
  [
    { label: "HS Code", key: "hsCode" },
    { label: "Outer Fabric (en)", key: "outerFabricEn" },
  ],
  [
    { label: "Release Date", key: "releaseDate" },
    { label: "Outer Fabric (ko)", key: "outerFabricKo" },
  ],
  [
    { label: "Season", key: "season" },
    { label: "Lining (en)", key: "liningEn" },
  ],
  [
    { label: "Country of Manufacture", key: "countryOfManufacture" },
    { label: "Lining (ko)", key: "liningKo" },
  ],
];
