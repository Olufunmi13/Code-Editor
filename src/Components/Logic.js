import React, {useState, useEffect} from 'react'
import CodeEditor from "./CodeEditor";
import {defineTheme} from "../Constants/defineTheme";
import  languageOptions from "../Constants/languagesOptions";
import LanguagesDropdown from "./LanguagesDropdown";
import ThemesDropdown from "./ThemesDropdown";
import OutputWindow from './OutputWindow'; 
import axios from "axios";
import { RWebShare } from "react-web-share";
import { FaShare } from "react-icons/fa6";
import "./Logic.scss";


const Logic = () => {
    const [code,setCode] = useState("")
    const [theme, setTheme] = useState("cobalt");
    const [language, setLanguage] = useState(languageOptions[0]);
    const [processing, setProcessing] = useState(null);
    const [outputDetails, setOutputDetails] = useState(null);

    const handleSave = () => {
      localStorage.setItem('savedCode', code);
    };

    const handleLoad = () => {
      const savedCode = localStorage.getItem('savedCode');
      if (savedCode) {
        setCode(savedCode);
      }
    };

    useEffect(() =>{
      // Get saved code from local storage
      const savedCode = localStorage.getItem('savedCode');
      if (savedCode) {
        setCode(savedCode);
      }
    }, [setCode]);
  
    const onSelectChange = (sl) => {
        console.log("selected Option...", sl);
        setLanguage(sl);
      };

      const onChange = (action, data) => {
        switch(action){
            case "code" : {
                setCode(data);
                break;
            }
            default: {
                console.warn("case not handled!", action,data);
            }
        }
      };

      const handleCompile = () => {
        setProcessing( true);
        const formData = {
            language_id: language.id,
            source_code: btoa(code),
            // stdin: btoa(customInput)
        };

        const options = {
            method: "POST",
            // const axios = require('axios');
            url: process.env.REACT_APP_RAPID_API_URL,
            params: {
                base64_encoded: 'true',
                fields: '*'
            },
            headers: {
                'content-type': 'application/json',
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
                'X-RapidAPI-Host': process.env.REACT_APP_RAPID_API_HOST,
            },
            data: formData,
        };

        axios
            .request(options)
            .then(function(response){
                console.log("res.data", response.data);
                const token = response.data.token;
                checkStatus(token);
            })
            .catch((err) => {
                let error = err.response ? err.response.data : err;
                let status = err.response.status;
                console.log("status", status);

                if (status === 429) {
                    console.log("too many requests", status);
                }
                setProcessing(false);
                console.log("catch block...", error );
          });
        };
        
    const checkStatus = async (token) => {
        const options = {
            method: "GET",
            // const axios = require('axios');
            url: process.env.REACT_APP_RAPID_API_URL + "/" + token,
            params: {
                base64_encoded: 'true',
                fields: '*'
            },
            headers: {
                'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
                'X-RapidAPI-Host': process.env.REACT_APP_RAPID_API_HOST,
            },
        };
        try {
            let response = await axios.request(options);
            let statusId = response.data.status.id;

            if (statusId === 1 || statusId === 2) {
                setTimeout (() => {checkStatus(token);}, 2000)
            } else {
                setProcessing(false);
                setOutputDetails(response.data);
                console.log("response.data", response.data);
                return;
            }
        } catch( err) {
            console.log("err", err)
            setProcessing(false);
        }
    };

    function handleThemeChange(th) {
        const theme = th;
        console.log("theme...", theme);
    
        if (["light", "vs-dark"].includes(theme.value)) {
          setTheme(theme);
        } else {
          defineTheme(theme.value).then((_) => setTheme(theme));
        }
      }
      useEffect(() => {
        defineTheme("oceanic-next").then((_) =>
          setTheme({ value: "oceanic-next", label: "Oceanic Next" })
        );
      }, []);
    
        const encodedCode = encodeURIComponent(code);
        
  return (
    <div className="app">
      <div className="dropdown">   
        <LanguagesDropdown onSelectChange={onSelectChange}/>
        <ThemesDropdown handleThemeChange ={handleThemeChange} theme={theme} />
        <RWebShare
                data={{
                    text: "Share",
                    url: `${window.location.href}?code=${encodedCode}`,
                    title: "Code Editor",
                }}
                sites = {["facebook","twitter"]}
                onClick={() => console.log("shared successfully!")}
            >
               <button><FaShare/></button>
            </RWebShare>
      </div>
      <div className="input__Area">
        <CodeEditor 
            code={code}
            onChange={onChange}
            language={language?.value}
            theme={theme.value}
        />
        
        <OutputWindow  className="output" outputDetails={outputDetails}/>
        
        </div>
        <button
              onClick={handleCompile}
              disabled={!code}
            >
              {processing ? "Processing..." : "Run Code"}
        </button>

      <button onClick={handleSave}>Save</button>
      <button onClick={handleLoad}>Load</button>
      

    </div>
  )
};

export default Logic