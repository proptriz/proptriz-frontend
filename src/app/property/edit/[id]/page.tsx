'use client';

import React, { use, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import HorizontalCard from "@/components/shared/HorizontalCard";
import { SelectButton, TextareaInput, TextInput } from "@/components/shared/Input";
import ToggleButtons from "@/components/ToggleButtons";
import AddPropertyDetails from "@/components/property/AddDetailsSection";
import { ScreenName } from "@/components/shared/LabelCards";

import { categories, styles } from "@/constant";
import getUserPosition from "@/utils/getUserPosition";

import { 
  getPropertyById, 
  updateProperty 
} from "@/services/propertyApi";

import { 
  CategoryEnum,
  ListForEnum,
  NegotiableEnum,
  PropertyType,
  Feature,
  RenewalEnum,
  CurrencyEnum,
  PropertyStatusEnum
} from "@/types";

import { IoHomeOutline } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";

import ImageManager from "@/components/ImageManager";
import Popup from "@/components/shared/Popup";
import logger from "../../../../../logger.config.mjs";
import { AppContext } from "@/context/AppContextProvider";
import PropertyLocationModal from "@/components/property/PropertyLocationSection";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { OutlineButton } from "@/components/shared/buttons";
import Counter from "@/components/Counter";
import { CgDetailsMore } from "react-icons/cg";

export default function EditPropertyPage({
  params
}: {
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = use(params);
  const propertyId = resolvedParams.id;
  const { authUser } = useContext(AppContext);

  // UI State
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCurrencyPopup, setShowCurrencyPopup] = useState(false);

  // Form Data State
  const [property, setProperty] = useState<PropertyType | null>(null);
  const [formData, setFormData] = useState<Partial<PropertyType>>({});

  // Additional state derived from property
  const [currency, setCurrency] = useState<CurrencyEnum>(CurrencyEnum.naira);
  const [negotiable, setNegotiable] = useState<NegotiableEnum>(NegotiableEnum.Negotiable);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [userCoordinates, setUserCoordinates] = useState<[number, number]>([9.0820, 8.6753]);
  const [propCoordinates, setPropCoordinates] = useState<[number, number]>(userCoordinates);
  const [openLocPicker, setOpenLocPicker] = useState<boolean>(false)

  // Get user location once
  useEffect(() => {
    (async () => {
      try {
        const coords = await getUserPosition();
        setUserCoordinates(coords);
      } catch (err) {
        logger.warn("getUserPosition failed:", err);
      }
    })();
  }, []);

  // Fetch property data
  useEffect(() => {
    if (!propertyId) return;

    setLoading(true);
    setError(null);

    let mounted = true;

    (async () => {
      try {
        const res = await getPropertyById(propertyId);
        if (!mounted) return;

        if (!res?._id) {
          setError("Property not found");
          return;
        }
        setProperty(res);
        setFormData(res);

        if (typeof res.latitude === "number" && typeof res.longitude === "number") {
          setPropCoordinates([res.latitude, res.longitude]);
        }

        setCurrency(res.currency);
        setNegotiable(res.negotiable ? NegotiableEnum.Negotiable : NegotiableEnum.NonNegotiable);
        setFeatures(res.features ?? []);
        setFacilities(res.env_facilities ?? []);

      } catch (err: any) {
        logger.error("Fetch property error:", err?.message ?? err);
        setError("Failed to fetch property");
      } finally {
        setLoading(false);
      }
    })();

    return () => { mounted = false };
  }, [propertyId]);

  // Handle location selection
  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setPropCoordinates([lat, lng]);
    toast.success(`Location selected: (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
  }, []);

  const now = new Date();

  // Generic form setter
  const updateForm = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit handler
  const handleSubmit = useCallback(async () => {

    if (!formData.title || !formData.listed_for || !formData.category || !formData.price) {
      toast.error("Please fill required fields.");
      return;
    }

    setSubmitLoading(true);
    try {
      const updatedData: Partial<PropertyType> = {
        ...formData,
        negotiable: negotiable === NegotiableEnum.Negotiable,
        latitude: propCoordinates?.[0],
        longitude: propCoordinates?.[1],
        env_facilities: facilities,
        period: formData.listed_for === ListForEnum.rent ? formData.period : undefined,
        currency,
        features,
        user: undefined // prevent updating user field
      };

      const updatedProperty = await updateProperty(propertyId, updatedData);

      if (updatedProperty) {
        toast.success("Property updated successfully");
        setProperty(updatedProperty);
        setFormData(updatedProperty);
        setCurrency(updatedProperty.currency);
        setNegotiable(updatedProperty.negotiable ? NegotiableEnum.Negotiable : NegotiableEnum.NonNegotiable);
        setFeatures(updatedProperty.features ?? []);
        setFacilities(updatedProperty.env_facilities ?? []);
        logger.info("Property updated:", updatedProperty);
      }
      
    } catch (err: any) {
      logger.error("Update failed:", err?.message ?? err);
      toast.error("Unexpected error occurred");
    } finally {
      setSubmitLoading(false);
    }

  }, [
    formData,
    negotiable,
    propCoordinates,
    features,
    facilities,
    propertyId,
    currency
  ]);

  // Render states
  if (loading) return <div className="p-6">Loading property...</div>;
  if (error || !property) return <div className="p-6 text-red-600">{error}</div>;


  return (
    <>
      <div className="pb-16 min-h-screen relative">

        <ScreenName title="Edit Property" />

        <div className="p-6 max-w-4xl mx-auto">

          {/* Preview Card */}
          {formData._id && (
            <HorizontalCard
              id={property._id}
              name={property.title || "Property"}
              price={property.price || 0.00}
              currency={property.currency}
              category={property.category as CategoryEnum}
              address={property.address}
              image={property.banner || "/logo.png"}
              period={property.period as RenewalEnum}
              listed_for={property.listed_for as ListForEnum}
              rating={4.5}
              expired={property.expired_by && new Date(property.expired_by) < new Date()}
            />
          )}

          <div className="mt-8 space-y-6">
            {/* Category */}
            <h3 className={styles.H2}>Property Category</h3>
            <SelectButton<CategoryEnum>
              list={categories}
              setValue={(val) => updateForm("category", val)}
              name="category"
              value={formData.category as CategoryEnum}
            />

            {/* Title */}
            <div>
              <TextInput
                label="Property title"
                icon={<IoHomeOutline />}
                id="title"
                name="title"
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm("title", e.target.value)}
                placeholder="Property title here"
              />
            </div>

            {/* Price */}
            <div>
              <label className={styles.H2} htmlFor={"price"}>
                {formData.listed_for === ListForEnum.rent ? "Rent Price" : "Sell Price"}
              </label>
              <div 
              className="flex items-center p-[10px] w-full rounded-md border-[1px]
                bg-gray-100 border-primary
                focus-within:border-secondary
                focus-within:bg-white
                transition-colors
                "
              >
                <input
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={(e) => updateForm("price", e.target.value)}
                  type="number"
                  placeholder="Property price here"
                  className="w-full outline-none bg-transparent"
                />
                <button 
                  className="text-gray-500 text-lg px-3 flex items-center gap-1"
                  onClick={() => setShowCurrencyPopup(true)}
                >
                  {currency}
                  <IoMdArrowDropdown />          
                </button>
              </div>
            </div>

            {/* Listed For */}
            <ToggleButtons<ListForEnum>
              label="Listed For"
              options={Object.values(ListForEnum) as ListForEnum[]}
              selected={formData.listed_for as ListForEnum}
              onChange={(value) => updateForm("listed_for", value)}
            />

            {/* Rent period */}
            {formData.listed_for === ListForEnum.rent && (
              <ToggleButtons<RenewalEnum>
                label="Renewal Period"
                options={Object.values(RenewalEnum) as RenewalEnum[]}
                selected={formData.period as RenewalEnum}
                onChange={(value) => updateForm("period", value)}
              />
            )}

            <TextareaInput
              label="Property Description (optional)"
              id='description'
              icon={<CgDetailsMore />}
              name="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateForm("description", e.target.value)}
              placeholder="Enter Property details here"
              className="w-full outline-none card-bg"
            />

            {(formData.expired_by && new Date(formData.expired_by) < now) && <div className="gap-4 items-center mt-4">
              <label htmlFor="duration" className={styles.H2}>
                Listing Duration (in weeks)
              </label>

              <div
                className={`
                  flex items-center w-full px-2 rounded-md border-[1px]
                  ${"bg-gray-100 border-gray-300"}
                  focus-within:border-secondary
                  transition-colors
                `}
              >
                <input
                  type="number"
                  name="duration"
                  id="duration"
                  placeholder="Enter listing duration (in weeks)"
                  value={formData.duration}
                  min={1}
                  max={50}
                  onChange={(e) =>
                    updateForm("duration", Number(e.target.value) || 1)
                  }
                  className="w-full outline-none p-1 bg-transparent disabled:cursor-not-allowed"
                />

                <Counter
                  label=""
                  value={formData.duration ?? 1}
                  // disabled={!isExpired}
                  onIncrement={() =>
                    updateForm(
                      "duration",
                      Math.min((formData.duration ?? 1) + 1, 50)
                    )
                  }
                  onDecrement={() =>
                    updateForm(
                      "duration",
                      Math.max((formData.duration ?? 1) - 1, 1)
                    )
                  }
                />
              </div>
            </div>}


            {/* Availability status */}
            <ToggleButtons<PropertyStatusEnum>
              label="Availability status"
              options={Object.values(PropertyStatusEnum).filter(status => status !== PropertyStatusEnum.expired)}
              selected={formData.status as PropertyStatusEnum}
              onChange={(value) => updateForm("status", value)}
            />

            {/* Address */}
            <div className="mb-4">
              <TextInput 
                label="Property Address"
                icon={<HiOutlineLocationMarker />}
                name="address"
                id="address"
                value={formData.address}
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => updateForm("address", e.target.value)}
                placeholder="Enter property Address"
              />
            </div>
    
            <div className="w-full flex justify-end">
              <OutlineButton 
                styles={{
                
                }}
                onClick={()=>setOpenLocPicker(true)}
              >
                Pick property location
              </OutlineButton>
            </div>

            {/* Extra Details */}
            <AddPropertyDetails
              listingCategory={property.category as CategoryEnum}
              existingFeatures={features ?? []}
              existingFacilities={facilities ?? []}
              onNegotiableChange={setNegotiable}
              onFeaturesChange={setFeatures}
              onFacilitiesChange={setFacilities}
            />

            {/* Submit */}
            { authUser ? <button
              disabled={submitLoading}
              onClick={handleSubmit}
              className={`px-4 py-2 rounded-md w-full text-white ${
                submitLoading ? "bg-gray-400" : "bg-green"
              }`}
            >
              {submitLoading ? "Updating..." : "Update Property"}
            </button> : <button
              disabled
              className="px-4 py-2 rounded-md w-full text-white bg-gray-400" 
            >
              Update (Login on Pi Browser)
            </button>
            }

            {/* Image Manager */}
            {formData._id && (
              <ImageManager propertyId={formData._id} images={formData.images || []} />
            )}
          </div>

        </div>
      </div>

      <PropertyLocationModal
        isOpen={openLocPicker}
        onClose={() => setOpenLocPicker(false)}
        userCoordinates={propCoordinates}
        fallbackCoordinates={userCoordinates || [9.082, 8.6753]} // Nigeria default
        onLocationSelect={handleLocationSelect}
      />

      {/* Currency Popup */}
      <Popup
        header="Select currency"
        toggle={showCurrencyPopup}
        setToggle={setShowCurrencyPopup}
        useMask={true}
      >
        <div className="my-3">
          {Object.entries(CurrencyEnum).map(([key, value]) => (
            <button
              key={key}
              onClick={() => {
                setCurrency(value);
                setShowCurrencyPopup(false);
              }}
              className="w-full text-left p-3 border-b last:border-b-0 hover:bg-primary hover:text-white transition"
            >
              {key.toUpperCase()} ({value})
            </button>
          ))}
        </div>
      </Popup>
    </>
  );
}
