"use client";

import { DatePicker } from "~/components/date_picker";

export default function DatePick({
    deadline,
    setDeadline
} : {
    deadline: Date;
    setDeadline: (deadline: Date | undefined) => void;
}) {

  return (
      <div className="py-4 space-y-4 w-full">
        <DatePicker
          date={deadline}
          setDate={setDeadline}
          mode="single"
          disabled={{
            before: new Date()
          }}
        />
      </div>
  );
}