import { toast } from 'react-toastify';

const handleLocationSelect = (lat: number, lng: number) => {
  toast.success(`Location selected: (${lat}, ${lng})`, { position: "top-right" });
  console.log("Selected coordinates:", lat, lng);
    // Save to form state, API, etc.
};

export default handleLocationSelect;