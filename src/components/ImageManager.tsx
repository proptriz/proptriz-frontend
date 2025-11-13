import { FaSyncAlt } from "react-icons/fa";

const MAX_IMAGES = 5;

export default function ImageManager({
  property,
  removeExistingImage,
  replaceExistingImage,
  handleNewPhotoUpload,
  newPhotos,
  setNewPhotos,
}: {
  property: any;
  removeExistingImage: (index: number) => void;
  replaceExistingImage: (index: number, file: File) => void;
  handleNewPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newPhotos: File[];
  setNewPhotos: React.Dispatch<React.SetStateAction<File[]>>;
}) {
  const existingCount = property?.images?.length || 0;
  const newCount = newPhotos.length;
  const remainingSlots = Math.max(0, MAX_IMAGES - (existingCount + newCount));

  
  const removeNewPhoto = (index: number) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Property Images</h3>

      {/* Existing Images */}
      <div className="flex flex-wrap gap-4">
        {property && property.images>0 && property?.images?.map((imgUrl: string, idx: number) => (
          <div key={idx} className="relative w-32 h-32">
            {imgUrl && <img
              src={imgUrl}
              alt={`Existing ${idx + 1}`}
              className="w-full h-full object-cover rounded-md border border-gray-300"
            />}

            {/* Delete Button */}
            <button
              onClick={() => removeExistingImage(idx)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
              title="Remove Image"
            >
              &times;
            </button>

            {/* Replace Button */}
            <label
              htmlFor={`replace-${idx}`}
              className="absolute bottom-1 right-1 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1.5 cursor-pointer shadow transition"
              title="Replace Image"
            >
              <FaSyncAlt size={14} />
              <input
                id={`replace-${idx}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) replaceExistingImage(idx, file);
                }}
              />
            </label>
          </div>
        ))}
      </div>

      {/* Upload New Photos */}
      {(newPhotos.length < MAX_IMAGES) && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            Upload up to {remainingSlots} more {remainingSlots === 1 ? "image" : "images"} (max 5 total)
          </p>

          <div className="flex flex-wrap gap-3">
            {/* Show previews of newly selected photos */}
            {newPhotos && newPhotos.length > 0 && newPhotos.map((file, idx) => (
              <div key={idx} className="relative w-32 h-32">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`New upload ${idx + 1}`}
                  className="w-full h-full object-cover rounded-md border border-gray-300"
                />
                <button
                  onClick={() => removeNewPhoto(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                  title="Remove"
                >
                  &times;
                </button>
              </div>
            ))}

            {/* Empty upload boxes for remaining slots */}
            {[...Array(remainingSlots)].map((_, i) => (
              <label
                key={i}
                className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition"
              >
                <span className="text-3xl">+</span>
                <span className="text-xs">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleNewPhotoUpload}
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
