 

// import { LiaTimesSolid } from "react-icons/lia";
// import { ChangeEvent, useEffect, useState } from "react";
// import { AiOutlineFileAdd } from "react-icons/ai";
// import FileRenderer from "./FileRender";
// import { Button } from "../buttons/Button";
// import {  shortText } from "@/lib";
// import { TConvertedFile } from "@/types";
// import { getFilePath } from "@/lib/file";

// export type TFilePicker = {
//   fileStyles?: string;
//   className?: string;
//   fileWrapperStyles?: string;
//   exportFiles: (f: TConvertedFile[]) => void;
//   uniqueId?: string;
//   accept?: string;
// };
// export default function MultiFilePicker({
//   fileStyles,
//   fileWrapperStyles,
//   className,
//   uniqueId = "input-file",
//   accept = "image/*",
//   exportFiles,
// }: TFilePicker) {
//   const [localFiles, setLocalFiles] = useState<Array<File> | []>([]);
//   //On file selection
//   const handleSelection = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) setLocalFiles((p) => [...p, file]);
//   };

//   useEffect(() => {
//     const converted: TConvertedFile[] = [];
//     async function handleConversion() {
//       for (const file of localFiles) {
//         const f = await getFilePath(file);
//         converted.push({ name: file.name, path: f, type: file.type });
//       }
//       exportFiles(converted);
//     }
//     handleConversion();
//   }, [localFiles]);

//   const hasFiles = localFiles.length > 0;
//   return (
//     <div className={` rounded ${className} `}>
//       <section
//         className={`relative group flex flex-wrap gap-2 mb-7 w-full ${fileWrapperStyles}`}
//       >
//         <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 container">
//           {localFiles.map((file, i: number) => (
//             <li key={i} className="relative w-full h-auto shadow-sm border">
//               <FileRenderer  file={file} className={fileStyles}  />

//               <div className="bg-secondary flex items-center gap-4 max-w-full max-h-8 line-clamp-1 text-xs font-light absolute top-3 right-3 border border-border rounded-full pl-4 ">
//                 <p>{shortText(file?.name)}</p>
//                 <Button
//                   primaryText=""
//                   title="Remove"
//                   className=" text-Red rounded-r-full hover:scale-110 hover:transform p-1"
//                 >
//                   <LiaTimesSolid
//                     size={24}
//                     role="button"
//                     onClick={() =>
//                       setLocalFiles(
//                         localFiles.filter((_, index) => index !== i)
//                       )
//                     }
//                   />
//                 </Button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </section>

//       {/* Picker */}
//       <section
//         className={` w-full  ${hasFiles ? "justify-end" : "justify-center"}`}
//       >
//         <label
//           data-tip="Add file"
//           htmlFor={uniqueId}
//           className="border border-blue-500 hover:bg-blue-400 active:bg-blue-600 flex gap-2 items-center shadow w-fit rounded-none cursor-pointer  "
//         >
//           <span className="px-2 text-secondary-foreground">
//             {localFiles.length == 0 ? "None" : localFiles.length + " files"}
//           </span>
//           <div className="flex items-center w-fit bg-blue-500 p-1 text-white ">
//             <AiOutlineFileAdd size={24} /> Add file
//             <input
//               id={uniqueId}
//               type="file"
//               accept={accept ?? "image/*"}
//               onChange={handleSelection}
//               name="image"
//               className={`max-w-52 text-sm invisible w-0 file:text-transparent `}
//             />
//           </div>
//         </label>
//       </section>
//     </div>
//   );
// }
