import React, { useRef } from "react";
import { Paperclip, Camera, X } from "lucide-react";
import Image from "next/image";

export interface FileAttachment {
  id: string | number;
  name: string;
  type: "file" | "photo";
  url?: string;
  file?: File;
}

interface FileAttachmentsProps {
  attachments: FileAttachment[];
  onAddFile: (file: File) => void;
  onAddPhoto: (photo: File) => void;
  onRemove?: (id: string | number) => void;
  readOnly?: boolean;
}

/**
 * A reusable component for uploading and displaying file and photo attachments
 */
export function FileAttachments({
  attachments,
  onAddFile,
  onAddPhoto,
  onRemove,
  readOnly = false
}: FileAttachmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="w-full">
      {attachments.length > 0 && (
        <div className="mb-3 space-y-2">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="flex items-center gap-2 bg-muted p-2 rounded text-xs">
              {attachment.type === "photo" && attachment.url && (
                <div className="relative w-16 h-16">
                  <Image
                    src={attachment.url}
                    alt="Attached photo"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <div className="flex-1 truncate">
                {attachment.type === "file" ? (
                  <span className="flex items-center gap-1">
                    <Paperclip size={12} className="text-primary" />
                    {attachment.name}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Camera size={12} className="text-emerald-600 dark:text-emerald-400" />
                    {attachment.name || "Photo"}
                  </span>
                )}
              </div>
              {!readOnly && onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(attachment.id)}
                  className="p-1 rounded-full hover:bg-accent transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      
      {!readOnly && (
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1 cursor-pointer text-xs text-primary hover:text-primary/80 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onAddFile(file);
                  // Reset input to allow selecting the same file again
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }
              }}
            />
            <Paperclip className="w-4 h-4" /> File
          </label>
          <label className="flex items-center gap-1 cursor-pointer text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const photo = e.target.files?.[0];
                if (photo) {
                  onAddPhoto(photo);
                  // Reset input to allow selecting the same photo again
                  if (photoInputRef.current) photoInputRef.current.value = "";
                }
              }}
            />
            <Camera className="w-4 h-4" /> Photo
          </label>
        </div>
      )}
    </div>
  );
}

/**
 * A component for displaying a list of comments with attachments
 */
export interface Comment {
  id: string | number;
  sender: string;
  timestamp: string;
  text: string;
  attachments: FileAttachment[];
}

interface CommentsWithAttachmentsProps {
  comments: Comment[];
  onAddComment: (text: string, attachments: File[]) => void;
  emptyMessage?: string;
}

export function CommentsWithAttachments({
  comments,
  onAddComment,
  emptyMessage = "No comments yet."
}: CommentsWithAttachmentsProps) {
  const [newComment, setNewComment] = React.useState("");
  const [pendingAttachments, setPendingAttachments] = React.useState<File[]>([]);
  
  const handleAddFile = (file: File) => {
    setPendingAttachments(prev => [...prev, file]);
  };
  
  const handleAddPhoto = (photo: File) => {
    setPendingAttachments(prev => [...prev, photo]);
  };
  
  const handleRemovePending = (index: number) => {
    setPendingAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment && pendingAttachments.length === 0) return;
    onAddComment(newComment, pendingAttachments);
    setNewComment("");
    setPendingAttachments([]);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-2 space-y-3 bg-muted rounded p-2">
        {comments.length === 0 ? (
          <div className="text-xs text-muted-foreground text-center">{emptyMessage}</div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="flex flex-col items-start gap-1 bg-card rounded shadow p-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-semibold text-primary">{comment.sender}</span>
                <span className="text-muted-foreground">{comment.timestamp}</span>
              </div>
              {comment.text && <div className="text-sm text-foreground">{comment.text}</div>}
              {comment.attachments.length > 0 && (
                <div className="w-full mt-1">
                  <FileAttachments
                    attachments={comment.attachments}
                    onAddFile={() => {}}
                    onAddPhoto={() => {}}
                    readOnly
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      <form className="flex flex-col gap-2 mt-auto" onSubmit={handleSubmit}>
        <textarea
          className="border border-input rounded px-2 py-1 text-xs resize-none bg-background text-foreground"
          placeholder="Add a comment..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          rows={2}
        />
        
        {pendingAttachments.length > 0 && (
          <div className="space-y-1 mb-2">
            {pendingAttachments.map((file, index) => (
              <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded text-xs">
                <div className="flex-1 truncate">
                  <span className="flex items-center gap-1">
                    {file.type.startsWith("image/") ? (
                      <Camera size={12} className="text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Paperclip size={12} className="text-primary" />
                    )}
                    {file.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePending(index)}
                  className="p-1 rounded-full hover:bg-accent transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <FileAttachments
            attachments={[]}
            onAddFile={handleAddFile}
            onAddPhoto={handleAddPhoto}
          />
          <button
            type="submit"
            className="ml-auto px-3 py-1 rounded bg-primary text-primary-foreground text-xs disabled:opacity-50 hover:bg-primary/90 transition-colors"
            disabled={!newComment && pendingAttachments.length === 0}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}