import { useForm, Controller, useFieldArray } from "react-hook-form";
import { TextArea } from "@/components/input/Inputs";
import { Button } from "@/components/buttons/Button";
import { Plus, X } from "lucide-react";
import { CgRemove } from "react-icons/cg";
import QuillEditor from "@/components/editor/Quill";
import { INewsProps, IPostNews } from "@/types/news.interface";
import {
  useCreateNewsMutation,
  useUpdateNewsMutation,
} from "@/services/news.endpoints";
import { formatDate } from "@/lib/timeAndDate";
import { smartToast } from "@/utils/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks/store";
import { SimpleVideoUploader } from "@/components/files/simple-uploader/video";
import { SimpleImageUploader } from "@/components/files/simple-uploader/image";
import FileRenderer from "@/components/files/FileRender";
import { useEffect } from "react";
import { clearNews, setNews } from "@/store/slices/news.slice";
import { staticImages } from "@/assets/images";

interface INewsForm {
  newsItem?: INewsProps | null;
  onSuccess?: () => void;
}

export const NewsForm = ({ newsItem, onSuccess }: INewsForm) => {
  const { user } = useAppSelector((s) => s.auth);
  const { news: persistedNews } = useAppSelector((s) => s.news);
  const dispatch = useAppDispatch();

  const [createNews, { isLoading: isCreating }] = useCreateNewsMutation();
  const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation();
  const isLoading = isCreating || isUpdating;

  const defaultValues = newsItem ||
    persistedNews || {
      headline: { text: "", image: "" },
      details: [{ text: "", media: [] }],
      reporter: {
        name: user?.name || "",
        image: user?.image || "",
        email: user?.email || "",
        avatar: user?.image || "",
      },
    };

  const { control, handleSubmit, reset, watch } = useForm<IPostNews>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  // Watch headline image for preview
  const headlineImage = watch("headline.image");

  // Handle image upload for headline
  const handleHeadlineImageUpload = (imageData: any, onChange: any) => {
    onChange(imageData?.secure_url);
  };

  // Handle media upload for details (append to existing array)
  const handleMediaUpload = (
    newMedia: any,
    existingMedia: any[] = [],
    onChange: any,
  ) => {
    if (!newMedia) return;

    // If it's a single upload, append to array
    const updatedMedia = Array.isArray(newMedia)
      ? [...existingMedia, ...newMedia]
      : [...existingMedia, newMedia];

    onChange(updatedMedia);
  };

  // Remove media item
  const handleRemoveMedia = (
    _detailIndex: number,
    mediaIndex: number,
    onChange: any,
    currentMedia: any[],
  ) => {
    const updatedMedia = currentMedia.filter((_, i) => i !== mediaIndex);
    onChange(updatedMedia);
  };

  const onSubmit = async (data: IPostNews) => {
    try {
      let result;

      if (newsItem?._id) {
        result = await updateNews({ _id: newsItem._id, ...data } as IPostNews).unwrap();
      } else {
        result = await createNews(data).unwrap();
      }

      if (result.success) {
        reset();
        dispatch(clearNews()); // Clear persisted news
        onSuccess?.();
      }

      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  // Update Redux store when form changes (optional - remove if not needed)
  useEffect(() => {
    const subscription = watch((value) => {
      dispatch(setNews(value as IPostNews));
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-6">
      {/* Headline Section */}
      <header className="border-b-2 grid gap-4 py-4 mb-6 border px-2 border-border">
        <h1 className="_subtitle">Headline</h1>

        <Controller
          name="headline.text"
          control={control}
          rules={{ required: "Headline is required" }}
          render={({ field, fieldState }) => (
            <TextArea
              {...field}
              placeholder="Type headline here..."
              className="border border-border bg-white text-gray-800"
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="headline.image"
          control={control}
          render={({ field }) => (
            <div className="space-y-3">
              {field.value && (
                <div className="relative w-32 h-32">
                  <img
                    src={field.value}
                    alt="Headline"
                    className="w-full h-full object-cover rounded-lg border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        staticImages.tackling;
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => field.onChange("")}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <SimpleImageUploader
                onUploadSuccess={(f) => field.onChange(f?.secure_url)}
                trigger={
                  field.value ? "Change Image" : "Upload Feature Image"
                }
                folder={`news/headlines-${new Date().getFullYear()}`}
                buttonVariant="outline"
                showIcon={true}
              />
            </div>
          )}
        />
      </header>

      {/* Details Section */}
      <h1 className="_subtitle">Details</h1>
      <main className="space-y-10 divide-y-2 divide-primary">
        {fields.map((item, index) => (
          <div key={item.id} className="flex items-start gap-2 pt-6 first:pt-0">
            <div className="grow space-y-3">
              <Controller
                control={control}
                name={`details.${index}.text`}
                render={({ field }) => (
                  <QuillEditor
                    value={field.value || ""}
                    onChange={field.onChange}
                    className="w-full grow"
                    placeholder={`Detail ${index + 1} content...`}
                  />
                )}
              />

              {/* Media Gallery */}
              {item?.media && item.media.length > 0 && (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                  {item.media.map((file, mediaIndex) => (
                    <div
                      key={file.public_id || mediaIndex}
                      className="relative group"
                    >
                      <FileRenderer file={file} />
                      <Controller
                        control={control}
                        name={`details.${index}.media`}
                        render={({ field }) => (
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveMedia(
                                index,
                                mediaIndex,
                                field.onChange,
                                item.media || [],
                              )
                            }
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Controls */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <Controller
                  control={control}
                  name={`details.${index}.media`}
                  render={({ field }) => (
                    <>
                      <SimpleImageUploader
                        onUploadSuccess={(newMedia) =>
                          handleMediaUpload(
                            newMedia,
                            item.media,
                            field.onChange,
                          )
                        }
                        multiple
                        trigger="Add Images"
                        folder={`news/details-${formatDate(new Date().toString(), "yyyy-mm-dd")}`}
                        buttonVariant="outline"
                      
                      />

                      <SimpleVideoUploader
                        onUploadSuccess={(newMedia) =>
                          handleMediaUpload(
                            newMedia,
                            item.media,
                            field.onChange,
                          )
                        }
                        multiple
                        trigger="Add Videos"
                        folder={`news/details-${formatDate(new Date().toString(), "yyyy-mm-dd")}`}
                        buttonVariant="outline"
                       
                      />
                    </>
                  )}
                />

                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                    className="ml-auto"
                  >
                    <CgRemove className="mr-1" />
                    Remove Detail
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-center pt-6">
          <button
            onClick={() => append({ text: "", media: [] })}
            className="rounded-full p-3 border border-border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Add Content Block"
            type="button"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </main>

      <div className="border-t pt-6">
        <Button
          type="submit"
          primaryText={newsItem ? "Update News" : "Publish News"}
          waiting={isLoading}
          waitingText={newsItem ? "Updating..." : "Publishing..."}
          className="w-full h-12 uppercase font-semibold"
        />
      </div>
    </form>
  );
};
