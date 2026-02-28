// import { useState, useRef, useEffect } from 'react';
// import { useUploadMixedMutation } from '@/services/upload.endpoints';
// import { Button } from '@/components/buttons/Button';
// import { Progress } from '@/components/ui/progress';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { 
//     Image as ImageIcon,
//     Video,
//     FileText,
//     X,
//     CheckCircle,
//     AlertCircle,
//     UploadCloud,
//     Loader2,
//     Trash2,
//     Eye,
//     Download,
//     File
// } from 'lucide-react';
// import { formatBytes, formatDuration } from '@/lib/utils';

// // ==================== TYPES ====================

// export interface UploadedFile {
//     url: string;
//     secure_url: string;
//     public_id: string;
//     format: string;
//     bytes: number;
//     originalName?: string;
    
//     // Image specific
//     width?: number;
//     height?: number;
    
//     // Video specific
//     duration?: number;
//     thumbnail?: string;
    
//     // Document specific
//     pages?: number;
// }

// export interface MixedUploadResult {
//     avatar?: UploadedFile[];
//     gallery?: UploadedFile[];
//     video?: UploadedFile[];
//     documents?: UploadedFile[];
//     [key: string]: UploadedFile[] | undefined;
// }

// export interface FileWithPreview extends File {
//     preview?: string;
//     id: string;
//     type: 'image' | 'video' | 'document';
//     uploadedData?: UploadedFile;
// }

// // ==================== PROPS ====================

// interface MixedUploaderProps {
//     /** Called when all uploads are complete */
//     onUploadComplete?: (results: MixedUploadResult) => void;
//     /** Called when individual file uploads */
//     onFileUploaded?: (field: string, file: UploadedFile) => void;
//     /** Called on error */
//     onError?: (error: string) => void;
    
//     /** Configuration for each field */
//     fields: {
//         [key: string]: {
//             label: string;
//             accept: string;
//             maxSize: number; // in bytes
//             maxCount?: number;
//             multiple?: boolean;
//             icon?: React.ReactNode;
//             description?: string;
//         };
//     };
    
//     /** Initial files */
//     initialFiles?: {
//         [key: string]: UploadedFile[];
//     };
    
//     /** Custom class name */
//     className?: string;
    
//     /** Disable all uploads */
//     disabled?: boolean;
    
//     /** Show previews */
//     showPreviews?: boolean;
    
//     /** Auto upload on select */
//     autoUpload?: boolean;
// }

// // ==================== MAIN COMPONENT ====================

// export function MixedUploader({
//     onUploadComplete,
//     onFileUploaded,
//     onError,
//     fields,
//     initialFiles,
//     className = '',
//     disabled = false,
//     showPreviews = true,
//     autoUpload = true,
// }: MixedUploaderProps) {
//     const [uploadMixed, { isLoading }] = useUploadMixedMutation();
//     const fileInputRef = useRef<HTMLInputElement>(null);
    
//     // State
//     const [activeTab, setActiveTab] = useState<string>(Object.keys(fields)[0]);
//     const [files, setFiles] = useState<{ [key: string]: FileWithPreview[] }>({});
//     const [uploadedResults, setUploadedResults] = useState<MixedUploadResult>(initialFiles || {});
//     const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
//     const [errors, setErrors] = useState<{ [key: string]: string }>({});
//     const [isDragging, setIsDragging] = useState(false);
//     const [dragField, setDragField] = useState<string | null>(null);

//     // Initialize files state from fields
//     useEffect(() => {
//         const initial: { [key: string]: FileWithPreview[] } = {};
//         Object.keys(fields).forEach(key => {
//             initial[key] = [];
//         });
//         setFiles(initial);
//     }, [fields]);

//     // Cleanup previews on unmount
//     useEffect(() => {
//         return () => {
//             Object.values(files).flat().forEach(file => {
//                 if (file.preview) {
//                     URL.revokeObjectURL(file.preview);
//                 }
//             });
//         };
//     }, [files]);

//     // ==================== UTILITIES ====================

//     const getFileType = (file: File): 'image' | 'video' | 'document' => {
//         if (file.type.startsWith('image/')) return 'image';
//         if (file.type.startsWith('video/')) return 'video';
//         return 'document';
//     };

//     const generateFileId = () => {
//         return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
//     };

//     const validateFile = (file: File, field: string): string | null => {
//         const fieldConfig = fields[field];
        
//         // Check file type
//         const fileType = file.type.split('/')[0];
//         const acceptTypes = fieldConfig.accept.split(',').map(t => t.trim());
//         const isAccepted = acceptTypes.some(type => 
//             file.type.match(new RegExp(type.replace('*', '.*')))
//         );
        
