import { sanitizeImageUrl } from "@/utils/sanitizeImageUrl";
import Image from "next/image";

export default function Test() {
  return (
    <Image
      src={"https://res.cloudinary.com/demo/image/upload/sample.jpg"}
      alt="Cloudinary test"
      width={500}
      height={400}
    />
  );
}
