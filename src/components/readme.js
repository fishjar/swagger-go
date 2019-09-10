import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "github-markdown-css";

import { readReadme } from "../utils";

export default function Readme() {
  const [source, setSource] = useState("");
  useEffect(() => {
    readReadme().then(text => {
      setSource(text);
    });
  }, []);
  return <ReactMarkdown className="markdown-body" source={source} />;
}
