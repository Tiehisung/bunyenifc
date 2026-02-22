// "use client";
// import { useRef } from "react";
// import { FaPrint } from "react-icons/fa";
// import ReactToPrint from "react-to-print";

// export default function PrintComponent({ children }) {
//   const reactToPrintRef = useRef(null);
//   const printComponent = () => {
//     reactToPrintRef.current.print();
//   };
//   return (
//     <div>
//       <ReactToPrint ref={reactToPrintRef} />
//       <button
//         onClick={printComponent}
//         className="secondary__btn p-1 flex gap-2 font-semibold"
//       >
//         <FaPrint /> Print
//       </button>
//     </div>
//   );
// }

// export function TableToPrint() {
//   return (
//     <table>
//       <tbody>
//         <tr>
//           <th>Surname</th>
//           <th>Firstname</th>
//         </tr>
//         <tr>
//           <td>Alhassan</td>
//           <td>Baleqis</td>
//         </tr>
//         <tr>
//           <td>Alhassan</td>
//           <td>Baleqis</td>
//         </tr>
//         <tr>
//           <td>Alhassan</td>
//           <td>Baleqis</td>
//         </tr>
//         <tr>
//           <td>Alhassan</td>
//           <td>Baleqis</td>
//         </tr>
//         <tr>
//           <td>Alhassan</td>
//           <td>Baleqis</td>
//         </tr>
//         <tr>
//           <td>Alhassan</td>
//           <td>Baleqis</td>
//         </tr>
//       </tbody>
//     </table>
//   );
// }
