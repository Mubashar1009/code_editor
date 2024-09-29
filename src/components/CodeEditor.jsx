import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import ACTIONS from "../Actions";

export const CodeEditor = ({ socketRef, roomId,handleChangeCode }) => {
  const [code, setCode] = useState("");
  const editorRef = useRef();

  console.log("CodeEditor**");

  useEffect(() => {
    if (socketRef.current) {
      console.log("Sockets connected**",editorRef.current);
      
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code,
      });
      
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          console.log("code changed", code);
          setCode(code);
          handleChangeCode(code);
          // update the parent component's code
        }
      });
    }

    // Cleanup socket listeners when component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      }
    };
  }, [socketRef.current]); // Only depend on socketRef.current

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = code;
    
   
   
    editor.focus();
  }

  const handleOutput = () => {
    const output = editorRef.current.getValue();
    if (!output) return;

    console.log("output", output);

    fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      body: JSON.stringify({
        language: "js",
        version: "18.15.0",
        files: [{ name: "my_cool_code.js", content: output }],
      }),
    })
      .then(response => response.json())
      .then(data => console.log('API response', data.output))
      .catch(error => console.log("Error", error));
  };

  const handleChange = (newValue) => {
    console.log("NewValue", newValue);
    setCode(newValue);
    console.log("NewValue", newValue);
    handleChangeCode(newValue);

    if (socketRef.current) {
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code: newValue,
      });
    }
  };

  return (
    <div className="w-full h-full bg-red-600">
      <button className="bg-red-600 p-2 rounded" onClick={handleOutput}>Run</button>
      <Editor
        width="100%"
        height="100%"
        theme="vs-dark"
        fontSize={16}
        lineNumbers={true}
        defaultLanguage="javascript"
        defaultValue="// some comment"
        value={code}
        onMount={handleEditorDidMount}
        onChange={handleChange}
      />
    </div>
  );
};
