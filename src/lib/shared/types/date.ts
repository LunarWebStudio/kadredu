
export const today = () => new Date();
export const ago = (x:number) => new Date().setMonth(today().getMonth() - x)
