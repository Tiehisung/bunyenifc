import { Button } from "@/components/buttons/Button";
import { INewsProps } from "@/types/news.interface";
import { ThumbsUp, SendHorizontal, ThumbsDown } from "lucide-react";
import { ActionButton } from "@/components/buttons/ActionButton";
import { apiConfig } from "@/lib/configs";
import { POPOVER } from "@/components/ui/popover";
import SocialShare from "@/components/SocialShare";
import { FormEvent, useEffect, useState } from "react";
import { staticImages } from "@/assets/images";
import { LiaCommentSolid } from "react-icons/lia";
import { IoShareSocial } from "react-icons/io5";
import { AVATAR } from "@/components/ui/avatar";
import { getTimeLeftOrAgo } from "@/lib/timeAndDate";
import { shortText } from "@/lib";
import { BsDot } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { DIALOG } from "@/components/Dialog";
import QuillEditor from "@/components/editor/Quill";
import { fireEscape } from "@/hooks/Esc";
import { getDeviceId } from "@/lib/device";
import { icons } from "@/assets/icons/icons";
import LoginController from "@/components/auth/LoginModal";
import { useUpdateNewsMutation } from "@/services/news.endpoints";
import { toggleClick, markupToPlainText } from "@/lib/dom";
import { dummyUser } from "@/data/user";
import { smartToast } from "@/utils/toast";
import { RtkActionButton } from "@/components/buttons/ActionButtonRTK";