//         if (!isAccepted) {
//             return `File type not accepted. Allowed: ${fieldConfig.accept}`;
//         }
        
//         // Check file size
//         if (file.size > fieldConfig.maxSize) {
//             return `File too large. Maximum size: ${formatBytes(fieldConfig.maxSize)}`;
//         }
        
//         // Check count
//         if (!fieldConfig.multiple && files[field].length >= 1) {
//             return `Only one file allowed for ${fieldConfig.label}`;
//         }
        
//         if (fieldConfig.maxCount && files[field].length >= fieldConfig.maxCount) {
//             return `Maximum ${fieldConfig.maxCount} files allowed for ${fieldConfig.label}`;
//         }
        
//         return null;
//     };

//     // ==================== FILE HANDLING ====================

//     const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
//         const selectedFiles = Array.from(e.target.files || []);
//         processFiles(selectedFiles, field);
        
//         // Reset input
//         if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//         }
//     };

//     const processFiles = (newFiles: File[], field: string) => {
//         const fieldConfig = fields[field];
//         const currentFiles = [...files[field]];
        
//         const processedFiles: FileWithPreview[] = [];
//         const newErrors: string[] = [];

//         newFiles.forEach(file => {
//             // Validate
//             const error = validateFile(file, field);
//             if (error) {
//                 newErrors.push(`${file.name}: ${error}`);
//                 return;
//             }

//             // Create preview for images/videos
//             let preview: string | undefined;
//             if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
//                 preview = URL.createObjectURL(file);
//             }

//             processedFiles.push({
//                 ...file,
//                 id: generateFileId(),
//                 preview,
//                 type: getFileType(file),
//             });
//         });

//         // Update errors
//         if (newErrors.length > 0) {
//             setErrors(prev => ({
//                 ...prev,
//                 [field]: newErrors.join('\n')
//             }));
//             onError?.(newErrors.join('\n'));
//         }

//         // Update files
//         const updatedFiles = fieldConfig.multiple
//             ? [...currentFiles, ...processedFiles]
//             : processedFiles;

//         setFiles(prev => ({
//             ...prev,
//             [field]: updatedFiles
//         }));

//         // Auto upload if enabled
//         if (autoUpload && processedFiles.length > 0) {
//             handleUpload(field, processedFiles);
//         }
//     };

//     const handleDragOver = (e: React.DragEvent, field: string) => {
//         e.preventDefault();
//         setIsDragging(true);
//         setDragField(field);
//     };

//     const handleDragLeave = (e: React.DragEvent) => {
//         e.preventDefault();
//         setIsDragging(false);
//         setDragField(null);
//     };

//     const handleDrop = (e: React.DragEvent, field: string) => {
//         e.preventDefault();
//         setIsDragging(false);
//         setDragField(null);
        
//         const droppedFiles = Array.from(e.dataTransfer.files);
//         processFiles(droppedFiles, field);
//     };

//     const removeFile = (field: string, fileId: string) => {
//         setFiles(prev => ({
//             ...prev,
//             [field]: prev[field].filter(f => f.id !== fileId)
//         }));
        
//         // Cleanup preview
//         const file = files[field].find(f => f.id === fileId);
//         if (file?.preview) {
//             URL.revokeObjectURL(file.preview);
//         }
//     };

//     // ==================== UPLOAD HANDLING ====================

//     const handleUpload = async (field: string, filesToUpload: FileWithPreview[]) => {
//         try {
//             setErrors(prev => ({ ...prev, [field]: '' }));
            
//             const formData = new FormData();
            
//             filesToUpload.forEach(file => {
//                 formData.append(field, file);
//             });
            
//             // Add field name as metadata
//             formData.append('field', field);
            
//             // Simulate progress
//             const progressInterval = setInterval(() => {
//                 setUploadProgress(prev => ({
//                     ...prev,
//                     [field]: Math.min((prev[field] || 0) + 10, 90)
//                 }));
//             }, 500);

//             const response = await uploadMixed(formData).unwrap();
//             clearInterval(progressInterval);
            
//             setUploadProgress(prev => ({
//                 ...prev,
//                 [field]: 100
//             }));

//             // Update results
//             const uploadedFiles = response.data[field] || [];
            
//             setUploadedResults(prev => ({
//                 ...prev,
//                 [field]: [...(prev[field] || []), ...uploadedFiles]
//             }));

//             // Mark files as uploaded
//             setFiles(prev => ({
//                 ...prev,
//                 [field]: prev[field].map(file => {
//                     const uploaded = uploadedFiles.find((u: UploadedFile) => 
//                         u.originalName === file.name
//                     );
//                     return uploaded ? { ...file, uploadedData: uploaded } : file;
//                 })
//             }));

