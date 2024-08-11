import React from 'react';
import Select from 'react-select';

import './CompilerHeader.css';

const CompilerHeader = ({ userLang, setUserLang, userTheme, setUserTheme, setUserCode, fontSize, setFontSize }) => {
    
    const languages = [
        { value: "c", label: "C" },
        { value: "cpp", label: "C++" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
    ];
    
    const themes = [
        { value: "vs-dark", label: "Dark" },
        { value: "light", label: "Light" },
    ]
    
    const cBoilerPlate = `#include<stdio.h>

int main() {
    // your code goes here
    return 0;
}`;

    const cppBoilerPlate = `#include<bits/stdc++.h>
using namespace std;

int main() {
    // your code goes here
    return 0;
}`;

    const javaBoilerPlate = `class Main {
    public static void main(String[] args) {
        // your code goes here
    }
}`;


    const handleChange = (e) => {
        setUserLang(e.value);
        
        switch(e.value) {
            case "c":
                setUserCode(cBoilerPlate);
                break;
            case "cpp":
                setUserCode(cppBoilerPlate);
                break;
            case "python":
                setUserCode(`# your code goes here`);
                break;
            case "java":
                setUserCode(javaBoilerPlate);
                break;
            default:
                setUserCode(cppBoilerPlate);
        }
    }

    return (
        <div className="compiler-header">
            <Select options={languages} value={userLang}
                onChange={handleChange}
                placeholder={userLang} />
            <Select options={themes} value={userTheme === 'vs-dark' ? themes[0].label : themes[1].label}
                onChange={(e) => setUserTheme(e.value)}
                placeholder={userTheme === 'vs-dark' ? themes[0].label : themes[1].label} />
            <label>Font Size</label>
            <input type="range" min="18" max="30"   
                value={fontSize} step="2"
                onChange={(e) => { setFontSize(e.target.value) }} />
        </div>
    )
}

export default CompilerHeader;
