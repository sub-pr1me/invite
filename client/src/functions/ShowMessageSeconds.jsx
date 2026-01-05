export async function ShowMessageSeconds(time) {
  
  const delay = new Promise((resolve) => setTimeout(resolve, time*1000));
  await delay; // delay simulation
  return 'delay';
};