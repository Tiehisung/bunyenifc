// import { useState } from 'react';
// import { useAppSelector } from '../../hooks/redux';
// import { AnimateOnView } from '../../styles/stagger';
// import { icons } from '../../assets/icons/_icons';
// import BottomSheetModal from '../modals/BottomSheet';
// import { QuestionInput } from '../../pages/survey/QuestionnairePage/QuestionInput';

// const RecruiterQuestionnairePreviewModal = () => {
//   const { title, questions } = useAppSelector((s) => s.newGigQuestionnaire);

//   const [answers, setAnswers] = useState<{ [key: string]: any }>({});

//   return (
//     <BottomSheetModal
//       label={
//         <div className="flex items-center _secondaryBtn p-2 text-secondary gap-1">
//           <icons.preview /> Preview
//         </div>
//       }
//       id={'new-questionnaire'}
//       title={title}
//       className=" "
//     >
//       <div className="space-y-6 pb-10">
//         <header className="_heading mb-4 border-b pb-2 border-background">
//           {title + title}
//         </header>
//         {questions.map((q, i) => (
//           <AnimateOnView index={i} key={q.id} delay={0.2} once>
//             <div className="flex items-start gap-4">
//               <span className="  p-1 rounded-full w-8 h-5 flex justify-center items-center text-black _p italic">
//                 {i + 1}
//               </span>

//               <QuestionInput
//                 name={`preview-${q.id}`}
//                 question={q}
//                 onChange={(val) => setAnswers({ ...answers, [q.name]: val })}
//                 choice={answers[q.name]}
//                 className="grow "
//                 required={q.required}
//               />
//             </div>
//           </AnimateOnView>
//         ))}
//       </div>
//     </BottomSheetModal>
//   );
// };

// export default RecruiterQuestionnairePreviewModal;
