import Axios from 'axios';
import { useState } from 'react';
import Editor from '@monaco-editor/react';

import './Compiler.css';
import baseURL from '../utils/baseURL';
import spinner from '../assets/spinner.svg';
import CompilerHeader from './CompilerHeader';

const Compiler = () => {
    const cppBoilerPlate = `#include<bits/stdc++.h>
using namespace std;

int main() {
    // your code goes here
    return 0;
}`;
    const [userCode, setUserCode] = useState(cppBoilerPlate);
    const [userLang, setUserLang] = useState("cpp");
    const [userTheme, setUserTheme] = useState("vs-dark");
    const [fontSize, setFontSize] = useState(20);
    const [userInput, setUserInput] = useState("");
    const [userOutput, setUserOutput] = useState("");
    const [loading, setLoading] = useState(false);

    const options = {
        fontSize: fontSize
    }

    const compile = () => {
        setLoading(true);
        if (userCode === ``) {
            setLoading(false);
            return;
        }

        Axios.post(`${baseURL}/compiler`, {
            code: userCode,
            language: userLang,
            input: userInput
        }).then((res) => {

            if (res?.data?.signal === "SIGKILL") {
                setUserOutput("Error: Process killed, it took too long to execute the code");
                setLoading(false);
                return;
            }

            setUserOutput(res.data.stdout || res.data.stderr);
        }).then(() => {
            setLoading(false);
        }).catch((err) => {
            console.error(err);
            setUserOutput("Error: " + (err.response ? err.response.data.error : err.message));
            setLoading(false);
        });
    }

    const clearOutput = () => {
        setUserOutput("");
    }

    return (
        <div className="compiler">
                
            <CompilerHeader
                userTheme={userTheme} setUserTheme={setUserTheme}
                fontSize={fontSize} setFontSize={setFontSize}
                userLang={userLang} setUserLang={setUserLang}
                setUserCode={setUserCode}
            />
            <div className="main">
                <div className="left-container">
                    <Editor
                        options={options}
                        height="calc(100vh - 50px)"
                        width="100%"
                        theme={userTheme}
                        language={userLang}
                        value={userCode}
                        onChange={(value) => { setUserCode(value) }}
                    />
                    <button className="run-btn" onClick={() => compile()}>
                        Run
                    </button>
                </div>
                <div className="right-container">
                    <h4>Input:</h4>
                    <div className="input-box">
                        <textarea id="code-inp" onChange=
                            {(e) => setUserInput(e.target.value)}>
                        </textarea>
                    </div>
                    <h4>Output:</h4>
                    {loading ? (
                        <div className="spinner-box">
                            <img src={spinner} alt="Loading..." />
                        </div>
                    ) : (
                        <div className="output-box">
                            <pre>{userOutput}</pre>
                            <button onClick={() => { clearOutput() }}
                                className="clear-btn">
                                Clear Output
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Compiler;