'use client';
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const handleUpload = useCallback(async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `listings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }, [onChange]);

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      handleUpload(acceptedFiles[0]);
    },
    accept: {
      'image/jpeg': [],
      'image/png': []
    }
  });

  return (
    <div className="space-y-4 w-full">
      <div
        {...getRootProps({
          className: "w-full p-4 border-2 border-dashed border-neutral-300 rounded-lg hover:border-rose-500 transition cursor-pointer"
        })}
      >
        <input {...getInputProps()} />
        {value ? (
          <div className="aspect-square w-full relative overflow-hidden rounded-lg">
            <Image
              fill
              style={{ objectFit: 'cover' }}
              src={value}
              alt="Listing"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-neutral-600">
              Click to upload or drag and drop
            </div>
            <div className="text-neutral-500 text-sm">
              JPG, PNG (max 10MB)
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 