//             // Callbacks
//             uploadedFiles.forEach((file: UploadedFile) => {
//                 onFileUploaded?.(field, file);
//             });

//             onUploadComplete?.(response.data);

//             // Clear progress after 2 seconds
//             setTimeout(() => {
//                 setUploadProgress(prev => {
//                     const newProgress = { ...prev };
//                     delete newProgress[field];
//                     return newProgress;
//                 });
//             }, 2000);

//         } catch (err: any) {
//             const errorMsg = err?.data?.message || `Upload failed for ${field}`;
//             setErrors(prev => ({ ...prev, [field]: errorMsg }));
//             onError?.(errorMsg);
//             setUploadProgress(prev => {
//                 const newProgress = { ...prev };
//                 delete newProgress[field];
//                 return newProgress;
//             });
//         }
//     };

//     const handleUploadAll = async () => {
//         for (const [field, fieldFiles] of Object.entries(files)) {
//             if (fieldFiles.length > 0) {
//                 await handleUpload(field, fieldFiles);
//             }
//         }
//     };

//     // ==================== RENDER HELPERS ====================

//     const renderFilePreview = (file: FileWithPreview, field: string) => {
//         const isUploaded = !!file.uploadedData;
        
//         return (
//             <div
//                 key={file.id}
//                 className={`
//                     relative group border rounded-lg p-3
//                     ${isUploaded ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'}
//                 `}
//             >
//                 {/* Preview */}
//                 <div className="flex items-start gap-3">
//                     {/* Icon/Thumbnail */}
//                     <div className="shrink-0">
//                         {file.preview && file.type === 'image' ? (
//                             <img
//                                 src={file.preview}
//                                 alt={file.name}
//                                 className="w-16 h-16 object-cover rounded"
//                             />
//                         ) : file.preview && file.type === 'video' ? (
//                             <video
//                                 src={file.preview}
//                                 className="w-16 h-16 object-cover rounded"
//                                 controls={false}
//                             />
//                         ) : (
//                             <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
//                                 {file.type === 'image' && <ImageIcon className="h-8 w-8 text-gray-400" />}
//                                 {file.type === 'video' && <Video className="h-8 w-8 text-gray-400" />}
//                                 {file.type === 'document' && <FileText className="h-8 w-8 text-gray-400" />}
//                             </div>
//                         )}
//                     </div>

//                     {/* File info */}
//                     <div className="flex-1 min-w-0">
//                         <p className="font-medium text-sm truncate" title={file.name}>
//                             {file.name}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                             {formatBytes(file.size)} • {file.type.split('/')[1].toUpperCase()}
//                         </p>
                        
//                         {/* Uploaded data */}
//                         {file.uploadedData && (
//                             <div className="mt-1 text-xs text-green-600 flex items-center gap-1">
//                                 <CheckCircle className="h-3 w-3" />
//                                 <span>Uploaded</span>
//                                 {file.uploadedData.width && file.uploadedData.height && (
//                                     <span className="text-gray-500">
//                                         • {file.uploadedData.width}x{file.uploadedData.height}
//                                     </span>
//                                 )}
//                                 {file.uploadedData.duration && (
//                                     <span className="text-gray-500">
//                                         • {formatDuration(file.uploadedData.duration)}
//                                     </span>
//                                 )}
//                             </div>
//                         )}
//                     </div>

//                     {/* Actions */}
//                     <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
//                         {file.preview && (
//                             <Button
//                                 type="button"
//                                 size="icon"
//                                 variant="ghost"
//                                 onClick={() => window.open(file.preview, '_blank')}
//                                 className="h-8 w-8"
//                             >
//                                 <Eye className="h-4 w-4" />
//                             </Button>
//                         )}
//                         <Button
//                             type="button"
//                             size="icon"
//                             variant="ghost"
//                             onClick={() => removeFile(field, file.id)}
//                             className="h-8 w-8 text-red-500 hover:text-red-600"
//                             disabled={isLoading}
//                         >
//                             <Trash2 className="h-4 w-4" />
//                         </Button>
//                     </div>
//                 </div>

//                 {/* Upload progress */}
//                 {uploadProgress[field] && uploadProgress[field] < 100 && (
//                     <div className="mt-2">
//                         <Progress value={uploadProgress[field]} className="h-1" />
//                     </div>
//                 )}

