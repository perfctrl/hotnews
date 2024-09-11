import * as vscode from 'vscode';
const debug = false;
export const loggerInfo = (...params: any[]) => {
    if (debug) {
        console.log(new Date(), ...params);
    }
};

export const loggerWarn = (...params: any[]) => {
    if (debug) {
        console.warn(new Date(), ...params);
    }
};


export const loggerError = (param: any) => {
    vscode.window.showErrorMessage(param);
};