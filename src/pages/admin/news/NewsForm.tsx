 
import { useForm, Controller, useFieldArray } from "react-hook-form";

import { TextArea } from "@/components/input/Inputs";
import { Button } from "@/components/buttons/Button";

import { Plus } from "lucide-react";
import CloudinaryUploader from "@/components/cloudinary/FileUploadWidget";
import { CgAttachment, CgRemove } from "react-icons/cg";
import QuillEditor from "@/components/editor/Quill";
import { INewsProps, IPostNews } from "@/types/news.interface";
import { useCreateNewsMutation } from "@/services/news.endpoints";
import { dummyUser } from "@/data/user";
import { formatDate } from "@/lib/timeAndDate";
import { smartToast } from "@/utils/toast";

interface INewsForm {
  newsItem?: INewsProps | null;
}

export const NewsForm = ({ newsItem = null }: INewsForm) => {
  const user = dummyUser;

 
  const [createNews,{isLoading}] = useCreateNewsMutation();

  const { control, handleSubmit, reset } = useForm<IPostNews>({
    defaultValues: newsItem ?? {
      headline: { text: "", image: "" },
      details: [{ text: "" }],
      reporter: {
        name: user?.name as string,
        avatar: user?.image as string,
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  const onSubmit = async (data: IPostNews) => {
    try {
      
      const result = await createNews(data).unwrap();

      if (result.success) reset();

      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }  
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-6">
      {/* Headline Section */}
      <header className="border-b-2 grid gap-4 py-4 mb-6 border px-2 border-border">
        <h1 className="_subtitle">Headline</h1>
        <Controller
          name="headline.text"
          control={control}
          rules={{ required: "Headline is required" }}
          render={({ field }) => (
            <TextArea
              {...field}
              // label="Headline text"
              placeholder="Type headline here..."
            />
          )}
        />

        <Controller
          name="headline.image"
          control={control}
          render={({ field }) => (
            <CloudinaryUploader
              triggerId=""
              setUploadedFiles={(fs) => field.onChange(fs?.[0]?.secure_url)}
              successMessage=""
              maxFiles={1}
              trigger={
                <>
                  <CgAttachment size={24} /> Upload Feature Image
                </>
              }
              folder={`news/media-${new Date().getFullYear()}`}
              multiple={false}
              cropping
            />
          )}
        />
      </header>

      {/* Details Section */}
      <h1 className="_subtitle">Details</h1>
      <main className="space-y-10 divide-y-2 divide-primary">
        {fields.map((item, index) => (
          <div key={item.id} className="flex items-start gap-2">
            <div className="grow space-y-3">
              <Controller
                control={control}
                name={`details.${index}.text`}
                render={({ field }) => (
                  <QuillEditor
                    value={field.value || ""}
                    onChange={field.onChange}
                    className="w-full grow"
                  />
                )}
              />

              <div className="flex justify-between items-center mb-2">
                <Controller
                  control={control}
                  name={`details.${index}.media`}
                  render={({ field }) => (
                    <CloudinaryUploader
                      setUploadedFiles={field.onChange}
                      successMessage=""
                      maxFiles={30}
                      trigger={
                        <>
                          <CgAttachment size={24} /> Attach Media
                        </>
                      }
                      folder={`news/media-${formatDate(new Date().toString(), "yyyy-mm-dd")}`}
                    />
                  )}
                />

                <Button
                  primaryText="Remove"
                  onClick={() => remove(index)}
                  className="text-red-400 text-xs _deleteBtn"
                >
                  <CgRemove />
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-2 justify-center">
          <button
            onClick={() => append({ text: "", media: [] })}
            className="rounded-full p-3 border _borderColor hover:opacity-90 bg-gray-700 text-white dark:text-gray-950 dark:bg-gray-200 justify-center"
            title="Add Content"
            type="button"
          >
            <Plus />
          </button>
        </div>
      </main>

      <br />

      <Button
        type="submit"
        primaryText="Post news"
        waiting={isLoading}
        waitingText="Posting..."
        className="_primaryBtn p-3 ml-auto w-full justify-center h-12 uppercase"
      />
    </form>
  );
};
