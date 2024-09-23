export const second = 1000;
export const minute = second * 60;
export const hour = minute * 60;
export const day = hour * 24;

export const today = () => new Date();
export const ago = (x:number) => new Date().setMonth(today().getMonth() - x)
