// // DataContext.jsx
// import { createContext, useEffect, useState } from "react";
// import axios from "axios";

// const DataContext = createContext();

// const MyContextProvider = ({ children }) => {
//   const [data, setData] = useState(() => {
//     // Try to get data from localStorage
//     const storedData = localStorage.getItem('myData');
//     return storedData ? JSON.parse(storedData) : 'Default Value';
//   });

//   useEffect(() => {
//     async function fetchData() {
//       const allTypes = ['containers', 'flowers', 'tools', 'fertilizers', 'shrubs', 'trendingPlants','trees'];
//       var allData = {};

//       for (let index = 0; index < allTypes.length; index++) {
//         const element = allTypes[index];
//         try {
//           const response = await getType(element);
//           allData[element] = response.data;
//         } catch (error) {
//           console.log(error);
//         }
//       }

//       // Save data to localStorage whenever it changes
//       localStorage.setItem('myData', JSON.stringify(allData));
//       setData(allData);
//     }

//     fetchData();
//   }, []);

//   function getType(type) {
//     console.log(type);
//     return axios.get(`http://localhost:8000/${type}`);

//   }

//   return (
//     <DataContext.Provider value={{ data, setData }}>
//       {children}
//     </DataContext.Provider>
//   );
// };

// export { MyContextProvider, DataContext };
