// import { FC, useEffect, useState } from 'react';

// import RecruiterQuestionnairePreviewModal from './PreviewModal';
 

// const CreateQuestionnaire = () => {
//   const dispatch = useAppDispatch();
//   const { title, questions } = useAppSelector((s) => s.newGigQuestionnaire);

//   const [qTitle, setQTitle] = useState(title);

//   return (
//     <div
//       className=" min-h-80 form-control justify-center container py-36"
//       style={{
//         background: `url(${staticAssets.heroBeehive})`,
//         backgroundRepeat: 'no-repeat',
//         backgroundSize: 'cover',
//       }}
//     >
//       <header className="mx-auto border text-center _card mb-10">
//         <h1 className="_title ">Questionnaire Form</h1>
//         <h4 className="_label">Create Questions for responses </h4>
//       </header>

//       <section>
//         <TextArea
//           label={'Title of Questionnaire'}
//           name={'qtitle'}
//           placeholder="Type heading..."
//           onChange={(e) => {
//             dispatch(setQuestionnaire({ title: e.target.value }));
//             setQTitle(e.target.value);
//           }}
//           value={qTitle}
//           className="outline-none border-b border-background focus:border-primary bg-background/70 w-full placeholder:text-sm text-sm py-2"
//         />
//       </section>
//       <section>
//         <div className="space-y-4 mb-6">
//           {questions.map((q, i) => (
//             <QuestionCP {...q} key={q.type + i} index={i} />
//           ))}
//         </div>

//         <IconButton
//           icon="add"
//           text="Add question"
//           className="px-2 text-success _p border "
//           onClick={() => {
//             dispatch(
//               setQuestionnaire({
//                 questions: [
//                   ...questions,
//                   {
//                     id: `${Date.now()}`,
//                     label: '',
//                     type: 'textarea',
//                     name: `${Date.now()}`,
//                   },
//                 ],
//               })
//             );
//           }}
//         />
//         <footer className="flex items-center justify-end gap-2 p-4 ">
//           <RecruiterQuestionnairePreviewModal />
//           <Button primaryText="Submit" className="_primaryBtn px-6 py-2" />
//         </footer>
//       </section>
//     </div>
//   );
// };

// export default CreateQuestionnaire;

// const QuestionCP: FC<IQuestion & { index: number }> = (question) => {
//   const questionTypes: IQuestion['type'][] = [
//     'textarea',
//     'checkbox',
//     'date',
//     'select',
//     'number',
//   ];

//   const dispatch = useAppDispatch();
//   const { questions } = useAppSelector((s) => s.newGigQuestionnaire);

//   const removeQuestion = () => {
//     dispatch(
//       setQuestionnaire({
//         questions: questions.filter((q) => q.id != question.id),
//       })
//     );
//   };

//   const [formData, setFormData] = useState<IQuestion>({ ...question });

//   useEffect(() => {
//     const modified = questions.map((q) => {
//       if (q.id !== question.id) return q;
//       else return formData;
//     });
//     dispatch(setQuestionnaire({ questions: modified }));
//   }, [formData]);

//   return (
//     <section className="shadow border border-secondary _card">
//       <div className="bg-modalTransparent px-6 py-3 flex items-baseline ">
//         <span className="mr-10 text-white">{question.index + 1}.</span>
//         <ResizableContent className=" ">
//           {[
//             formData.type,
//             ...questionTypes.filter((t) => t !== formData.type),
//           ].map((qt) => (
//             <Button
//               primaryText={qt}
//               className={` px-2 capitalize border ${formData.type == qt ? '_defaultBtn pointer-events-none' : '_secondaryBtn'}`}
//               onClick={() => setFormData((p) => ({ ...p, type: qt }))}
//             />
//           ))}
//         </ResizableContent>

//         <div className="ml-auto ">
//           <IconButton
//             icon="close"
//             onClick={removeQuestion}
//             className="text-background"
//           />
//         </div>
//       </div>

//       <div className="bg-white pt-4">
//         <TextArea
//           name={question.name}
//           placeholder="Type question..."
//           onChange={(e) =>
//             setFormData((p) => ({ ...p, label: e.target.value }))
//           }
//           value={formData.label}
//           className="outline-none border-b border-background focus:border-primary bg-background/70 w-full placeholder:text-sm text-sm py-2"
//         />

//         {/* Number constraints for 'number' */}

//         <div hidden={formData.type !== 'number'}>
//           <div className="flex items-center gap-3 mt-3 w-60">
//             <Input
//               type="number"
//               placeholder="Minimum"
//               className="outline-primary"
//               onChange={(e) =>
//                 setFormData((p) => ({
//                   ...p,
//                   minimum: Number(e.target.value),
//                 }))
//               }
//               value={formData.minimum}
//               label="Set Minimum"
//               labelStyles="_small"
//               isAnimate
//             />
//             <Input
//               type="number"
//               value={formData.maximum}
//               onChange={(e) =>
//                 setFormData((p) => ({
//                   ...p,
//                   maximum: Number(e.target.value),
//                 }))
//               }
//               placeholder="Maximmum"
//               className="outline-primary"
//               label="Set Maximum"
//               labelStyles="_small"
//               isAnimate
//               error={
//                 (formData?.minimum ?? 0) > (formData?.maximum ?? 0)
//                   ? 'Invalid '
//                   : ''
//               }
//             />
//           </div>
//         </div>

//         {/* Options for 'select' */}
//         <div hidden={formData.type !== 'select'}>
//           <MultipleInput
//             required
//             name={`${question.name}-options`}
//             values={formData.options?.map((v) => v.value) ?? []}
//             exportValues={(opts) =>
//               setFormData((p) => ({
//                 ...p,
//                 options: opts.map((o) => ({ value: o, label: o })),
//               }))
//             }
//             placeholder="Add option"
//           />
//         </div>

//         <div className="p-2 pt-3 flex items-center justify-between gap-6 border-t mt-3">
//           <div className="join gap-2 px-2">
//             <small>Constraints: </small>
//             <Button
//               primaryText="Required"
//               className={` rounded-lg _small px-2 py-0.5 border ${!formData.required ? '_secondaryBtn' : '_defaultBtn'}`}
//               onClick={() => setFormData((p) => ({ ...p, required: true }))}
//             />
//             <Button
//               primaryText="Optional"
//               className={` rounded-lg _small px-2 py-0.5 border ${formData.required ? '_secondaryBtn' : '_defaultBtn'}`}
//               onClick={() => setFormData((p) => ({ ...p, required: false }))}
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };
