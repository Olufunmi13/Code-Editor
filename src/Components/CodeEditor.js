import React, { useState,useEffect } from 'react';
import "./CodeEditor.scss";
import Editor from '@monaco-editor/react';

const CodeEditor = ({code,language,theme,onChange}) => {
  const [value,setValue] = useState(code || "");

  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
  };
 
  useEffect(() => {
    setValue(code || "");
  }, [code]);

  return (
    <div className='Editor'>
      <Editor
      height='85vh'
      width={`100%`}
      theme={theme}
      language={language || "javascript"}
      value={value}
      onChange={handleEditorChange}
       />
    </div>
  )
}

export default CodeEditor


// FaBookmark
