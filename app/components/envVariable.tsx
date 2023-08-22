import React from "react";
import { Typography } from "@mui/material";

const EnvVariable: React.FC<{
  key: string;
}> = ({ key }) => {
  console.log(process.env[key]);

  return <Typography component="span">{process.env[key]}</Typography>;
};

export default EnvVariable;
