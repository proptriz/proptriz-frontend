import { toast } from 'react-toastify';

const handleLocationSelect = (lat: number, lng: number, onLocSet:React.Dispatch<React.SetStateAction<[number, number]>>) => {
  toast.success(`Location selected: (${lat}, ${lng})`, { position: "top-right" });
  console.log("Selected coordinates:", lat, lng);
    // Save to form state, API, etc.
  onLocSet([lat, lng])
};

export default handleLocationSelect