//                 {/* Uploaded badge */}
//                 {isUploaded && (
//                     <div className="absolute top-1 right-1">
//                         <CheckCircle className="h-4 w-4 text-green-500" />
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     const renderUploadArea = (field: string) => {
//         const config = fields[field];
//         const fieldFiles = files[field] || [];
//         const hasFiles = fieldFiles.length > 0;
//         const isFull = config.maxCount && fieldFiles.length >= config.maxCount;

//         return (
//             <div key={field} className="space-y-4">
//                 {/* Field label */}
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <h3 className="font-medium flex items-center gap-2">
//                             {config.icon || <File className="h-4 w-4" />}
//                             {config.label}
//                         </h3>
//                         {config.description && (
//                             <p className="text-sm text-gray-500">{config.description}</p>
//                         )}
//                     </div>
//                     <span className="text-xs text-gray-500">
//                         {fieldFiles.length}{config.maxCount ? `/${config.maxCount}` : ''}
//                     </span>
//                 </div>

//                 {/* Upload area */}
//                 {(!isFull || config.multiple) && (
//                     <div
//                         onClick={() => !disabled && !isFull && fileInputRef.current?.click()}
//                         onDragOver={(e) => handleDragOver(e, field)}
//                         onDragLeave={handleDragLeave}
//                         onDrop={(e) => handleDrop(e, field)}
//                         className={`
//                             border-2 border-dashed rounded-lg p-6
//                             flex flex-col items-center justify-center
//                             transition-colors cursor-pointer
//                             ${isDragging && dragField === field
//                                 ? 'border-primary bg-primary/5' 
//                                 : 'border-gray-300 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800'
//                             }
//                             ${disabled || isFull ? 'opacity-50 cursor-not-allowed' : ''}
//                         `}
//                     >
//                         <input
//                             ref={fileInputRef}
//                             type="file"
//                             accept={config.accept}
//                             multiple={config.multiple}
//                             onChange={(e) => handleFileSelect(e, field)}
//                             className="hidden"
//                             disabled={disabled || isFull}
//                         />
                        
//                         <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
//                         <p className="text-sm font-medium mb-1">
//                             Click to upload or drag and drop
//                         </p>
//                         <p className="text-xs text-gray-500">
//                             {config.accept} • Max {formatBytes(config.maxSize)}
//                         </p>
//                         {config.maxCount && (
//                             <p className="text-xs text-gray-500 mt-1">
//                                 Up to {config.maxCount} files
//                             </p>
//                         )}
//                     </div>
//                 )}

//                 {/* Error message */}
//                 {errors[field] && (
//                     <Alert variant="destructive">
//                         <AlertCircle className="h-4 w-4" />
//                         <AlertDescription>{errors[field]}</AlertDescription>
//                     </Alert>
//                 )}

//                 {/* File previews */}
//                 {showPreviews && fieldFiles.length > 0 && (
//                     <div className="space-y-2 mt-4">
//                         {fieldFiles.map(file => renderFilePreview(file, field))}
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     const hasAnyFiles = Object.values(files).some(f => f.length > 0);

//     return (
//         <div className={`space-y-6 ${className}`}>
//             {/* Tabs for different file types */}
//             <Tabs value={activeTab} onValueChange={setActiveTab}>
//                 <TabsList className="grid w-full" style={{
//                     gridTemplateColumns: `repeat(${Object.keys(fields).length}, 1fr)`
//                 }}>
//                     {Object.entries(fields).map(([key, config]) => (
//                         <TabsTrigger key={key} value={key} className="flex items-center gap-2">
//                             {config.icon}
//                             <span className="hidden sm:inline">{config.label}</span>
//                             {files[key]?.length > 0 && (
//                                 <span className="ml-1 text-xs bg-primary text-white rounded-full px-1.5">
//                                     {files[key].length}
//                                 </span>
//                             )}
//                         </TabsTrigger>
//                     ))}
//                 </TabsList>

//                 {Object.keys(fields).map(key => (
//                     <TabsContent key={key} value={key} className="mt-4">
//                         {renderUploadArea(key)}
//                     </TabsContent>
//                 ))}
//             </Tabs>

//             {/* Global actions */}
//             {hasAnyFiles && !autoUpload && (
//                 <div className="flex justify-end gap-2 pt-4 border-t">
//                     <Button
//                         type="button"
//                         onClick={handleUploadAll}
//                         disabled={isLoading}
//                     >
//                         {isLoading ? (
//                             <>
//                                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                 Uploading...
//                             </>
//                         ) : (
//                             <>
//                                 <UploadCloud className="h-4 w-4 mr-2" />
//                                 Upload All Files
//                             </>
//                         )}
//                     </Button>
//                 </div>
//             )}
//         </div>
//     );
// }