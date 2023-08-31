import React from "react";
import { Typography } from "@mui/material";

const EnvVariable: React.FC<{
  key: string;
}> = ({ key }) => <Typography component="span">{process.env[key]}</Typography>;

export default EnvVariable;
