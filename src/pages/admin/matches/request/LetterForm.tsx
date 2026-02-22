"use client";

import QuillEditor from "@/components/editor/Quill";
import { useEffect, useState } from "react";
import { generateMatchRequestTemplates } from "./_templates";
import useGetParam from "@/hooks/params";
import { IMatchProps } from "@/app/matches/(fixturesAndResults)";
import { IManager } from "../../managers/page";
import { TemplatesSelector } from "./TemplatesSelectorModal";
import { POPOVER } from "@/components/ui/popover";
import { ActionButton } from "@/components/buttons/ActionButton";
import { Button } from "@/components/buttons/Button";
import { printMatchRequestLetter } from "./Print";
import { icons } from "@/assets/icons/icons";
import { Separator } from "@/components/ui/separator";

interface IProps {
  match: IMatchProps;
  official: { requester: IManager };
}
export function MatchRequestForm({ match, official }: IProps) {
  const [letterForm, setLetterForm] = useState({
    body: "",
    title: "",
  });

  const templateId = useGetParam("templateId");

  useEffect(() => {
    if (templateId) {
      const template = generateMatchRequestTemplates(match, official)?.find(
        (t) => t?.id == templateId
      );
      console.log(template?.body);
      if (template)
        setLetterForm({ body: template.body, title: template.title });
    }
  }, [templateId]);

  return (
    <div>
      <h1 className="font-light text-xl mb-3.5 text-Orange">{match?.title}</h1>
      <Separator className="bg-Orange" />
      <header className="flex flex-wrap items-center justify-between gap-4 py-4">
        <h1 className="_title">Match Request Letter</h1>
        <TemplatesSelector
          match={match}
          official={official}
          modal
          modalVariant={"outline"}
        />
      </header>
      <QuillEditor
        value={letterForm.body || ""}
        onChange={(text) => {
          setLetterForm((p) => ({ ...p, body: text }));
        }}
        className="w-full "
        placeholder="Type request letter here..."
      />
      <br />
      <section className="grid sm:grid-cols-2 md:grid-cols-3 items-center gap-3.5 flex-wrap">
        <Button
          primaryText="Print"
          waitingText="Generating..."
          className=" w-full justify-start font-normal"
          variant={"default"}
          disabled={!letterForm.body}
          onClick={() => printMatchRequestLetter(letterForm, match, official)}
        >
          {<icons.printer />}
        </Button>
        <ActionButton
          primaryText="Save as draft"
          loadingText="Saving..."
          method="POST"
          className=" w-full justify-start font-normal"
          variant={"secondary"}
        >
          {<icons.save />}
        </ActionButton>
      </section>
    </div>
  );
}
