import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { handleSubmit } from "@/db/action/creatProject";

// Type for form submission response
interface FormResponse {
  success: boolean;
  error?: string;
}

// Server action to handle form submiss
import { ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Type for component props
interface ClientDialogProps {
  children: ReactNode;
}

export default function ClientDialog() {
  //const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="project-name">Name</Label>
              <Input id="project-name" type="text" name="project-name" required/>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description"  />
            </div>
            <DialogClose type="submit" className="w-full bg-primary p-2 rounded-md text-white">
                add
            </DialogClose>
          </div>
        </form>{" "}
      </DialogContent>
    </Dialog>
  );
}
