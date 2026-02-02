"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToCollectionDialog } from "@/components/detail/add-to-collection-dialog";

interface AddToCollectionButtonProps {
  setId: string;
  setName: string;
  userId: string | null;
}

export function AddToCollectionButton({
  setId,
  setName,
  userId,
}: AddToCollectionButtonProps) {
  const [open, setOpen] = useState(false);

  if (!userId) {
    return (
      <Button variant="outline" asChild>
        <Link href={`/sign-in?next=/sets/${setId}`}>Sign in to collect</Link>
      </Button>
    );
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Add to Collection
      </Button>
      <AddToCollectionDialog
        setId={setId}
        setName={setName}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
