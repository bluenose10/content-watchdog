
import { Button } from "@/components/ui/button";

interface ProfileActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export function ProfileActions({ isEditing, onEdit, onCancel, onSave }: ProfileActionsProps) {
  if (isEditing) {
    return (
      <>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>
          Save Changes
        </Button>
      </>
    );
  }
  
  return (
    <>
      <Button variant="outline" onClick={onEdit}>
        Edit Profile
      </Button>
      <Button variant="secondary" className="ml-2">
        Change Password
      </Button>
    </>
  );
}
