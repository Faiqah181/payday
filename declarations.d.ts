declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

// Metro resolves asset imports to a numeric asset-registry id
declare module "*.wav" {
  const asset: number;
  export default asset;
}

declare module "*.mp3" {
  const asset: number;
  export default asset;
}
