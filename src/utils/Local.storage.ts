export const useLocalStorage = () => {
  const setLocalStorage = (key: number, value: object) => {
    localStorage.setItem(JSON.stringify(key), JSON.stringify(value));
  };

  const getLocalStorage = (key: number) => {
    const data = localStorage.getItem(JSON.stringify(key));
    return (data && JSON.parse(data)) || [];
  };

  return {
    setLocalStorage,
    getLocalStorage,
  };
};
