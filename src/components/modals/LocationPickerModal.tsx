
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import LocationPicker from '@/components/map/LocationPicker';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  onLocationSelect,
  initialLat,
  initialLng
}) => {
  const [selectedLat, setSelectedLat] = useState<number | undefined>(initialLat);
  const [selectedLng, setSelectedLng] = useState<number | undefined>(initialLng);

  const handleLocationChange = (lat: number, lng: number) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
  };

  const handleSubmit = () => {
    if (selectedLat !== undefined && selectedLng !== undefined) {
      onLocationSelect(selectedLat, selectedLng);
      onClose();
    }
  };

  const handleCancel = () => {
    // Reset to initial values if canceling
    setSelectedLat(initialLat);
    setSelectedLng(initialLng);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Select Property Location</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <LocationPicker 
            onLocationSelect={handleLocationChange}
            initialLat={initialLat}
            initialLng={initialLng}
          />
          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSubmit}>Confirm Location</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPickerModal;