export function NewsReactions({ newsItem }: { newsItem: INewsProps }) {
  const [comment, setComment] = useState("");
  const user = dummyUser;
  const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation();

  const maxLength = 3500;

  const onComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await updateNews({
        _id: newsItem?._id,
        comments: [
          {
            email: user?.email ?? "unknown",
            name: user?.name ?? "unknown",
            image: user?.image,
            date: new Date().toISOString(),
            comment,
          },
          ...(newsItem?.comments ?? []),
        ],
      }).unwrap();

      if (result.success) {
        smartToast({ message: "Comment sent", success: true });
        setComment("");
        fireEscape();
      }
    } catch (error) {
      smartToast({ error });
    }
  };

  // LIKES
  const isLiked = newsItem?.likes?.find((l) => l.device === getDeviceId());
  const likes = isLiked
    ? newsItem?.likes?.filter((l) => l.device !== getDeviceId())
    : [
        ...(newsItem?.likes ?? []),
        {
          name: user?.name ?? "unknown",
          date: new Date().toISOString(),
          device: getDeviceId(),
        },
      ];

  // update views
  useEffect(() => {
    function updateViews() {
      const uniqueViews = newsItem?.views?.find(
        (ni) => ni.device === getDeviceId(),
      )
        ? newsItem?.views
        : [
            ...(newsItem?.views ?? []),
            {
              email: user?.email ?? "unknown",
              name: user?.name ?? "unknown",
              date: new Date().toISOString(),
              device: getDeviceId() ?? "unknown",
            },
          ];

      updateNews({
        _id: newsItem?._id,
        views: uniqueViews,
      });
    }
    updateViews();
  }, []);

  const handleShare = async () => {
    await updateNews({
      _id: newsItem?._id,
      shares: [
        ...(newsItem?.shares ?? []),
        {
          email: user?.email ?? "unknown",
          name: user?.name ?? "unknown",
          date: new Date().toISOString(),
          device: "unknown",
        },
      ],
    });
  };

  return (
    <div>
      <ul className="flex items-center flex-wrap gap-4">
        <li>
          <RtkActionButton
            mutation={useUpdateNewsMutation}
            data={{ _id: newsItem?._id, likes }}
            className={`p-1.5 _shrink rounded-full ${
              isLiked ? "bg-Blue text-white" : ""
            }`}
            styles={{ borderRadius: "100%" }}
            variant="ghost"
            loadingText=""
            disableToast
            id="likes-trigger"
          >
            {isLiked ? <ThumbsDown size={32} /> : <ThumbsUp size={32} />}
          </RtkActionButton>
          <span
            className="font-light text-xs"
            onClick={() => toggleClick("likes-trigger")}
          >
            {newsItem?.likes?.length ?? ""} Likes
          </span>
        </li>
        <li>
          <POPOVER
            trigger={<IoShareSocial size={32} />}
            variant="ghost"
            triggerClassNames="rounded-full"
            id="shares-trigger"
          >
            <SocialShare onShare={handleShare} />
          </POPOVER>
          <div
            className="font-light text-xs"
            onClick={() => toggleClick("shares-trigger")}
          >
            {newsItem?.shares?.length ?? ""} Shares
          </div>
        </li>
        <li className="flex flex-col items-center justify-center">
          {!user ? (
            <LoginController
              trigger={
                <LiaCommentSolid
                  size={24}
                  onClick={() => document.getElementById("comment")?.focus()}
                />
              }
              description={
                <p className="italic font-light text-center">
                  Login to comment on our news article. Thank you!
                </p>
              }
            />
          ) : (
            <DIALOG
              trigger={
                <LiaCommentSolid
                  size={24}
                  onClick={() => document.getElementById("comment")?.focus()}
                />
              }
              triggerStyles="rounded-full"
              variant="ghost"
              title="Comment on this news article"
              id="comments-trigger"
            >
              <form onSubmit={onComment}>
                <QuillEditor
                  value={comment}
                  onChange={(val) => {
                    if (val.length <= maxLength) setComment(val);
                  }}
                  className="w-full grow"
                  placeholder="Type comment ..."
                />
                <p className="_p p-4">
                  {`${markupToPlainText(comment)?.length}/${maxLength}`}
                </p>
                <Button
                  type="submit"
                  className="backdrop-blur-2xl w-full mt-5 justify-center"
                  waiting={isUpdating}
                  waitingText=""
                  primaryText="Comment"
                  size="lg"
                >
                  <SendHorizontal size={20} />
                </Button>
              </form>
            </DIALOG>
          )}

          <div
            className="font-light text-xs"
            onClick={() =>
              toggleClick(user ? "comments-trigger" : "login-controller")
            }
          >
            {newsItem?.comments?.length ?? ""} Comment
            {newsItem?.comments?.length === 1 ? "" : "s"}
          </div>
        </li>

        <li className="flex flex-col items-center justify-center gap-1">
          {<icons.view />}
          <div className="text-xs">{newsItem?.views?.length} Views</div>
        </li>
      </ul>

      <br />
      <hr />
      <br />

      {/* Comments */}
      <ul className="grid gap-6 divide-y divide-border/45">
        {newsItem?.comments?.map((com, i) => (
          <li key={`com-${i}`} className="flex items-start gap-5 pb-6 relative">
            <AVATAR src={com?.image ?? staticImages.avatar} />
            <section>
              <div className="flex items-start gap-6">
                <div className="flex items-baseline gap-0.5">
                  <h1 className="_subtitle">{com?.name ?? "Anonymous"}</h1>
                  <span>
                    <BsDot size={15} className="text-muted-foreground" />
                  </span>
                  <span className="text-sm mt-2.5 font-light">
                    {getTimeLeftOrAgo(com?.date).formatted}
                  </span>
                </div>
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: shortText(com?.comment ?? "Hi", maxLength),
                }}
                className="border border-border rounded-2xl p-3 -ml-6 mt-4 _p text-wrap wrap-break-word max-sm:max-w-60 max-w-3/4 overflow-x-auto"
              />
            </section>

            {user?.role?.includes("admin") && (
              <ActionButton
                method="PUT"
                body={{
                  comments: newsItem?.comments?.filter(
                    (c) => c?.date !== com?.date,
                  ),
                }}
                uri={`${apiConfig.news}/${newsItem?._id}`}
                className="absolute right-2 top-1 p-0.5 _hover _shrink"
                variant="secondary"
                loadingText="Deleting..."
                styles={{ padding: "6px" }}
              >
                <RiDeleteBin6Line size={24} />
              </ActionButton>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
