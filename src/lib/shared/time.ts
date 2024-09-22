export const second = 1000;
export const minute = second * 60;
export const hour = minute * 60;
export const day = hour * 24;
export const today = new Date().toISOString();
export const monthAgo = new Date(new Date().getMonth() - 1).toISOString();
