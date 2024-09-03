const debug = true;
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