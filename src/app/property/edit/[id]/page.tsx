'use client';

import React, { use, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import HorizontalCard from "@/components/shared/HorizontalCard";
import { SelectButton } from "@/components/shared/Input";
import ToggleButtons from "@/components/ToggleButtons";
import AddPropertyDetails from "@/components/property/AddDetailsSection";
import PropertyLocationSection from "@/components/property/PropertyLocationSection";
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
import ToggleCollapse from "@/components/shared/ToggleCollapse";
import { FaArrowLeft } from "react-icons/fa";
import { AppContext } from "@/context/AppContextProvider";

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
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState<Partial<PropertyType>>({});

  // Additional state derived from property
  const [currency, setCurrency] = useState<CurrencyEnum>(CurrencyEnum.naira);
  const [negotiable, setNegotiable] = useState<NegotiableEnum>(NegotiableEnum.Negotiable);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [propCoordinates, setPropCoordinates] = useState<[number, number] | null>(null);
  const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);

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

        if (!res?.id) {
          setError("Property not found");
          return;
        }

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
      const updateData: Partial<PropertyType> = {
        ...formData,
        currency,
        negotiable: negotiable === NegotiableEnum.Negotiable,
        latitude: propCoordinates?.[0],
        longitude: propCoordinates?.[1],
        features,
        env_facilities: facilities,
        period: formData.listed_for === ListForEnum.rent ? formData.period : undefined
      };

      const res = await updateProperty(propertyId, updateData);

      if (res?.success) {
        toast.success("Property updated successfully");
        setSubmitSuccess(true);
        setShowStatusPopup(true);
      } else {
        toast.error(res?.message ?? "Failed to update property");
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
    propertyId
  ]);

  // Render states
  if (loading) return <div className="p-6">Loading property...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;


  return (
    <>
      <div className="pb-16 min-h-screen relative">

        <ScreenName title="Edit Property" />

        <div className="p-6 max-w-4xl mx-auto">

          {/* Preview Card */}
          {formData.id && (
            <HorizontalCard
              id={formData.id}
              name={formData.title || "Property"}
              price={formData.price || 0.00}
              currency={currency}
              category={formData.category as CategoryEnum}
              address={formData.address || ""}
              image={formData.banner || ""}
              period={formData.period as RenewalEnum}
              listed_for={formData.listed_for as ListForEnum}
              rating={4.5}
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
              <h3 className={styles.H2}>Property Title</h3>
              <div className="flex card-bg p-3 rounded-full shadow-md">
                <input
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={(e) => updateForm("title", e.target.value)}
                  className="w-full outline-none card-bg"
                  placeholder="Enter title"
                />
                <IoHomeOutline className="text-gray-500 text-lg" />
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className={styles.H2}>
                {formData.listed_for === ListForEnum.rent ? "Rent Price" : "Sell Price"}
              </h3>

              <div className="flex card-bg p-3 rounded-lg shadow-md">
                <input
                  type="number"
                  name="price"
                  value={formData.price || ""}
                  onChange={(e) => updateForm("price", Number(e.target.value))}
                  className="w-full outline-none card-bg"
                  placeholder="Enter price"
                />

                <button
                  type="button"
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

            {/* Availability status */}
            <ToggleButtons<PropertyStatusEnum>
              label="Availability status"
              options={Object.values(PropertyStatusEnum).filter(status => status !== PropertyStatusEnum.expired)}
              selected={formData.status as PropertyStatusEnum}
              onChange={(value) => updateForm("status", value)}
            />

            <ToggleCollapse header="Property Location" open={true}>
              {/* Address */}
              <div>
                <h3 className={styles.H2}>Property Address</h3>
                <div className="flex card-bg p-3 rounded-full shadow-md">
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ""}
                    onChange={(e) => updateForm("address", e.target.value)}
                    className="w-full outline-none card-bg"
                    placeholder="Property address"
                  />
                  <IoHomeOutline className="text-gray-500 text-lg" />
                </div>
              </div>

              {/* Location */}
              <PropertyLocationSection
                userCoordinates={userCoordinates}
                fallbackCoordinates={propCoordinates ? propCoordinates : userCoordinates || [0,0]}
                onLocationSelect={handleLocationSelect}
              />
            </ToggleCollapse>

            {/* Extra Details */}
            <AddPropertyDetails
              listingCategory={formData.category as CategoryEnum}
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
            {formData.id && (
              <ImageManager propertyId={formData.id} images={formData.images || []} />
            )}
          </div>

        </div>

        {/* Status Popup */}
        {showStatusPopup && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white p-4 rounded shadow">
            {submitSuccess ? (
              <p className="font-semibold">Property updated successfully</p>
            ) : (
              <p className="font-semibold text-red-600">Update failed</p>
            )}
            <button onClick={() => setShowStatusPopup(false)} className="mt-2 underline">
              Close
            </button>
          </div>
        )}
      </div>

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
              key={value}
              onClick={() => {
                updateForm("currency", value);
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
